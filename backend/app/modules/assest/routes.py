import math
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.assest.schema import (
    AssestCreate,
    AssestUpdate,
    AssestResponse,
    AssestListResponse,
)
from app.modules.assest.service import AssestService

router = APIRouter()


@router.get("", response_model=AssestListResponse, summary="List Assests")
async def list_assests(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssestService(db)
    items, total = await svc.list(page=page, page_size=page_size)
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "success": True,
        "pagination": {
            "count": total,
            "total_pages": total_pages,
            "current_page": page,
            "page_size": page_size,
        },
        "results": items,
    }


@router.post("", response_model=AssestResponse, status_code=status.HTTP_201_CREATED, summary="Create Assest")
async def create_assest(
    data: AssestCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssestService(db)
    return await svc.create(data)


@router.get("/search", response_model=list[AssestResponse], summary="Search Assests")
async def search_assests(
    q: str = Query(..., min_length=1, description="Search query"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssestService(db)
    return await svc.search(q)


@router.get("/{pk}", response_model=AssestResponse, summary="Get Assest")
async def get_assest(
    pk: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssestService(db)
    return await svc.get(pk)


@router.put("/{pk}", response_model=AssestResponse, summary="Update Assest")
async def update_assest(
    pk: int,
    data: AssestUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssestService(db)
    return await svc.update(pk, data)


@router.delete("/{pk}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Assest")
async def delete_assest(
    pk: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssestService(db)
    await svc.delete(pk)
