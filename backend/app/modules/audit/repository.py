"""Database repositories for audit cycle and record queries."""

from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.audit.model import AuditCycle, AuditRecord


class AuditCycleRepository:
    """Repository managing database operations for AuditCycle."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, name: str, scope: Optional[str], auditor_user_id: Optional[int]) -> AuditCycle:
        """Create a new audit cycle record."""
        cycle = AuditCycle(name=name, scope=scope, auditor_user_id=auditor_user_id)
        self.db.add(cycle)
        await self.db.flush()
        await self.db.refresh(cycle)
        return cycle

    async def get_by_id(self, cycle_id: int) -> Optional[AuditCycle]:
        """Fetch an audit cycle by primary key."""
        result = await self.db.execute(select(AuditCycle).where(AuditCycle.id == cycle_id))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> Tuple[List[AuditCycle], int]:
        """Fetch paginated audit cycles."""
        total_result = await self.db.execute(select(func.count()).select_from(AuditCycle))
        total = total_result.scalar_one()
        result = await self.db.execute(
            select(AuditCycle).order_by(AuditCycle.created_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all()), total


class AuditRecordRepository:
    """Repository managing database operations for AuditRecord."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        audit_cycle_id: int,
        asset_tag: str,
        asset_name: str,
        expected_location: Optional[str],
        reported_location: Optional[str],
        status: str,
    ) -> AuditRecord:
        """Create a new audit verification record."""
        record = AuditRecord(
            audit_cycle_id=audit_cycle_id,
            asset_tag=asset_tag,
            asset_name=asset_name,
            expected_location=expected_location,
            reported_location=reported_location,
            status=status,
        )
        self.db.add(record)
        await self.db.flush()
        await self.db.refresh(record)
        return record

    async def get_by_id(self, record_id: int) -> Optional[AuditRecord]:
        """Fetch an audit record by primary key."""
        result = await self.db.execute(select(AuditRecord).where(AuditRecord.id == record_id))
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status_filter: Optional[str] = None,
        search: Optional[str] = None,
        cycle_id: Optional[int] = None,
    ) -> Tuple[List[AuditRecord], int]:
        """Fetch paginated audit records with optional filters."""
        query = select(AuditRecord)
        count_query = select(func.count()).select_from(AuditRecord)

        if cycle_id is not None:
            query = query.where(AuditRecord.audit_cycle_id == cycle_id)
            count_query = count_query.where(AuditRecord.audit_cycle_id == cycle_id)
        if status_filter:
            query = query.where(AuditRecord.status == status_filter)
            count_query = count_query.where(AuditRecord.status == status_filter)
        if search:
            like = f"%{search}%"
            query = query.where(
                AuditRecord.asset_name.ilike(like) | AuditRecord.asset_tag.ilike(like)
            )
            count_query = count_query.where(
                AuditRecord.asset_name.ilike(like) | AuditRecord.asset_tag.ilike(like)
            )

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        records_result = await self.db.execute(
            query.order_by(AuditRecord.id.asc()).offset(skip).limit(limit)
        )
        return list(records_result.scalars().all()), total

    async def update(
        self, record_id: int, status: str, reported_location: Optional[str] = None
    ) -> Optional[AuditRecord]:
        """Update audit record status and reported location."""
        record = await self.get_by_id(record_id)
        if record:
            record.status = status
            if reported_location is not None:
                record.reported_location = reported_location
            await self.db.flush()
            await self.db.refresh(record)
        return record

    async def get_stats(self, cycle_id: Optional[int] = None) -> dict:
        """Return count breakdown by status."""
        base = select(AuditRecord)
        if cycle_id is not None:
            base = base.where(AuditRecord.audit_cycle_id == cycle_id)

        total_r = await self.db.execute(select(func.count()).select_from(base.subquery()))
        verified_r = await self.db.execute(
            select(func.count()).select_from(
                base.where(AuditRecord.status == "Verified").subquery()
            )
        )
        pending_r = await self.db.execute(
            select(func.count()).select_from(
                base.where(AuditRecord.status == "Pending").subquery()
            )
        )
        missing_r = await self.db.execute(
            select(func.count()).select_from(
                base.where(AuditRecord.status == "Missing").subquery()
            )
        )

        return {
            "total": total_r.scalar_one(),
            "verified": verified_r.scalar_one(),
            "pending": pending_r.scalar_one(),
            "missing": missing_r.scalar_one(),
        }
