"""Integration tests for profile HTTP routes.

Verifies all profile endpoints reject unauthenticated requests with 401.
"""

from typing import Generator
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Fixture providing a synchronous TestClient.

    Yields:
        TestClient: HTTP test client.
    """
    with TestClient(app) as tc:
        yield tc


class TestProfileRoutes:
    """Integration tests for /api/profile endpoints."""

    def test_get_profile_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/profile/me returns 401 for unauthenticated requests."""
        response = client.get("/api/profile/me")
        assert response.status_code == 401

    def test_update_profile_unauthenticated(self, client: TestClient) -> None:
        """Verify PUT /api/profile/me returns 401 for unauthenticated requests."""
        response = client.put("/api/profile/me", json={"full_name": "New Name"})
        assert response.status_code == 401

    def test_change_password_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/profile/me/change-password returns 401 for unauthenticated requests."""
        payload = {
            "current_password": "OldPass1!",
            "new_password": "NewPass1!",
            "confirm_password": "NewPass1!",
        }
        response = client.post("/api/profile/me/change-password", json=payload)
        assert response.status_code == 401
