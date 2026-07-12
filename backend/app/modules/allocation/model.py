"""Database models for asset allocation and transfer history.

Tracks who holds which asset (Allocation) and a running log of
all allocation/transfer/return events (AllocationHistory).
No changes are made to the existing Assest model.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Allocation(Base):
    """Database model representing an active asset allocation record.

    Attributes:
        id (int): Primary key ID.
        asset_tag (str): Tag of the allocated asset (e.g. 'AF-001'). FK-like reference.
        asset_name (str): Snapshot of the asset name at time of allocation.
        emp_id (str): Employee ID string, e.g. 'EMP-1042'.
        person (str): Full name of the employee holding the asset.
        department (str): Department the asset is assigned to.
        assigned_date (datetime): Timestamp of when allocation occurred.
        approved_by_user_id (int): ID of the admin user who approved.
        approved_by_name (str): Snapshot of approver name.
        reason (str): Optional notes / reason for allocation.
    """

    __tablename__ = "allocations"

    id = Column(Integer, primary_key=True, index=True)
    asset_tag = Column(String(50), nullable=False, index=True)
    asset_name = Column(String(255), nullable=False)
    emp_id = Column(String(100), nullable=False)
    person = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    assigned_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    approved_by_user_id = Column(Integer, nullable=True)
    approved_by_name = Column(String(255), nullable=True)
    reason = Column(Text, nullable=True)

    history = relationship("AllocationHistory", back_populates="allocation", cascade="all, delete-orphan")


class AllocationHistory(Base):
    """Database model representing a single event in the allocation lifecycle.

    Used for the timeline view and analytics activity log.

    Attributes:
        id (int): Primary key ID.
        allocation_id (int, optional): Associated allocation record (nullable for returns).
        asset_tag (str): Tag of the affected asset.
        action (str): Human-readable description, e.g. 'Allocated AF-001 to John'.
        performed_by_user_id (int): ID of the acting user.
        performed_by_name (str): Snapshot of acting user name.
        event_date (datetime): When the event occurred.
    """

    __tablename__ = "allocation_history"

    id = Column(Integer, primary_key=True, index=True)
    allocation_id = Column(
        Integer, ForeignKey("allocations.id", ondelete="SET NULL"), nullable=True
    )
    asset_tag = Column(String(50), nullable=False, index=True)
    action = Column(String(500), nullable=False)
    performed_by_user_id = Column(Integer, nullable=True)
    performed_by_name = Column(String(255), nullable=True)
    event_date = Column(DateTime, default=datetime.utcnow, nullable=False)

    allocation = relationship("Allocation", back_populates="history")
