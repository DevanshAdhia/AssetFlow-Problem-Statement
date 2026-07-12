"""Database models for maintenance requests and Kanban workflow tracking.

Defines the MaintenanceRequest entity with priority levels and status columns.
"""

from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class MaintenanceRequest(Base):
    """Database model representing a maintenance work order."""

    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    asset_name = Column(String(255), nullable=False)
    asset_tag = Column(String(50), nullable=False, index=True)
    priority = Column(String(50), nullable=False, default="Medium")  # Low, Medium, High, Critical
    column = Column(String(50), nullable=False, default="pending")   # pending, approved, assigned, in_progress, resolved
    scheduled_date = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
