from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.modules.signup.model import User
from app.modules.admin_dashboard.schema import AdminDashboardResponse
from app.modules.admin_dashboard.service import AdminDashboardService

router = APIRouter()

@router.get(
    "",
    response_model=AdminDashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Admin Dashboard Data",
)
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = AdminDashboardService(db)
    return await svc.get_dashboard_data()
