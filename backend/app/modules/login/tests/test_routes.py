"""Integration tests for the user login routes.

Verifies status codes and schema validation of authentication endpoints
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


class TestLoginRoutes:
    """Test suite targeting HTTP endpoints registered under /api/login."""

    def test_login_invalid_payload(self, client: TestClient) -> None:
        """Verify invalid payload structures fail with status code 422.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.post("/api/login/token", json={"email": "invalid"})
        assert response.status_code == 422

    def test_google_login_invalid_payload(self, client: TestClient) -> None:
        """Verify Google OAuth path fails with 422 on empty inputs.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.post("/api/login/google", json={})
        assert response.status_code == 422
