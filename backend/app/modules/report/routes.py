from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.modules.signup.model import User
from app.modules.report.schema import ReportResponse
from app.modules.report.service import ReportService

router = APIRouter()

@router.get(
    "",
    response_model=ReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Analytics and Reports Data",
)
async def get_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = ReportService(db)
    return await svc.get_reports()
