"""API routes for maintenance request management.

Exposes endpoints for listing, creating, progressing, and deleting maintenance work orders.
"""

import math
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.maintenance.schema import (
    MaintenanceCreate,
    MaintenanceMoveRequest,
    MaintenanceResponse,
    MaintenanceListResponse,
)
from app.modules.maintenance.service import MaintenanceService

router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List Maintenance Requests",
    description="Fetch all maintenance work orders. Optionally filter by Kanban column.",
)
async def list_maintenance(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    column: Optional[str] = Query(None, description="Filter by Kanban column."),
) -> dict:
    """List maintenance requests."""
    svc = MaintenanceService(db)
    items, total = await svc.list_requests(page=page, page_size=page_size, column=column)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": [MaintenanceResponse.model_validate(i) for i in items],
    }


@router.post(
    "",
    response_model=MaintenanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Maintenance Request",
    description="Log a new maintenance work order for an asset.",
)
async def create_maintenance(
    data: MaintenanceCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> MaintenanceResponse:
    """Create maintenance request."""
    svc = MaintenanceService(db)
    req = await svc.create_request(data, current_user_id)
    return MaintenanceResponse.model_validate(req)


@router.put(
    "/{request_id}/move",
    response_model=MaintenanceResponse,
    status_code=status.HTTP_200_OK,
    summary="Move Maintenance Card",
    description="Advance a maintenance work order to the next Kanban stage.",
)
async def move_maintenance(
    request_id: int,
    move_data: MaintenanceMoveRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> MaintenanceResponse:
    """Move maintenance card."""
    svc = MaintenanceService(db)
    req = await svc.move_request(request_id, move_data)
    return MaintenanceResponse.model_validate(req)


@router.delete(
    "/{request_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Maintenance Request",
    description="Remove a maintenance work order.",
)
async def delete_maintenance(
    request_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Delete maintenance request."""
    svc = MaintenanceService(db)
    await svc.delete_request(request_id)
    return {"success": True, "message": f"Maintenance request {request_id} deleted."}
