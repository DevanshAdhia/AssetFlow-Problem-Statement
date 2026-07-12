"""Business logic service for maintenance workflow management."""

from datetime import date
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.maintenance.model import MaintenanceRequest
from app.modules.maintenance.repository import MaintenanceRepository
from app.modules.maintenance.schema import MaintenanceCreate, MaintenanceMoveRequest, COLUMN_ORDER
from app.common.exceptions import NotFoundException, AppException


class MaintenanceService:
    """Service layer coordinating maintenance Kanban workflow operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = MaintenanceRepository(db)

    async def create_request(self, data: MaintenanceCreate, user_id: int) -> MaintenanceRequest:
        """Create a new maintenance work order in the 'pending' column.

        Args:
            data (MaintenanceCreate): Input data.
            user_id (int): Requesting user.

        Returns:
            MaintenanceRequest: Newly created record.
        """
        return await self.repo.create(
            title=data.title,
            asset_name=data.asset_name,
            asset_tag=data.asset_tag,
            priority=data.priority,
            user_id=user_id,
            scheduled_date=data.scheduled_date,
        )

    async def list_requests(
        self, page: int = 1, page_size: int = 100, column: Optional[str] = None
    ) -> Tuple[List[MaintenanceRequest], int]:
        """Fetch paginated list of maintenance requests.

        Args:
            page (int): Page index.
            page_size (int): Records per page.
            column (str, optional): Filter by Kanban column.

        Returns:
            Tuple[List, int]: Records and total count.
        """
        skip = (page - 1) * page_size
        return await self.repo.get_all(skip=skip, limit=page_size, column=column)

    async def move_request(self, request_id: int, move_data: MaintenanceMoveRequest) -> MaintenanceRequest:
        """Move a maintenance card to a specified Kanban column.

        Validates the target column and ensures progression follows the defined workflow order.

        Args:
            request_id (int): Target maintenance request ID.
            move_data (MaintenanceMoveRequest): Target column.

        Returns:
            MaintenanceRequest: Updated record.

        Raises:
            NotFoundException: If request does not exist.
            AppException: If the target column is not an adjacent next step.
        """
        req = await self.repo.get_by_id(request_id)
        if not req:
            raise NotFoundException("MaintenanceRequest", request_id)

        current_idx = COLUMN_ORDER.index(req.column) if req.column in COLUMN_ORDER else -1
        target_idx = COLUMN_ORDER.index(move_data.column) if move_data.column in COLUMN_ORDER else -1

        if target_idx != current_idx + 1:
            raise AppException(
                f"Cannot move directly from '{req.column}' to '{move_data.column}'. "
                f"Expected next column: '{COLUMN_ORDER[current_idx + 1] if current_idx < len(COLUMN_ORDER) - 1 else 'already resolved'}'.",
                code="invalid_column_transition",
            )

        return await self.repo.update_column(request_id, move_data.column)

    async def delete_request(self, request_id: int) -> bool:
        """Delete a maintenance request.

        Args:
            request_id (int): Target ID.

        Returns:
            bool: True if deleted.

        Raises:
            NotFoundException: If not found.
        """
        req = await self.repo.get_by_id(request_id)
        if not req:
            raise NotFoundException("MaintenanceRequest", request_id)
        return await self.repo.delete(request_id)
