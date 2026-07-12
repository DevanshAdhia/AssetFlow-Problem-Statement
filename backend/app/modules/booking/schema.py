"""Pydantic schemas for validating resource bookings and availability payloads.

Supports creation requests and structured timeline responses.
"""

from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


# --- Resource Schemas ---

class ResourceCreate(BaseModel):
    """Schema for validating resource registration requests."""

    name: str = Field(..., min_length=2, max_length=255, description="Resource display name.")
    type: str = Field(..., description="Classification type: 'Room' or 'Equipment'.")
    capacity: Optional[int] = Field(default=None, ge=1, description="Max seating capacity (optional).")
    amenities: Optional[List[str]] = Field(default=None, description="Amenities provided.")
    location: str = Field(..., min_length=2, max_length=255, description="Physical location.")

    @field_validator("name", "type", "location")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        """Strip whitespace characters."""
        return v.strip()


class ResourceResponse(BaseModel):
    """Schema representing details of a registered resource."""

    id: int
    name: str
    type: str
    capacity: Optional[int] = None
    amenities: List[str] = []
    location: str

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def model_validate(cls, obj, **kwargs):
        """Custom validator to handle amenities conversion from comma-separated string."""
        if hasattr(obj, "amenities") and isinstance(obj.amenities, str):
            amenities_str = obj.amenities
            obj_dict = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
            obj_dict["amenities"] = [a.strip() for a in amenities_str.split(",") if a.strip()]
            return super().model_validate(obj_dict, **kwargs)
        return super().model_validate(obj, **kwargs)


# --- Booking Schemas ---

class BookingCreate(BaseModel):
    """Schema for creating a slot reservation booking."""

    resource_id: int = Field(..., description="Target resource ID.")
    booking_date: date = Field(..., description="Date of reservation.")
    time_slot: str = Field(..., description="Reserved time slot e.g., '10:00 AM'.")
    purpose: str = Field(..., min_length=2, max_length=255, description="Booking description.")


class BookingResponse(BaseModel):
    """Schema representing a reservation booking profile."""

    id: int
    resource_id: int
    booking_date: date
    time_slot: str
    purpose: str
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Availability Timeline Schemas ---

class TimelineSlot(BaseModel):
    """Schema representing a specific hourly slot status on a timeline."""

    time: str
    status: str  # "available", "booked"
    booked_by: Optional[str] = None
    booking_id: Optional[int] = None


class TimelineResponse(BaseModel):
    """Schema representing a resource's availability map for a specific date."""

    resource_id: int
    booking_date: date
    slots: List[TimelineSlot]
