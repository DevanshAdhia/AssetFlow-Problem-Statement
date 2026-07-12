"""Business logic services for user authentication.

This module coordinates password validation, Google OAuth id_token verification
via external HTTP calls, and database updates for oauth logins.
"""

import logging
from typing import Optional
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import User
from app.modules.signup.repository import UserRepository
from app.modules.login.repository import LoginRepository
from app.core.security import verify_password
from app.common.exceptions import AppException

logger = logging.getLogger(__name__)


class LoginService:
    """Service class encapsulating login and OAuth verification business logic."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the login service.

        Args:
            db (AsyncSession): The asynchronous SQLAlchemy database session.
        """
        self.db = db
        self.login_repo = LoginRepository(db)
        self.user_repo = UserRepository(db)

    async def authenticate_email_password(self, email: str, password: str) -> User:
        """Authenticate user credentials using email and password.

        Args:
            email (str): Account registration email address.
            password (str): User login password.

        Returns:
            User: The authenticated User model instance.

        Raises:
            AppException: If email/password is incorrect or user registered via OAuth.
        """
        user = await self.login_repo.get_by_email(email)
        if not user:
            raise AppException("Invalid email or password.", code="invalid_credentials")

        if not user.hashed_password:
            raise AppException(
                "This account uses Google Sign-in. Please log in with Google.",
                code="social_account_only",
            )

        if not verify_password(password, user.hashed_password):
            raise AppException("Invalid email or password.", code="invalid_credentials")

        if not user.is_active:
            raise AppException("This account is inactive.", code="inactive_account")

        logger.info("User logged in via email/password: id=%s", user.id)
        return user

    async def authenticate_google(self, id_token: str) -> User:
        """Verify Google OAuth id_token and sign-in or register the user account.

        Provides a developer mock bypass if id_token is 'mock_google_token'.

        Args:
            id_token (str): Google issued credential token string.

        Returns:
            User: The authenticated or registered User model instance.

        Raises:
            AppException: If token verification fails.
        """
        # Developer mock check for local testing
        if id_token == "mock_google_token":
            email = "mock_google_user@gmail.com"
            name = "Google Mock User"
            google_id = "mock_google_sub_123456"
            logger.info("Google OAuth bypassed. Using mock profile: %s", email)
        else:
            # Call Google OAuth tokeninfo endpoint
            url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, timeout=10.0)
                if response.status_code != 200:
                    raise AppException("Failed to verify Google token.", code="invalid_google_token")

                payload = response.json()
                email = payload.get("email")
                name = payload.get("name", "Google User")
                google_id = payload.get("sub")

                if not email or not google_id:
                    raise AppException("Invalid Google token payload.", code="invalid_google_token")

            except httpx.RequestError as exc:
                logger.error("HTTP request to Google tokeninfo failed: %s", exc)
                raise AppException(
                    "Network error verifying credentials. Please try again later.",
                    code="network_error",
                ) from exc

        # Look up user by Google ID or Email
        user = await self.login_repo.get_by_google_id(google_id)
        if not user:
            # Fallback lookup by email
            user = await self.login_repo.get_by_email(email)
            if user:
                # Link Google ID to existing account
                user = await self.user_repo.update(user, google_id=google_id, auth_provider="google")
                logger.info("Linked Google OAuth to existing account: email=%s", email)
            else:
                # Create a new user record
                user = await self.user_repo.create(
                    email=email,
                    full_name=name,
                    phone=None,  # Google OAuth does not provide phone number
                    hashed_password=None,
                    auth_provider="google",
                    google_id=google_id,
                )
                logger.info("Registered new user via Google OAuth: email=%s", email)

        if not user.is_active:
            raise AppException("This account is inactive.", code="inactive_account")

        return user
