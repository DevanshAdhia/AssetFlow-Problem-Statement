import logging
from typing import List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest
from app.modules.allocation.model import AllocationHistory
from app.modules.asset_manager.schema import DashboardResponse, KPIData, AlertData, ActivityData

logger = logging.getLogger(__name__)

class AssetManagerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_data(self) -> DashboardResponse:
        # Calculate KPIs
        total_assets = await self.db.scalar(select(func.count()).select_from(Assest))
        available = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Available"))
        allocated = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Allocated"))
        maintenance = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "In Repair"))
        lost = await self.db.scalar(select(func.count()).select_from(Assest).where(Assest.status == "Lost"))

        kpis = [
            KPIData(label="Total Assets", value=total_assets or 0),
            KPIData(label="Available", value=available or 0),
            KPIData(label="Allocated", value=allocated or 0),
            KPIData(label="Under Maintenance", value=maintenance or 0),
            KPIData(label="Lost/Missing", value=lost or 0),
        ]

        # Calculate Alerts (e.g. warranty expiring in < 30 days)
        alerts = []
        if lost and lost > 0:
            alerts.append(AlertData(
                title=f"Lost Asset Report ({lost})",
                description="One or more assets reported missing.",
                severity="warning"
            ))

        # Recent Activities
        history_result = await self.db.execute(
            select(AllocationHistory)
            .order_by(AllocationHistory.event_date.desc())
            .limit(5)
        )
        history_logs = history_result.scalars().all()
        activities = []
        for log in history_logs:
            activities.append(ActivityData(
                id=log.id,
                action=log.action,
                asset_tag=log.asset_tag,
                performed_by=log.performed_by_name,
                time_ago="Recently",  # Can be computed based on log.event_date
                type="info"
            ))

        return DashboardResponse(kpis=kpis, alerts=alerts, activities=activities)
