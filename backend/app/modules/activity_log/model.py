"""Database model for tracking system actions and audit trials."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base


class ActivityLog(Base):
    """Database model representing a recorded system activity."""

    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user = Column(String(255), nullable=False, index=True)
    action = Column(String(500), nullable=False)
    status = Column(String(50), nullable=False, default="Success")  # Success, Pending, Failed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
