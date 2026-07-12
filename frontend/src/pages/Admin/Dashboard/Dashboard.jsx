import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recentActivities } from '../../../data/mockData';
import { Package, Users, Settings, CalendarCheck, Plus, Bookmark, Wrench } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Dynamic KPI States
  const [kpis, setKpis] = useState({ available: 120, allocated: 320, maintenance: 12, bookings: 34 });
  const [missingCount, setMissingCount] = useState(3);
  const [allocCount, setAllocCount] = useState(5);

  useEffect(() => {
    try {
      let available = 120, allocated = 320, inRepair = 12;
      const savedAssets = localStorage.getItem('admin_assets');
      if (savedAssets) {
        const parsedAssets = JSON.parse(savedAssets);
        available = parsedAssets.filter(a => a.status === 'Available').length;
        allocated = parsedAssets.filter(a => a.status === 'Allocated').length;
        inRepair = parsedAssets.filter(a => a.status === 'In Repair').length;
      }
      setKpis({ available, allocated, maintenance: inRepair, bookings: 34 });

      const savedAudit = localStorage.getItem('admin_audit');
      if (savedAudit) {
        const parsedAudit = JSON.parse(savedAudit);
        setMissingCount(parsedAudit.filter(a => a.status === 'Missing').length);
      }

      const savedAlloc = localStorage.getItem('admin_allocations');
      if (savedAlloc) {
        setAllocCount(JSON.parse(savedAlloc).length);
      }
    } catch (err) {}
  }, []);
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p className="text-muted">Welcome back! Here's what's happening with your assets today.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-primary-light">
            <Package className="text-primary" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpis.available}</h3>
            <p>Assets Available</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-success-light">
            <Users className="text-success" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpis.allocated}</h3>
            <p>Assets Allocated</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-warning-light">
            <Settings className="text-warning" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpis.maintenance}</h3>
            <p>In Maintenance</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-info-light">
            <CalendarCheck className="text-info" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpis.bookings}</h3>
            <p>Active Bookings</p>
          </div>
        </div>
      </div>

      {/* Action Required Section */}
      <div className="card action-required-card border-warning">
        <div className="card-header">
          <h2 className="text-warning flex-align-center gap-2">
            <Settings size={20} /> Action Required
          </h2>
        </div>
        <div className="action-items-list">
          <div className="action-alert-item">
            <span className="alert-dot bg-danger"></span>
            <div className="alert-content">
              <h4>{missingCount > 0 ? `${missingCount} assets missing for specs` : 'No missing assets'}</h4>
              <p>Flagged for immediate follow-up and audit verification.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/audit')}>Review</button>
          </div>
          <div className="action-alert-item">
            <span className="alert-dot bg-warning"></span>
            <div className="alert-content">
              <h4>{allocCount} Active/Pending Transfers</h4>
              <p>Department allocation transfers awaiting administrator approval.</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/allocation')}>Approve</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Recent Activities */}
        <div className="card recent-activities">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/activity-logs')}>View All</button>
          </div>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-indicator ${activity.type}`}></div>
                <div className="activity-details">
                  <p className="activity-text">{activity.text}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/assets')}>
              <Plus size={20} />
              <span>Register Asset</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/bookings')}>
              <Bookmark size={20} />
              <span>Book Resource</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/maintenance')}>
              <Wrench size={20} />
              <span>Raise Maintenance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
