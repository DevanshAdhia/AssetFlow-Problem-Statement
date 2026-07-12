from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.modules.signup.model import User
from app.modules.employee.schema import EmployeeDashboardResponse
from app.modules.employee.service import EmployeeService

router = APIRouter()

@router.get(
    "/dashboard",
    response_model=EmployeeDashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Employee Dashboard",
)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    svc = EmployeeService(db)
    return await svc.get_dashboard_data(current_user.id, current_user.name)
