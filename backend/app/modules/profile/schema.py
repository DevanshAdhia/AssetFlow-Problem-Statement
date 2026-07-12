"""Pydantic schemas for user profile retrieval and update operations."""

from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, EmailStr, field_validator


class ProfileResponse(BaseModel):
    """Schema representing the current user's full profile."""

    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None
    role: str = "Employee"
    status: str = "Active"
    auth_provider: str

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdateRequest(BaseModel):
    """Schema for updating editable profile fields.

    Only name and phone can be updated by the user.
    Role and department are managed by admins via the OrganizationSetup module.
    """

    full_name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=50)

    @field_validator("full_name", mode="before")
    @classmethod
    def strip_name(cls, v: Optional[str]) -> Optional[str]:
        """Strip whitespace from full_name."""
        return v.strip() if isinstance(v, str) else v


class ChangePasswordRequest(BaseModel):
    """Schema for validating password change requests.

    The user must provide their current password to authorize the update.
    """

    current_password: str = Field(..., min_length=1, description="Current account password.")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password (min 8 chars).")
    confirm_password: str = Field(..., min_length=8, max_length=128, description="Must match new_password.")

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        """Validate confirm_password matches new_password."""
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("confirm_password must match new_password.")
        return v
