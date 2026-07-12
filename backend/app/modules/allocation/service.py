"""Business logic service for asset allocation and transfer workflow.

Coordinates asset status updates on the Assest table alongside
Allocation and AllocationHistory record management.
"""

from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.assest.model import Assest
from app.modules.allocation.model import Allocation, AllocationHistory
from app.modules.allocation.repository import AllocationRepository, AllocationHistoryRepository
from app.modules.allocation.schema import (
    AllocationCreate,
    TransferRequest,
    AllocationStatsResponse,
)
from app.common.exceptions import NotFoundException, AppException


class AllocationService:
    """Service coordinating allocation, transfer, and return operations."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.alloc_repo = AllocationRepository(db)
        self.hist_repo = AllocationHistoryRepository(db)

    # ── helpers ──────────────────────────────────────────────────────────

    async def _get_asset(self, asset_tag: str) -> Assest:
        """Fetch an Assest record by tag or raise NotFoundException.

        Args:
            asset_tag (str): The asset tag, e.g. 'AF-001'.

        Returns:
            Assest: Found asset record.

        Raises:
            NotFoundException: If asset does not exist.
        """
        result = await self.db.execute(
            select(Assest).where(Assest.tag == asset_tag)
        )
        asset = result.scalar_one_or_none()
        if not asset:
            raise NotFoundException("Assest", asset_tag)
        return asset

    async def _get_approver_name(self, user_id: int) -> str:
        """Resolve a user display name from the users table.

        Falls back to a generic label if user is not found.

        Args:
            user_id (int): Approving user's ID.

        Returns:
            str: Display name string.
        """
        from app.modules.signup.model import User
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        return user.full_name if user else f"User #{user_id}"

    # ── Allocation ────────────────────────────────────────────────────────

    async def create_allocation(
        self, data: AllocationCreate, approver_user_id: int
    ) -> Allocation:
        """Allocate an available asset to an employee.

        Validates the asset exists and is Available, then updates its
        status to Allocated, creates an Allocation record, and logs a
        history event.

        Args:
            data (AllocationCreate): Allocation form data.
            approver_user_id (int): Authenticated admin user ID.

        Returns:
            Allocation: The newly created allocation record.

        Raises:
            NotFoundException: If the asset tag does not exist.
            AppException: If the asset is not currently Available.
        """
        asset = await self._get_asset(data.asset_tag)
        if asset.status != "Available":
            raise AppException(
                f"Asset '{data.asset_tag}' is not available for allocation. Current status: '{asset.status}'.",
                code="asset_not_available",
            )

        approver_name = await self._get_approver_name(approver_user_id)

        # Create allocation record
        alloc = await self.alloc_repo.create(
            asset_tag=data.asset_tag,
            asset_name=asset.name,
            emp_id=data.emp_id,
            person=data.person,
            department=data.department,
            approved_by_user_id=approver_user_id,
            approved_by_name=approver_name,
            reason=data.reason,
        )

        # Update asset status
        asset.status = "Allocated"
        asset.current_holder = data.person
        await self.db.flush()

        # Log history event
        await self.hist_repo.create(
            asset_tag=data.asset_tag,
            action=f"Allocated {data.asset_tag} to {data.person} ({data.department})",
            performed_by_user_id=approver_user_id,
            performed_by_name=approver_name,
            allocation_id=alloc.id,
        )

        return alloc

    async def list_allocations(
        self, page: int = 1, page_size: int = 100, search: Optional[str] = None
    ) -> Tuple[List[Allocation], int]:
        """Fetch paginated active allocations.

        Args:
            page (int): Page number.
            page_size (int): Records per page.
            search (str, optional): Filter by tag, person, or department.

        Returns:
            Tuple[List[Allocation], int]: Records and total count.
        """
        skip = (page - 1) * page_size
        return await self.alloc_repo.get_all(skip=skip, limit=page_size, search=search)

    async def return_asset(self, allocation_id: int, user_id: int) -> dict:
        """Return an allocated asset back to Available status.

        Deletes the Allocation record and logs a return history event.

        Args:
            allocation_id (int): Active allocation ID.
            user_id (int): Authenticated admin user ID.

        Returns:
            dict: Success confirmation.

        Raises:
            NotFoundException: If allocation does not exist.
        """
        alloc = await self.alloc_repo.get_by_id(allocation_id)
        if not alloc:
            raise NotFoundException("Allocation", allocation_id)

        person_name = alloc.person
        dept = alloc.department
        tag = alloc.asset_tag
        performer_name = await self._get_approver_name(user_id)

        # Reset asset status
        asset_result = await self.db.execute(select(Assest).where(Assest.tag == tag))
        asset = asset_result.scalar_one_or_none()
        if asset:
            asset.status = "Available"
            asset.current_holder = None
            await self.db.flush()

        # Log history before deletion
        await self.hist_repo.create(
            asset_tag=tag,
            action=f"Returned from {person_name} ({dept})",
            performed_by_user_id=user_id,
            performed_by_name=performer_name,
            allocation_id=None,
        )

        # Delete allocation record
        await self.alloc_repo.delete(allocation_id)

        return {"success": True, "message": f"Asset {tag} returned to Available."}

    # ── Transfer ──────────────────────────────────────────────────────────

    async def create_transfer(
        self, data: TransferRequest, approver_user_id: int
    ) -> Allocation:
        """Transfer an available asset to a new holder.

        The asset must be Available. Creates a new Allocation record
        and logs a history event.

        Args:
            data (TransferRequest): Transfer form data.
            approver_user_id (int): Authenticated admin user ID.

        Returns:
            Allocation: The created allocation record.

        Raises:
            NotFoundException: If the asset tag does not exist.
            AppException: If the asset is already Allocated.
        """
        asset = await self._get_asset(data.asset_tag)
        if asset.status == "Allocated":
            raise AppException(
                f"Asset '{data.asset_tag}' is already allocated. Return it first before transferring.",
                code="asset_allocated",
            )

        approver_name = await self._get_approver_name(approver_user_id)

        alloc = await self.alloc_repo.create(
            asset_tag=data.asset_tag,
            asset_name=asset.name,
            emp_id="TRANSFER",
            person=data.transfer_to,
            department="Transfer",
            approved_by_user_id=approver_user_id,
            approved_by_name=approver_name,
            reason=data.reason,
        )

        asset.status = "Allocated"
        asset.current_holder = data.transfer_to
        await self.db.flush()

        await self.hist_repo.create(
            asset_tag=data.asset_tag,
            action=f"Transferred to {data.transfer_to}",
            performed_by_user_id=approver_user_id,
            performed_by_name=approver_name,
            allocation_id=alloc.id,
        )

        return alloc

    # ── History & Stats ───────────────────────────────────────────────────

    async def list_history(
        self,
        page: int = 1,
        page_size: int = 100,
        asset_tag: Optional[str] = None,
    ) -> Tuple[List[AllocationHistory], int]:
        """Fetch paginated allocation history events.

        Args:
            page (int): Page number.
            page_size (int): Records per page.
            asset_tag (str, optional): Filter by specific asset tag.

        Returns:
            Tuple[List[AllocationHistory], int]: Events and total count.
        """
        skip = (page - 1) * page_size
        return await self.hist_repo.get_all(skip=skip, limit=page_size, asset_tag=asset_tag)

    async def get_stats(self) -> AllocationStatsResponse:
        """Return allocation analytics statistics.

        Combines data from Allocation and Assest tables.

        Returns:
            AllocationStatsResponse: KPI summary counts.
        """
        total_allocated = await self.alloc_repo.count_active()
        departments_active = await self.alloc_repo.count_active_departments()

        total_assets_result = await self.db.execute(
            select(func.count()).select_from(Assest).where(Assest.is_active == True)
        )
        total_assets = total_assets_result.scalar_one()

        available_result = await self.db.execute(
            select(func.count()).select_from(Assest).where(
                Assest.status == "Available", Assest.is_active == True
            )
        )
        total_available = available_result.scalar_one()

        return AllocationStatsResponse(
            total_allocated=total_allocated,
            total_available=total_available,
            total_assets=total_assets,
            departments_active=departments_active,
        )
