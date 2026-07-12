"""Pydantic schemas for maintenance request payloads and responses."""

from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_PRIORITIES = {"Low", "Medium", "High", "Critical"}
VALID_COLUMNS = {"pending", "approved", "assigned", "in_progress", "resolved"}
COLUMN_ORDER = ["pending", "approved", "assigned", "in_progress", "resolved"]


class MaintenanceCreate(BaseModel):
    """Schema for creating a new maintenance request."""

    title: str = Field(..., min_length=3, max_length=255)
    asset_name: str = Field(..., min_length=2, max_length=255)
    asset_tag: str = Field(..., min_length=2, max_length=50)
    priority: str = Field(default="Medium")
    scheduled_date: Optional[date] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        """Validate priority field value."""
        if v not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of {sorted(VALID_PRIORITIES)}")
        return v


class MaintenanceMoveRequest(BaseModel):
    """Schema for moving a maintenance request to the next Kanban column."""

    column: str = Field(..., description="Target column to move to.")

    @field_validator("column")
    @classmethod
    def validate_column(cls, v: str) -> str:
        """Validate column field value."""
        if v not in VALID_COLUMNS:
            raise ValueError(f"Column must be one of {sorted(VALID_COLUMNS)}")
        return v


class MaintenanceResponse(BaseModel):
    """Schema representing a maintenance request card."""

    id: int
    title: str
    asset_name: str
    asset_tag: str
    priority: str
    column: str
    scheduled_date: Optional[date] = None
    user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MaintenanceListResponse(BaseModel):
    """Schema for paginated maintenance requests."""

    success: bool = True
    pagination: dict
    results: List[MaintenanceResponse]
