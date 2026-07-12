"""Database repositories for maintenance request CRUD operations."""

from datetime import date
from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.maintenance.model import MaintenanceRequest


class MaintenanceRepository:
    """Repository managing database operations for MaintenanceRequest."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(
        self,
        title: str,
        asset_name: str,
        asset_tag: str,
        priority: str,
        user_id: Optional[int],
        scheduled_date: Optional[date] = None,
    ) -> MaintenanceRequest:
        """Create a new maintenance request record."""
        req = MaintenanceRequest(
            title=title,
            asset_name=asset_name,
            asset_tag=asset_tag,
            priority=priority,
            column="pending",
            scheduled_date=scheduled_date,
            user_id=user_id,
        )
        self.db.add(req)
        await self.db.flush()
        await self.db.refresh(req)
        return req

    async def get_by_id(self, request_id: int) -> Optional[MaintenanceRequest]:
        """Fetch a maintenance request by primary key."""
        result = await self.db.execute(
            select(MaintenanceRequest).where(MaintenanceRequest.id == request_id)
        )
        return result.scalar_one_or_none()

    async def get_all(
        self, skip: int = 0, limit: int = 100, column: Optional[str] = None
    ) -> Tuple[List[MaintenanceRequest], int]:
        """Fetch all maintenance requests with optional column filter."""
        query = select(MaintenanceRequest)
        count_query = select(func.count()).select_from(MaintenanceRequest)
        if column:
            query = query.where(MaintenanceRequest.column == column)
            count_query = count_query.where(MaintenanceRequest.column == column)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        records_result = await self.db.execute(
            query.order_by(MaintenanceRequest.created_at.desc()).offset(skip).limit(limit)
        )
        return list(records_result.scalars().all()), total

    async def update_column(self, request_id: int, new_column: str) -> Optional[MaintenanceRequest]:
        """Update the Kanban column of a maintenance request."""
        req = await self.get_by_id(request_id)
        if req:
            req.column = new_column
            await self.db.flush()
            await self.db.refresh(req)
        return req

    async def delete(self, request_id: int) -> bool:
        """Delete a maintenance request record."""
        req = await self.get_by_id(request_id)
        if req:
            await self.db.delete(req)
            return True
        return False
