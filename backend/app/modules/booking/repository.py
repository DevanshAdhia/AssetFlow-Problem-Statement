"""Database repositories managing queries for shared resources and reservation bookings.

Coordinates persistence transactions for bookings and resources using SQLAlchemy AsyncSession.
"""

from datetime import date
from typing import List, Optional, Tuple
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.booking.model import Resource, Booking


class ResourceRepository:
    """Repository class managing queries for the Resource table."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def create(
        self, name: str, type: str, capacity: Optional[int], amenities: Optional[str], location: str
    ) -> Resource:
        """Create a new shared resource.

        Args:
            name (str): Display name.
            type (str): "Room" or "Equipment".
            capacity (int, optional): Seating capacity.
            amenities (str, optional): Comma-separated amenities.
            location (str): Physical location.

        Returns:
            Resource: The created Resource instance.
        """
        resource = Resource(
            name=name,
            type=type,
            capacity=capacity,
            amenities=amenities,
            location=location,
        )
        self.db.add(resource)
        await self.db.flush()
        await self.db.refresh(resource)
        return resource

    async def get_by_id(self, resource_id: int) -> Optional[Resource]:
        """Fetch a resource profile by its ID.

        Args:
            resource_id (int): Primary key ID.

        Returns:
            Optional[Resource]: Matched resource or None.
        """
        result = await self.db.execute(select(Resource).where(Resource.id == resource_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Optional[Resource]:
        """Fetch a resource by its unique name.

        Args:
            name (str): Display name.

        Returns:
            Optional[Resource]: Matched resource or None.
        """
        result = await self.db.execute(select(Resource).where(Resource.name == name))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> Tuple[List[Resource], int]:
        """Retrieve a paginated collection of resources along with total count.

        Args:
            skip (int): Records offset.
            limit (int): Max records per query.

        Returns:
            Tuple[List[Resource], int]: List of resources and total count.
        """
        # Get count
        from sqlalchemy import func
        count_result = await self.db.execute(select(func.count()).select_from(Resource))
        total = count_result.scalar_one()

        # Get records
        records_result = await self.db.execute(
            select(Resource).offset(skip).limit(limit).order_by(Resource.id.asc())
        )
        records = list(records_result.scalars().all())

        return records, total


class BookingRepository:
    """Repository class managing query transactions for the Booking table."""

    def __init__(self, db: AsyncSession) -> None:
        """Initialize the repository.

        Args:
            db (AsyncSession): Asynchronous database session.
        """
        self.db = db

    async def create(
        self, resource_id: int, booking_date: date, time_slot: str, purpose: str, user_id: int
    ) -> Booking:
        """Create a new reservation booking.

        Args:
            resource_id (int): Associated resource.
            booking_date (date): Date of reservation.
            time_slot (str): Hourly slot string.
            purpose (str): Booking description.
            user_id (int): Associated requestor.

        Returns:
            Booking: The created Booking record.
        """
        booking = Booking(
            resource_id=resource_id,
            booking_date=booking_date,
            time_slot=time_slot,
            purpose=purpose,
            user_id=user_id,
        )
        self.db.add(booking)
        await self.db.flush()
        await self.db.refresh(booking)
        return booking

    async def get_by_id(self, booking_id: int) -> Optional[Booking]:
        """Fetch a booking by primary key ID.

        Args:
            booking_id (int): Primary key ID.

        Returns:
            Optional[Booking]: Matched booking or None.
        """
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id))
        return result.scalar_one_or_none()

    async def get_bookings_for_resource(self, resource_id: int, booking_date: date) -> List[Booking]:
        """Retrieve all bookings assigned to a resource on a specific date.

        Args:
            resource_id (int): Associated resource.
            booking_date (date): Date filter.

        Returns:
            List[Booking]: Bookings list.
        """
        result = await self.db.execute(
            select(Booking)
            .where(Booking.resource_id == resource_id, Booking.booking_date == booking_date)
            .order_by(Booking.created_at.asc())
        )
        return list(result.scalars().all())

    async def get_booking_by_slot(
        self, resource_id: int, booking_date: date, time_slot: str
    ) -> Optional[Booking]:
        """Query booking matching a specific slot coordinates.

        Args:
            resource_id (int): Resource reference.
            booking_date (date): Target date.
            time_slot (str): Hourly slot string.

        Returns:
            Optional[Booking]: Matched booking or None.
        """
        result = await self.db.execute(
            select(Booking).where(
                Booking.resource_id == resource_id,
                Booking.booking_date == booking_date,
                Booking.time_slot == time_slot,
            )
        )
        return result.scalar_one_or_none()

    async def delete(self, booking_id: int) -> bool:
        """Cancel and delete a booking record by ID.

        Args:
            booking_id (int): Booking primary key ID.

        Returns:
            bool: True if deleted successfully, otherwise False.
        """
        result = await self.db.execute(delete(Booking).where(Booking.id == booking_id))
        return result.rowcount > 0
