"""API routes for audit cycle and verification record management.

Exposes endpoints for creating audit cycles, listing records, updating statuses, and fetching stats.
"""

import math
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.audit.schema import (
    AuditCycleCreate,
    AuditCycleResponse,
    AuditRecordCreate,
    AuditRecordUpdate,
    AuditRecordResponse,
    AuditStatsResponse,
)
from app.modules.audit.service import AuditService

router = APIRouter()


# --- Audit Cycle Routes ---

@router.post(
    "/cycles",
    response_model=AuditCycleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Audit Cycle",
    description="Initialize a new asset audit cycle with a defined scope and auditor.",
)
async def create_audit_cycle(
    data: AuditCycleCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AuditCycleResponse:
    """Create audit cycle."""
    svc = AuditService(db)
    cycle = await svc.create_cycle(data)
    return AuditCycleResponse.model_validate(cycle)


@router.get(
    "/cycles",
    status_code=status.HTTP_200_OK,
    summary="List Audit Cycles",
    description="Fetch all audit cycles ordered by creation date.",
)
async def list_audit_cycles(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
) -> dict:
    """List audit cycles."""
    svc = AuditService(db)
    items, total = await svc.list_cycles(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": [AuditCycleResponse.model_validate(i) for i in items],
    }


# --- Audit Record Routes ---

@router.get(
    "/records",
    status_code=status.HTTP_200_OK,
    summary="List Audit Records",
    description="Fetch verification records. Supports filtering by status, search, and cycle.",
)
async def list_audit_records(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    page: int = Query(1, ge=1),
    page_size: int = Query(100, ge=1, le=500),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter: Verified, Pending, Missing"),
    search: Optional[str] = Query(None, description="Search by asset tag or name."),
    cycle_id: Optional[int] = Query(None, description="Filter by audit cycle ID."),
) -> dict:
    """List audit records."""
    svc = AuditService(db)
    items, total = await svc.list_records(
        page=page, page_size=page_size, status_filter=status_filter, search=search, cycle_id=cycle_id
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
        "results": [AuditRecordResponse.model_validate(i) for i in items],
    }


@router.post(
    "/records",
    response_model=AuditRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Audit Record",
    description="Add a verification record to an active audit cycle.",
)
async def create_audit_record(
    data: AuditRecordCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AuditRecordResponse:
    """Create audit record."""
    svc = AuditService(db)
    record = await svc.create_record(data)
    return AuditRecordResponse.model_validate(record)


@router.put(
    "/records/{record_id}",
    response_model=AuditRecordResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Audit Record",
    description="Update the verification status and reported location of an audit record.",
)
async def update_audit_record(
    record_id: int,
    data: AuditRecordUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> AuditRecordResponse:
    """Update audit record."""
    svc = AuditService(db)
    record = await svc.update_record(record_id, data)
    return AuditRecordResponse.model_validate(record)


@router.get(
    "/stats",
    response_model=AuditStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Audit Statistics",
    description="Return summary counts: total, verified, pending, and missing assets.",
)
async def get_audit_stats(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
    cycle_id: Optional[int] = Query(None, description="Filter by audit cycle ID."),
) -> AuditStatsResponse:
    """Get audit stats."""
    svc = AuditService(db)
    return await svc.get_stats(cycle_id=cycle_id)
