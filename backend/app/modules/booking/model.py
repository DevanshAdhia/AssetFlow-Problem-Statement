"""Database models for shared resources and reservation bookings.

Defines schemas for the resources (rooms, equipment) and their scheduled slot reservations.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.base import Base


class Resource(Base):
    """Database model representing a reservable shared resource."""

    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    type = Column(String(100), nullable=False)  # "Room", "Equipment"
    capacity = Column(Integer, nullable=True)
    amenities = Column(String(1000), nullable=True)  # Comma-separated list
    location = Column(String(255), nullable=False)

    # Relationships
    bookings = relationship("Booking", back_populates="resource", cascade="all, delete-orphan")


class Booking(Base):
    """Database model representing a scheduled booking reservation."""

    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    resource_id = Column(Integer, ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)
    booking_date = Column(Date, nullable=False)
    time_slot = Column(String(50), nullable=False)  # e.g., "09:00 AM"
    purpose = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    resource = relationship("Resource", back_populates="bookings")
    user = relationship("User")

    # Double booking prevention constraint
    __table_args__ = (
        UniqueConstraint("resource_id", "booking_date", "time_slot", name="uq_resource_slot_date"),
    )
