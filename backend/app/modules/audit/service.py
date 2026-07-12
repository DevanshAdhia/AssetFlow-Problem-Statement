"""Business logic service for audit cycle and verification record management."""

from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.audit.model import AuditCycle, AuditRecord
from app.modules.audit.repository import AuditCycleRepository, AuditRecordRepository
from app.modules.audit.schema import AuditCycleCreate, AuditRecordCreate, AuditRecordUpdate, AuditStatsResponse
from app.common.exceptions import NotFoundException


class AuditService:
    """Service coordinating audit cycle initialization and record verification."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cycle_repo = AuditCycleRepository(db)
        self.record_repo = AuditRecordRepository(db)

    async def create_cycle(self, data: AuditCycleCreate) -> AuditCycle:
        """Create a new audit cycle.

        Args:
            data (AuditCycleCreate): Input parameters.

        Returns:
            AuditCycle: Newly created cycle.
        """
        return await self.cycle_repo.create(
            name=data.name,
            scope=data.scope,
            auditor_user_id=data.auditor_user_id,
        )

    async def list_cycles(self, page: int = 1, page_size: int = 100) -> Tuple[List[AuditCycle], int]:
        """Fetch paginated audit cycles."""
        skip = (page - 1) * page_size
        return await self.cycle_repo.get_all(skip=skip, limit=page_size)

    async def create_record(self, data: AuditRecordCreate) -> AuditRecord:
        """Create a single verification record within an audit cycle.

        Args:
            data (AuditRecordCreate): Input parameters.

        Returns:
            AuditRecord: Created record.

        Raises:
            NotFoundException: If the audit cycle does not exist.
        """
        cycle = await self.cycle_repo.get_by_id(data.audit_cycle_id)
        if not cycle:
            raise NotFoundException("AuditCycle", data.audit_cycle_id)

        return await self.record_repo.create(
            audit_cycle_id=data.audit_cycle_id,
            asset_tag=data.asset_tag,
            asset_name=data.asset_name,
            expected_location=data.expected_location,
            reported_location=data.reported_location,
            status=data.status,
        )

    async def list_records(
        self,
        page: int = 1,
        page_size: int = 100,
        status_filter: Optional[str] = None,
        search: Optional[str] = None,
        cycle_id: Optional[int] = None,
    ) -> Tuple[List[AuditRecord], int]:
        """Fetch paginated audit records with optional filters."""
        skip = (page - 1) * page_size
        return await self.record_repo.get_all(
            skip=skip,
            limit=page_size,
            status_filter=status_filter,
            search=search,
            cycle_id=cycle_id,
        )

    async def update_record(self, record_id: int, data: AuditRecordUpdate) -> AuditRecord:
        """Update an audit record's verification status.

        Args:
            record_id (int): Target record ID.
            data (AuditRecordUpdate): New status and optional reported location.

        Returns:
            AuditRecord: Updated record.

        Raises:
            NotFoundException: If the record does not exist.
        """
        record = await self.record_repo.get_by_id(record_id)
        if not record:
            raise NotFoundException("AuditRecord", record_id)

        return await self.record_repo.update(
            record_id=record_id,
            status=data.status,
            reported_location=data.reported_location,
        )

    async def get_stats(self, cycle_id: Optional[int] = None) -> AuditStatsResponse:
        """Return summary statistics for audit records.

        Args:
            cycle_id (int, optional): Filter by specific audit cycle.

        Returns:
            AuditStatsResponse: Count breakdown by status.
        """
        stats = await self.record_repo.get_stats(cycle_id=cycle_id)
        return AuditStatsResponse(**stats)
