"""Unit and integration tests for Notification."""

from unittest.mock import AsyncMock, MagicMock
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.modules.notification.service import NotificationService
from app.modules.notification.schema import NotificationCreate
from app.modules.notification.model import Notification
from app.common.exceptions import NotFoundException, AppException


class TestNotificationService:
    """Unit tests for NotificationService."""

    @pytest.fixture
    def mock_db(self) -> AsyncMock:
        return AsyncMock()

    @pytest.fixture
    def service(self, mock_db: AsyncMock) -> NotificationService:
        return NotificationService(mock_db)

    async def test_create_notification_user_not_found(self, service: NotificationService) -> None:
        service.db.execute = AsyncMock(return_value=MagicMock(scalar_one_or_none=lambda: None))
        data = NotificationCreate(title="Alert", message="Msg", type="alerts", user_id=999)
        with pytest.raises(NotFoundException):
            await service.create_notification(data)

    async def test_create_notification_success(self, service: NotificationService) -> None:
        mock_user = MagicMock()
        mock_res = MagicMock()
        mock_res.scalar_one_or_none.return_value = mock_user
        service.db.execute = AsyncMock(return_value=mock_res)

        mock_notif = MagicMock(spec=Notification)
        mock_notif.id = 1
        service.repo.create = AsyncMock(return_value=mock_notif)

        data = NotificationCreate(title="Alert", message="Msg", type="alerts", user_id=1)
        result = await service.create_notification(data)
        assert result.id == 1
        service.repo.create.assert_called_once_with(title="Alert", message="Msg", type="alerts", user_id=1)

    async def test_read_notification_not_found(self, service: NotificationService) -> None:
        service.repo.get_by_id = AsyncMock(return_value=None)
        with pytest.raises(NotFoundException):
            await service.read_notification(999, user_id=1)

    async def test_read_notification_forbidden(self, service: NotificationService) -> None:
        mock_notif = MagicMock(spec=Notification)
        mock_notif.user_id = 2  # Different user
        service.repo.get_by_id = AsyncMock(return_value=mock_notif)
        with pytest.raises(AppException):
            await service.read_notification(1, user_id=1)

    async def test_read_notification_success(self, service: NotificationService) -> None:
        mock_notif = MagicMock(spec=Notification)
        mock_notif.user_id = 1
        service.repo.get_by_id = AsyncMock(return_value=mock_notif)
        service.repo.mark_read = AsyncMock(return_value=mock_notif)

        result = await service.read_notification(1, user_id=1)
        assert result == mock_notif
        service.repo.mark_read.assert_called_once_with(1)


class TestNotificationRoutes:
    """Integration tests for Notification API endpoints."""

    @pytest.fixture
    def client(self) -> TestClient:
        with TestClient(app) as tc:
            yield tc

    def test_list_notifications_unauthenticated(self, client: TestClient) -> None:
        response = client.get("/api/notifications")
        assert response.status_code == 401

    def test_create_notification_unauthenticated(self, client: TestClient) -> None:
        payload = {"title": "Alert", "message": "Msg", "user_id": 1}
        response = client.post("/api/notifications", json=payload)
        assert response.status_code == 401

    def test_read_notification_unauthenticated(self, client: TestClient) -> None:
        response = client.put("/api/notifications/1/read")
        assert response.status_code == 401

    def test_mark_all_read_unauthenticated(self, client: TestClient) -> None:
        response = client.post("/api/notifications/mark-all-read")
        assert response.status_code == 401
