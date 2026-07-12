from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest
from app.modules.booking.model import Booking
from app.modules.maintenance.model import MaintenanceRequest
from app.modules.allocation.model import Allocation
from app.modules.activity_log.model import ActivityLog
from app.modules.admin_dashboard.schema import AdminDashboardResponse, AdminDashboardKPIs, AdminActivityData

class AdminDashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_data(self) -> AdminDashboardResponse:
        # Fetch Asset Statuses
        available = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Available"))
        allocated = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Allocated"))
        missing = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Missing"))
        
        # Fetch Maintenance counts
        maintenance = await self.db.scalar(select(func.count()).select_from(MaintenanceRequest).where(MaintenanceRequest.status != "Completed"))
        
        # Fetch Booking counts
        bookings = await self.db.scalar(select(func.count()).select_from(Booking).where(Booking.status == "Approved"))

        # Fetch Pending Allocation counts
        alloc_count = await self.db.scalar(select(func.count()).select_from(Allocation).where(Allocation.status == "Pending"))

        kpis = AdminDashboardKPIs(
            available=available or 0,
            allocated=allocated or 0,
            maintenance=maintenance or 0,
            bookings=bookings or 0
        )

        # Recent Activities
        logs_result = await self.db.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(5))
        logs = logs_result.scalars().all()
        activities = [
            AdminActivityData(
                id=log.id,
                action=log.action,
                time=log.created_at.strftime("%H:%M") if hasattr(log.created_at, 'strftime') else "Recently"
            ) for log in logs
        ]

        return AdminDashboardResponse(
            kpis=kpis,
            missing_count=missing or 0,
            alloc_count=alloc_count or 0,
            recent_activities=activities
        )
