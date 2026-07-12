import React from 'react';
import { kpiData, recentActivities } from '../../data/mockData';
import { Package, Users, Settings, CalendarCheck, Plus, Bookmark, Wrench } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
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
            <h3>{kpiData.available}</h3>
            <p>Assets Available</p>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-success-light">
            <Users className="text-success" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpiData.allocated}</h3>
            <p>Assets Allocated</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-warning-light">
            <Settings className="text-warning" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpiData.maintenance}</h3>
            <p>In Maintenance</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-info-light">
            <CalendarCheck className="text-info" size={24} />
          </div>
          <div className="kpi-info">
            <h3>{kpiData.bookings}</h3>
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
              <h4>3 assets missing for specs</h4>
              <p>Flagged for immediate follow-up and audit verification.</p>
            </div>
            <button className="btn btn-outline btn-sm">Review</button>
          </div>
          <div className="action-alert-item">
            <span className="alert-dot bg-warning"></span>
            <div className="alert-content">
              <h4>5 Pending Transfers</h4>
              <p>Department allocation transfers awaiting administrator approval.</p>
            </div>
            <button className="btn btn-outline btn-sm">Approve</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* Recent Activities */}
        <div className="card recent-activities">
          <div className="card-header">
            <h2>Recent Activities</h2>
            <button className="btn btn-outline btn-sm">View All</button>
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
            <button className="action-btn">
              <Plus size={20} />
              <span>Register Asset</span>
            </button>
            <button className="action-btn">
              <Bookmark size={20} />
              <span>Book Resource</span>
            </button>
            <button className="action-btn">
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
