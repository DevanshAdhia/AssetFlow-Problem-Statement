# AssetFlow Backend API

A production-ready FastAPI project for AssetFlow.

## Modules

- `login`
- `signup`
- `assest`

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

API docs: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

## Development (Local / Windows)

1. **Virtual Environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
   *(Note: If you run into script execution errors, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`)*

2. **Install Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

3. **Environment Setup**:
   ```powershell
   Copy-Item .env.example .env
   ```
   *Important: If running PostgreSQL locally instead of through Docker, update the `DATABASE_URL` in your `.env` to point to `localhost` instead of `postgres`!*

4. **Run Migrations & Server**:
   ```powershell
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

## Testing

```bash
make test
make test-cov
```
