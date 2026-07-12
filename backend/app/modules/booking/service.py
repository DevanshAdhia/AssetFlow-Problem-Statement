"""Business logic service layer managing shared resources and reservations bookings.

Validates capacity and slot double-booking constraints, generating hourly timeline schedules.
"""

from datetime import date
from typing import List, Optional, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.booking.model import Resource, Booking
from app.modules.booking.repository import ResourceRepository, BookingRepository
from app.modules.booking.schema import ResourceCreate, BookingCreate, TimelineSlot, TimelineResponse
from app.modules.signup.model import User
from app.modules.department.service import DepartmentService
from app.common.exceptions import ForbiddenException, ConflictException, NotFoundException, AppException


class BookingService:
    """Service layer coordinating bookings validations, timelines, and cancellations."""

    # Standard timeline slots matching the React frontend configuration
    STANDARD_SLOTS = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
    ]

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the booking service.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db
        self.resource_repo = ResourceRepository(db)
        self.booking_repo = BookingRepository(db)
        self.dept_service = DepartmentService(db)

    # --- Resource Operations ---

    async def create_resource(self, data: ResourceCreate, user_id: int) -> Resource:
        """Create a shared resource if authorized.

        Args:
            data (ResourceCreate): Input validation parameters.
            user_id (int): Requesting administrator user ID.

        Returns:
            Resource: The registered resource record.

        Raises:
            ForbiddenException: If requesting user is not an administrator.
            ConflictException: If a resource with the name already exists.
        """
        is_admin = await self.dept_service.check_is_admin(user_id)
        if not is_admin:
            raise ForbiddenException("Only administrators can register shared resources.")

        existing = await self.resource_repo.get_by_name(data.name)
        if existing:
            raise ConflictException(f"Resource with name '{data.name}' already exists.")

        amenities_str = ",".join(data.amenities) if data.amenities else ""
        return await self.resource_repo.create(
            name=data.name,
            type=data.type,
            capacity=data.capacity,
            amenities=amenities_str,
            location=data.location,
        )

    async def list_resources(self, page: int = 1, page_size: int = 100) -> Tuple[List[Resource], int]:
        """Fetch a paginated collection of resources.

        Args:
            page (int): Page index.
            page_size (int): Records size.

        Returns:
            Tuple[List[Resource], int]: Resource collection and total count.
        """
        skip = (page - 1) * page_size
        return await self.resource_repo.get_all(skip=skip, limit=page_size)

    # --- Booking Operations ---

    async def get_timeline(self, resource_id: int, booking_date: date) -> TimelineResponse:
        """Generate availability timeline matrix overlaying bookings for a date.

        Args:
            resource_id (int): Target resource reference.
            booking_date (date): Schedule date.

        Returns:
            TimelineResponse: Hourly slots availability mapping.

        Raises:
            NotFoundException: If the resource does not exist.
        """
        resource = await self.resource_repo.get_by_id(resource_id)
        if not resource:
            raise NotFoundException("Resource", resource_id)

        # Get existing bookings
        bookings = await self.booking_repo.get_bookings_for_resource(resource_id, booking_date)
        bookings_map = {b.time_slot: b for b in bookings}

        slots: List[TimelineSlot] = []
        for time in self.STANDARD_SLOTS:
            if time in bookings_map:
                b = bookings_map[time]
                # Load user email for booked by context
                user_res = await self.db.execute(select(User).where(User.id == b.user_id))
                user = user_res.scalar_one_or_none()
                booked_by_name = user.full_name if user else "Unknown User"
                
                # Use booking purpose if provided, fallback to user name
                display_purpose = f"{b.purpose} ({booked_by_name})" if b.purpose else booked_by_name

                slots.append(
                    TimelineSlot(
                        time=time,
                        status="booked",
                        booked_by=display_purpose,
                        booking_id=b.id,
                    )
                )
            else:
                slots.append(TimelineSlot(time=time, status="available"))

        return TimelineResponse(
            resource_id=resource_id,
            booking_date=booking_date,
            slots=slots,
        )

    async def create_booking(self, data: BookingCreate, user_id: int) -> Booking:
        """Reserve an hourly slot for a shared resource.

        Args:
            data (BookingCreate): Input parameters.
            user_id (int): Booking requestor.

        Returns:
            Booking: The created Booking record.

        Raises:
            NotFoundException: If the resource does not exist.
            AppException: If the time slot is invalid.
            ConflictException: If the slot is already booked.
        """
        # Validate resource exists
        resource = await self.resource_repo.get_by_id(data.resource_id)
        if not resource:
            raise NotFoundException("Resource", data.resource_id)

        # Validate time slot format
        if data.time_slot not in self.STANDARD_SLOTS:
            raise AppException(
                f"Invalid time slot '{data.time_slot}'. Allowed slots: {self.STANDARD_SLOTS}",
                code="invalid_time_slot",
            )

        # Check double booking
        existing = await self.booking_repo.get_booking_by_slot(
            resource_id=data.resource_id,
            booking_date=data.booking_date,
            time_slot=data.time_slot,
        )
        if existing:
            raise ConflictException("This time slot is already booked for the selected resource and date.")

        return await self.booking_repo.create(
            resource_id=data.resource_id,
            booking_date=data.booking_date,
            time_slot=data.time_slot,
            purpose=data.purpose,
            user_id=user_id,
        )

    async def cancel_booking(self, booking_id: int, user_id: int) -> bool:
        """Cancel and delete a slot reservation booking.

        Only the original requestor or an administrator can cancel a booking.

        Args:
            booking_id (int): PK database ID.
            user_id (int): Requesting session user ID.

        Returns:
            bool: True if canceled, False otherwise.

        Raises:
            NotFoundException: If the booking does not exist.
            ForbiddenException: If unauthorized to cancel this booking.
        """
        booking = await self.booking_repo.get_by_id(booking_id)
        if not booking:
            raise NotFoundException("Booking", booking_id)

        # Authorize: Must be the user who booked it OR an admin
        is_admin = await self.dept_service.check_is_admin(user_id)
        if booking.user_id != user_id and not is_admin:
            raise ForbiddenException("You do not have permission to cancel this booking.")

        return await self.booking_repo.delete(booking_id)
