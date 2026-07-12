# AssetFlow ERP Platform Backend API

**AssetFlow** is a modern, enterprise-grade FastAPI backend service built to manage organizational assets, employee allocations, resource bookings, Kanban-style maintenance tracking, and verification audits.

---

## 🌟 Key Backend Modules & Features

### 1. Robust Authentication & Accounts (`/api/login`, `/api/signup`)
- Email password sign-in (using bcrypt hashing).
- Google OAuth token verification and account registration/linking.
- One-Time Password (OTP) validation.

### 2. Organization Structure (`/api/departments`)
- Department hierarchy management.
- Employee registration, roles (`Employee`, `Asset Manager`, `Admin`), and permissions.
- Asset category and physical location classification.

### 3. Asset Inventory (`/api/assest`)
- Full CRUD operations supporting tags, location tracking, status, and physical condition.

### 4. Resource Booking (`/api/bookings`)
- Timeline scheduling with built-in validation preventing resource double-bookings.

### 5. Maintenance Board (`/api/maintenance`)
- Kanban task workflow tracking with step-by-step state transition rules (`pending` → `approved` → `assigned` → `in_progress` → `resolved`).

### 6. Verification Audits (`/api/audit`)
- Create audit cycles, match items dynamically, track expected vs. reported location, and record discrepancies.

### 7. Allocation & Transfers (`/api/allocations`)
- Track who holds which asset.
- Double-allocation validation (prevents assigning already-allocated assets).
- Return assets to storage or transfer them between employees/departments with automated history logging.

### 8. System Monitoring (`/api/activity-logs`, `/api/notifications`)
- Activity log audit trails for successful/pending system events.
- Notification dispatch targeted to specific users with unread/read state transitions.

---

## 🛠️ Technology Stack
- **Framework**: FastAPI (ASGI)
- **Database ORM**: SQLAlchemy 2.0 (Asyncpg PostgreSQL)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Testing**: Pytest (with Asyncio)
- **Security**: Passlib (Bcrypt) & Python-Jose JWT

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have Python 3.10+ and a PostgreSQL server instance running.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/DevanshAdhia/AssetFlow-Problem-Statement.git
   cd AssetFlow-Problem-Statement/backend
   ```
2. Set up virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables template and configure your credentials:
   ```bash
   cp .env.example .env
   ```

### Database Migrations
Run the migrations to set up the database tables:
```bash
alembic upgrade head
```

### Running Locally
Start the Uvicorn ASGI server:
```bash
uvicorn app.main:app --reload --port 5000
```
Interactive API documentation will be available at `http://localhost:5000/docs`.

---

## 🧪 Testing
To execute the automated test suite (including route and service validations):
```bash
python -m pytest
```