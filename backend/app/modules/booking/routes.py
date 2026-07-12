"""API routes for managing shared resources and slot reservation bookings.

Exposes REST endpoints supporting resource creation, schedule timelines, and slot bookings/cancellations.
"""

import math
from datetime import date
from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.booking.schema import (
    ResourceCreate,
    ResourceResponse,
    BookingCreate,
    BookingResponse,
    TimelineResponse,
)
from app.modules.booking.service import BookingService

router = APIRouter()


# --- Resource Routes ---

@router.post(
    "/resources",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Shared Resource",
    description="Registers a new shared resource (Room or Equipment). Admin only.",
)
async def create_resource(
    data: ResourceCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> ResourceResponse:
    """Register a new shared resource."""
    svc = BookingService(db)
    resource = await svc.create_resource(data, current_user_id)
    return ResourceResponse.model_validate(resource)


@router.get(
    "/resources",
    status_code=status.HTTP_200_OK,
    summary="List Shared Resources",
    description="Fetch a paginated collection of shared resources.",
)
async def list_resources(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1, description="Page index."),
    page_size: int = Query(100, ge=1, le=500, description="Records limit."),
) -> dict:
    """List shared resources."""
    svc = BookingService(db)
    items, total = await svc.list_resources(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    results = [ResourceResponse.model_validate(i) for i in items]
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": results,
    }


# --- Booking Routes ---

@router.get(
    "/timeline",
    response_model=TimelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Resource Availability Timeline",
    description="Query availability schedule slots overlaying bookings for a resource on a specific date.",
)
async def get_timeline(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    resource_id: int = Query(..., description="Target resource ID."),
    booking_date: date = Query(..., description="Schedule date."),
) -> TimelineResponse:
    """Query daily schedule timeline."""
    svc = BookingService(db)
    return await svc.get_timeline(resource_id, booking_date)


@router.post(
    "",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Book Resource Slot",
    description="Reserve an hourly slot for a shared resource.",
)
async def create_booking(
    data: BookingCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> BookingResponse:
    """Create a slot reservation booking."""
    svc = BookingService(db)
    return await svc.create_booking(data, current_user_id)


@router.delete(
    "/{booking_id}",
    status_code=status.HTTP_200_OK,
    summary="Cancel Resource Booking",
    description="Cancel and delete an active slot reservation. Requestor or Admin only.",
)
async def cancel_booking(
    booking_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Cancel booking."""
    svc = BookingService(db)
    await svc.cancel_booking(booking_id, current_user_id)
    return {"success": True, "message": f"Booking ID {booking_id} successfully canceled."}
