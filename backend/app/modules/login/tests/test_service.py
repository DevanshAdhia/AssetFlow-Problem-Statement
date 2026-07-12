import pytest
from unittest.mock import AsyncMock, MagicMock
from app.modules.login.service import LoginService
from app.modules.login.schema import LoginCreate, LoginUpdate
from app.common.exceptions import NotFoundException


class TestLoginService:

    @pytest.fixture
    def mock_db(self):
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db):
        return LoginService(mock_db)

    async def test_get_not_found(self, service: LoginService):
        service.repo.get_by_id = AsyncMock(return_value=None)
        with pytest.raises(NotFoundException):
            await service.get(999)

    async def test_create(self, service: LoginService):
        mock_instance = MagicMock()
        mock_instance.id = 1
        mock_instance.name = "Test"
        service.repo.create = AsyncMock(return_value=mock_instance)
        data = LoginCreate(name="Test", description="desc")
        result = await service.create(data)
        assert result.name == "Test"
        service.repo.create.assert_called_once_with(name="Test", description="desc")
