"""Integration tests for the user signup and OTP routes.

Verifies the HTTP status codes, payloads, and mock responses of endpoints
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


class TestSignupRoutes:
    """Test suite targeting HTTP endpoints registered under /api/signup."""

    def test_send_otp_success(self, client: TestClient) -> None:
        """Verify POST /send-otp returns success message on correct payload.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.post("/api/signup/send-otp", json={"email": "test@example.com"})
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_verify_otp_success_dev_bypass(self, client: TestClient) -> None:
        """Verify POST /verify-otp returns success using fallback '1234'.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.post(
            "/api/signup/verify-otp", json={"email": "test@example.com", "code": "1234"}
        )
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_verify_otp_invalid_format(self, client: TestClient) -> None:
        """Verify invalid OTP payloads trigger standard 422 validation.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.post(
            "/api/signup/verify-otp", json={"email": "invalid-email", "code": "12"}
        )
        assert response.status_code == 422
