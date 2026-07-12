"""Pydantic schemas for Notification payload validation."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_TYPES = {"alerts", "approvals", "bookings"}


class NotificationCreate(BaseModel):
    """Schema for creating a new notification alert."""

    title: str = Field(..., min_length=2, max_length=255)
    message: str = Field(..., min_length=2, max_length=1000)
    type: str = Field(default="alerts")
    user_id: int = Field(..., description="Target user ID to send alert to.")

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        """Validate alert type."""
        if v not in VALID_TYPES:
            raise ValueError(f"Notification type must be one of {sorted(VALID_TYPES)}")
        return v


class NotificationResponse(BaseModel):
    """Schema representing a notification."""

    id: int
    title: str
    message: str
    type: str
    read: bool
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    """Schema representing paginated user notifications."""

    success: bool = True
    pagination: dict
    results: List[NotificationResponse]
