"""Service layer managing user alert notifications."""

from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.notification.model import Notification
from app.modules.notification.repository import NotificationRepository
from app.modules.notification.schema import NotificationCreate
from app.common.exceptions import NotFoundException


class NotificationService:
    """Service coordinates dispatching and reading user notification alerts."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = NotificationRepository(db)

    async def create_notification(self, data: NotificationCreate) -> Notification:
        """Create a notification entry."""
        # Verify target user exists
        from app.modules.signup.model import User
        from sqlalchemy import select
        user_res = await self.db.execute(select(User).where(User.id == data.user_id))
        if not user_res.scalar_one_or_none():
            raise NotFoundException("User", data.user_id)

        return await self.repo.create(
            title=data.title,
            message=data.message,
            type=data.type,
            user_id=data.user_id,
        )

    async def list_notifications(
        self, user_id: int, page: int = 1, page_size: int = 100, notif_type: Optional[str] = None
    ) -> Tuple[List[Notification], int]:
        """List user's notifications."""
        skip = (page - 1) * page_size
        return await self.repo.get_by_user(user_id=user_id, skip=skip, limit=page_size, notif_type=notif_type)

    async def read_notification(self, notif_id: int, user_id: int) -> Notification:
        """Mark a user's notification as read."""
        notif = await self.repo.get_by_id(notif_id)
        if notif is None:
            raise NotFoundException("Notification", notif_id)

        # Basic verification: only target user can update
        if notif.user_id != user_id:
            from app.common.exceptions import AppException
            raise AppException("Forbidden access to notification.", code="forbidden")

        return await self.repo.mark_read(notif_id)

    async def read_all_notifications(self, user_id: int) -> dict:
        """Mark all notifications of user as read."""
        await self.repo.mark_all_read(user_id)
        return {"success": True, "message": "All notifications marked as read."}
