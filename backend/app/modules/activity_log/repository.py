"""Database repository for ActivityLog records."""

from typing import List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.activity_log.model import ActivityLog


class ActivityLogRepository:
    """Repository managing queries on the activity_logs table."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, user: str, action: str, status: str) -> ActivityLog:
        """Create and persist a new activity log entry."""
        log = ActivityLog(user=user, action=action, status=status)
        self.db.add(log)
        await self.db.flush()
        await self.db.refresh(log)
        return log

    async def get_all(self, skip: int = 0, limit: int = 100) -> Tuple[List[ActivityLog], int]:
        """Fetch paginated activity log records, sorted by date descending."""
        total_result = await self.db.execute(select(func.count()).select_from(ActivityLog))
        total = total_result.scalar_one()

        records_result = await self.db.execute(
            select(ActivityLog).order_by(ActivityLog.created_at.desc()).offset(skip).limit(limit)
        )
        return list(records_result.scalars().all()), total
