import React, { useState } from 'react';
import { Box, Calendar, Wrench, Undo2, ArrowRightLeft, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmpDashboard = () => {
  const navigate = useNavigate();

  const [kpis] = useState({
    assignedAssets: 4,
    activeBookings: 2,
    pendingMaintenance: 1,
    pendingReturns: 0
  });

  const recentActivities = [
    { id: 1, text: "Booked Conference Room B5", time: "2 hours ago", type: "success" },
    { id: 2, text: "Raised maintenance for MacBook Pro", time: "1 day ago", type: "warning" },
    { id: 3, text: "Received Dell UltraSharp Monitor", time: "3 days ago", type: "primary" }
  ];

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Dashboard</h1>
          <p className="emp-page-subtitle">Overview of your assigned assets and requests.</p>
        </div>
      </div>

      <div className="emp-kpi-grid">
        <div className="emp-kpi-card" onClick={() => navigate('/employee/assets')} style={{ cursor: 'pointer' }}>
          <span className="emp-kpi-label">Assigned Assets</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="emp-kpi-value">{kpis.assignedAssets}</span>
            <Box size={28} className="text-primary" opacity={0.8} />
          </div>
        </div>
        <div className="emp-kpi-card" onClick={() => navigate('/employee/my-bookings')} style={{ cursor: 'pointer', borderLeftColor: 'var(--success)' }}>
          <span className="emp-kpi-label">Active Bookings</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="emp-kpi-value">{kpis.activeBookings}</span>
            <Calendar size={28} className="text-success" opacity={0.8} />
          </div>
        </div>
        <div className="emp-kpi-card" onClick={() => navigate('/employee/maintenance')} style={{ cursor: 'pointer', borderLeftColor: 'var(--warning)' }}>
          <span className="emp-kpi-label">Pending Maintenance</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="emp-kpi-value">{kpis.pendingMaintenance}</span>
            <Wrench size={28} className="text-warning" opacity={0.8} />
          </div>
        </div>
        <div className="emp-kpi-card" onClick={() => navigate('/employee/returns')} style={{ cursor: 'pointer', borderLeftColor: 'var(--danger)' }}>
          <span className="emp-kpi-label">Pending Returns</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="emp-kpi-value">{kpis.pendingReturns}</span>
            <Undo2 size={28} className="text-danger" opacity={0.8} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="emp-card">
          <div className="emp-card-header">
            <h2 className="emp-card-title">Quick Actions</h2>
          </div>
          <div className="emp-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/employee/bookings')} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Calendar size={24} className="text-primary" />
              <span>Book Resource</span>
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/employee/maintenance')} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Wrench size={24} className="text-warning" />
              <span>Raise Maintenance</span>
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/employee/returns')} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Undo2 size={24} className="text-danger" />
              <span>Return Asset</span>
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/employee/transfers')} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <ArrowRightLeft size={24} className="text-success" />
              <span>Transfer Asset</span>
            </button>
          </div>
        </div>

        <div className="emp-card">
          <div className="emp-card-header">
            <h2 className="emp-card-title">Recent Activities</h2>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/employee/activity')}>View All</button>
          </div>
          <div className="emp-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map(act => (
              <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: `var(--bg-${act.type}-light, #f1f5f9)`, color: `var(--${act.type}, #64748b)` }}>
                  <Clock size={16} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontWeight: 500, fontSize: '0.9rem' }}>{act.text}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;
