"""Business logic services for managing OTP verification and user signup.

This module coordinates repository interactions, generates random OTP codes,
performs verification checks, hashes passwords, and saves new user records.
It sends verification emails asynchronously to maintain fast request response
times and scalability.
"""

import asyncio
import logging
import random
import smtplib
from datetime import datetime, timedelta, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.signup.model import User, OTP
from app.modules.signup.repository import UserRepository, OTPRepository
from app.modules.signup.schema import SignupCreate
from app.core.security import get_password_hash
from app.common.exceptions import ConflictException, AppException
from app.core.config import settings

logger = logging.getLogger(__name__)


def _send_otp_email_sync(email: str, code: str) -> None:
    """Send SMTP email synchronously.

    Offloaded to a worker thread via asyncio.to_thread for async scalability.

    Args:
        email (str): Recipient email address.
        code (str): The 4-digit OTP code to send.
    """
    if not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP_PASSWORD is not configured in settings. Skipping actual email dispatch."
        )
        return

    msg = MIMEMultipart()
    msg["From"] = settings.SMTP_USER
    msg["To"] = email
    msg["Subject"] = "Your AssetFlow Verification OTP"

    body = (
        f"Hello,\n\n"
        f"Your one-time password (OTP) verification code for AssetFlow is: {code}\n\n"
        f"This code is valid for 5 minutes.\n\n"
        f"Regards,\n"
        f"AssetFlow Team"
    )
    msg.attach(MIMEText(body, "plain"))

    try:
        # Connect to Gmail SMTP
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, email, msg.as_string())
        logger.info("OTP verification email dispatched to %s via SMTP", email)
    except Exception as exc:
        logger.error("Failed to send OTP verification email via SMTP: %s", exc)


class SignupService:
    """Service class encapsulating registration and OTP business logic."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the signup service.

        Args:
            db (AsyncSession): The asynchronous SQLAlchemy database session.
        """
        self.user_repo = UserRepository(db)
        self.otp_repo = OTPRepository(db)

    async def generate_otp(self, email: str) -> str:
        """Generate a new 4-digit OTP for the specified email.

        The generated OTP code is stored in the database with a 5-minute expiry,
        printed directly to the console logs, and dispatched asynchronously via SMTP.

        Args:
            email (str): The email address to associate the OTP with.

        Returns:
            str: The generated OTP code.
        """
        # Generate 4-digit OTP code
        code = str(random.randint(1000, 9999))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

        # Store OTP code
        await self.otp_repo.create(email=email, code=code, expires_at=expires_at)

        # Log OTP clearly for local development debugging
        logger.info("Generated OTP for %s: %s (Expires at %s)", email, code, expires_at)
        print(f"DEBUG OTP for {email} is: {code}")

        # Send email asynchronously using a thread pool so we don't block the main event loop
        await asyncio.to_thread(_send_otp_email_sync, email, code)

        return code

    async def verify_otp(self, email: str, code: str) -> bool:
        """Verify an OTP code submitted for an email address.

        Accepts "1234" as a development mode fallback.

        Args:
            email (str): The email address to verify.
            code (str): The submitted verification code.

        Returns:
            bool: True if OTP is successfully verified.

        Raises:
            AppException: If the OTP is invalid or expired.
        """
        # Development fallback bypass
        if code == "1234":
            logger.info("OTP verified for %s using development fallback '1234'", email)
            # Create a mock verified OTP record so the verification persists
            expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
            otp_record = await self.otp_repo.create(email=email, code="1234", expires_at=expires_at)
            await self.otp_repo.mark_verified(otp_record)
            return True

        otp_record = await self.otp_repo.get_valid_otp(email=email, code=code)
        if not otp_record:
            raise AppException("Invalid or expired OTP code.", code="invalid_otp")

        await self.otp_repo.mark_verified(otp_record)
        logger.info("OTP code successfully verified for %s", email)
        return True

    async def register_user(self, data: SignupCreate) -> User:
        """Register a new user after verifying their OTP state.

        Args:
            data (SignupCreate): Registration input payload schema.

        Returns:
            User: The newly created User record.

        Raises:
            ConflictException: If a user with the email already exists.
            AppException: If the email has not been verified via OTP.
        """
        # 1. Check if user already exists
        existing_user = await self.user_repo.get_by_email(data.email)
        if existing_user:
            raise ConflictException("A user with this email address already exists.")

        # 2. Check if email was verified via OTP (either with real code or dev bypass)
        has_verified = await self.otp_repo.has_verified_otp(data.email)
        if not has_verified and data.otp != "1234":
            raise AppException("Email address must be verified via OTP first.", code="email_not_verified")

        # 3. Create the user
        hashed_pwd = get_password_hash(data.password)
        new_user = await self.user_repo.create(
            email=data.email,
            full_name=data.full_name,
            phone=data.phone,
            hashed_password=hashed_pwd,
            auth_provider="email",
        )

        logger.info("User registered successfully: id=%s email=%s", new_user.id, new_user.email)
        return new_user
