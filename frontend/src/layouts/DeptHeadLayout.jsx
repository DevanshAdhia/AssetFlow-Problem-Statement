import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, CheckSquare, ArrowRightLeft, CalendarDays,
  BookOpen, Users, FileBarChart, Bell, Activity, User, Settings, LogOut,
  Menu, Search, ChevronDown, X, Building2, AlertCircle, Clock
} from 'lucide-react';
import './DashboardLayout.css';
import './DeptHeadLayout.css';

const getUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'));
    return u || { name: 'Dept Head', role: 'Department Head', department: 'Engineering', avatar: null };
  } catch { return { name: 'Dept Head', role: 'Department Head', department: 'Engineering', avatar: null }; }
};

const buildAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&bold=true&size=80`;

const NAV_ITEMS = [
  { to: '/dept-head/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dept-head/assets',       icon: Package,         label: 'Dept. Assets' },
  { to: '/dept-head/allocation',   icon: CheckSquare,     label: 'Allocation Requests', badge: 4 },
  { to: '/dept-head/transfers',    icon: ArrowRightLeft,  label: 'Transfer Requests', badge: 2 },
  { to: '/dept-head/bookings',     icon: BookOpen,        label: 'Resource Booking' },
  { to: '/dept-head/calendar',     icon: CalendarDays,    label: 'Dept. Calendar' },
  { to: '/dept-head/employees',    icon: Users,           label: 'Employees' },
  { to: '/dept-head/reports',      icon: FileBarChart,    label: 'Reports' },
  { to: '/dept-head/notifications',icon: Bell,            label: 'Notifications', badge: 7 },
  { to: '/dept-head/activity-logs',icon: Activity,        label: 'Activity Logs' },
];

const NOTIFS = [
  { id:1, icon: CheckSquare, color:'#7c3aed', msg:'Allocation request from Rohan Mehta awaiting approval', time:'5m ago' },
  { id:2, icon: ArrowRightLeft, color:'#d97706', msg:'Transfer request for Projector AF-009 submitted', time:'1h ago' },
  { id:3, icon: Clock, color:'#0284c7', msg:'Meeting Room A booked for tomorrow 10:00 AM', time:'2h ago' },
];

const BREADCRUMB_MAP = {
  '/dept-head/dashboard':     ['Engineering Dept.', 'Dashboard'],
  '/dept-head/assets':        ['Engineering Dept.', 'Department Assets'],
  '/dept-head/allocation':    ['Engineering Dept.', 'Allocation Requests'],
  '/dept-head/transfers':     ['Engineering Dept.', 'Transfer Requests'],
  '/dept-head/bookings':      ['Engineering Dept.', 'Resource Booking'],
  '/dept-head/calendar':      ['Engineering Dept.', 'Department Calendar'],
  '/dept-head/employees':     ['Engineering Dept.', 'Employees'],
  '/dept-head/reports':       ['Engineering Dept.', 'Reports'],
  '/dept-head/notifications': ['Engineering Dept.', 'Notifications'],
  '/dept-head/activity-logs': ['Engineering Dept.', 'Activity Logs'],
  '/dept-head/profile':       ['Engineering Dept.', 'My Profile'],
};

const DeptHeadLayout = () => {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [user, setUser]                 = useState(getUser());
  const navigate  = useNavigate();
  const location  = useLocation();
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  useEffect(() => {
    const refresh = () => setUser(getUser());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumbs = BREADCRUMB_MAP[location.pathname] || ['Engineering Dept.'];
  const avatarSrc   = user.avatar || buildAvatar(user.name);
  const initials    = (user.name || 'DH').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="brand-logo" style={{ color: 'var(--dh-primary)' }}>AssetFlow</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 4 }}>
            <Building2 size={13} style={{ color: 'var(--dh-primary)' }} />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              {user.department || 'Engineering'} Dept.
            </p>
          </div>
          {/* Role badge */}
          <div style={{ marginTop: 6 }}>
            <span className="dh-role-badge">Dept. Head</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
              {badge && (
                <span style={{
                  marginLeft: 'auto', background: '#7c3aed', color: '#fff',
                  borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px'
                }}>{badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/dept-head/profile" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <User size={20} /><span>Profile</span>
          </NavLink>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
                  <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--dh-primary)' : 'var(--text-muted)', fontWeight: i === breadcrumbs.length - 1 ? 700 : 400 }}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="topbar-right">
            {/* Search */}
            <div className="dh-search-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', border: '1px solid var(--border)', borderRadius: 8, padding: '0.4rem 0.75rem', minWidth: 200 }}>
              <Search size={15} style={{ color: 'var(--text-muted)' }} />
              <input placeholder="Search assets, requests..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%' }} />
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)} style={{ position: 'relative' }}>
                <Bell size={20} />
                <span className="badge">7</span>
              </button>
              {notifOpen && (
                <div className="dh-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, minWidth: 300 }}>
                  <div className="dh-card-header" style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                    <button className="dh-btn dh-btn-xs dh-btn-outline">Mark all read</button>
                  </div>
                  {NOTIFS.map(n => (
                    <div key={n.id} className="dh-dropdown-item" style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <n.icon size={16} style={{ color: n.color, flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 500 }}>{n.msg}</p>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="dh-btn dh-btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
                      onClick={() => { setNotifOpen(false); navigate('/dept-head/notifications'); }}>
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }} ref={profileRef}>
              <div className="user-profile" onClick={() => setProfileOpen(!profileOpen)} style={{ cursor: 'pointer' }}>
                <img src={avatarSrc} alt={user.name} className="avatar"
                  onError={e => { e.target.src = buildAvatar(user.name); }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span className="user-name">{user.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dept. Head</span>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
              {profileOpen && (
                <div className="dh-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, minWidth: 200 }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{user.name}</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.department} Dept.</p>
                  </div>
                  <button className="dh-dropdown-item" onClick={() => { setProfileOpen(false); navigate('/dept-head/profile'); }}>
                    <User size={15} /> My Profile
                  </button>
                  <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                  <button className="dh-dropdown-item" style={{ color: '#dc2626' }} onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeptHeadLayout;
