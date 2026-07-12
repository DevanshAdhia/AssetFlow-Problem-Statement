"""Database repositories for user account creation and OTP management.

This module houses the database layer abstractions for checking, creating, and
updating user profiles, as well as managing OTP expiration and validation.
"""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import User, OTP


class UserRepository:
    """Repository class for handling User entity database transactions."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the user repository.

        Args:
            db (AsyncSession): The asynchronous SQLAlchemy database session.
        """
        self.db = db

    async def get_by_id(self, pk: int) -> Optional[User]:
        """Fetch a user account by its primary key ID.

        Args:
            pk (int): The primary key ID of the user.

        Returns:
            Optional[User]: The user instance if found, otherwise None.
        """
        result = await self.db.execute(select(User).where(User.id == pk))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        """Fetch a user account by its email address.

        Args:
            email (str): The email address of the user.

        Returns:
            Optional[User]: The user instance if found, otherwise None.
        """
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_google_id(self, google_id: str) -> Optional[User]:
        """Fetch a user account by its unique Google OAuth ID.

        Args:
            google_id (str): The unique google sub identifier.

        Returns:
            Optional[User]: The user instance if found, otherwise None.
        """
        result = await self.db.execute(select(User).where(User.google_id == google_id))
        return result.scalar_one_or_none()

    async def create(
        self,
        email: str,
        full_name: str,
        phone: Optional[str] = None,
        hashed_password: Optional[str] = None,
        auth_provider: str = "email",
        google_id: Optional[str] = None,
    ) -> User:
        """Create a new user record in the database.

        Args:
            email (str): Unique user email.
            full_name (str): Full name of the user.
            phone (str, optional): User phone number. Defaults to None.
            hashed_password (str, optional): Password hash. Defaults to None.
            auth_provider (str, optional): Authentication type. Defaults to "email".
            google_id (str, optional): Google ID token subject. Defaults to None.

        Returns:
            User: The newly created User instance.
        """
        instance = User(
            email=email,
            full_name=full_name,
            phone=phone,
            hashed_password=hashed_password,
            auth_provider=auth_provider,
            google_id=google_id,
        )
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: User, **kwargs) -> User:
        """Update fields of an existing user record.

        Args:
            instance (User): The user instance to update.
            **kwargs: Field-value pairs to set.

        Returns:
            User: The updated User instance.
        """
        for field, value in kwargs.items():
            if value is not None:
                setattr(instance, field, value)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance


class OTPRepository:
    """Repository class for handling OTP verification database transactions."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the OTP repository.

        Args:
            db (AsyncSession): The asynchronous SQLAlchemy database session.
        """
        self.db = db

    async def create(self, email: str, code: str, expires_at: datetime) -> OTP:
        """Create and save a new OTP code in the database.

        Args:
            email (str): The target email address.
            code (str): The 4-digit code.
            expires_at (datetime): Expiration date and time.

        Returns:
            OTP: The newly created OTP instance.
        """
        instance = OTP(email=email, code=code, expires_at=expires_at)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def get_valid_otp(self, email: str, code: str) -> Optional[OTP]:
        """Retrieve a valid, unverified, and non-expired OTP record.

        Args:
            email (str): The email address.
            code (str): The 4-digit verification code.

        Returns:
            Optional[OTP]: The valid OTP instance if exists, otherwise None.
        """
        now = datetime.now(timezone.utc)
        result = await self.db.execute(
            select(OTP).where(
                OTP.email == email,
                OTP.code == code,
                OTP.is_verified.is_(False),
                OTP.expires_at > now,
            )
        )
        return result.scalar_one_or_none()

    async def mark_verified(self, instance: OTP) -> OTP:
        """Mark an OTP record as verified.

        Args:
            instance (OTP): The OTP instance to mark as verified.

        Returns:
            OTP: The updated OTP instance.
        """
        instance.is_verified = True
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def has_verified_otp(self, email: str) -> bool:
        """Check if an email has at least one verified OTP.

        Args:
            email (str): Email address to verify.

        Returns:
            bool: True if a verified OTP exists for the email, False otherwise.
        """
        result = await self.db.execute(
            select(OTP).where(OTP.email == email, OTP.is_verified.is_(True))
        )
        return result.scalars().first() is not None
