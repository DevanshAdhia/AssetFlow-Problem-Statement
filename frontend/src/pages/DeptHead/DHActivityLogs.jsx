import React, { useState } from 'react';
import { Search, Download, Activity, Filter } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const LOGS = [
  { id: 'LOG-010', action: 'Approved Allocation Request REQ-0091', module: 'Allocation', user: 'Bharat Rathor', date: '12 Jul 2026', time: '10:15 AM', status: 'Success', ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
  { id: 'LOG-009', action: 'Rejected Transfer Request TRF-0032',  module: 'Transfers',  user: 'Bharat Rathor', date: '12 Jul 2026', time: '09:30 AM', status: 'Success', ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
  { id: 'LOG-008', action: 'Booked Meeting Room A',               module: 'Booking',    user: 'Bharat Rathor', date: '11 Jul 2026', time: '04:15 PM', status: 'Success', ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
  { id: 'LOG-007', action: 'Exported Department Assets (CSV)',    module: 'Assets',     user: 'Bharat Rathor', date: '11 Jul 2026', time: '02:00 PM', status: 'Success', ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
  { id: 'LOG-006', action: 'Failed to access Admin Dashboard',    module: 'Security',   user: 'Bharat Rathor', date: '10 Jul 2026', time: '11:45 AM', status: 'Failed',  ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
  { id: 'LOG-005', action: 'Updated Profile Information',         module: 'Profile',    user: 'Bharat Rathor', date: '09 Jul 2026', time: '10:00 AM', status: 'Success', ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
  { id: 'LOG-004', action: 'Logged In',                           module: 'Auth',       user: 'Bharat Rathor', date: '09 Jul 2026', time: '09:00 AM', status: 'Success', ip: '192.168.1.45', device: 'Windows 11 / Chrome' },
];

const MODULE_COLORS = {
  Allocation: 'dh-badge-pending', Transfers: 'dh-badge-transfer', Booking: 'dh-badge-info', 
  Assets: 'dh-badge-allocated', Security: 'dh-badge-rejected', Auth: 'dh-badge-success', Profile: 'dh-badge-maintenance'
};

const DHActivityLogs = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = LOGS.filter(l => {
    const q = search.toLowerCase();
    return (l.action.toLowerCase().includes(q) || l.module.toLowerCase().includes(q)) &&
           (filter === 'All' || l.module === filter);
  });

  return (
    <div className="dh-page">
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Activity Logs</h1>
          <p className="dh-page-subtitle">Track all actions performed within the department portal.</p>
        </div>
        <button className="dh-btn dh-btn-outline"><Download size={15}/> Export Logs</button>
      </div>

      <div className="dh-card">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--dh-border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="dh-search-bar" style={{ minWidth: 260 }}>
            <Search size={14}/><input placeholder="Search action or module..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="dh-form-control" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="All">All Modules</option>
            {Object.keys(MODULE_COLORS).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="dh-table-container">
          <table className="dh-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Module</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>IP / Device</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.action}</td>
                  <td><span className={`dh-badge ${MODULE_COLORS[l.module]}`}>{l.module}</span></td>
                  <td>
                    <p style={{ margin: 0 }}>{l.date}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dh-muted)' }}>{l.time}</p>
                  </td>
                  <td>
                    <span className={`dh-badge ${l.status === 'Success' ? 'dh-badge-success' : 'dh-badge-rejected'}`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{l.ip}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dh-muted)' }}>{l.device}</p>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5}><div className="dh-empty-state"><Activity size={40}/><span>No logs found</span></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DHActivityLogs;
