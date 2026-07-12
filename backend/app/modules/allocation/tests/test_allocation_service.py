"""Unit tests for AllocationService.

Tests allocation creation, return, transfer, and analytics stats.
"""

from unittest.mock import AsyncMock, MagicMock, patch
import pytest
from app.modules.allocation.service import AllocationService
from app.modules.allocation.schema import AllocationCreate, TransferRequest
from app.modules.allocation.model import Allocation, AllocationHistory
from app.modules.assest.model import Assest
from app.common.exceptions import NotFoundException, AppException


class TestAllocationService:
    """Unit tests for the AllocationService class."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock database session."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> AllocationService:
        """Fixture providing an AllocationService instance."""
        return AllocationService(mock_db)

    def _mock_asset(self, status: str = "Available") -> MagicMock:
        """Create a mock Assest with given status."""
        asset = MagicMock(spec=Assest)
        asset.tag = "AF-001"
        asset.name = "Dell XPS 15"
        asset.status = status
        asset.current_holder = None
        return asset

    async def test_create_allocation_asset_not_found(self, service: AllocationService) -> None:
        """Verify NotFoundException when asset tag does not exist."""
        service._get_asset = AsyncMock(side_effect=NotFoundException("Assest", "AF-999"))
        data = AllocationCreate(asset_tag="AF-999", emp_id="EMP-1", person="John", department="IT")
        with pytest.raises(NotFoundException):
            await service.create_allocation(data, approver_user_id=1)

    async def test_create_allocation_asset_not_available(self, service: AllocationService) -> None:
        """Verify AppException when asset is already Allocated."""
        service._get_asset = AsyncMock(return_value=self._mock_asset(status="Allocated"))
        data = AllocationCreate(asset_tag="AF-001", emp_id="EMP-1", person="John", department="IT")
        with pytest.raises(AppException) as exc_info:
            await service.create_allocation(data, approver_user_id=1)
        assert exc_info.value.code == "asset_not_available"

    async def test_create_allocation_success(self, service: AllocationService) -> None:
        """Verify successful allocation creates record and updates asset status."""
        asset = self._mock_asset()
        service._get_asset = AsyncMock(return_value=asset)
        service._get_approver_name = AsyncMock(return_value="Admin User")

        mock_alloc = MagicMock(spec=Allocation)
        mock_alloc.id = 1
        service.alloc_repo.create = AsyncMock(return_value=mock_alloc)
        service.hist_repo.create = AsyncMock()

        data = AllocationCreate(asset_tag="AF-001", emp_id="EMP-1", person="John Smith", department="IT")
        result = await service.create_allocation(data, approver_user_id=1)
        assert result.id == 1
        assert asset.status == "Allocated"
        service.hist_repo.create.assert_called_once()

    async def test_return_asset_not_found(self, service: AllocationService) -> None:
        """Verify NotFoundException when allocation ID does not exist."""
        service.alloc_repo.get_by_id = AsyncMock(return_value=None)
        with pytest.raises(NotFoundException):
            await service.return_asset(999, user_id=1)

    async def test_return_asset_success(self, service: AllocationService) -> None:
        """Verify return sets asset status to Available and deletes allocation."""
        mock_alloc = MagicMock(spec=Allocation)
        mock_alloc.id = 1
        mock_alloc.asset_tag = "AF-001"
        mock_alloc.person = "John Smith"
        mock_alloc.department = "IT"
        service.alloc_repo.get_by_id = AsyncMock(return_value=mock_alloc)
        service._get_approver_name = AsyncMock(return_value="Admin")
        service.hist_repo.create = AsyncMock()
        service.alloc_repo.delete = AsyncMock(return_value=True)

        asset = self._mock_asset(status="Allocated")
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = asset
        service.db.execute = AsyncMock(return_value=mock_result)

        result = await service.return_asset(1, user_id=1)
        assert result["success"] is True
        assert asset.status == "Available"

    async def test_transfer_blocked_when_allocated(self, service: AllocationService) -> None:
        """Verify AppException when trying to transfer an already allocated asset."""
        service._get_asset = AsyncMock(return_value=self._mock_asset(status="Allocated"))
        data = TransferRequest(asset_tag="AF-001", transfer_to="HR Dept", reason="Dept change")
        with pytest.raises(AppException) as exc_info:
            await service.create_transfer(data, approver_user_id=1)
        assert exc_info.value.code == "asset_allocated"

    async def test_transfer_success(self, service: AllocationService) -> None:
        """Verify successful transfer allocates asset and logs history."""
        asset = self._mock_asset()
        service._get_asset = AsyncMock(return_value=asset)
        service._get_approver_name = AsyncMock(return_value="Admin User")
        mock_alloc = MagicMock(spec=Allocation)
        mock_alloc.id = 2
        service.alloc_repo.create = AsyncMock(return_value=mock_alloc)
        service.hist_repo.create = AsyncMock()

        data = TransferRequest(asset_tag="AF-001", transfer_to="Sarah Jenkins", reason="Project reassignment")
        result = await service.create_transfer(data, approver_user_id=1)
        assert result.id == 2
        assert asset.status == "Allocated"
