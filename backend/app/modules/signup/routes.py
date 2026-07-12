import math
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.signup.schema import (
    SignupCreate,
    SignupUpdate,
    SignupResponse,
    SignupListResponse,
)
from app.modules.signup.service import SignupService

router = APIRouter()


@router.get("", response_model=SignupListResponse, summary="List Signups")
async def list_signups(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = SignupService(db)
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


@router.post("", response_model=SignupResponse, status_code=status.HTTP_201_CREATED, summary="Create Signup")
async def create_signup(
    data: SignupCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = SignupService(db)
    return await svc.create(data)


@router.get("/search", response_model=list[SignupResponse], summary="Search Signups")
async def search_signups(
    q: str = Query(..., min_length=1, description="Search query"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = SignupService(db)
    return await svc.search(q)


@router.get("/{pk}", response_model=SignupResponse, summary="Get Signup")
async def get_signup(
    pk: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = SignupService(db)
    return await svc.get(pk)


@router.put("/{pk}", response_model=SignupResponse, summary="Update Signup")
async def update_signup(
    pk: int,
    data: SignupUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = SignupService(db)
    return await svc.update(pk, data)


@router.delete("/{pk}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Signup")
async def delete_signup(
    pk: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = SignupService(db)
    await svc.delete(pk)
