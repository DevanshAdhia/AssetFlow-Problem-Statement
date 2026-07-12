"""Unit tests for the BookingService.

Tests resource registration, slot reservations, timeline fetches, and cancellation checks.
"""

from datetime import date
from unittest.mock import AsyncMock, MagicMock
import pytest
from app.modules.booking.service import BookingService
from app.modules.booking.schema import ResourceCreate, BookingCreate
from app.modules.signup.model import User
from app.modules.booking.model import Resource, Booking
from app.common.exceptions import ForbiddenException, ConflictException, NotFoundException, AppException


class TestBookingService:
    """Test suite containing unit tests for the BookingService class."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        """Fixture providing an AsyncMock database session."""
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> BookingService:
        """Fixture providing a BookingService instance."""
        return BookingService(mock_db)

    async def test_create_resource_unauthorized(self, service: BookingService) -> None:
        """Verify non-admin users cannot register new shared resources.

        Args:
            service (BookingService): The booking service.
        """
        service.dept_service.check_is_admin = AsyncMock(return_value=False)
        data = ResourceCreate(name="Room A", type="Room", capacity=10, location="HQ")

        with pytest.raises(ForbiddenException):
            await service.create_resource(data, user_id=2)

    async def test_create_resource_success(self, service: BookingService) -> None:
        """Verify successful resource registration by an admin user.

        Args:
            service (BookingService): The booking service.
        """
        service.dept_service.check_is_admin = AsyncMock(return_value=True)
        service.resource_repo.get_by_name = AsyncMock(return_value=None)
        
        mock_res = MagicMock(spec=Resource)
        mock_res.name = "Room A"
        service.resource_repo.create = AsyncMock(return_value=mock_res)

        data = ResourceCreate(name="Room A", type="Room", capacity=10, location="HQ")
        result = await service.create_resource(data, user_id=1)

        assert result.name == "Room A"
        service.resource_repo.create.assert_called_once()

    async def test_create_booking_resource_not_found(self, service: BookingService) -> None:
        """Verify booking fails if the resource does not exist.

        Args:
            service (BookingService): The booking service.
        """
        service.resource_repo.get_by_id = AsyncMock(return_value=None)
        data = BookingCreate(resource_id=999, booking_date=date(2026, 10, 12), time_slot="09:00 AM", purpose="Meeting")

        with pytest.raises(NotFoundException):
            await service.create_booking(data, user_id=1)

    async def test_create_booking_invalid_slot(self, service: BookingService) -> None:
        """Verify booking fails with invalid time slot strings.

        Args:
            service (BookingService): The booking service.
        """
        mock_res = MagicMock(spec=Resource)
        service.resource_repo.get_by_id = AsyncMock(return_value=mock_res)
        data = BookingCreate(resource_id=1, booking_date=date(2026, 10, 12), time_slot="12:30 PM", purpose="Meeting")

        with pytest.raises(AppException):
            await service.create_booking(data, user_id=1)

    async def test_create_booking_double_booking(self, service: BookingService) -> None:
        """Verify booking fails if slot is already reserved.

        Args:
            service (BookingService): The booking service.
        """
        mock_res = MagicMock(spec=Resource)
        service.resource_repo.get_by_id = AsyncMock(return_value=mock_res)
        
        mock_booking = MagicMock(spec=Booking)
        service.booking_repo.get_booking_by_slot = AsyncMock(return_value=mock_booking)

        data = BookingCreate(resource_id=1, booking_date=date(2026, 10, 12), time_slot="10:00 AM", purpose="Meeting")
        with pytest.raises(ConflictException):
            await service.create_booking(data, user_id=1)

    async def test_create_booking_success(self, service: BookingService) -> None:
        """Verify successful booking creation.

        Args:
            service (BookingService): The booking service.
        """
        mock_res = MagicMock(spec=Resource)
        service.resource_repo.get_by_id = AsyncMock(return_value=mock_res)
        service.booking_repo.get_booking_by_slot = AsyncMock(return_value=None)
        
        mock_booking = MagicMock(spec=Booking)
        mock_booking.id = 5
        service.booking_repo.create = AsyncMock(return_value=mock_booking)

        data = BookingCreate(resource_id=1, booking_date=date(2026, 10, 12), time_slot="10:00 AM", purpose="Meeting")
        result = await service.create_booking(data, user_id=1)

        assert result.id == 5
        service.booking_repo.create.assert_called_once()

    async def test_cancel_booking_unauthorized(self, service: BookingService) -> None:
        """Verify that a user cannot cancel a booking created by someone else.

        Args:
            service (BookingService): The booking service.
        """
        mock_booking = MagicMock(spec=Booking)
        mock_booking.user_id = 99  # owned by user 99
        service.booking_repo.get_by_id = AsyncMock(return_value=mock_booking)
        service.dept_service.check_is_admin = AsyncMock(return_value=False)

        with pytest.raises(ForbiddenException):
            await service.cancel_booking(booking_id=1, user_id=2)

    async def test_cancel_booking_success_owner(self, service: BookingService) -> None:
        """Verify successful booking cancellation by its original owner.

        Args:
            service (BookingService): The booking service.
        """
        mock_booking = MagicMock(spec=Booking)
        mock_booking.user_id = 2
        service.booking_repo.get_by_id = AsyncMock(return_value=mock_booking)
        service.dept_service.check_is_admin = AsyncMock(return_value=False)
        service.booking_repo.delete = AsyncMock(return_value=True)

        result = await service.cancel_booking(booking_id=1, user_id=2)
        assert result is True
        service.booking_repo.delete.assert_called_once_with(1)
