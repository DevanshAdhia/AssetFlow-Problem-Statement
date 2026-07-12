"""API routes for user authentication.

Exposes endpoints for credential-based logins and Google OAuth verification,
returning standard session tokens.
"""

from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db
from app.modules.login.schema import LoginRequest, GoogleLoginRequest, TokenResponse
from app.modules.login.service import LoginService
from app.core.security import create_access_token, create_refresh_token
from app.core.dependencies import get_current_user_id
from app.modules.signup.model import User

router = APIRouter()


@router.post(
    "/token",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Login via Email and Password",
    description="Validate user credentials and return bearer access/refresh tokens.",
)
async def login_token(
    data: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """Authenticate email/password credentials.

    Args:
        data (LoginRequest): Input credentials.
        db (AsyncSession): Database session.

    Returns:
        TokenResponse: Session tokens and profile status.
    """
    svc = LoginService(db)
    user = await svc.authenticate_email_password(email=data.email, password=data.password)

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    is_profile_complete = user.phone is not None

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        is_profile_complete=is_profile_complete,
        user=user,
    )


@router.post(
    "/google",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Login via Google OAuth",
    description="Verify Google id_token, log in or sign up the user, and return bearer tokens.",
)
async def login_google(
    data: GoogleLoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenResponse:
    """Authenticate Google OAuth credential token.

    Args:
        data (GoogleLoginRequest): Google id_token body.
        db (AsyncSession): Database session.

    Returns:
        TokenResponse: Session tokens and profile status.
    """
    svc = LoginService(db)
    user = await svc.authenticate_google(id_token=data.id_token)

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    is_profile_complete = user.phone is not None

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        is_profile_complete=is_profile_complete,
        user=user,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="User Logout",
    description="Endpoint for user logout. In this stateless JWT setup, it confirms the intent to log out so the client can discard tokens.",
)
async def logout(
    current_user_id: Annotated[int, Depends(get_current_user_id)],
) -> dict:
    """Log out the current user.
    
    Args:
        current_user_id (int): The authenticated user ID from the dependency.
        
    Returns:
        dict: A success message.
    """
    # If a token blocklist was implemented, we would invalidate the token here.
    return {"message": "Successfully logged out."}
