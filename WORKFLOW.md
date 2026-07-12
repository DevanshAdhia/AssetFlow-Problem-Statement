# AssetFlow - Enterprise Asset & Resource Management System

## Tech Stack

- **Frontend**: React
- **Backend**: FastAPI
- **Database**: PostgreSQL

## 1. Overall Vision

The vision for AssetFlow is to simplify and digitize how organizations track, allocate, and maintain their physical assets and shared resources through a centralized ERP platform. It aims to reduce manual tracking inefficiencies (spreadsheets, paper logs) by enabling structured asset lifecycles, centralized resource booking, and real-time visibility into who holds what, where it is, and its condition.

AssetFlow focuses on delivering core ERP functionality with clean architecture, role-based workflows, and scalable module design without touching purchasing, invoicing, or accounting concerns.

## 2. Mission

Build a user-centric, responsive application that simplifies asset and resource management for any organization. The platform should provide staff with intuitive tools to:

- Set up departments, asset categories, and the employee directory.
- Register and track assets through their full lifecycle.
- Allocate assets to employees/departments with conflict handling.
- Book shared resources (rooms, vehicles, equipment) without overlaps.
- Run a structured maintenance approval workflow.
- Run structured audit cycles to catch discrepancies.
- Get notified of overdue returns, bookings, and maintenance events.

## 3. Problem Statement

Design and develop an Enterprise Asset & Resource Management System where organizations can:

- Maintain departments, asset categories, and an employee directory.
- Track assets through a flexible lifecycle (Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed) with state transitions.
- Allocate assets, preventing double-allocation of a single asset.
- Book shared/limited resources by time slot, with overlap validation.
- Route maintenance requests through an approval workflow before repair work starts.
- Run scheduled audit cycles with assigned auditors and auto-generated discrepancy reports.
- Surface overdue returns, bookings, and maintenance activity through notifications and a KPI dashboard.

## 4. User Roles

### Admin

- Manages departments, asset categories, audit cycles, and employee/role assignment (Organization Setup).
- Views organization-wide analytics.

### Asset Manager

- Registers and allocates assets.
- Approves transfers, maintenance requests, and audit discrepancy resolution.
- Approves asset returns and condition check-in notes.

### Department Head

- Views assets allocated to their department.
- Approves allocation/transfer requests within their department.
- Books shared resources on behalf of the department.

### Employee

- Views assets allocated to them.
- Books shared resources.
- Raises maintenance requests.
- Initiates return/transfer requests.

## 5. Basic Workflow

- **Admin Setup:** Admin sets up departments, asset categories, and promotes select employees to Department Head / Asset Manager.
- **Registration:** Asset Manager registers a new asset, which enters the system as Available.
- **Allocation:** Asset is allocated to an employee/department (blocked if already allocated—a transfer request is required instead) or marked as a shared bookable resource.
- **Booking:** Employees book shared resources by time slot; overlapping requests are rejected automatically.
- **Maintenance:** If an asset needs repair, the holder raises a maintenance request, which must be approved before work begins and before the asset flips to "Under Maintenance".
- **Transfers/Returns:** Assets are transferred or returned as needs change; overdue returns are flagged automatically.
- **Auditing:** Periodic audit cycles assign auditors, verify assets, and auto-generate discrepancy reports before closing.
- **Tracking:** All activity is tracked through notifications, logs, and reports.

## 6. Features & Application Screens

### 1. Login / Signup Screen

- **Purpose:** Authenticate users with realistic, non-self-elevating account creation.
- **Key Functionality:**
  - Signup creates an **Employee** account only (no role selection at signup).
  - Admin creates/promotes Department Heads and Asset Managers from the Employee Directory.
  - Email & password login, forgot password, session validation.

### 2. Dashboard / Home Screen

- **Purpose:** Give every role a real-time operational snapshot.
- **Key Functionality:**
  - **KPI cards:** Assets Available, Assets Allocated, Maintenance Today, Active Bookings, Pending Transfers, Upcoming Returns.
  - **Overdue returns:** Highlighted separately from upcoming ones.
  - **Quick actions:** Register Asset, Book Resource, Raise Maintenance Request.

### 3. Organization Setup Screen (Admin only)

- **Purpose:** Maintain the master data everything else depends on.
- **Tab A - Department Management:** Create/edit/deactivate department. Assign Head, optional Parent Department (for hierarchy), Status (Active/Inactive).
- **Tab B - Asset Category Management:** Create/edit categories (Electronics, Furniture, etc.). Optional category-specific fields (e.g., warranty period).
- **Tab C - Employee Directory:** Name, Email, Department, Role, Status. **Admin promotes an Employee to Department Head or Asset Manager here (the only place roles are assigned).**

### 4. Asset Registration & Directory Screen

- **Purpose:** Register assets and search/track them centrally.
- **Key Functionality:**
  - **Register:** Name, Category, auto-generated Asset Tag (e.g. AF-0001), Serial Number, Acquisition Date, Acquisition Cost, Condition, Location, photo, "shared/bookable" flag.
  - **Search/Filter:** By Asset Tag, Serial Number, QR code, category, status, department, or location.
  - **Lifecycle Status:** Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed.
  - **Per-asset history:** Allocation history + maintenance history.

### 5. Asset Allocation & Transfer Screen

- **Purpose:** Manage who holds what, with explicit conflict rules.
- **Key Functionality:**
  - **Allocate:** Assign asset to employee/department with an optional Expected Return Date.
  - **Conflict rule:** You can't allocate an asset that's already taken. (e.g., If Priya has Laptop AF-0114, Raj gets blocked and is offered a "Transfer Request" button instead).
  - **Transfer workflow:** Requested → Approved (by Asset Manager/Dept Head) → Re-allocated.
  - **Return flow:** Mark returned, capture condition notes, revert status to Available. Overdue allocations feed Dashboard/Notifications.

### 6. Resource Booking Screen

- **Purpose:** Time-slot booking of shared resources with no overlaps.
- **Key Functionality:**
  - **Calendar view:** Shows a resource's existing bookings.
  - **Overlap validation:** Two people can't book the same room at overlapping times. Requests are rejected if they overlap.
  - **Booking status:** Upcoming, Ongoing, Completed, Cancelled.
  - **Actions:** Cancel/reschedule; reminder notification before the slot starts.

### 7. Maintenance Management Screen

- **Purpose:** Route repairs through approval before work starts.
- **Key Functionality:**
  - **Raise request:** Select asset, describe issue, set priority, attach photo.
  - **Workflow (Kanban):** Pending → Approved / Rejected (by Asset Manager) → Technician Assigned → In Progress → Resolved.
  - **Status update:** Asset status auto-updates to "Under Maintenance" on approval and back to "Available" on resolution.

### 8. Asset Audit Screen

- **Purpose:** Run structured verification cycles instead of a single form.
- **Key Functionality:**
  - **Create Cycle:** Define scope (department/location, date range).
  - **Assign auditors:** Auditor marks each asset as Verified / Missing / Damaged.
  - **Discrepancy report:** Auto-generated for flagged items.
  - **Close Audit Cycle:** Locks the cycle and updates affected asset statuses (e.g., Lost for confirmed-missing items).

### 9. Reports & Analytics Screen

- **Purpose:** Give managers actionable operational insight.
- **Key Functionality:**
  - Asset utilization trends; most-used vs. idle assets.
  - Maintenance frequency by asset/category.
  - Assets due for maintenance or nearing retirement.
  - Department-wise allocation summary & resource booking heatmap.
  - Exportable reports.

### 10. Activity Logs & Notifications Screen

- **Purpose:** Keep every role informed without digging for updates.
- **Key Functionality:**
  - **Notifications:** Asset Assigned, Maintenance Approved/Rejected, Booking Confirmed/Cancelled/Reminder, Transfer Approved, Overdue Return Alert, Audit Discrepancy Flagged.
  - **Full audit log:** Admin/manager/employee actions (who did what, when).
