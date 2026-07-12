from typing import List
from pydantic import BaseModel

class DH_KPIs(BaseModel):
    label: str
    value: int | str
    delta: str
    color: str
    icon: str

class TrendDataPoint(BaseModel):
    m: str
    v: int

class ApprovalData(BaseModel):
    id: str
    employee: str
    asset: str
    priority: str
    submitted: str

class UpcomingBookingData(BaseModel):
    resource: str
    date: str
    bookedBy: str
    purpose: str

class DHActivityData(BaseModel):
    msg: str
    time: str
    type: str

class DHDashboardResponse(BaseModel):
    kpis: List[DH_KPIs]
    allocation_trend: List[TrendDataPoint]
    booking_trend: List[TrendDataPoint]
    pending_approvals: List[ApprovalData]
    upcoming_bookings: List[UpcomingBookingData]
    recent_activities: List[DHActivityData]
