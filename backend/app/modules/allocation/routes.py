"""API routes for asset allocation and transfer management.

Exposes endpoints matching the Allocation page tabs:
- Directory tab: list active allocations, create new allocation, return asset
- Transfer tab: submit transfer request
- Analytics tab: get stats + history
"""

import math
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user_id
from app.modules.allocation.schema import (
    AllocationCreate,
    TransferRequest,
    AllocationResponse,
    AllocationHistoryResponse,
    AllocationStatsResponse,
)
from app.modules.allocation.service import AllocationService

router = APIRouter()


# ── Directory Tab ──────────────────────────────────────────────────────────

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List Active Allocations",
    description="Fetch all active asset allocations. Powers the 'Active Allocations Directory' tab.",
)
async def list_allocations(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    search: Optional[str] = Query(None, description="Search by tag, person, or department."),
) -> dict:
    """List active allocations."""
    svc = AllocationService(db)
    items, total = await svc.list_allocations(page=page, page_size=page_size, search=search)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": [AllocationResponse.model_validate(i) for i in items],
    }


@router.post(
    "",
    response_model=AllocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Allocation",
    description="Allocate an available asset to an employee. Updates the asset status to 'Allocated'.",
)
async def create_allocation(
    data: AllocationCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AllocationResponse:
    """Create allocation."""
    svc = AllocationService(db)
    alloc = await svc.create_allocation(data, current_user_id)
    return AllocationResponse.model_validate(alloc)


@router.post(
    "/{allocation_id}/return",
    status_code=status.HTTP_200_OK,
    summary="Return Asset",
    description="Return an allocated asset back to 'Available' status. Removes the allocation record.",
)
async def return_asset(
    allocation_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Return asset to storage."""
    svc = AllocationService(db)
    return await svc.return_asset(allocation_id, current_user_id)


# ── Transfer Tab ───────────────────────────────────────────────────────────

@router.post(
    "/transfer",
    response_model=AllocationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Transfer Request",
    description="Transfer an Available asset to a new holder or department. Powers the 'Transfer Request Form'.",
)
async def create_transfer(
    data: TransferRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AllocationResponse:
    """Create transfer."""
    svc = AllocationService(db)
    alloc = await svc.create_transfer(data, current_user_id)
    return AllocationResponse.model_validate(alloc)


# ── History & Analytics Tab ────────────────────────────────────────────────

@router.get(
    "/history",
    status_code=status.HTTP_200_OK,
    summary="Get Allocation History",
    description="Fetch the allocation event timeline. Optionally filter by asset tag.",
)
async def list_history(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    asset_tag: Optional[str] = Query(None, description="Filter history by asset tag."),
) -> dict:
    """List allocation history."""
    svc = AllocationService(db)
    items, total = await svc.list_history(page=page, page_size=page_size, asset_tag=asset_tag)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": [AllocationHistoryResponse.model_validate(i) for i in items],
    }


@router.get(
    "/stats",
    response_model=AllocationStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Allocation Analytics",
    description="Return KPI counts: total allocated, available, total assets, and active departments.",
)
async def get_stats(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AllocationStatsResponse:
    """Get allocation analytics stats."""
    svc = AllocationService(db)
    return await svc.get_stats()
