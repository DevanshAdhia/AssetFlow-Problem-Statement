# AssetFlow Backend API

A production-ready FastAPI project for AssetFlow.

## Modules

The AssetFlow backend is divided into specialized modules to support different features and roles:
- `activity_log`: Tracks system-wide events and user activities.
- `admin_dashboard`: Aggregates global KPIs for the Admin Dashboard.
- `allocation`: Manages asset allocations, returns, and transfer requests.
- `assest`: Core module for managing the asset inventory.
- `asset_manager`: KPI dashboard specifically for Asset Managers.
- `audit`: Tracks and manages asset audits.
- `booking`: Handles resource and room bookings.
- `department`: Manages departments, categories, and locations.
- `dept_head`: KPI dashboard for Department Heads.
- `employee`: Dashboard and insights tailored for standard employees.
- `login`: Authentication logic.
- `maintenance`: Manages maintenance requests and tracking.
- `notification`: Handles system alerts and notifications.
- `profile`: User profile management.
- `report`: Analytics and utilization reporting.
- `signup`: User registration and verification.


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
