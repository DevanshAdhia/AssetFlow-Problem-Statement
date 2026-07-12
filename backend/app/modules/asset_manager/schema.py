from typing import List, Optional
from pydantic import BaseModel
from app.modules.assest.schema import AssestResponse

class KPIData(BaseModel):
    label: str
    value: str | int

class AlertData(BaseModel):
    title: str
    description: str
    severity: str  # "danger", "warning", "info"

class ActivityData(BaseModel):
    id: int
    action: str
    asset_tag: str
    performed_by: Optional[str]
    time_ago: str
    type: str  # "success", "info", "primary", "warning", "danger"

class DashboardResponse(BaseModel):
    kpis: List[KPIData]
    alerts: List[AlertData]
    activities: List[ActivityData]
