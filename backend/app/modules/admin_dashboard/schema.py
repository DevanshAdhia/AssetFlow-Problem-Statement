from typing import List
from pydantic import BaseModel

class AdminDashboardKPIs(BaseModel):
    available: int
    allocated: int
    maintenance: int
    bookings: int

class AdminActivityData(BaseModel):
    id: int
    action: str
    time: str

class AdminDashboardResponse(BaseModel):
    kpis: AdminDashboardKPIs
    missing_count: int
    alloc_count: int
    recent_activities: List[AdminActivityData]
