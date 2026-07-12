from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.assest.model import Assest
from app.modules.department.model import Department
from app.modules.maintenance.model import MaintenanceRequest
from app.modules.report.schema import ReportResponse, DepartmentUtilization, MaintenanceIncidentData, AlertItem

class ReportService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_reports(self) -> ReportResponse:
        # Mocking department utilization data due to missing foreign keys directly on Assest
        # In a real scenario, Assest should map to Department for accurate utilization.
        dept_utilization = [
            DepartmentUtilization(name="Technology", utilization=85),
            DepartmentUtilization(name="Operations", utilization=65),
            DepartmentUtilization(name="Finance", utilization=45),
            DepartmentUtilization(name="HR", utilization=30),
            DepartmentUtilization(name="Legal", utilization=20)
        ]

        # Monthly maintenance data (YTD mock or basic aggregation)
        maintenance_data = [
            MaintenanceIncidentData(month="Jan", incidents=4),
            MaintenanceIncidentData(month="Feb", incidents=7),
            MaintenanceIncidentData(month="Mar", incidents=5),
            MaintenanceIncidentData(month="Apr", incidents=12),
            MaintenanceIncidentData(month="May", incidents=8),
            MaintenanceIncidentData(month="Jun", incidents=15)
        ]

        # Action Required Alerts
        # Fetch some idle assets
        idle_assets = await self.db.execute(select(Assest).where(Assest.status == "Available").limit(2))
        idle_items = [f"{a.name} ({a.asset_tag}) : Unused" for a in idle_assets.scalars().all()]

        # Fetch some maintenance required assets
        maint_assets = await self.db.execute(select(Assest).where(Assest.status == "In Repair").limit(2))
        maint_items = [f"{a.name} ({a.asset_tag}) : Requires review" for a in maint_assets.scalars().all()]

        alerts = [
            AlertItem(title="Idle Assets", items=idle_items if idle_items else ["None currently"]),
            AlertItem(title="Maintenance / Retirement", items=maint_items if maint_items else ["None currently"])
        ]

        return ReportResponse(
            departmentData=dept_utilization,
            maintenanceData=maintenance_data,
            alerts=alerts
        )
