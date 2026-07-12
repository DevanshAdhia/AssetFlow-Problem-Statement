import pytest
from unittest.mock import AsyncMock, MagicMock
from app.modules.assest.service import AssestService
from app.modules.assest.schema import AssestCreate, AssestUpdate
from app.common.exceptions import NotFoundException


class TestAssestService:

    @pytest.fixture
    def mock_db(self):
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db):
        return AssestService(mock_db)

    async def test_get_not_found(self, service: AssestService):
        service.repo.get_by_id = AsyncMock(return_value=None)
        with pytest.raises(NotFoundException):
            await service.get(999)

    async def test_create(self, service: AssestService):
        mock_instance = MagicMock()
        mock_instance.id = 1
        mock_instance.name = "Test"
        service.repo.create = AsyncMock(return_value=mock_instance)
        data = AssestCreate(tag="AF-001", name="Test", description="desc")
        result = await service.create(data)
        assert result.name == "Test"
        service.repo.create.assert_called_once_with(
            tag="AF-001",
            name="Test",
            description="desc",
            status="Available",
            current_holder=None,
            location=None,
            condition="Good",
            category=None,
            department=None,
            brand=None,
            model=None,
            serial_number=None,
            manufacturer=None,
            purchase_date=None,
            warranty_expiry=None,
            cost=None,
            supplier=None,
            is_shared=False,
            is_bookable=False,
        )
