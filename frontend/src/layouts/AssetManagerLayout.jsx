import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Shield, Settings, Menu, Bell, User, LogOut } from 'lucide-react';
import '../layouts/DashboardLayout.css';

const AssetManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Shield className="text-primary" size={24} />
          <h2>AssetManager</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/asset-manager/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/asset-manager/assets" className="nav-item">
            <Package size={20} />
            <span>Asset Directory</span>
          </NavLink>
          <NavLink to="/asset-manager/settings" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
          </div>
          
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div className="avatar bg-primary-light text-primary">AM</div>
              <div className="user-info">
                <span className="user-name">Asset Manager</span>
                <span className="user-role">Manager Role</span>
              </div>
            </div>
            <button className="icon-btn text-danger" onClick={() => navigate('/login')}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AssetManagerLayout;
