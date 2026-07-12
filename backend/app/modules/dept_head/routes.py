from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.dependencies import get_db, get_current_user
from app.modules.signup.model import User
from app.modules.department.model import UserDepartment
from app.modules.dept_head.schema import DHDashboardResponse
from app.modules.dept_head.service import DeptHeadService

router = APIRouter()

@router.get(
    "/dashboard",
    response_model=DHDashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Department Head Dashboard",
)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Fetch department ID for the user
    user_dept = await db.scalar(
        select(UserDepartment).where(UserDepartment.user_id == current_user.id)
    )
    dept_id = user_dept.department_id if user_dept else 0

    svc = DeptHeadService(db)
    return await svc.get_dashboard_data(current_user.id, dept_id)
