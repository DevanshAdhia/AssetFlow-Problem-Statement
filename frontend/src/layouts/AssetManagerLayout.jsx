import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ArrowRightLeft, Wrench,
  ShieldCheck, FileText, Bell, User, LogOut, Menu,
  Search, ChevronDown, Settings, Activity, AlertCircle
} from 'lucide-react';
import './DashboardLayout.css';
import './AssetManagerLayout.css';

const getStoredUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'));
    return {
      name:   u?.name || u?.full_name || 'Asset Manager',
      role:   u?.role || 'Asset Manager',
      avatar: u?.avatar || null,
    };
  } catch {
    return { name: 'Asset Manager', role: 'Asset Manager', avatar: null };
  }
};

const NAV_ITEMS = [
  { to: '/asset-manager/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/asset-manager/assets',        icon: Package,         label: 'Asset Directory' },
  { to: '/asset-manager/allocation',    icon: ArrowRightLeft,  label: 'Allocation & Transfer' },
  { to: '/asset-manager/maintenance',   icon: Wrench,          label: 'Maintenance' },
  { to: '/asset-manager/audit',         icon: ShieldCheck,     label: 'Audit' },
  { to: '/asset-manager/reports',       icon: FileText,        label: 'Reports & Analytics' },
  { to: '/asset-manager/notifications', icon: Bell,            label: 'Notifications' },
  { to: '/asset-manager/activity-logs', icon: Activity,        label: 'Activity Logs' },
];

const BREADCRUMB_MAP = {
  '/asset-manager/dashboard':    ['Asset Manager', 'Dashboard'],
  '/asset-manager/assets':        ['Asset Manager', 'Asset Directory'],
  '/asset-manager/allocation':    ['Asset Manager', 'Allocation & Transfer'],
  '/asset-manager/maintenance':   ['Asset Manager', 'Maintenance'],
  '/asset-manager/audit':         ['Asset Manager', 'Audit'],
  '/asset-manager/reports':       ['Asset Manager', 'Reports & Analytics'],
  '/asset-manager/notifications': ['Asset Manager', 'Notifications'],
  '/asset-manager/activity-logs': ['Asset Manager', 'Activity Logs'],
  '/asset-manager/profile':       ['Asset Manager', 'My Profile'],
  '/asset-manager/edit-profile':  ['Asset Manager', 'Edit Profile'],
};

const NOTIFS = [
  { id: 1, icon: AlertCircle, color: 'var(--danger)',  msg: 'AF-099 Projector reported missing', time: '5m ago' },
  { id: 2, icon: Package,     color: 'var(--success)', msg: 'AF-045 Monitor transfer approved',  time: '1h ago' },
  { id: 3, icon: Wrench,      color: 'var(--warning)', msg: 'Maintenance due: Forklift AF-0087', time: '3h ago' },
];

const AssetManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const navigate   = useNavigate();
  const location   = useLocation();
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  // Re-read user when profile is edited (storage event)
  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbs = BREADCRUMB_MAP[location.pathname] || ['Asset Manager'];

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="dashboard-layout">

      {/* ── Sidebar (identical structure to Admin) ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="brand-logo" style={{ color: 'var(--primary)' }}>AssetFlow</h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Asset Manager Portal</p>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/asset-manager/profile" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ── */}
      <main className="main-content">

        {/* ── Topbar (same height/style as Admin) ── */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem' }}>
              {breadcrumbs.map((crumb, i) => (
                <span key={i}>
                  <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>
                    {crumb}
                  </span>
                  {i < breadcrumbs.length - 1 && (
                    <span style={{ color: 'var(--border)', margin: '0 0.3rem' }}>/</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* Search bar */}
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search assets, employees..." />
          </div>

          <div className="topbar-actions">
            {/* Notification bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={20} />
                <span className="badge">3</span>
              </button>

              {notifOpen && (
                <div className="am-dropdown">
                  <div className="am-dropdown-header">
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                    <button className="am-text-link">Mark all read</button>
                  </div>
                  {NOTIFS.map(n => (
                    <div key={n.id} className="am-notif-item">
                      <n.icon size={16} style={{ color: n.color, flexShrink: 0 }} />
                      <div>
                        <p className="am-notif-msg">{n.msg}</p>
                        <span className="am-notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                  <button
                    className="am-view-all"
                    onClick={() => { setNotifOpen(false); navigate('/asset-manager/notifications'); }}
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div
                className="user-profile"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="avatar" />
                ) : (
                  <div className="am-avatar-initials">{initials}</div>
                )}
                <span className="user-name">{user.name}</span>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </div>

              {profileOpen && (
                <div className="am-dropdown am-profile-dropdown">
                  <div className="am-dropdown-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{user.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</span>
                  </div>
                  <button className="am-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/asset-manager/profile'); }}>
                    <User size={15} /> My Profile
                  </button>
                  <button className="am-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/asset-manager/settings'); }}>
                    <Settings size={15} /> Settings
                  </button>
                  <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <button className="am-dropdown-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AssetManagerLayout;
