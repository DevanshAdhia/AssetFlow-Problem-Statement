import React, { useState } from 'react';
import { Search, CalendarDays, Eye, X, RefreshCw, CheckCircle, Clock } from 'lucide-react';

const initialBookings = [
  { id: 'BKG-081', resource: 'Conference Room B5', date: 'Oct 12, 2026', time: '02:00 PM – 03:00 PM', purpose: 'Client Meeting', status: 'Approved' },
  { id: 'BKG-075', resource: 'Mobile Projector X-1', date: 'Oct 10, 2026', time: '10:00 AM – 01:00 PM', purpose: 'Marketing Presentation', status: 'Completed' },
  { id: 'BKG-089', resource: 'Huddle Space A', date: 'Oct 15, 2026', time: '09:00 AM – 10:00 AM', purpose: 'Weekly Sync', status: 'Pending' },
  { id: 'BKG-062', resource: 'Conference Room B5', date: 'Sep 28, 2026', time: '11:00 AM – 12:00 PM', purpose: 'Team Standup', status: 'Cancelled' }
];

const STATUS_STYLE = {
  Approved:  { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  Completed: { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  Pending:   { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
};

const EmpMyBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [bookings, setBookings] = useState(initialBookings);
  const [viewBooking, setViewBooking] = useState(null);

  const filtered = bookings.filter(b => {
    const matchSearch = b.resource.toLowerCase().includes(searchTerm.toLowerCase()) || b.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const cancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
    }
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Bookings</h1>
          <p className="emp-page-subtitle">View and manage your resource booking history.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search bookings..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 'auto', fontSize: '0.85rem' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {['All', 'Approved', 'Pending', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="emp-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                {['Booking ID', 'Resource', 'Date & Time', 'Purpose', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const s = STATUS_STYLE[b.status] || {};
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{b.id}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{b.resource}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500 }}>{b.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.time}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{b.purpose}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: s.bg, color: s.color }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.35rem 0.6rem' }} onClick={() => setViewBooking(b)}>
                          <Eye size={13} />
                        </button>
                        {(b.status === 'Approved' || b.status === 'Pending') && (
                          <>
                            <button className="btn btn-outline btn-sm" title="Reschedule" style={{ padding: '0.35rem 0.6rem', color: 'var(--warning)' }} onClick={() => alert(`Reschedule feature coming soon for ${b.id}`)}>
                              <RefreshCw size={13} />
                            </button>
                            <button className="btn btn-outline btn-sm" title="Cancel Booking" style={{ padding: '0.35rem 0.6rem', color: 'var(--danger)' }} onClick={() => cancelBooking(b.id)}>
                              <X size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
              <CalendarDays size={40} strokeWidth={1} />
              <p style={{ margin: 0 }}>No bookings found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {viewBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setViewBooking(null)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '480px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Booking Details</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setViewBooking(null)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Booking ID', value: viewBooking.id },
                  { label: 'Resource', value: viewBooking.resource },
                  { label: 'Date', value: viewBooking.date },
                  { label: 'Time', value: viewBooking.time },
                  { label: 'Purpose', value: viewBooking.purpose },
                  { label: 'Status', value: viewBooking.status },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setViewBooking(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpMyBookings;
