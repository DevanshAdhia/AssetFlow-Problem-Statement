import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ArrowRightLeft, Wrench,
  ShieldCheck, FileText, Bell, User, LogOut, Menu, X,
  Search, Sun, Moon, ChevronDown, Settings, ClipboardList,
  Activity, AlertCircle
} from 'lucide-react';
import './AssetManagerLayout.css';

const getStoredUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'));
    return { name: u?.name || u?.full_name || 'Asset Manager', role: u?.role || 'Asset Manager' };
  } catch { return { name: 'Asset Manager', role: 'Asset Manager' }; }
};

const NAV_ITEMS = [
  { to: '/asset-manager/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/asset-manager/assets',         icon: Package,         label: 'Asset Directory' },
  { to: '/asset-manager/allocation',     icon: ArrowRightLeft,  label: 'Allocation & Transfer' },
  { to: '/asset-manager/maintenance',    icon: Wrench,          label: 'Maintenance' },
  { to: '/asset-manager/audit',          icon: ShieldCheck,     label: 'Audit' },
  { to: '/asset-manager/reports',        icon: FileText,        label: 'Reports & Analytics' },
  { to: '/asset-manager/notifications',  icon: Bell,            label: 'Notifications' },
  { to: '/asset-manager/activity-logs',  icon: Activity,        label: 'Activity Logs' },
];

const BREADCRUMB_MAP = {
  '/asset-manager/dashboard':    ['Asset Manager', 'Dashboard'],
  '/asset-manager/assets':        ['Asset Manager', 'Asset Directory'],
  '/asset-manager/assets/new':    ['Asset Manager', 'Asset Directory', 'Register Asset'],
  '/asset-manager/allocation':    ['Asset Manager', 'Allocation & Transfer'],
  '/asset-manager/maintenance':   ['Asset Manager', 'Maintenance'],
  '/asset-manager/audit':         ['Asset Manager', 'Audit'],
  '/asset-manager/reports':       ['Asset Manager', 'Reports'],
  '/asset-manager/notifications': ['Asset Manager', 'Notifications'],
  '/asset-manager/activity-logs': ['Asset Manager', 'Activity Logs'],
};

const AssetManagerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('am_dark') === 'true');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const user = getStoredUser();

  useEffect(() => {
    document.documentElement.setAttribute('data-am-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('am_dark', darkMode);
  }, [darkMode]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbs = BREADCRUMB_MAP[location.pathname] || ['Asset Manager'];

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  const NOTIFS = [
    { id: 1, icon: AlertCircle, color: 'text-danger', msg: 'AF-099 Projector reported missing', time: '5m ago' },
    { id: 2, icon: Package,     color: 'text-success', msg: 'AF-045 Monitor transfer approved', time: '1h ago' },
    { id: 3, icon: Wrench,      color: 'text-warning', msg: 'Maintenance due: Forklift AF-0087', time: '3h ago' },
  ];

  return (
    <div className={`am-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${darkMode ? 'am-dark' : ''}`}>

      {/* ── Sidebar ── */}
      <aside className="am-sidebar">
        <div className="am-sidebar-header">
          <div className="am-brand">
            <div className="am-brand-icon">AF</div>
            {sidebarOpen && <span className="am-brand-name">AssetFlow</span>}
          </div>
          <button className="am-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="am-sidebar-search">
            <Search size={14} />
            <input
              placeholder="Quick nav..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>
        )}

        <nav className="am-nav">
          <div className="am-nav-section-label">{sidebarOpen && 'MAIN MENU'}</div>
          {NAV_ITEMS.filter(n => !searchVal || n.label.toLowerCase().includes(searchVal.toLowerCase())).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `am-nav-item ${isActive ? 'active' : ''}`}
              title={!sidebarOpen ? label : undefined}
              onClick={() => setSearchVal('')}
            >
              <Icon size={19} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="am-sidebar-footer">
          <NavLink to="/asset-manager/settings" className="am-nav-item" title={!sidebarOpen ? 'Settings' : undefined}>
            <Settings size={19} />
            {sidebarOpen && <span>Settings</span>}
          </NavLink>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="am-main">

        {/* ── Topbar ── */}
        <header className="am-topbar">
          <div className="am-topbar-left">
            <button className="am-icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <nav className="am-breadcrumb" aria-label="breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={i}>
                  <span className={i === breadcrumbs.length - 1 ? 'am-breadcrumb-active' : 'am-breadcrumb-link'}>{crumb}</span>
                  {i < breadcrumbs.length - 1 && <span className="am-breadcrumb-sep">/</span>}
                </span>
              ))}
            </nav>
          </div>

          <div className="am-topbar-right">
            {/* Search */}
            <div className="am-topbar-search">
              <Search size={15} />
              <input placeholder="Search assets, employees..." />
            </div>

            {/* Dark mode toggle */}
            <button className="am-icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <div className="am-notif-wrap" ref={notifRef}>
              <button className="am-icon-btn am-notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={18} />
                <span className="am-badge">3</span>
              </button>
              {notifOpen && (
                <div className="am-notif-dropdown">
                  <div className="am-dropdown-header">
                    <span>Notifications</span>
                    <button className="am-text-btn">Mark all read</button>
                  </div>
                  {NOTIFS.map(n => (
                    <div key={n.id} className="am-notif-item">
                      <n.icon size={16} className={n.color} />
                      <div>
                        <p className="am-notif-msg">{n.msg}</p>
                        <span className="am-notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                  <button className="am-view-all-btn" onClick={() => { setNotifOpen(false); navigate('/asset-manager/notifications'); }}>
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="am-profile-wrap" ref={profileRef}>
              <button className="am-profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="am-avatar">{user.name.charAt(0)}</div>
                <div className="am-user-info">
                  <span className="am-user-name">{user.name}</span>
                  <span className="am-user-role">{user.role}</span>
                </div>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="am-profile-dropdown">
                  <div className="am-dropdown-header">
                    <div className="am-avatar lg">{user.name.charAt(0)}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <p className="am-user-role">{user.role}</p>
                    </div>
                  </div>
                  <button className="am-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/profile'); }}>
                    <User size={15} /> My Profile
                  </button>
                  <button className="am-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/asset-manager/settings'); }}>
                    <Settings size={15} /> Settings
                  </button>
                  <div className="am-dropdown-divider" />
                  <button className="am-dropdown-item text-danger" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="am-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="am-mobile-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default AssetManagerLayout;
