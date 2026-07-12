from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user_id
from app.modules.asset_manager.schema import DashboardResponse
from app.modules.asset_manager.service import AssetManagerService

router = APIRouter()

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Asset Manager Dashboard",
)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user_id),
):
    svc = AssetManagerService(db)
    return await svc.get_dashboard_data()
