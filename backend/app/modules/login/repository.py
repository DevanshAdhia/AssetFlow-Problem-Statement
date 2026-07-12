"""Database repositories for login user querying.

This module abstracts database access for retrieving user records needed during
the authentication flow.
"""

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import User


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
