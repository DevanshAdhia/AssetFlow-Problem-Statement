import pytest
from httpx import AsyncClient
from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


class TestSignupRoutes:

    async def test_list_signups_unauthenticated(self, client: AsyncClient):
        response = await client.get("/api/signup/")
        assert response.status_code == 401

    async def test_health_check(self, client: AsyncClient):
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] in ("healthy", "degraded")
