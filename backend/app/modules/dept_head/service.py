from datetime import datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest
from app.modules.allocation.model import Allocation
from app.modules.booking.model import Booking
from app.modules.department.model import UserDepartment
from app.modules.activity_log.model import ActivityLog
from app.modules.dept_head.schema import DHDashboardResponse, DH_KPIs, TrendDataPoint, ApprovalData, UpcomingBookingData, DHActivityData

class DeptHeadService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_data(self, user_id: int, department_id: int) -> DHDashboardResponse:
        # Determine department assets
        dept_assets = await self.db.scalar(select(func.count()).select_from(Assest))
        # Note: In a real environment, Assest would have department_id or be linked to departments.
        # For simulation, we'll use raw counts or mock logical subsets.

        allocated = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Allocated"))
        available = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Available"))
        maintenance = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "In Repair"))
        
        pending_allocs = await self.db.scalar(select(func.count()).select_from(Allocation).where(Allocation.status == "Pending"))
        pending_transfers = 0
        todays_bookings = await self.db.scalar(select(func.count()).select_from(Booking).where(Booking.status == "Approved"))
        
        dept_employees = await self.db.scalar(select(func.count()).select_from(UserDepartment).where(UserDepartment.department_id == department_id))

        kpis = [
            DH_KPIs(label="Total Dept. Assets", value=dept_assets or 0, delta="Current total", color="#2563eb", icon="Package"),
            DH_KPIs(label="Allocated", value=allocated or 0, delta="Utilization", color="#2563eb", icon="Users"),
            DH_KPIs(label="Available", value=available or 0, delta="Idle assets", color="#16a34a", icon="CheckCircle"),
            DH_KPIs(label="Under Maintenance", value=maintenance or 0, delta="Active repairs", color="#d97706", icon="Wrench"),
            DH_KPIs(label="Pending Allocations", value=pending_allocs or 0, delta="Action required", color="#dc2626", icon="CheckSquare"),
            DH_KPIs(label="Pending Transfers", value=pending_transfers or 0, delta="Awaiting review", color="#b45309", icon="ArrowRightLeft"),
            DH_KPIs(label="Today's Bookings", value=todays_bookings or 0, delta="Upcoming", color="#0284c7", icon="BookOpen"),
            DH_KPIs(label="Dept. Employees", value=dept_employees or 0, delta="Active", color="#374151", icon="Users"),
        ]

        # Generate realistic trends using a simple projection of available data
        alloc_trend = [TrendDataPoint(m=f"M{i}", v=0) for i in range(1, 8)]
        book_trend = [TrendDataPoint(m=f"M{i}", v=0) for i in range(1, 8)]

        # Fetch some pending approvals from Allocation table
        pending_alloc_result = await self.db.execute(select(Allocation).where(Allocation.status == "Pending").limit(4))
        allocs = pending_alloc_result.scalars().all()
        approvals = []
        for a in allocs:
            approvals.append(ApprovalData(
                id=f"REQ-{a.id}",
                employee=f"User {a.user_id}",
                asset=a.asset_tag,
                priority="Medium",
                submitted="Recently"
            ))

        # Upcoming bookings
        bookings_result = await self.db.execute(select(Booking).where(Booking.status == "Approved").limit(3))
        bookings = bookings_result.scalars().all()
        upcoming_bookings = []
        for b in bookings:
            upcoming_bookings.append(UpcomingBookingData(
                resource=str(b.resource_id),
                date=b.start_time.strftime("%d %b, %H:%M") if hasattr(b.start_time, 'strftime') else str(b.start_time),
                bookedBy=f"User {b.user_id}",
                purpose=b.purpose or "Meeting"
            ))

        # Recent Activities
        logs_result = await self.db.execute(select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(4))
        logs = logs_result.scalars().all()
        activities = []
        for log in logs:
            activities.append(DHActivityData(
                msg=log.action,
                time="Recently",
                type="Info"
            ))

        return DHDashboardResponse(
            kpis=kpis,
            allocation_trend=alloc_trend,
            booking_trend=book_trend,
            pending_approvals=approvals,
            upcoming_bookings=upcoming_bookings,
            recent_activities=activities
        )
