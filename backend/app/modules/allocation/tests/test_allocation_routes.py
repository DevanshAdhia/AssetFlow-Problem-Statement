"""Integration tests for allocation HTTP routes.

Verifies all allocation endpoints reject unauthenticated requests.
"""

from typing import Generator
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Fixture providing a synchronous TestClient."""
    with TestClient(app) as tc:
        yield tc


class TestAllocationRoutes:
    """Integration tests for /api/allocations endpoints."""

    def test_list_allocations_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/allocations returns 401."""
        assert client.get("/api/allocations").status_code == 401

    def test_create_allocation_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/allocations returns 401."""
        payload = {"asset_tag": "AF-001", "emp_id": "EMP-1", "person": "John", "department": "IT"}
        assert client.post("/api/allocations", json=payload).status_code == 401

    def test_return_asset_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/allocations/{id}/return returns 401."""
        assert client.post("/api/allocations/1/return").status_code == 401

    def test_transfer_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/allocations/transfer returns 401."""
        payload = {"asset_tag": "AF-001", "transfer_to": "HR", "reason": "Dept change"}
        assert client.post("/api/allocations/transfer", json=payload).status_code == 401

    def test_history_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/allocations/history returns 401."""
        assert client.get("/api/allocations/history").status_code == 401

    def test_stats_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/allocations/stats returns 401."""
        assert client.get("/api/allocations/stats").status_code == 401
