from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.common.exceptions import setup_exception_handlers
from app.common.middleware import RequestLoggingMiddleware
from app.common.health import router as health_router
from app.db.session import engine
from app.db.base import Base

from app.modules.login.routes import router as login_router
from app.modules.signup.routes import router as signup_router
from app.modules.assest.routes import router as assest_router
from app.modules.department.routes import router as department_router
from app.modules.booking.routes import router as booking_router
from app.modules.maintenance.routes import router as maintenance_router
from app.modules.audit.routes import router as audit_router
from app.modules.profile.routes import router as profile_router
from app.modules.allocation.routes import router as allocation_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        import logging
        logging.getLogger("uvicorn.error").warning(f"Database initialization warning: {e}")
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-ready API built with FastAPI.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(RequestLoggingMiddleware)

# Exception handlers
setup_exception_handlers(app)

# Routers
app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(login_router, prefix="/api/login", tags=["Login"])
app.include_router(signup_router, prefix="/api/signup", tags=["Signup"])
app.include_router(assest_router, prefix="/api/assest", tags=["Assest"])
app.include_router(department_router, prefix="/api/departments", tags=["Departments"])
app.include_router(booking_router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(maintenance_router, prefix="/api/maintenance", tags=["Maintenance"])
app.include_router(audit_router, prefix="/api/audit", tags=["Audit"])
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(allocation_router, prefix="/api/allocations", tags=["Allocations"])
