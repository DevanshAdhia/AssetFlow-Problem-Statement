"""Pydantic schemas for ActivityLog responses and creation payloads."""

from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field


class ActivityLogCreate(BaseModel):
    """Schema for logging a new activity."""

    user: str = Field(..., min_length=2, max_length=255)
    action: str = Field(..., min_length=2, max_length=500)
    status: str = Field(default="Success", max_length=50)


class ActivityLogResponse(BaseModel):
    """Schema representing a logged activity."""

    id: int
    user: str
    action: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActivityLogListResponse(BaseModel):
    """Schema representing paginated logged activities."""

    success: bool = True
    pagination: dict
    results: List[ActivityLogResponse]
