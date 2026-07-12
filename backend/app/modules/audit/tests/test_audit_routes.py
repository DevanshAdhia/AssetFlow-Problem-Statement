"""Integration tests for audit HTTP routes.

Verifies unauthenticated access is rejected by all audit endpoints.
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


class TestAuditRoutes:
    """Integration tests for /api/audit endpoints."""

    def test_list_cycles_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/audit/cycles returns 401 for unauthenticated requests."""
        response = client.get("/api/audit/cycles")
        assert response.status_code == 401

    def test_create_cycle_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/audit/cycles returns 401 for unauthenticated requests."""
        response = client.post("/api/audit/cycles", json={"name": "Q4 Audit"})
        assert response.status_code == 401

    def test_list_records_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/audit/records returns 401 for unauthenticated requests."""
        response = client.get("/api/audit/records")
        assert response.status_code == 401

    def test_create_record_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/audit/records returns 401 for unauthenticated requests."""
        payload = {
            "audit_cycle_id": 1,
            "asset_tag": "AF-001",
            "asset_name": "Dell XPS 15",
            "status": "Pending",
        }
        response = client.post("/api/audit/records", json=payload)
        assert response.status_code == 401

    def test_update_record_unauthenticated(self, client: TestClient) -> None:
        """Verify PUT /api/audit/records/{id} returns 401 for unauthenticated requests."""
        response = client.put("/api/audit/records/1", json={"status": "Verified"})
        assert response.status_code == 401

    def test_get_stats_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/audit/stats returns 401 for unauthenticated requests."""
        response = client.get("/api/audit/stats")
        assert response.status_code == 401
