from typing import List
from pydantic import BaseModel

class DepartmentUtilization(BaseModel):
    name: str
    utilization: int

class MaintenanceIncidentData(BaseModel):
    month: str
    incidents: int

class AlertItem(BaseModel):
    title: str
    items: List[str]

class ReportResponse(BaseModel):
    departmentData: List[DepartmentUtilization]
    maintenanceData: List[MaintenanceIncidentData]
    alerts: List[AlertItem]
