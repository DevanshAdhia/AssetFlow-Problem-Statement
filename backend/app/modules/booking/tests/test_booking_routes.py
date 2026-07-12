"""Integration tests for the booking HTTP routes.

Verifies page listings, timeline schedules, and authorization barriers using synchronous test client.
"""

from typing import Generator
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Fixture providing a synchronous TestClient helper.

    Yields:
        TestClient: Synchronous test client.
    """
    with TestClient(app) as tc:
        yield tc


class TestBookingRoutes:
    """Test suite targeting HTTP endpoints registered under /api/bookings."""

    def test_list_resources_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/bookings/resources returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/bookings/resources")
        assert response.status_code == 401

    def test_create_resource_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/bookings/resources returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        payload = {
            "name": "Room B5",
            "type": "Room",
            "capacity": 7,
            "amenities": ["TV"],
            "location": "Floor 2",
        }
        response = client.post("/api/bookings/resources", json=payload)
        assert response.status_code == 401

    def test_get_timeline_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/bookings/timeline returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/bookings/timeline?resource_id=1&booking_date=2026-10-12")
        assert response.status_code == 401

    def test_create_booking_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/bookings returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        payload = {
            "resource_id": 1,
            "booking_date": "2026-10-12",
            "time_slot": "09:00 AM",
            "purpose": "Marketing Sync",
        }
        response = client.post("/api/bookings", json=payload)
        assert response.status_code == 401

    def test_cancel_booking_unauthenticated(self, client: TestClient) -> None:
        """Verify DELETE /api/bookings/{id} returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.delete("/api/bookings/1")
        assert response.status_code == 401
