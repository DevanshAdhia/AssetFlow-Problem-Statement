# AssetFlow ERP Platform

![AssetFlow Banner](https://via.placeholder.com/1200x400.png?text=AssetFlow+-+Enterprise+Resource+Planning)

**AssetFlow** is a modern, highly responsive Enterprise Resource Planning (ERP) platform prototype designed to streamline asset allocation, resource booking, organization setups, and maintenance tracking.

## 🌟 Key Features

### 1. Robust Authentication Flow
- **Interactive UI:** Split-screen layouts with fully responsive styling.
- **Realistic Authentication:** Real-world simulated Google Account Picker for SSO onboarding.
- **Role-Based Routing & Guards:** Dropdown role selection embedded directly into the login and signup flow, seamlessly routing users to their specific dashboard (`/admin`, `/employee`, etc.) while hiding demo credentials for a production feel. Includes **Strict Route Guards** preventing URL manipulation to unauthorized dashboards.
- **Dynamic Formatting:** Custom-built country code selector integrating real-time flag CDN images.

### 2. Comprehensive Dashboard
- **Live KPI Metrics:** Monitor available assets, active allocations, and maintenance alerts at a glance.
- **Seamless Navigation:** Smart, auto-collapsing mobile sidebars replacing outdated full-screen menus.
- **Responsive Tables:** Clean data displays for activity logs and resource reports.

### 3. Administrator & Organization Management
- **Organization Setup:** Manage departments, internal hierarchy, and team structure via interactive data tables.
- **Terms & Policy:** Mandatory scroll-tracking acceptance flows for new administrator accounts.
- **Dynamic Profiles:** Fully integrated, standardized profile modules mirroring the Employee structure perfectly, featuring dynamic avatar uploading (hover/click camera) and password management.

### 4. Employee & Department Head Portals
- **My Assets & Bookings:** Employees can track assigned assets and book shared resources via a calendar timeline interface.
- **Maintenance & Transfers:** Built-in modal workflows for raising tickets and requesting asset transfers.
- **Dynamic Activity History:** Accordion-based (drop down/up) audit trail of all employee actions.
- **Universal Profile Synchronization:** Instant profile updates (including avatars, emails, and passwords) synchronized across the app utilizing cross-component local storage event dispatchers.

### 5. Advanced Operations & Auditing (Admin & Managers)
- **Kanban Maintenance:** Track repairs across pending, approved, and resolved states.
- **Audit Center:** Live discrepancy reporting for expected vs. reported asset locations.
- **Rich Analytics:** Lightweight CSS-based heatmaps and utilization charts for actionable insights.
- **Role-Based Access Control (RBAC):** Distinct locked routing and navigation structures with hard redirects (`/403`) for Admin, Asset Manager, Department Head, and Employee roles.

## 🛠️ Technology Stack
- **Core:** React 18, Vite
- **Routing:** React Router DOM v6
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, CSS Grid)
- **Icons:** Lucide React
- **Integration:** FlagCDN for dynamic assets

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have Node.js installed locally.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/DevanshAdhia/AssetFlow-Problem-Statement.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AssetFlow-Problem-Statement
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5175/` (or the port specified in your terminal).

## 📄 Documentation Structure
- `API_CONTRACT.md`: Complete JSON API endpoint spec designed for Backend Developer integration.
- `admin.md`: Deep dive into specific admin features and layout behaviors (Intended for internal team).
- `README.md`: Public-facing project overview (this file).

---
*Built for the Hackathon — Focuses on providing a flawless, 100% responsive, visually stunning frontend experience.*