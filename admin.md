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

### 2. Administrator Terms & Conditions
- **Enterprise Policy Gate:** Administrators must agree to the Terms & Conditions before accessing the dashboard.
- **Interactive TOC:** A sticky sidebar that tracks scrolling progress.
- **Acceptance Logic:** The "Continue" button is strictly disabled until the admin explicitly checks the agreement box.

### 3. Core Dashboard
- **KPI Metrics:** Quick-glance cards showing Total Assets, Active Employees, Pending Requests, and Maintenance Alerts.
- **Responsive Sidebar:** Collapses into a hamburger menu for mobile devices, preserving screen real estate.
- **Top Navigation:** Contains quick-actions like Notifications and Profile settings.

### 4. User Profile & Settings
- **Profile Layout:** Displays user details, roles, and recent activity.
- **Password Management:** Dedicated screens for password resets and updates.
- **Activity Logs:** Tabular data layout with horizontal scrolling for mobile devices.

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
