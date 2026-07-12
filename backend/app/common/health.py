import time
from fastapi import APIRouter
from sqlalchemy import text
from app.db.session import AsyncSessionLocal

router = APIRouter()


@router.get("/health", tags=["Health"])
async def health_check():
    checks = {}
    overall_status = "healthy"

    # Database check
    try:
        start = time.monotonic()
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        checks["database"] = {
            "status": "healthy",
            "response_time_ms": round((time.monotonic() - start) * 1000, 2),
        }
    except Exception as e:
        checks["database"] = {"status": "unhealthy", "error": str(e)}
        overall_status = "unhealthy"

    return {"status": overall_status, "checks": checks}
