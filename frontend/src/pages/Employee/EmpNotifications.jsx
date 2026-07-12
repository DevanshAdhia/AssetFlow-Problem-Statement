import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, Calendar, Wrench, ArrowRightLeft, Undo2, Settings } from 'lucide-react';

const notificationsData = [
  { id: 1, title: 'Booking Approved', desc: 'Conference Room B5 booking on Oct 12 at 2:00 PM has been approved.', type: 'booking', priority: 'Low', time: '2 hours ago', read: false },
  { id: 2, title: 'Maintenance Request Update', desc: 'Your request MNT-092 (Battery issue – MacBook) has been reviewed. Technician will visit on Oct 14.', type: 'maintenance', priority: 'High', time: '5 hours ago', read: false },
  { id: 3, title: 'Transfer Request Under Review', desc: 'Your transfer request TRF-015 for Dell UltraSharp is currently under Department Head review.', type: 'transfer', priority: 'Medium', time: '1 day ago', read: true },
  { id: 4, title: 'Asset Assigned', desc: 'A new asset Dell UltraSharp 27" (AST-1045) has been allocated to you effective Oct 5, 2026.', type: 'system', priority: 'Low', time: '7 days ago', read: true },
];

const typeIcons = { booking: Calendar, maintenance: Wrench, transfer: ArrowRightLeft, returns: Undo2, system: Settings };
const typeColors = { booking: 'var(--primary)', maintenance: 'var(--warning)', transfer: 'var(--success)', returns: 'var(--danger)', system: 'var(--text-muted)' };

const EmpNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(notificationsData);

  const tabs = ['all', 'bookings', 'maintenance', 'transfers', 'system'];

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bookings') return n.type === 'booking';
    return n.type === activeTab.slice(0, -1); // strip trailing 's'
  });

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteN = (id) => setNotifications(notifications.filter(n => n.id !== id));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Notifications</h1>
          <p className="emp-page-subtitle">Stay updated on your assets, bookings, and requests.</p>
        </div>
        <div className="emp-header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}><CheckCheck size={16} /> Mark All Read ({unreadCount})</button>
          )}
        </div>
      </div>

      <div className="emp-card">
        <div className="emp-card-header">
          <div className="emp-tabs" style={{ borderBottom: 'none', marginBottom: 0 }}>
            {tabs.map(tab => (
              <button key={tab} className={`emp-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.length === 0 && <div className="emp-empty-state"><Bell size={40} /><p>No notifications here.</p></div>}
          {filtered.map(n => {
            const Icon = typeIcons[n.type] || Bell;
            const color = typeColors[n.type] || 'var(--text-muted)';
            return (
              <div key={n.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', alignItems: 'flex-start', background: n.read ? 'var(--surface)' : 'rgba(37,99,235,0.02)', transition: 'background 0.15s' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${color}18` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.9rem', color: 'var(--secondary)' }}>{n.title}</span>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.priority}</span>
                      {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }}></span>}
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.desc}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    {!n.read && <button className="btn btn-outline btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }} onClick={() => markRead(n.id)}>Mark Read</button>}
                    <button className="btn btn-outline btn-sm" style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem', color: 'var(--danger)' }} onClick={() => deleteN(n.id)}><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmpNotifications;
