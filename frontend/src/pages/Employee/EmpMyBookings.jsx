import React, { useState } from 'react';
import { Search, Filter, CalendarDays, Eye, X, RefreshCw } from 'lucide-react';

const myBookingsData = [
  { id: 'BKG-081', resource: 'Conference Room B5', date: 'Oct 12, 2026', time: '02:00 PM - 03:00 PM', purpose: 'Client Meeting', status: 'Approved' },
  { id: 'BKG-075', resource: 'Mobile Projector X-1', date: 'Oct 10, 2026', time: '10:00 AM - 01:00 PM', purpose: 'Marketing Presentation', status: 'Completed' },
  { id: 'BKG-089', resource: 'Huddle Space A', date: 'Oct 15, 2026', time: '09:00 AM - 10:00 AM', purpose: 'Weekly Sync', status: 'Pending' },
  { id: 'BKG-062', resource: 'Conference Room B5', date: 'Sep 28, 2026', time: '11:00 AM - 12:00 PM', purpose: 'Team Standup', status: 'Cancelled' }
];

const EmpMyBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = myBookingsData.filter(b => 
    b.resource.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Bookings</h1>
          <p className="emp-page-subtitle">View and manage your resource booking history.</p>
        </div>
        <div className="emp-header-actions">
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="emp-card">
        <div className="table-container">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Booking ID</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resource</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Purpose</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)' }}>{booking.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{booking.resource}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{booking.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.time}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{booking.purpose}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: booking.status === 'Approved' ? 'var(--bg-success-light, rgba(34,197,94,0.1))' 
                                : booking.status === 'Pending' ? 'var(--bg-warning-light, rgba(245,158,11,0.1))'
                                : booking.status === 'Completed' ? 'rgba(37,99,235,0.1)'
                                : 'var(--bg-danger-light, rgba(239,68,68,0.1))',
                      color: booking.status === 'Approved' ? 'var(--success)' 
                           : booking.status === 'Pending' ? 'var(--warning)'
                           : booking.status === 'Completed' ? 'var(--primary)'
                           : 'var(--danger)'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.4rem' }}><Eye size={14} /></button>
                      {(booking.status === 'Approved' || booking.status === 'Pending') && (
                        <>
                          <button className="btn btn-outline btn-sm" title="Reschedule" style={{ padding: '0.4rem', color: 'var(--warning)' }}><RefreshCw size={14} /></button>
                          <button className="btn btn-outline btn-sm" title="Cancel Booking" style={{ padding: '0.4rem', color: 'var(--danger)' }}><X size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="emp-empty-state">
              <CalendarDays size={40} />
              <p>No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpMyBookings;
