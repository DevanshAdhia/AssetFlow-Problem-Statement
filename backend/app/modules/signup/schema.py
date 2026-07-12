"""Pydantic validation schemas for user signup and OTP verification.

This module defines the validation classes and custom validation rules
for parsing and verifying payloads during user registration.
"""

import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class OTPRequest(BaseModel):
    """Schema for requesting a new OTP verification code.

    Attributes:
        email (EmailStr): The email address to send the OTP to.
    """

    email: EmailStr = Field(..., description="Email address requesting the OTP.")

    model_config = ConfigDict(from_attributes=True)


class OTPVerify(BaseModel):
    """Schema for validating an OTP verification attempt.

    Attributes:
        email (EmailStr): The email address to verify.
        code (str): The 4-digit verification code.
    """

    email: EmailStr = Field(..., description="Email address associated with the OTP.")
    code: str = Field(..., min_length=4, max_length=6, description="Verification OTP code.")

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    """Schema for user response representation.

    Attributes:
        id (int): The primary key user ID.
        email (EmailStr): The user's email.
        full_name (str): The user's full name.
        phone (str, optional): The user's phone number.
        auth_provider (str): The authentication provider type.
        is_active (bool): Whether the user is active.
        created_at (datetime): The timestamp of account creation.
    """

    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    auth_provider: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SignupCreate(BaseModel):
    """Schema for submitting user registration details.

    Performs complex validation for password rules, confirmation matching,
    and phone number formats.

    Attributes:
        full_name (str): Full name of the employee.
        email (EmailStr): Email of the employee.
        otp (str): Verified OTP code.
        phone (str): Contact phone number.
        password (str): Account password.
        confirm_password (str): Confirmation of the password.
    """

    full_name: str = Field(..., min_length=2, max_length=255, description="Full name.")
    email: EmailStr = Field(..., description="User email.")
    otp: str = Field(..., min_length=4, max_length=6, description="OTP code verified prior.")
    phone: str = Field(..., min_length=8, max_length=20, description="Phone number.")
    password: str = Field(..., min_length=8, description="Create password.")
    confirm_password: str = Field(..., min_length=8, description="Confirm password.")

    @model_validator(mode="after")
    def validate_signup_passwords(self) -> "SignupCreate":
        """Verify password complexity constraints and matching values.

        Rules verified:
            - Must be at least 8 characters.
            - Must contain at least one uppercase letter.
            - Must contain at least one digit.
            - Must contain at least one special symbol.
            - Confirm password must match password.

        Returns:
            SignupCreate: The validated input model.

        Raises:
            ValueError: If any validation rule fails.
        """
        pwd = self.password
        conf_pwd = self.confirm_password

        if pwd != conf_pwd:
            raise ValueError("Passwords do not match.")

        if not any(char.isupper() for char in pwd):
            raise ValueError("Password must contain at least one uppercase letter.")

        if not any(char.isdigit() for char in pwd):
            raise ValueError("Password must contain at least one digit.")

        # Check for at least one special character/symbol
        special_chars = re.compile(r"[!@#$%^&*(),.?\":{}|<>_\[\]\\/\-+~`=;']")
        if not special_chars.search(pwd):
            raise ValueError("Password must contain at least one special character.")

        return self
