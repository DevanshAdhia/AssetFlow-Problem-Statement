"""Database repositories for allocation and history CRUD operations."""

from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.allocation.model import Allocation, AllocationHistory


class AllocationRepository:
    """Repository managing database operations for Allocation records."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        asset_tag: str,
        asset_name: str,
        emp_id: str,
        person: str,
        department: str,
        approved_by_user_id: Optional[int],
        approved_by_name: Optional[str],
        reason: Optional[str],
    ) -> Allocation:
        """Create a new active allocation record."""
        alloc = Allocation(
            asset_tag=asset_tag,
            asset_name=asset_name,
            emp_id=emp_id,
            person=person,
            department=department,
            approved_by_user_id=approved_by_user_id,
            approved_by_name=approved_by_name,
            reason=reason,
        )
        self.db.add(alloc)
        await self.db.flush()
        await self.db.refresh(alloc)
        return alloc

    async def get_by_id(self, allocation_id: int) -> Optional[Allocation]:
        """Fetch an allocation by primary key."""
        result = await self.db.execute(
            select(Allocation).where(Allocation.id == allocation_id)
        )
        return result.scalar_one_or_none()

    async def get_by_tag(self, asset_tag: str) -> Optional[Allocation]:
        """Fetch the active allocation for a given asset tag."""
        result = await self.db.execute(
            select(Allocation).where(Allocation.asset_tag == asset_tag)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self, skip: int = 0, limit: int = 100, search: Optional[str] = None
    ) -> Tuple[List[Allocation], int]:
        """Fetch paginated allocations with optional search filter."""
        query = select(Allocation)
        count_query = select(func.count()).select_from(Allocation)

        if search:
            like = f"%{search}%"
            query = query.where(
                Allocation.asset_tag.ilike(like)
                | Allocation.person.ilike(like)
                | Allocation.department.ilike(like)
            )
            count_query = count_query.where(
                Allocation.asset_tag.ilike(like)
                | Allocation.person.ilike(like)
                | Allocation.department.ilike(like)
            )

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        records_result = await self.db.execute(
            query.order_by(Allocation.assigned_date.desc()).offset(skip).limit(limit)
        )
        return list(records_result.scalars().all()), total

    async def delete(self, allocation_id: int) -> bool:
        """Delete an allocation record by ID."""
        alloc = await self.get_by_id(allocation_id)
        if alloc:
            await self.db.delete(alloc)
            return True
        return False

    async def count_active(self) -> int:
        """Return count of active allocations."""
        result = await self.db.execute(select(func.count()).select_from(Allocation))
        return result.scalar_one()

    async def count_active_departments(self) -> int:
        """Return count of unique departments with active allocations."""
        result = await self.db.execute(
            select(func.count(func.distinct(Allocation.department))).select_from(Allocation)
        )
        return result.scalar_one()


class AllocationHistoryRepository:
    """Repository managing database operations for AllocationHistory events."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        asset_tag: str,
        action: str,
        performed_by_user_id: Optional[int],
        performed_by_name: Optional[str],
        allocation_id: Optional[int] = None,
    ) -> AllocationHistory:
        """Create a new history event record."""
        event = AllocationHistory(
            asset_tag=asset_tag,
            action=action,
            performed_by_user_id=performed_by_user_id,
            performed_by_name=performed_by_name,
            allocation_id=allocation_id,
        )
        self.db.add(event)
        await self.db.flush()
        await self.db.refresh(event)
        return event

    async def get_all(
        self, skip: int = 0, limit: int = 100, asset_tag: Optional[str] = None
    ) -> Tuple[List[AllocationHistory], int]:
        """Fetch paginated history events, optionally filtered by asset tag."""
        query = select(AllocationHistory)
        count_query = select(func.count()).select_from(AllocationHistory)

        if asset_tag:
            query = query.where(AllocationHistory.asset_tag == asset_tag)
            count_query = count_query.where(AllocationHistory.asset_tag == asset_tag)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()
        records_result = await self.db.execute(
            query.order_by(AllocationHistory.event_date.desc()).offset(skip).limit(limit)
        )
        return list(records_result.scalars().all()), total
