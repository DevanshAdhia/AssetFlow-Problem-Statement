"""API router endpoints for Notifications."""

import math
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.notification.schema import (
    NotificationCreate,
    NotificationResponse,
)
from app.modules.notification.service import NotificationService

router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List My Notifications",
    description="Fetch a paginated list of notification alerts for the current session user.",
)
async def list_notifications(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    type: Optional[str] = Query(None, description="Filter: alerts, approvals, bookings"),
) -> dict:
    """List notifications."""
    svc = NotificationService(db)
    items, total = await svc.list_notifications(
        user_id=current_user_id, page=page, page_size=page_size, notif_type=type
    )
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": [NotificationResponse.model_validate(i) for i in items],
    }


@router.post(
    "",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Notification Alert",
    description="Trigger a notification alert to a specific target user.",
)
async def create_notification(
    data: NotificationCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> NotificationResponse:
    """Create notification."""
    svc = NotificationService(db)
    notif = await svc.create_notification(data)
    return NotificationResponse.model_validate(notif)


@router.put(
    "/{notif_id}/read",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark Notification as Read",
    description="Mark a single notification alert as read.",
)
async def read_notification(
    notif_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> NotificationResponse:
    """Mark notification read."""
    svc = NotificationService(db)
    return await svc.read_notification(notif_id, current_user_id)


@router.post(
    "/mark-all-read",
    status_code=status.HTTP_200_OK,
    summary="Mark All Read",
    description="Mark all notifications for the current session user as read.",
)
async def mark_all_read(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Mark all notifications read."""
    svc = NotificationService(db)
    return await svc.read_all_notifications(current_user_id)
