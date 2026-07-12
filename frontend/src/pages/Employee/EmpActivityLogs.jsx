import React, { useState } from 'react';
import { Activity, Search, Filter, Calendar, Wrench, ArrowRightLeft, Undo2, BookOpen, User, ChevronDown, ChevronUp, Clock } from 'lucide-react';

const activityLogs = [
  { id: 'ACT-201', action: 'Booked Conference Room B5', module: 'Resource Booking', date: 'Today', time: '01:45 PM', status: 'Completed', icon: BookOpen, color: 'var(--primary)' },
  { id: 'ACT-200', action: 'Submitted Maintenance Request MNT-092 (Battery issue – MacBook)', module: 'Maintenance', date: 'Today', time: '10:20 AM', status: 'Pending', icon: Wrench, color: 'var(--warning)' },
  { id: 'ACT-198', action: 'Initiated Transfer Request TRF-015 for Dell UltraSharp 27"', module: 'Transfer', date: 'Yesterday', time: '03:10 PM', status: 'Under Review', icon: ArrowRightLeft, color: 'var(--success)' },
  { id: 'ACT-197', action: 'Cancelled Booking BKG-070 for Huddle Space A', module: 'Resource Booking', date: 'Yesterday', time: '11:00 AM', status: 'Completed', icon: BookOpen, color: 'var(--primary)' },
  { id: 'ACT-195', action: 'Updated Profile — changed phone number', module: 'Profile', date: 'Oct 07, 2026', time: '09:05 AM', status: 'Completed', icon: User, color: 'var(--text-muted)' },
  { id: 'ACT-192', action: 'Booked Mobile Projector X-1 for Marketing Presentation', module: 'Resource Booking', date: 'Oct 07, 2026', time: '11:00 AM', status: 'Completed', icon: BookOpen, color: 'var(--primary)' },
  { id: 'ACT-190', action: 'Created Return Request RET-024 for Dell Keyboard (AST-3012)', module: 'Returns', date: 'Sep 01, 2026', time: '04:30 PM', status: 'Completed', icon: Undo2, color: 'var(--danger)' },
  { id: 'ACT-185', action: 'Logged in from Mumbai, India', module: 'System', date: 'Sep 01, 2026', time: '09:00 AM', status: 'Completed', icon: User, color: 'var(--text-muted)' },
];

const STATUS_STYLE = {
  Completed:    { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  Pending:      { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  'Under Review':{ bg: 'rgba(37,99,235,0.1)',  color: '#2563eb' },
};

const EmpActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const modules = ['All', ...new Set(activityLogs.map(a => a.module))];

  const filtered = activityLogs.filter(a => {
    const matchSearch = a.action.toLowerCase().includes(searchTerm.toLowerCase()) || a.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = filterModule === 'All' || a.module === filterModule;
    return matchSearch && matchModule;
  });

  // Group by date
  const groups = filtered.reduce((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  const toggleGroup = (date) => {
    setCollapsedGroups(prev => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Activity History</h1>
          <p className="emp-page-subtitle">A complete audit trail of all your actions in AssetFlow.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search activities..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 'auto', fontSize: '0.85rem' }} value={filterModule} onChange={e => setFilterModule(e.target.value)}>
            {modules.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {Object.keys(groups).length === 0 && (
        <div className="emp-card">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
            <Activity size={40} strokeWidth={1} /><p style={{ margin: 0 }}>No activity records found.</p>
          </div>
        </div>
      )}

      {Object.entries(groups).map(([date, logs]) => {
        const isCollapsed = collapsedGroups[date];
        return (
          <div key={date} className="emp-card" style={{ marginBottom: '1rem' }}>
            {/* Group Header — clickable */}
            <button
              onClick={() => toggleGroup(date)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: 'none', borderBottom: isCollapsed ? 'none' : '1px solid var(--border)', cursor: 'pointer', borderRadius: isCollapsed ? 'var(--radius)' : 'var(--radius) var(--radius) 0 0' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={15} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--secondary)' }}>{date}</span>
                <span style={{ fontSize: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.1rem 0.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {logs.length} {logs.length === 1 ? 'activity' : 'activities'}
                </span>
              </div>
              {isCollapsed
                ? <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
                : <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} />
              }
            </button>

            {/* Group Body */}
            {!isCollapsed && (
              <div>
                {logs.map((log, index) => {
                  const Icon = log.icon;
                  const ss = STATUS_STYLE[log.status] || { bg: '#f1f5f9', color: '#64748b' };
                  return (
                    <div key={log.id} style={{ display: 'flex', gap: '1rem', padding: '1.1rem 1.5rem', borderBottom: index < logs.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                      {/* Icon + vertical line */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${log.color}18`, border: `2px solid ${log.color}40`, flexShrink: 0 }}>
                          <Icon size={16} style={{ color: log.color }} />
                        </div>
                        {index < logs.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, background: 'var(--border)', marginTop: 4 }}></div>}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--secondary)' }}>{log.action}</span>
                          <span style={{ padding: '0.15rem 0.55rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: ss.bg, color: ss.color, whiteSpace: 'nowrap' }}>{log.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span style={{ padding: '0.1rem 0.45rem', background: 'var(--bg-color)', borderRadius: '6px', border: '1px solid var(--border)', fontWeight: 500 }}>{log.module}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} />{log.time}</span>
                          <span style={{ color: 'var(--border)' }}>#{log.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EmpActivityLogs;
