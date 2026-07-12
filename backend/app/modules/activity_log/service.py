"""Service coordinating system activity logging."""

from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.activity_log.model import ActivityLog
from app.modules.activity_log.repository import ActivityLogRepository
from app.modules.activity_log.schema import ActivityLogCreate


class ActivityLogService:
    """Service layer managing ActivityLogs."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = ActivityLogRepository(db)

    async def create_log(self, data: ActivityLogCreate) -> ActivityLog:
        """Create a new activity log entry."""
        return await self.repo.create(user=data.user, action=data.action, status=data.status)

    async def list_logs(self, page: int = 1, page_size: int = 100) -> Tuple[List[ActivityLog], int]:
        """Fetch paginated activity logs."""
        skip = (page - 1) * page_size
        return await self.repo.get_all(skip=skip, limit=page_size)
