import pytest
from unittest.mock import AsyncMock, MagicMock
from app.modules.signup.service import SignupService
from app.modules.signup.schema import SignupCreate, SignupUpdate
from app.common.exceptions import NotFoundException


class TestSignupService:

    @pytest.fixture
    def mock_db(self):
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db):
        return SignupService(mock_db)

    async def test_get_not_found(self, service: SignupService):
        service.repo.get_by_id = AsyncMock(return_value=None)
        with pytest.raises(NotFoundException):
            await service.get(999)

    async def test_create(self, service: SignupService):
        mock_instance = MagicMock()
        mock_instance.id = 1
        mock_instance.name = "Test"
        service.repo.create = AsyncMock(return_value=mock_instance)
        data = SignupCreate(name="Test", description="desc")
        result = await service.create(data)
        assert result.name == "Test"
        service.repo.create.assert_called_once_with(name="Test", description="desc")
