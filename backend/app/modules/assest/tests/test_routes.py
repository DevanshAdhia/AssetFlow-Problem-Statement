"""Integration tests for the asset routes.

Verifies HTTP status codes and responses for endpoints managing assets
using a synchronous test client.
"""

from typing import Generator
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Fixture providing a synchronous TestClient helper for API execution.

    Yields:
        TestClient: The TestClient to run requests.
    """
    with TestClient(app) as tc:
        yield tc


class TestAssestRoutes:
    """Test suite targeting HTTP endpoints registered under /api/assest."""

    def test_list_assests_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/assest/ returns 401 Unauthorized for unauthenticated request.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/assest/")
        assert response.status_code == 401

    def test_health_check(self, client: TestClient) -> None:
        """Verify GET /api/health returns HTTP 200 with appropriate server status.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] in ("healthy", "degraded")
