"""API routes for user registration and OTP verification flows.

Exposes endpoints for generating/verifying OTPs and completing account registration
while complying with strict validation rules.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db
from app.modules.signup.schema import OTPRequest, OTPVerify, SignupCreate, UserResponse
from app.modules.signup.service import SignupService

router = APIRouter()


@router.post(
    "/send-otp",
    status_code=status.HTTP_200_OK,
    summary="Send OTP",
    description="Generate a 4-digit OTP code, save it, and print to console logs.",
)
async def send_otp(
    data: OTPRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, bool | str]:
    """Generate and send a 4-digit OTP for email verification.

    Args:
        data (OTPRequest): The email address request body.
        db (AsyncSession): The database session.

    Returns:
        dict[str, bool | str]: A dictionary showing success status and action message.
    """
    svc = SignupService(db)
    await svc.generate_otp(data.email)
    return {"success": True, "message": "OTP sent successfully."}


@router.post(
    "/verify-otp",
    status_code=status.HTTP_200_OK,
    summary="Verify OTP",
    description="Validate the submitted OTP code. Accepts '1234' in development.",
)
async def verify_otp(
    data: OTPVerify,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, bool | str]:
    """Verify the submitted OTP code.

    Args:
        data (OTPVerify): The verification request body.
        db (AsyncSession): The database session.

    Returns:
        dict[str, bool | str]: A dictionary showing verification success status.
    """
    svc = SignupService(db)
    await svc.verify_otp(data.email, data.code)
    return {"success": True, "message": "OTP verified successfully."}


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Complete Registration",
    description="Create a new user account if the OTP was verified.",
)
async def register(
    data: SignupCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserResponse:
    """Create a new user account with validated details and OTP status.

    Args:
        data (SignupCreate): Registration input validation fields.
        db (AsyncSession): The database session.

    Returns:
        UserResponse: The newly registered user profile attributes.
    """
    svc = SignupService(db)
    user = await svc.register_user(data)
    return user
