# AssetFlow - Admin Dashboard Interface

This document outlines the architecture, features, and capabilities of the AssetFlow Administrator Interface built for the hackathon.

## 🚀 Overview
The AssetFlow Admin Dashboard is an enterprise-grade UI prototype built using React, Vite, and modern Vanilla CSS. It focuses on a clean, scalable, and highly responsive user experience tailored for resource and asset management.

## 🎨 Design System & Theme
- **Color Palette:** Corporate Blue (`#2563EB`), Slate Gray (`#64748B`), and Clean White (`#FFFFFF`).
- **Typography:** Modern Sans-serif (Inter/Poppins) for high legibility.
- **Components:** Glassmorphism accents, soft shadows (`box-shadow`), and fully rounded input components.
- **Responsiveness:** 100% Mobile-first responsive grids and layouts.

## 🔑 Key Features Implemented

### 1. Advanced Authentication Flow
- **Login/Signup:** Includes a modern UI with split-screen layouts.
- **Social Login:** Integrated UI for "Continue with Google" including native SVG iconography and dividers.
- **Email Verification:** Interactive "Send OTP" mechanics that lock input fields upon successful verification.
- **International Phone Support:** Custom dropdown component supporting country flags via FlagCDN (bypassing native Windows emoji limitations).
- **Viewport Auto-Scaling:** Aggressively optimized paddings, gaps, and layouts (like placing passwords side-by-side) to ensure massive forms fit 100vh perfectly without triggering browser scrollbars.

### 2. Administrator Terms & Conditions
- **Enterprise Policy Gate:** Administrators must agree to the Terms & Conditions before accessing the dashboard.
- **Interactive TOC:** A sticky sidebar that tracks scrolling progress.
- **Acceptance Logic:** The "Continue" button is strictly disabled until the admin explicitly checks the agreement box.

### 3. Core Dashboard
- **KPI Metrics:** Quick-glance cards showing Total Assets, Active Employees, Pending Requests, and Maintenance Alerts.
- **Responsive Sidebar:** Collapses into a hamburger menu for mobile devices, preserving screen real estate.
- **Top Navigation:** Contains quick-actions like Notifications and Profile settings.

### 4. User Profile & Settings
- **Standardized Profile Layout:** A completely redesigned profile interface mirroring the Employee dashboard layout, featuring a split-card layout (Avatar + Security vs. Info + Address) for a unified UI.
- **Dynamic Role Synchronization:** Automatically injects the precise name, email, and Role (e.g., Admin, Asset Manager, Dept Head) from the initial login selection into the UI.
- **Edit Profile:** Dedicated interface supporting live, interactive image preview uploads via click or hover over the avatar.
- **Password Management:** Integrated "Change Password" modal with real-time length and match validation.
- **Strict Route Guards (RBAC):** Implementation of locked route access based on role. Prevents users from manually navigating across dashboards by strictly redirecting them to `/403` if they access an unauthorized layout component.

### 5. Advanced Modules (Newly Integrated)
- **Asset Allocation & Transfer:** Interactive form with double-allocation blockage checks and asset history timelines.
- **Maintenance Management (Kanban):** Drag-and-drop style columns (Pending, Approved, etc.) with automation alerts masking assets during maintenance.
- **Asset Audit:** Discrepancy reporting matrix tracking expected vs. reported locations, complete with auto-generated PDF triggers.
- **Reports & Analytics:** CSS-based, lightweight data visualizations including Heatmaps, Bar Charts (Used vs. Idle), and Maintenance Frequency charts.
- **Categorized Notifications:** Tab-filtered notification center segregating general alerts, approvals, and bookings.

### 5. Organization Setup (Screen 3)
- **Directory Interface:** Comprehensive management console for internal structure.
- **Department Table:** High-fidelity data grid displaying Department Name, Head, Parent Dept, and Active/Inactive Badges.
- **Admin Action Panel:** Interactive controls (Filter, Search) and quick-action icons (Edit, Delete) tightly integrated into the data rows.

## 🛠️ Technical Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite (Ultra-fast HMR)
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Styling:** Native CSS Variables & Flexbox/Grid

## 📱 Responsiveness Guarantee
The interface has been thoroughly tested across:
- **Desktop (1080p+):** Utilizes full grid widths and sticky sidebars.
- **Tablet (768px - 1024px):** Adapts KPI grids from 4-columns to 2-columns.
- **Mobile (<768px):** Implements slide-out sidebars, hides non-essential labels (like usernames), and uses 1-column layouts for maximum readability.
