from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest
from app.modules.booking.model import Booking
from app.modules.maintenance.model import MaintenanceRequest
from app.modules.activity_log.model import ActivityLog
from app.modules.employee.schema import EmployeeDashboardResponse, EmployeeKPIs, EmployeeActivityData

class EmployeeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_data(self, user_id: int, user_name: str) -> EmployeeDashboardResponse:
        # Count Assigned Assets
        assigned_assets = await self.db.scalar(
            select(func.count())
            .select_from(Assest)
            .where(Assest.current_holder == user_name)
        )

        # Count Active Bookings
        active_bookings = await self.db.scalar(
            select(func.count())
            .select_from(Booking)
            .where(Booking.user_id == user_id, Booking.status == "Approved")
        )

        # Count Pending Maintenance
        pending_maintenance = await self.db.scalar(
            select(func.count())
            .select_from(MaintenanceRequest)
            .where(MaintenanceRequest.reported_by_id == user_id, MaintenanceRequest.status == "Pending")
        )

        # For Pending Returns, we can simulate or query a returns table if it exists.
        # Assuming pending returns are 0 for now as there is no Returns model built yet.
        pending_returns = 0

        kpis = EmployeeKPIs(
            assignedAssets=assigned_assets or 0,
            activeBookings=active_bookings or 0,
            pendingMaintenance=pending_maintenance or 0,
            pendingReturns=pending_returns
        )

        # Recent Activities
        logs_result = await self.db.execute(
            select(ActivityLog)
            .where(ActivityLog.user_id == user_id)
            .order_by(ActivityLog.created_at.desc())
            .limit(5)
        )
        logs = logs_result.scalars().all()
        activities = []
        for log in logs:
            # Map event type to UI colors
            type_color = "primary"
            if "fail" in log.action.lower() or "reject" in log.action.lower():
                type_color = "danger"
            elif "success" in log.action.lower() or "approve" in log.action.lower() or "book" in log.action.lower():
                type_color = "success"
            elif "maintenance" in log.action.lower() or "warn" in log.action.lower():
                type_color = "warning"
                
            activities.append(EmployeeActivityData(
                id=log.id,
                text=log.action,
                time="Recently", # Could format log.created_at
                type=type_color
            ))

        return EmployeeDashboardResponse(kpis=kpis, activities=activities)
