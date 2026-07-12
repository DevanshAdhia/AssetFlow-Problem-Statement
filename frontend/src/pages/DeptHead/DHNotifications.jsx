import React, { useState } from 'react';
import { Bell, CheckSquare, ArrowRightLeft, BookOpen, AlertCircle, Settings, CheckCircle } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const NOTIFICATIONS = [
  { id: 1, type: 'Allocation', icon: CheckSquare,    color: '#7c3aed', title: 'New Allocation Request', desc: 'Rohan Mehta has requested a Dell XPS 15 Laptop.', priority: 'High', date: 'Today, 09:45 AM', read: false },
  { id: 2, type: 'Transfer',   icon: ArrowRightLeft, color: '#d97706', title: 'Transfer Request Submitted', desc: 'Sneha Kulkarni requested transfer of 4K Monitor (AF-045).', priority: 'Medium', date: 'Today, 08:30 AM', read: false },
  { id: 3, type: 'Booking',    icon: BookOpen,       color: '#0284c7', title: 'Resource Booked', desc: 'Meeting Room A is booked by you for Sprint Review.', priority: 'Low', date: 'Yesterday, 04:15 PM', read: true },
  { id: 4, type: 'Maintenance',icon: AlertCircle,    color: '#dc2626', title: 'Maintenance Overdue', desc: 'Laptop AF-022 requires immediate maintenance check.', priority: 'High', date: 'Yesterday, 10:00 AM', read: true },
  { id: 5, type: 'System',     icon: Settings,       color: '#6b7280', title: 'System Update', desc: 'AssetFlow will be down for maintenance this Sunday at 2 AM.', priority: 'Low', date: '10 Jul 2026', read: true },
];

const DHNotifications = () => {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('All');

  const filtered = notifs.filter(n => filter === 'All' || n.type === filter);

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
  const toggleRead = (id) => setNotifs(notifs.map(n => n.id === id ? { ...n, read: !n.read } : n));
  const deleteNotif = (id) => setNotifs(notifs.filter(n => n.id !== id));

  return (
    <div className="dh-page">
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Notifications</h1>
          <p className="dh-page-subtitle">Stay updated with requests, bookings, and alerts.</p>
        </div>
        <button className="dh-btn dh-btn-outline" onClick={markAllRead}>
          <CheckCircle size={15}/> Mark All Read
        </button>
      </div>

      {/* Tabs */}
      <div className="dh-tabs">
        {['All', 'Allocation', 'Transfer', 'Booking', 'Maintenance', 'System'].map(f => (
          <button key={f} className={`dh-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="dh-card">
        {filtered.length > 0 ? filtered.map(n => (
          <div key={n.id} style={{ 
            display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', 
            borderBottom: '1px solid var(--dh-border)', alignItems: 'flex-start',
            background: n.read ? 'transparent' : 'rgba(124, 58, 237, 0.03)'
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${n.color}18`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <n.icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: n.read ? 600 : 700, color: n.read ? 'var(--dh-text)' : '#7c3aed' }}>{n.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--dh-muted)' }}>{n.date}</span>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--dh-text)' }}>{n.desc}</p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span className={`dh-badge ${n.priority === 'High' ? 'dh-badge-danger' : n.priority === 'Medium' ? 'dh-badge-warning' : 'dh-badge-success'}`}>
                  {n.priority} Priority
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="dh-btn dh-btn-xs dh-btn-outline" onClick={() => toggleRead(n.id)}>{n.read ? 'Mark Unread' : 'Mark Read'}</button>
              <button className="dh-btn dh-btn-xs dh-btn-outline" style={{ color: '#dc2626', borderColor: '#fca5a5' }} onClick={() => deleteNotif(n.id)}>Delete</button>
            </div>
          </div>
        )) : (
          <div className="dh-empty-state"><Bell size={40}/><span>No notifications found</span></div>
        )}
      </div>
    </div>
  );
};

export default DHNotifications;
