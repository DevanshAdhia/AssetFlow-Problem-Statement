#!/bin/bash
set -e

if [ $# -eq 0 ] || [ "${1#-}" != "$1" ]; then
    set -- uvicorn app.main:app \
        --host 0.0.0.0 \
        --port 8000 \
        --workers 4 \
        --loop uvloop \
        --access-log \
        --log-level info "$@"
fi

if [ "$1" = "uvicorn" ]; then
    echo "Running Alembic migrations..."
    alembic upgrade head
    echo "Creating database tables..."
    python -c "
import asyncio
async def init_db():
    from app.db.session import engine
    from app.db.base import Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
asyncio.run(init_db())
"
fi

exec "$@"
