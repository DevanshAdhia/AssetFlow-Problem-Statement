"""Database repositories for login user querying.

This module abstracts database access for retrieving user records needed during
the authentication flow.
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import User, PasswordResetToken


class LoginRepository:
    """Repository layer for fetching user records during login validation."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the login repository.

        Args:
            db (AsyncSession): The asynchronous database session.
        """
        self.db = db

    async def get_by_email(self, email: str) -> Optional[User]:
        """Retrieve a user record from the database by email address.

        Args:
            email (str): The email address to look up.

        Returns:
            Optional[User]: The User model instance if found, else None.
        """
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_google_id(self, google_id: str) -> Optional[User]:
        """Retrieve a user record from the database by Google OAuth subject ID.

        Args:
            google_id (str): The Google subject ID token claim.

        Returns:
            Optional[User]: The User model instance if found, else None.
        """
        result = await self.db.execute(select(User).where(User.google_id == google_id))
        return result.scalar_one_or_none()

    async def create_reset_token(
        self, email: str, token: str, expires_at: object
    ) -> PasswordResetToken:
        """Persist a new password reset token record.

        Args:
            email (str): The account email address.
            token (str): The unique reset token string.
            expires_at (datetime): UTC expiry timestamp.

        Returns:
            PasswordResetToken: The persisted token record.
        """
        record = PasswordResetToken(email=email, token=token, expires_at=expires_at)
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def get_valid_reset_token(self, token: str) -> Optional[PasswordResetToken]:
        """Retrieve an unused, non-expired password reset token.

        Args:
            token (str): The reset token string to look up.

        Returns:
            Optional[PasswordResetToken]: The token record if valid, else None.
        """
        from datetime import datetime, timezone

        result = await self.db.execute(
            select(PasswordResetToken).where(
                PasswordResetToken.token == token,
                PasswordResetToken.is_used.is_(False),
                PasswordResetToken.expires_at > datetime.now(timezone.utc),
            )
        )
        return result.scalar_one_or_none()

    async def mark_reset_token_used(self, record: PasswordResetToken) -> None:
        """Mark a password reset token as consumed.

        Args:
            record (PasswordResetToken): The token record to invalidate.
        """
        record.is_used = True
        await self.db.commit()
