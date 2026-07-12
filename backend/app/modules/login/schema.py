"""Pydantic validation schemas for user login and token generation.

This module defines validation rules for email/password credentials,
Google ID token verification, and session token responses.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.modules.signup.schema import UserResponse


class ForgotPasswordRequest(BaseModel):
    """Schema for requesting a password reset link.

    Attributes:
        email (EmailStr): The account email to send the reset token to.
    """

    email: EmailStr = Field(..., description="Account email address.")

    model_config = ConfigDict(from_attributes=True)


class ResetPasswordRequest(BaseModel):
    """Schema for submitting a new password using a reset token.

    Attributes:
        token (str): The password reset token received via email.
        new_password (str): The new password to set.
    """

    token: str = Field(..., description="Password reset token.")
    new_password: str = Field(..., min_length=8, description="New account password.")

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    """Schema for validating email and password login requests.

    Attributes:
        email (EmailStr): User's registration email.
        password (str): User's password.
        remember_me (bool, optional): Keep user logged in. Defaults to False.
    """

    email: EmailStr = Field(..., description="Login email address.")
    password: str = Field(..., description="Login password.")
    remember_me: Optional[bool] = Field(default=False, description="Flag for extended session.")

    model_config = ConfigDict(from_attributes=True)


class GoogleLoginRequest(BaseModel):
    """Schema for submitting Google OAuth id_token.

    Attributes:
        id_token (str): Google issued credential string.
    """

    id_token: str = Field(..., description="Credential token from Google Sign-In.")

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """Schema representing successful login authentication session.

    Attributes:
        access_token (str): OAuth bearer access token.
        refresh_token (str): OAuth bearer refresh token.
        token_type (str): Token type identifier (always Bearer).
        is_profile_complete (bool): Indicates if mandatory fields like phone are set.
        user (UserResponse): Profile details of the logged in user.
    """

    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    is_profile_complete: bool
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)
