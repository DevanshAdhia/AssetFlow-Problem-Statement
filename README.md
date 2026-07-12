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
Make sure you have Node.js and Python installed locally.

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/DevanshAdhia/AssetFlow-Problem-Statement.git
   ```
2. Navigate to the frontend directory:
   ```bash
   cd AssetFlow-Problem-Statement/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5175/`.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

## 📄 Documentation Structure
- `WORKFLOW.md`: Complete breakdown of the system features, UI screens, and step-by-step role workflows.
- `API_CONTRACT.md`: Complete JSON API endpoint spec designed for Backend Developer integration.
- `admin.md`: Deep dive into specific admin features and layout behaviors.
- `backend/README.md`: Backend specific documentation and setup instructions.

---
*Built for the Hackathon — Focuses on providing a flawless, 100% responsive, visually stunning frontend experience backed by a robust FastAPI architecture.*
