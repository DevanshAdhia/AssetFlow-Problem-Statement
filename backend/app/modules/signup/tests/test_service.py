"""Unit tests for the SignupService.

Tests the OTP generation, OTP verification, and new user registration rules.
"""

from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.signup.service import SignupService
from app.modules.signup.schema import SignupCreate
from app.common.exceptions import ConflictException, AppException


class TestSignupService:
    """Test suite containing test cases for SignupService business logic."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock for the SQLAlchemy AsyncSession.

        Returns:
            AsyncMock: Mocked database session.
        """
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> SignupService:
        """Fixture providing a configured SignupService instance with mocked DB.

        Args:
            mock_db (AsyncMock): The mocked DB session.

        Returns:
            SignupService: Service instance for testing.
        """
        return SignupService(mock_db)

    async def test_generate_otp(self, service: SignupService) -> None:
        """Verify that generate_otp creates a 4-digit code and calls OTPRepository.

        Args:
            service (SignupService): The signup service instance.
        """
        service.otp_repo.create = AsyncMock()
        email = "test@example.com"
        code = await service.generate_otp(email)

        assert len(code) == 4
        assert code.isdigit()
        service.otp_repo.create.assert_called_once()

    async def test_verify_otp_dev_bypass(self, service: SignupService) -> None:
        """Verify that the dev bypass code '1234' works for OTP verification.

        Args:
            service (SignupService): The signup service instance.
        """
        service.otp_repo.create = AsyncMock()
        service.otp_repo.mark_verified = AsyncMock()
        
        result = await service.verify_otp("test@example.com", "1234")
        assert result is True
        service.otp_repo.create.assert_called_once()
        service.otp_repo.mark_verified.assert_called_once()

    async def test_register_user_already_exists(self, service: SignupService) -> None:
        """Verify that registering an email that already exists raises ConflictException.

        Args:
            service (SignupService): The signup service instance.
        """
        service.user_repo.get_by_email = AsyncMock(return_value=MagicMock())
        data = SignupCreate(
            full_name="John Doe",
            email="existing@example.com",
            otp="1234",
            phone="1234567890",
            password="Password123!",
            confirm_password="Password123!",
        )

        with pytest.raises(ConflictException):
            await service.register_user(data)

    async def test_register_user_without_verified_otp(self, service: SignupService) -> None:
        """Verify that registering without a verified OTP raises AppException.

        Args:
            service (SignupService): The signup service instance.
        """
        service.user_repo.get_by_email = AsyncMock(return_value=None)
        service.otp_repo.has_verified_otp = AsyncMock(return_value=False)
        
        data = SignupCreate(
            full_name="John Doe",
            email="test@example.com",
            otp="9999",  # incorrect OTP and not '1234'
            phone="1234567890",
            password="Password123!",
            confirm_password="Password123!",
        )

        with pytest.raises(AppException):
            await service.register_user(data)
