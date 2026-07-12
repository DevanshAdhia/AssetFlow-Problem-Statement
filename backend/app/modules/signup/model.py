"""Database models for user account management and verification.

This module defines the SQLAlchemy database models for storing user profile
information and tracking one-time password (OTP) verification attempts.
"""

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """SQLAlchemy model representing an application user account.

    Attributes:
        id (int): The primary key ID of the user.
        email (str): The unique email address of the user.
        full_name (str): The full name of the user.
        phone (str, optional): The phone number of the user. Can be null for
            OAuth-registered users.
        hashed_password (str, optional): The bcrypt hash of the user's password.
            Can be null for OAuth-registered users.
        auth_provider (str): The authentication method, e.g., 'email' or 'google'.
        google_id (str, optional): The unique Google OAuth identifier (sub claim).
        is_active (bool): Flag indicating if the user account is active.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    auth_provider = Column(String(50), nullable=False, default="email")
    google_id = Column(String(255), nullable=True, unique=True, index=True)
    is_active = Column(Boolean, nullable=False, default=True, index=True)

    def __repr__(self) -> str:
        """Return representation string for the User model.

        Returns:
            str: Formal representation of the user instance.
        """
        return f"<User(id={self.id}, email={self.email!r})>"


class OTP(Base, TimestampMixin):
    """SQLAlchemy model representing a pending one-time password (OTP).

    Attributes:
        id (int): The primary key ID of the OTP instance.
        email (str): The email address associated with the OTP attempt.
        code (str): The 4-digit code generated for verification.
        expires_at (datetime): The UTC time after which the OTP becomes invalid.
        is_verified (bool): Flag indicating if this OTP has been verified.
    """

    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    code = Column(String(10), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False)

    def __repr__(self) -> str:
        """Return representation string for the OTP model.

        Returns:
            str: Formal representation of the OTP instance.
        """
        return f"<OTP(email={self.email!r}, verified={self.is_verified})>"
