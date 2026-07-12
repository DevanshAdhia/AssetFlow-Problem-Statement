# AssetFlow - Enterprise Asset & Resource Management System

![AssetFlow Banner](https://via.placeholder.com/1200x400.png?text=AssetFlow+-+Enterprise+Resource+Planning)

## Overview
AssetFlow is a centralized ERP platform designed to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources. It eliminates manual tracking inefficiencies by enabling structured asset lifecycles, centralized resource booking, and providing real-time visibility.

## 🌟 Key Features

### 1. Robust Authentication Flow
- **Interactive UI:** Split-screen layouts with fully responsive styling.
- **Social Integration:** Integrated "Continue with Google" architecture.
- **Dynamic Formatting:** Custom-built country code selector integrating real-time flag CDN images.

### 2. Comprehensive Dashboard
- **Live KPI Metrics:** Monitor available assets, active allocations, and maintenance alerts at a glance.
- **Seamless Navigation:** Smart, auto-collapsing mobile sidebars replacing outdated full-screen menus.
- **Responsive Tables:** Clean data displays for activity logs and resource reports.

### 3. Administrator & Organization Management
- **Organization Setup:** Manage departments, internal hierarchy, and team structure via interactive data tables.
- **Role-Based Workflows:** Distinct interfaces and permissions for Admins, Asset Managers, Department Heads, and Employees.

### 4. Advanced Operations & Auditing
- **Kanban Maintenance:** Track repairs across pending, approved, and resolved states.
- **Audit Center:** Live discrepancy reporting for expected vs. reported asset locations.
- **Double-Allocation Check:** Smart transfer forms that visually block requests for already-assigned assets.

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, Vanilla CSS, React Router DOM v6
- **Backend:** FastAPI, Python
- **Database:** PostgreSQL
- **Icons:** Lucide React

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have **Node.js**, **Python**, **PostgreSQL 14**, and **Redis** installed locally.

### 1. Database Setup
Ensure your PostgreSQL and Redis services are running.
Create the required database and user:
```bash
createuser -s postgres
createdb app_db
```

### 2. Frontend Build
Compile the React frontend into production-ready static files:
```bash
cd AssetFlow-Problem-Statement/frontend
npm install
npm run build
```

### 3. Backend Setup
The FastAPI backend is configured to automatically serve the built frontend files, creating a unified single-server deployment.
```bash
cd ../backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Set up your environment variables:
```bash
cp .env.example .env
```
*(Ensure `DATABASE_URL` in `.env` is set to `postgresql+asyncpg://postgres:postgres@localhost:5432/app_db`)*

Run the database migrations and start the unified server:
```bash
alembic upgrade head
uvicorn app.main:app --reload
```

Open your browser and navigate to `http://localhost:8000` to view the live platform! The backend API documentation is available at `http://localhost:8000/docs`.

## 📄 Documentation Structure
- `WORKFLOW.md`: Complete breakdown of the system features, UI screens, and step-by-step role workflows.
- `API_CONTRACT.md`: Complete JSON API endpoint spec designed for Backend Developer integration.
- `admin.md`: Deep dive into specific admin features and layout behaviors.
- `backend/README.md`: Backend specific documentation and setup instructions.

---
*Built for the Hackathon — Focuses on providing a flawless, 100% responsive, visually stunning frontend experience backed by a robust FastAPI architecture.*
