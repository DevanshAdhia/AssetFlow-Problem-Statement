"""Pydantic schemas for allocation and transfer request/response payloads."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class AllocationCreate(BaseModel):
    """Schema for creating a new asset allocation (New Allocation modal form).

    Attributes:
        asset_tag (str): Tag of the available asset to allocate.
        emp_id (str): Employee ID string.
        person (str): Full name of the employee receiving the asset.
        department (str): Department the asset is being allocated to.
        reason (str, optional): Notes / reason for the allocation.
    """

    asset_tag: str = Field(..., min_length=2, max_length=50, description="Tag of the asset, e.g. AF-001.")
    emp_id: str = Field(..., min_length=2, max_length=100, description="Employee ID, e.g. EMP-1042.")
    person: str = Field(..., min_length=2, max_length=255, description="Employee full name.")
    department: str = Field(..., min_length=1, max_length=255, description="Department name.")
    reason: Optional[str] = Field(default=None, max_length=2000, description="Optional notes.")


class TransferRequest(BaseModel):
    """Schema for initiating an asset transfer.

    The asset must currently be Available. On success, the asset's
    current_holder is updated and a new Allocation record is created.

    Attributes:
        asset_tag (str): Tag of the asset to transfer.
        transfer_to (str): Destination employee name or department.
        reason (str): Justification for the transfer.
    """

    asset_tag: str = Field(..., min_length=2, max_length=50)
    transfer_to: str = Field(..., min_length=2, max_length=255, description="Destination employee/department.")
    reason: str = Field(..., min_length=3, max_length=2000, description="Transfer reason.")


class ReturnRequest(BaseModel):
    """Schema for returning an allocated asset back to storage.

    Attributes:
        allocation_id (int): ID of the active allocation to close.
    """

    allocation_id: int = Field(..., description="ID of the allocation record to close.")


class AllocationResponse(BaseModel):
    """Schema representing an active allocation record."""

    id: int
    asset_tag: str
    asset_name: str
    emp_id: str
    person: str
    department: str
    assigned_date: datetime
    approved_by_user_id: Optional[int] = None
    approved_by_name: Optional[str] = None
    reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AllocationHistoryResponse(BaseModel):
    """Schema representing a single allocation history event."""

    id: int
    allocation_id: Optional[int] = None
    asset_tag: str
    action: str
    performed_by_user_id: Optional[int] = None
    performed_by_name: Optional[str] = None
    event_date: datetime

    model_config = ConfigDict(from_attributes=True)


class AllocationStatsResponse(BaseModel):
    """Schema for allocation analytics summary counts."""

    total_allocated: int
    total_available: int
    total_assets: int
    departments_active: int
