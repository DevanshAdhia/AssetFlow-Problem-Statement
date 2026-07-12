import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Box, 
  ArrowRightLeft,
  Calendar, 
  Wrench, 
  ShieldCheck,
  FileText, 
  Bell, 
  User, 
  LogOut,
  Search,
  Menu
} from 'lucide-react';
import { currentUser } from '../data/mockData';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="brand-logo">AssetFlow</h2>
        </div>
        
        <div className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/setup" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Settings size={20} />
            <span>Organization Setup</span>
          </NavLink>
          <NavLink to="/assets" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Box size={20} />
            <span>Assets</span>
          </NavLink>
          <NavLink to="/allocation" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <ArrowRightLeft size={20} />
            <span>Allocation & Transfer</span>
          </NavLink>
          <NavLink to="/bookings" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Calendar size={20} />
            <span>Resource Booking</span>
          </NavLink>
          <NavLink to="/maintenance" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Wrench size={20} />
            <span>Maintenance</span>
          </NavLink>
          <NavLink to="/audit" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <ShieldCheck size={20} />
            <span>Audit</span>
          </NavLink>
          <NavLink to="/activity-logs" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FileText size={20} />
            <span>Reports</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <NavLink to="/notifications" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Bell size={20} />
            <span>Notifications</span>
          </NavLink>
          <NavLink to="/profile" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search assets, bookings..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => navigate('/notifications')}>
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="user-profile" onClick={() => navigate('/profile')}>
              <img src={currentUser.avatar} alt="User Avatar" className="avatar" />
              <span className="user-name">{currentUser.name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default DashboardLayout;
