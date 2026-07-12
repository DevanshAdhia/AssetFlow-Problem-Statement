"""API routes for user profile management.

Exposes endpoints for fetching, editing the authenticated user's profile,
and changing their account password.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.profile.schema import (
    ProfileResponse,
    ProfileUpdateRequest,
    ChangePasswordRequest,
)
from app.modules.profile.service import ProfileService

router = APIRouter()


@router.get(
    "/me",
    response_model=ProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get My Profile",
    description="Fetch the authenticated user's full profile including name, email, phone, department, and role.",
)
async def get_profile(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> ProfileResponse:
    """Get current user profile."""
    svc = ProfileService(db)
    return await svc.get_profile(current_user_id)


@router.put(
    "/me",
    response_model=ProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update My Profile",
    description="Update the authenticated user's editable profile fields: full_name and phone.",
)
async def update_profile(
    data: ProfileUpdateRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> ProfileResponse:
    """Update current user profile."""
    svc = ProfileService(db)
    return await svc.update_profile(current_user_id, data)


@router.post(
    "/me/change-password",
    status_code=status.HTTP_200_OK,
    summary="Change Password",
    description="Change the authenticated user's account password. Requires current password verification. Not available for OAuth accounts.",
)
async def change_password(
    data: ChangePasswordRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Change current user password."""
    svc = ProfileService(db)
    return await svc.change_password(current_user_id, data)
