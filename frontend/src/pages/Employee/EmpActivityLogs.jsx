import React, { useState } from 'react';
import { Activity, Search, Filter, Calendar, Wrench, ArrowRightLeft, Undo2, BookOpen, User } from 'lucide-react';

const activityLogs = [
  { id: 'ACT-201', action: 'Booked Conference Room B5', module: 'Resource Booking', date: 'Oct 12, 2026', time: '01:45 PM', status: 'Completed', icon: BookOpen, color: 'var(--primary)' },
  { id: 'ACT-200', action: 'Submitted Maintenance Request MNT-092', module: 'Maintenance', date: 'Oct 11, 2026', time: '10:20 AM', status: 'Pending', icon: Wrench, color: 'var(--warning)' },
  { id: 'ACT-198', action: 'Initiated Transfer Request TRF-015 for Dell UltraSharp', module: 'Transfer', date: 'Oct 09, 2026', time: '03:10 PM', status: 'Under Review', icon: ArrowRightLeft, color: 'var(--success)' },
  { id: 'ACT-195', action: 'Updated Profile — changed phone number', module: 'Profile', date: 'Oct 07, 2026', time: '09:05 AM', status: 'Completed', icon: User, color: 'var(--text-muted)' },
  { id: 'ACT-190', action: 'Booked Mobile Projector X-1', module: 'Resource Booking', date: 'Oct 10, 2026', time: '11:00 AM', status: 'Completed', icon: BookOpen, color: 'var(--primary)' },
  { id: 'ACT-185', action: 'Returned Dell Keyboard (AST-3012)', module: 'Returns', date: 'Sep 01, 2026', time: '04:30 PM', status: 'Completed', icon: Undo2, color: 'var(--danger)' },
];

const EmpActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activityLogs.filter(a =>
    a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Activity History</h1>
          <p className="emp-page-subtitle">A complete audit trail of all your actions in AssetFlow.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search activities..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="emp-card">
        {filtered.length === 0 && <div className="emp-empty-state"><Activity size={40} /><p>No activity records found.</p></div>}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((log, index) => {
            const Icon = log.icon;
            return (
              <div key={log.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: index < filtered.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                {/* Timeline Icon + Line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${log.color}18`, border: `2px solid ${log.color}40` }}>
                    <Icon size={17} style={{ color: log.color }} />
                  </div>
                  {index < filtered.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: 'var(--border)', marginTop: 4 }}></div>}
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--secondary)' }}>{log.action}</span>
                    <span style={{ padding: '0.15rem 0.55rem', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600, background: log.status === 'Completed' ? 'rgba(34,197,94,0.1)' : log.status === 'Pending' ? 'rgba(245,158,11,0.1)' : 'rgba(37,99,235,0.1)', color: log.status === 'Completed' ? 'var(--success)' : log.status === 'Pending' ? 'var(--warning)' : 'var(--primary)' }}>
                      {log.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ padding: '0.1rem 0.45rem', background: 'var(--bg-color)', borderRadius: '6px', border: '1px solid var(--border)' }}>{log.module}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={12} />{log.date} at {log.time}</span>
                    <span style={{ color: 'var(--border)' }}>#{log.id}</span>
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

export default EmpActivityLogs;
