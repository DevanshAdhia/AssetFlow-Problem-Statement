"""Pydantic schemas for audit cycle and record payloads."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_STATUSES = {"Verified", "Pending", "Missing"}


class AuditCycleCreate(BaseModel):
    """Schema for creating a new audit cycle."""

    name: str = Field(..., min_length=3, max_length=255, description="Audit cycle name, e.g. 'Q4 End of Year Audit'.")
    scope: Optional[str] = Field(default="All Departments", max_length=255, description="Department or location scope.")
    auditor_user_id: Optional[int] = Field(default=None, description="Assigned auditor user ID.")


class AuditCycleResponse(BaseModel):
    """Schema representing an audit cycle."""

    id: int
    name: str
    scope: Optional[str] = None
    auditor_user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditRecordCreate(BaseModel):
    """Schema for creating an audit verification record."""

    audit_cycle_id: int
    asset_tag: str = Field(..., min_length=2, max_length=50)
    asset_name: str = Field(..., min_length=2, max_length=255)
    expected_location: Optional[str] = Field(default=None, max_length=255)
    reported_location: Optional[str] = Field(default=None, max_length=255)
    status: str = Field(default="Pending")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        """Validate audit record status value."""
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of {sorted(VALID_STATUSES)}")
        return v


class AuditRecordUpdate(BaseModel):
    """Schema for updating an audit verification record status."""

    reported_location: Optional[str] = Field(default=None, max_length=255)
    status: str = Field(..., description="New status: Verified, Pending, or Missing.")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        """Validate audit record status value."""
        if v not in VALID_STATUSES:
            raise ValueError(f"Status must be one of {sorted(VALID_STATUSES)}")
        return v


class AuditRecordResponse(BaseModel):
    """Schema representing a single asset verification entry."""

    id: int
    audit_cycle_id: int
    asset_tag: str
    asset_name: str
    expected_location: Optional[str] = None
    reported_location: Optional[str] = None
    status: str

    model_config = ConfigDict(from_attributes=True)


class AuditStatsResponse(BaseModel):
    """Schema for audit statistics summary counts."""

    total: int
    verified: int
    pending: int
    missing: int
