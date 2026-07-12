import math
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.login.schema import (
    LoginCreate,
    LoginUpdate,
    LoginResponse,
    LoginListResponse,
)
from app.modules.login.service import LoginService

router = APIRouter()


@router.get("", response_model=LoginListResponse, summary="List Logins")
async def list_logins(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = LoginService(db)
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


@router.post("", response_model=LoginResponse, status_code=status.HTTP_201_CREATED, summary="Create Login")
async def create_login(
    data: LoginCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = LoginService(db)
    return await svc.create(data)


@router.get("/search", response_model=list[LoginResponse], summary="Search Logins")
async def search_logins(
    q: str = Query(..., min_length=1, description="Search query"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = LoginService(db)
    return await svc.search(q)


@router.get("/{pk}", response_model=LoginResponse, summary="Get Login")
async def get_login(
    pk: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = LoginService(db)
    return await svc.get(pk)


@router.put("/{pk}", response_model=LoginResponse, summary="Update Login")
async def update_login(
    pk: int,
    data: LoginUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = LoginService(db)
    return await svc.update(pk, data)


@router.delete("/{pk}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Login")
async def delete_login(
    pk: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = LoginService(db)
    await svc.delete(pk)
