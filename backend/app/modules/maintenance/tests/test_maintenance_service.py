"""Unit tests for the MaintenanceService.

Tests creation, Kanban column transitions, and invalid move rejections.
"""

from datetime import date
from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.maintenance.service import MaintenanceService
from app.modules.maintenance.schema import MaintenanceCreate, MaintenanceMoveRequest
from app.modules.maintenance.model import MaintenanceRequest
from app.common.exceptions import NotFoundException, AppException


class TestMaintenanceService:
    """Unit tests for the MaintenanceService class."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock database session."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> MaintenanceService:
        """Fixture providing a MaintenanceService instance."""
        return MaintenanceService(mock_db)

    async def test_create_request_success(self, service: MaintenanceService) -> None:
        """Verify successful creation of a maintenance request.

        Args:
            service (MaintenanceService): Service under test.
        """
        mock_req = MagicMock(spec=MaintenanceRequest)
        mock_req.id = 1
        mock_req.column = "pending"
        service.repo.create = AsyncMock(return_value=mock_req)

        data = MaintenanceCreate(
            title="Projector bulb replacement",
            asset_name="Projector X-1",
            asset_tag="AF-009",
            priority="High",
            scheduled_date=date(2026, 10, 12),
        )
        result = await service.create_request(data, user_id=1)
        assert result.id == 1
        service.repo.create.assert_called_once()

    async def test_move_request_valid_transition(self, service: MaintenanceService) -> None:
        """Verify successful Kanban column transition from pending to approved.

        Args:
            service (MaintenanceService): Service under test.
        """
        mock_req = MagicMock(spec=MaintenanceRequest)
        mock_req.id = 1
        mock_req.column = "pending"
        service.repo.get_by_id = AsyncMock(return_value=mock_req)

        updated = MagicMock(spec=MaintenanceRequest)
        updated.column = "approved"
        service.repo.update_column = AsyncMock(return_value=updated)

        move = MaintenanceMoveRequest(column="approved")
        result = await service.move_request(1, move)
        assert result.column == "approved"

    async def test_move_request_invalid_transition(self, service: MaintenanceService) -> None:
        """Verify that skipping Kanban stages raises an AppException.

        Args:
            service (MaintenanceService): Service under test.
        """
        mock_req = MagicMock(spec=MaintenanceRequest)
        mock_req.column = "pending"
        service.repo.get_by_id = AsyncMock(return_value=mock_req)

        move = MaintenanceMoveRequest(column="in_progress")
        with pytest.raises(AppException):
            await service.move_request(1, move)

    async def test_move_request_not_found(self, service: MaintenanceService) -> None:
        """Verify NotFoundException when request ID does not exist.

        Args:
            service (MaintenanceService): Service under test.
        """
        service.repo.get_by_id = AsyncMock(return_value=None)
        move = MaintenanceMoveRequest(column="approved")
        with pytest.raises(NotFoundException):
            await service.move_request(999, move)

    async def test_delete_request_success(self, service: MaintenanceService) -> None:
        """Verify successful deletion of a maintenance request.

        Args:
            service (MaintenanceService): Service under test.
        """
        mock_req = MagicMock(spec=MaintenanceRequest)
        service.repo.get_by_id = AsyncMock(return_value=mock_req)
        service.repo.delete = AsyncMock(return_value=True)

        result = await service.delete_request(1)
        assert result is True

    async def test_delete_request_not_found(self, service: MaintenanceService) -> None:
        """Verify NotFoundException when deleting a nonexistent request.

        Args:
            service (MaintenanceService): Service under test.
        """
        service.repo.get_by_id = AsyncMock(return_value=None)
        with pytest.raises(NotFoundException):
            await service.delete_request(999)
