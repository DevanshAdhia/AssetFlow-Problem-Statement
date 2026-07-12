"""Business logic service for user profile retrieval and update operations.

Assembles full profile data from User, UserRole, and UserDepartment/Department tables.
No new database table is created — the service reuses existing models.
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from app.modules.signup.model import User
from app.modules.department.model import UserRole, UserDepartment, Department
from app.modules.profile.schema import ProfileResponse, ProfileUpdateRequest, ChangePasswordRequest
from app.common.exceptions import NotFoundException, AppException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class ProfileService:
    """Service layer for profile viewing and update operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_profile(self, user_id: int) -> ProfileResponse:
        """Fetch the full profile for the authenticated user.

        Joins User with UserRole and UserDepartment/Department to assemble
        all fields expected by the frontend Profile page.

        Args:
            user_id (int): Authenticated session user ID.

        Returns:
            ProfileResponse: Assembled profile data.

        Raises:
            NotFoundException: If user does not exist.
        """
        user = await self._get_user(user_id)

        # Resolve role
        role_result = await self.db.execute(
            select(UserRole).where(UserRole.user_id == user_id)
        )
        role_record = role_result.scalar_one_or_none()
        role = role_record.role if role_record else "Employee"

        # Resolve department name
        dept_name: Optional[str] = None
        ud_result = await self.db.execute(
            select(UserDepartment).where(UserDepartment.user_id == user_id)
        )
        ud_record = ud_result.scalar_one_or_none()
        if ud_record:
            dept_result = await self.db.execute(
                select(Department).where(Department.id == ud_record.department_id)
            )
            dept = dept_result.scalar_one_or_none()
            dept_name = dept.name if dept else None

        status = "Active" if user.is_active else "Inactive"

        return ProfileResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            department=dept_name,
            role=role,
            status=status,
            auth_provider=user.auth_provider,
        )

    async def update_profile(self, user_id: int, data: ProfileUpdateRequest) -> ProfileResponse:
        """Update mutable profile fields (full_name, phone) for the authenticated user.

        Args:
            user_id (int): Authenticated session user ID.
            data (ProfileUpdateRequest): Fields to update.

        Returns:
            ProfileResponse: Updated profile.

        Raises:
            NotFoundException: If user does not exist.
        """
        user = await self._get_user(user_id)

        if data.full_name is not None:
            user.full_name = data.full_name
        if data.phone is not None:
            user.phone = data.phone

        await self.db.flush()
        await self.db.refresh(user)

        return await self.get_profile(user_id)

    async def change_password(self, user_id: int, data: ChangePasswordRequest) -> dict:
        """Change the authenticated user's password after verifying the current one.

        Args:
            user_id (int): Authenticated session user ID.
            data (ChangePasswordRequest): Current and new passwords.

        Returns:
            dict: Success confirmation message.

        Raises:
            NotFoundException: If user does not exist.
            AppException: If current password is incorrect or user uses OAuth.
        """
        user = await self._get_user(user_id)

        if user.auth_provider != "email":
            raise AppException(
                "Password change is not available for accounts registered via Google OAuth.",
                code="oauth_account",
            )

        if not user.hashed_password:
            raise AppException(
                "No password is set for this account.",
                code="no_password",
            )

        if not pwd_context.verify(data.current_password, user.hashed_password):
            raise AppException(
                "Current password is incorrect.",
                code="wrong_password",
            )

        user.hashed_password = pwd_context.hash(data.new_password)
        await self.db.flush()

        return {"success": True, "message": "Password changed successfully."}

    async def _get_user(self, user_id: int) -> User:
        """Fetch a User record by ID or raise NotFoundException.

        Args:
            user_id (int): Target user ID.

        Returns:
            User: The found user record.

        Raises:
            NotFoundException: If not found.
        """
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise NotFoundException("User", user_id)
        return user
