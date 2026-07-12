"""Database repository for Notification operations."""

from typing import List, Tuple, Optional
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.notification.model import Notification


class NotificationRepository:
    """Repository managing notifications database access."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, title: str, message: str, type: str, user_id: int) -> Notification:
        """Create a notification entry."""
        notif = Notification(title=title, message=message, type=type, user_id=user_id)
        self.db.add(notif)
        await self.db.flush()
        await self.db.refresh(notif)
        return notif

    async def get_by_id(self, notif_id: int) -> Optional[Notification]:
        """Fetch a notification by ID."""
        result = await self.db.execute(select(Notification).where(Notification.id == notif_id))
        return result.scalar_one_or_none()

    async def get_by_user(
        self, user_id: int, skip: int = 0, limit: int = 100, notif_type: Optional[str] = None
    ) -> Tuple[List[Notification], int]:
        """Fetch paginated notifications for a specific user, sorted by date descending."""
        query = select(Notification).where(Notification.user_id == user_id)
        count_query = select(func.count()).select_from(Notification).where(Notification.user_id == user_id)

        if notif_type:
            query = query.where(Notification.type == notif_type)
            count_query = count_query.where(Notification.type == notif_type)

        total_result = await self.db.execute(count_query)
        total = total_result.scalar_one()

        records_result = await self.db.execute(
            query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)
        )
        return list(records_result.scalars().all()), total

    async def mark_read(self, notif_id: int) -> Optional[Notification]:
        """Mark a notification as read."""
        notif = await self.get_by_id(notif_id)
        if notif:
            notif.read = True
            await self.db.flush()
            await self.db.refresh(notif)
        return notif

    async def mark_all_read(self, user_id: int) -> None:
        """Mark all notifications of a user as read."""
        await self.db.execute(
            update(Notification).where(Notification.user_id == user_id).values(read=True)
        )
        await self.db.flush()
