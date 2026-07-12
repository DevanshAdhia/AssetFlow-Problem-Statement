from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.common.exceptions import setup_exception_handlers
from app.common.middleware import RequestLoggingMiddleware
from app.common.health import router as health_router
from app.db.session import engine
from app.db.base import Base

from app.modules.login.routes import router as login_router
from app.modules.signup.routes import router as signup_router
from app.modules.assest.routes import router as assest_router


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

frontend_build_path = os.path.join(os.path.dirname(__file__), "../../frontend/dist")
if os.path.exists(frontend_build_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_build_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(frontend_build_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_build_path, "index.html"))
