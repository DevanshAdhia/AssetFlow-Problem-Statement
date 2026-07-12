from typing import List
from pydantic import BaseModel

class EmployeeKPIs(BaseModel):
    assignedAssets: int
    activeBookings: int
    pendingMaintenance: int
    pendingReturns: int

class EmployeeActivityData(BaseModel):
    id: int
    text: str
    time: str
    type: str  # "success", "warning", "primary", etc.

class EmployeeDashboardResponse(BaseModel):
    kpis: EmployeeKPIs
    activities: List[EmployeeActivityData]
