"""API router endpoints for ActivityLogs."""

import math
from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.activity_log.schema import (
    ActivityLogCreate,
    ActivityLogResponse,
)
from app.modules.activity_log.service import ActivityLogService

router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List Activity Logs",
    description="Fetch a paginated list of system activities.",
)
async def list_activity_logs(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
) -> dict:
    """List activity logs."""
    svc = ActivityLogService(db)
    items, total = await svc.list_logs(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": [ActivityLogResponse.model_validate(i) for i in items],
    }


@router.post(
    "",
    response_model=ActivityLogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Activity Log",
    description="Record a new system or user action entry.",
)
async def create_activity_log(
    data: ActivityLogCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> ActivityLogResponse:
    """Create activity log."""
    svc = ActivityLogService(db)
    log = await svc.create_log(data)
    return ActivityLogResponse.model_validate(log)
