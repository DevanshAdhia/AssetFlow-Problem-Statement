"""Database models for audit cycles and asset verification records."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class AuditCycle(Base):
    """Database model representing an audit cycle scope."""

    __tablename__ = "audit_cycles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    scope = Column(String(255), nullable=True)  # Department or location scope
    auditor_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    auditor = relationship("User")
    records = relationship("AuditRecord", back_populates="cycle", cascade="all, delete-orphan")


class AuditRecord(Base):
    """Database model representing a single asset verification entry."""

    __tablename__ = "audit_records"

    id = Column(Integer, primary_key=True, index=True)
    audit_cycle_id = Column(Integer, ForeignKey("audit_cycles.id", ondelete="CASCADE"), nullable=False)
    asset_tag = Column(String(50), nullable=False, index=True)
    asset_name = Column(String(255), nullable=False)
    expected_location = Column(String(255), nullable=True)
    reported_location = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False, default="Pending")  # Verified, Pending, Missing

    cycle = relationship("AuditCycle", back_populates="records")
