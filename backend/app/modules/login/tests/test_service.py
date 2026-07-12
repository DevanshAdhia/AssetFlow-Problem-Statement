"""Unit tests for the LoginService.

Tests email/password authentication logic and Google OAuth bypass flow.
"""

from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.login.service import LoginService
from app.common.exceptions import AppException
from app.core.security import get_password_hash


class TestLoginService:
    """Test suite containing test cases for LoginService business logic."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock for the database session.

        Returns:
            AsyncMock: Mocked DB session.
        """
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> LoginService:
        """Fixture providing a configured LoginService instance with mocked DB.

        Args:
            mock_db (AsyncMock): Mocked DB session.

        Returns:
            LoginService: Service instance for testing.
        """
        return LoginService(mock_db)

    async def test_authenticate_email_password_success(self, service: LoginService) -> None:
        """Verify successful credentials authentication returns the user record.

        Args:
            service (LoginService): The login service instance.
        """
        mock_user = MagicMock()
        mock_user.hashed_password = get_password_hash("Password123!")
        mock_user.is_active = True
        service.login_repo.get_by_email = AsyncMock(return_value=mock_user)

        user = await service.authenticate_email_password("test@example.com", "Password123!")
        assert user == mock_user

    async def test_authenticate_email_password_wrong_password(self, service: LoginService) -> None:
        """Verify incorrect password raises AppException.

        Args:
            service (LoginService): The login service instance.
        """
        mock_user = MagicMock()
        mock_user.hashed_password = get_password_hash("Password123!")
        mock_user.is_active = True
        service.login_repo.get_by_email = AsyncMock(return_value=mock_user)

        with pytest.raises(AppException):
            await service.authenticate_email_password("test@example.com", "WrongPassword!")

    async def test_authenticate_email_password_google_only(self, service: LoginService) -> None:
        """Verify attempting standard password login on Google user fails.

        Args:
            service (LoginService): The login service instance.
        """
        mock_user = MagicMock()
        mock_user.hashed_password = None  # Google OAuth only
        service.login_repo.get_by_email = AsyncMock(return_value=mock_user)

        with pytest.raises(AppException):
            await service.authenticate_email_password("test@example.com", "Password123!")

    async def test_authenticate_google_mock_token(self, service: LoginService) -> None:
        """Verify authenticate_google registers new mock user on 'mock_google_token'.

        Args:
            service (LoginService): The login service instance.
        """
        service.login_repo.get_by_google_id = AsyncMock(return_value=None)
        service.login_repo.get_by_email = AsyncMock(return_value=None)
        service.user_repo.create = AsyncMock(return_value=MagicMock(is_active=True))

        user = await service.authenticate_google("mock_google_token")
        assert user is not None
        service.user_repo.create.assert_called_once()
