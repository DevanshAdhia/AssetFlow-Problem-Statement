"""Unit and integration tests for ActivityLog."""

from unittest.mock import AsyncMock, MagicMock
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.modules.activity_log.service import ActivityLogService
from app.modules.activity_log.schema import ActivityLogCreate
from app.modules.activity_log.model import ActivityLog


class TestActivityLogService:
    """Unit tests for ActivityLogService."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> ActivityLogService:
        return ActivityLogService(mock_db)

    async def test_create_log_success(self, service: ActivityLogService) -> None:
        mock_log = MagicMock(spec=ActivityLog)
        mock_log.id = 1
        mock_log.user = "Admin"
        service.repo.create = AsyncMock(return_value=mock_log)

        data = ActivityLogCreate(user="Admin", action="Created User", status="Success")
        result = await service.create_log(data)
        assert result.id == 1
        assert result.user == "Admin"
        service.repo.create.assert_called_once_with(user="Admin", action="Created User", status="Success")

    async def test_list_logs_success(self, service: ActivityLogService) -> None:
        service.repo.get_all = AsyncMock(return_value=([], 0))
        items, total = await service.list_logs(page=1, page_size=20)
        assert items == []
        assert total == 0
        service.repo.get_all.assert_called_once_with(skip=0, limit=20)


class TestActivityLogRoutes:
    """Integration tests for ActivityLog API endpoints."""

    @pytest.fixture
    def client(self) -> TestClient:
        with TestClient(app) as tc:
            yield tc

    def test_list_logs_unauthenticated(self, client: TestClient) -> None:
        response = client.get("/api/activity-logs")
        assert response.status_code == 401

    def test_create_log_unauthenticated(self, client: TestClient) -> None:
        payload = {"user": "Admin", "action": "Created User"}
        response = client.post("/api/activity-logs", json=payload)
        assert response.status_code == 401
