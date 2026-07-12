"""Integration tests for maintenance HTTP routes.

Verifies unauthenticated access is rejected by all maintenance endpoints.
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


class TestMaintenanceRoutes:
    """Integration tests for /api/maintenance endpoints."""

    def test_list_maintenance_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/maintenance returns 401 for unauthenticated requests."""
        response = client.get("/api/maintenance")
        assert response.status_code == 401

    def test_create_maintenance_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/maintenance returns 401 for unauthenticated requests."""
        payload = {
            "title": "Projector bulb replacement",
            "asset_name": "Projector X-1",
            "asset_tag": "AF-009",
            "priority": "High",
        }
        response = client.post("/api/maintenance", json=payload)
        assert response.status_code == 401

    def test_move_maintenance_unauthenticated(self, client: TestClient) -> None:
        """Verify PUT /api/maintenance/{id}/move returns 401 for unauthenticated requests."""
        response = client.put("/api/maintenance/1/move", json={"column": "approved"})
        assert response.status_code == 401

    def test_delete_maintenance_unauthenticated(self, client: TestClient) -> None:
        """Verify DELETE /api/maintenance/{id} returns 401 for unauthenticated requests."""
        response = client.delete("/api/maintenance/1")
        assert response.status_code == 401
