"""Unit tests for the AuditService.

Tests cycle creation, record updates, and stat aggregation.
"""

from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.audit.service import AuditService
from app.modules.audit.schema import AuditCycleCreate, AuditRecordCreate, AuditRecordUpdate
from app.modules.audit.model import AuditCycle, AuditRecord
from app.common.exceptions import NotFoundException


class TestAuditService:
    """Unit tests for the AuditService class."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock database session."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> AuditService:
        """Fixture providing an AuditService instance."""
        return AuditService(mock_db)

    async def test_create_cycle_success(self, service: AuditService) -> None:
        """Verify successful audit cycle creation.

        Args:
            service (AuditService): Service under test.
        """
        mock_cycle = MagicMock(spec=AuditCycle)
        mock_cycle.id = 1
        mock_cycle.name = "Q4 Audit"
        service.cycle_repo.create = AsyncMock(return_value=mock_cycle)

        data = AuditCycleCreate(name="Q4 Audit", scope="All Departments")
        result = await service.create_cycle(data)
        assert result.name == "Q4 Audit"

    async def test_create_record_cycle_not_found(self, service: AuditService) -> None:
        """Verify NotFoundException when cycle does not exist for a record.

        Args:
            service (AuditService): Service under test.
        """
        service.cycle_repo.get_by_id = AsyncMock(return_value=None)
        data = AuditRecordCreate(
            audit_cycle_id=999,
            asset_tag="AF-001",
            asset_name="Dell XPS 15",
            expected_location="IT Dept",
            reported_location="IT Dept",
            status="Verified",
        )
        with pytest.raises(NotFoundException):
            await service.create_record(data)

    async def test_create_record_success(self, service: AuditService) -> None:
        """Verify successful audit record creation when cycle exists.

        Args:
            service (AuditService): Service under test.
        """
        mock_cycle = MagicMock(spec=AuditCycle)
        service.cycle_repo.get_by_id = AsyncMock(return_value=mock_cycle)

        mock_record = MagicMock(spec=AuditRecord)
        mock_record.id = 1
        service.record_repo.create = AsyncMock(return_value=mock_record)

        data = AuditRecordCreate(
            audit_cycle_id=1,
            asset_tag="AF-001",
            asset_name="Dell XPS 15",
            status="Pending",
        )
        result = await service.create_record(data)
        assert result.id == 1

    async def test_update_record_not_found(self, service: AuditService) -> None:
        """Verify NotFoundException when updating a nonexistent record.

        Args:
            service (AuditService): Service under test.
        """
        service.record_repo.get_by_id = AsyncMock(return_value=None)
        data = AuditRecordUpdate(status="Verified")
        with pytest.raises(NotFoundException):
            await service.update_record(999, data)

    async def test_update_record_success(self, service: AuditService) -> None:
        """Verify successful status update on an audit record.

        Args:
            service (AuditService): Service under test.
        """
        mock_record = MagicMock(spec=AuditRecord)
        service.record_repo.get_by_id = AsyncMock(return_value=mock_record)
        updated = MagicMock(spec=AuditRecord)
        updated.status = "Verified"
        service.record_repo.update = AsyncMock(return_value=updated)

        data = AuditRecordUpdate(status="Verified", reported_location="IT Dept (Floor 2)")
        result = await service.update_record(1, data)
        assert result.status == "Verified"

    async def test_get_stats_returns_counts(self, service: AuditService) -> None:
        """Verify get_stats returns properly shaped AuditStatsResponse.

        Args:
            service (AuditService): Service under test.
        """
        service.record_repo.get_stats = AsyncMock(
            return_value={"total": 6, "verified": 3, "pending": 1, "missing": 2}
        )
        result = await service.get_stats()
        assert result.total == 6
        assert result.verified == 3
        assert result.missing == 2
