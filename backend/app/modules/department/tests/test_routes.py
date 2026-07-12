"""Integration tests for the department, category, and location HTTP endpoints.

Verifies route registrations and security gates using a synchronous test client.
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


class TestDepartmentRoutes:
    """Test suite targeting HTTP endpoints registered under /api/departments."""

    def test_list_departments_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/departments returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/departments")
        assert response.status_code == 401

    def test_create_department_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/departments returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        payload = {
            "name": "IT Infrastructure",
            "head": "Alex Johnson",
            "parent": "Technology",
            "status": "Active",
        }
        response = client.post("/api/departments", json=payload)
        assert response.status_code == 401

    def test_list_categories_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/departments/categories returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/departments/categories")
        assert response.status_code == 401

    def test_create_category_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/departments/categories returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        payload = {
            "name": "Electronics",
            "description": "Laptops, Phones",
            "total_assets_initial": 0,
        }
        response = client.post("/api/departments/categories", json=payload)
        assert response.status_code == 401

    def test_list_locations_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/departments/locations returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/departments/locations")
        assert response.status_code == 401

    def test_create_location_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/departments/locations returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        payload = {
            "name": "Main HQ - Floor 1",
            "type": "Office",
            "capacity": 150,
            "status": "Active",
        }
        response = client.post("/api/departments/locations", json=payload)
        assert response.status_code == 401

    def test_list_employees_unauthenticated(self, client: TestClient) -> None:
        """Verify GET /api/departments/employees returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        response = client.get("/api/departments/employees")
        assert response.status_code == 401

    def test_create_employee_unauthenticated(self, client: TestClient) -> None:
        """Verify POST /api/departments/employees returns 401 Unauthorized for unauthenticated requests.

        Args:
            client (TestClient): Fixture HTTP client.
        """
        payload = {
            "name": "Mike Ross",
            "email": "mike@example.com",
            "department": "Legal",
            "role": "Employee",
        }
        response = client.post("/api/departments/employees", json=payload)
        assert response.status_code == 401
