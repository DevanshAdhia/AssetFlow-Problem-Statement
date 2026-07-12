"""Unit tests for the ProfileService.

Tests profile retrieval, name/phone updates, and password change validations.
"""

from unittest.mock import AsyncMock, MagicMock, patch
import pytest
from app.modules.profile.service import ProfileService
from app.modules.profile.schema import ProfileUpdateRequest, ChangePasswordRequest
from app.modules.signup.model import User
from app.common.exceptions import NotFoundException, AppException


class TestProfileService:
    """Unit tests for the ProfileService class."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock database session."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> ProfileService:
        """Fixture providing a ProfileService instance."""
        return ProfileService(mock_db)

    def _make_user(self, **kwargs) -> MagicMock:
        """Helper that creates a MagicMock User with default fields."""
        user = MagicMock(spec=User)
        user.id = kwargs.get("id", 1)
        user.full_name = kwargs.get("full_name", "Test User")
        user.email = kwargs.get("email", "test@example.com")
        user.phone = kwargs.get("phone", "+1234567890")
        user.is_active = kwargs.get("is_active", True)
        user.auth_provider = kwargs.get("auth_provider", "email")
        user.hashed_password = kwargs.get("hashed_password", "$2b$12$fakehashedpassword")
        return user

    async def test_get_profile_user_not_found(self, service: ProfileService) -> None:
        """Verify NotFoundException when user does not exist.

        Args:
            service (ProfileService): Service under test.
        """
        service._get_user = AsyncMock(side_effect=NotFoundException("User", 999))
        with pytest.raises(NotFoundException):
            await service.get_profile(999)

    async def test_get_profile_success(self, service: ProfileService) -> None:
        """Verify successful profile assembly with role and department.

        Args:
            service (ProfileService): Service under test.
        """
        user = self._make_user()
        service._get_user = AsyncMock(return_value=user)

        # Mock role query
        mock_role = MagicMock()
        mock_role.role = "Asset Manager"
        mock_ud = MagicMock()
        mock_ud.department_id = 5
        mock_dept = MagicMock()
        mock_dept.name = "IT Infrastructure"

        mock_scalar_role = MagicMock()
        mock_scalar_role.scalar_one_or_none.return_value = mock_role
        mock_scalar_ud = MagicMock()
        mock_scalar_ud.scalar_one_or_none.return_value = mock_ud
        mock_scalar_dept = MagicMock()
        mock_scalar_dept.scalar_one_or_none.return_value = mock_dept

        service.db.execute = AsyncMock(side_effect=[mock_scalar_role, mock_scalar_ud, mock_scalar_dept])

        result = await service.get_profile(1)
        assert result.full_name == "Test User"
        assert result.role == "Asset Manager"
        assert result.department == "IT Infrastructure"
        assert result.status == "Active"

    async def test_update_profile_success(self, service: ProfileService) -> None:
        """Verify successful profile field update.

        Args:
            service (ProfileService): Service under test.
        """
        user = self._make_user()
        service._get_user = AsyncMock(return_value=user)

        # Patch get_profile called at end of update
        mock_profile = MagicMock()
        mock_profile.full_name = "Updated Name"
        service.get_profile = AsyncMock(return_value=mock_profile)

        data = ProfileUpdateRequest(full_name="Updated Name", phone="+9876543210")
        result = await service.update_profile(1, data)
        assert result.full_name == "Updated Name"

    async def test_change_password_oauth_blocked(self, service: ProfileService) -> None:
        """Verify OAuth accounts cannot change password.

        Args:
            service (ProfileService): Service under test.
        """
        user = self._make_user(auth_provider="google")
        service._get_user = AsyncMock(return_value=user)

        data = ChangePasswordRequest(
            current_password="old_pass",
            new_password="New_Pass123!",
            confirm_password="New_Pass123!",
        )
        with pytest.raises(AppException) as exc_info:
            await service.change_password(1, data)
        assert exc_info.value.code == "oauth_account"

    async def test_change_password_wrong_current(self, service: ProfileService) -> None:
        """Verify wrong current password raises AppException.

        Args:
            service (ProfileService): Service under test.
        """
        user = self._make_user()
        service._get_user = AsyncMock(return_value=user)

        with patch("app.modules.profile.service.pwd_context.verify", return_value=False):
            data = ChangePasswordRequest(
                current_password="wrong_pass",
                new_password="New_Pass123!",
                confirm_password="New_Pass123!",
            )
            with pytest.raises(AppException) as exc_info:
                await service.change_password(1, data)
            assert exc_info.value.code == "wrong_password"

    async def test_change_password_success(self, service: ProfileService) -> None:
        """Verify successful password change.

        Args:
            service (ProfileService): Service under test.
        """
        user = self._make_user()
        service._get_user = AsyncMock(return_value=user)

        with patch("app.modules.profile.service.pwd_context.verify", return_value=True), \
             patch("app.modules.profile.service.pwd_context.hash", return_value="$2b$12$newhash"):
            data = ChangePasswordRequest(
                current_password="OldPass1!",
                new_password="NewPass1!",
                confirm_password="NewPass1!",
            )
            result = await service.change_password(1, data)
        assert result["success"] is True
