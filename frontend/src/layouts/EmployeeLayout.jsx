import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Calendar,
  CalendarDays,
  Wrench,
  Undo2,
  ArrowRightLeft,
  Bell,
  Activity,
  User,
  LogOut,
  Search,
  Menu
} from 'lucide-react';
import './EmployeeLayout.css';

const getAuthUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'));
    return {
      name: u?.name || u?.full_name || 'Employee',
      role: u?.role || 'Employee',
      avatar: u?.avatar || null
    };
  } catch {
    return { name: 'Employee', role: 'Employee', avatar: null };
  }
};

const buildInitialsAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=80`;

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(getAuthUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onFocus = () => setUser(getAuthUser());
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onFocus);
    };
  }, []);

  // Role-Based Access Control Guard
  useEffect(() => {
    if (user.role !== 'Employee') {
      navigate('/403');
    }
  }, [user.role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const avatarSrc = user.avatar || buildInitialsAvatar(user.name);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="brand-logo" style={{ color: 'var(--primary)' }}>AssetFlow</h2>
        </div>
        
        <div className="sidebar-nav">
          <NavLink to="/employee/dashboard" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/employee/assets" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Box size={20} />
            <span>My Assets</span>
          </NavLink>
          <NavLink to="/employee/bookings" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Calendar size={20} />
            <span>Resource Booking</span>
          </NavLink>
          <NavLink to="/employee/my-bookings" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <CalendarDays size={20} />
            <span>My Bookings</span>
          </NavLink>
          <NavLink to="/employee/maintenance" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Wrench size={20} />
            <span>Maintenance Requests</span>
          </NavLink>
          <NavLink to="/employee/returns" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Undo2 size={20} />
            <span>Return Requests</span>
          </NavLink>
          <NavLink to="/employee/transfers" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <ArrowRightLeft size={20} />
            <span>Transfer Requests</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <NavLink to="/employee/notifications" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Bell size={20} />
            <span>Notifications</span>
          </NavLink>
          <NavLink to="/employee/activity" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <Activity size={20} />
            <span>Activity History</span>
          </NavLink>
          <NavLink to="/employee/profile" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
          <button className="nav-item text-danger mt-2" onClick={handleLogout} style={{ borderTop: '1px solid var(--border)' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search my assets, requests..." />
            </div>
          </div>
          
          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => navigate('/employee/notifications')}>
              <Bell size={20} />
              <span className="badge-indicator"></span>
            </button>
            <div className="user-profile" onClick={() => navigate('/employee/profile')} style={{ cursor: 'pointer' }}>
              <img src={avatarSrc} alt="User Avatar" className="avatar" />
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role" style={{ color: 'var(--primary)', fontWeight: 600 }}>Employee</span>
              </div>
            </div>
          </div>
        </header>

        <main className="content-area" style={{ padding: '1.5rem', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default EmployeeLayout;
