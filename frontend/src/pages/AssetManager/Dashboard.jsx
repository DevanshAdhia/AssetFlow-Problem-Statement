import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, CheckCircle, Clock, AlertTriangle, AlertOctagon,
  FileCheck, ShieldAlert, ArrowDownCircle, Settings, Box, Plus, Settings2, FileText
} from 'lucide-react';
import './Dashboard.css';

const AssetManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="am-dashboard">
      <div className="am-header">
        <div>
          <h1 className="text-2xl font-bold">Asset Manager Dashboard</h1>
          <p className="text-muted">Real-time overview of asset operations and required actions.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={() => navigate('/asset-manager/reports')}><FileText size={18} /> Reports</button>
          <button className="btn btn-primary" onClick={() => navigate('/asset-manager/assets/new')}><Plus size={18} /> Register Asset</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid mt-4">
        <div className="kpi-card">
          <div className="kpi-icon bg-primary-light text-primary"><Package size={24} /></div>
          <div className="kpi-content">
            <p className="kpi-label">Total Assets</p>
            <h3 className="kpi-value">1,248</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-success-light text-success"><CheckCircle size={24} /></div>
          <div className="kpi-content">
            <p className="kpi-label">Available</p>
            <h3 className="kpi-value">432</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-info-light text-info"><Box size={24} /></div>
          <div className="kpi-content">
            <p className="kpi-label">Allocated</p>
            <h3 className="kpi-value">715</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-warning-light text-warning"><Settings size={24} /></div>
          <div className="kpi-content">
            <p className="kpi-label">Under Maintenance</p>
            <h3 className="kpi-value">45</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-danger-light text-danger"><AlertTriangle size={24} /></div>
          <div className="kpi-content">
            <p className="kpi-label">Lost/Missing</p>
            <h3 className="kpi-value">8</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid mt-4">
        
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header border-bottom pb-2">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-list mt-3">
            <button className="action-btn" onClick={() => navigate('/asset-manager/assets/new')}>
              <Plus size={20} className="text-primary" />
              <span>Register Asset</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/asset-manager/allocation')}>
              <CheckCircle size={20} className="text-success" />
              <span>Allocate Asset</span>
            </button>
            <button className="action-btn">
              <FileCheck size={20} className="text-info" />
              <span>Approve Transfer</span>
            </button>
            <button className="action-btn">
              <Settings2 size={20} className="text-warning" />
              <span>Approve Maintenance</span>
            </button>
            <button className="action-btn">
              <ArrowDownCircle size={20} className="text-muted" />
              <span>Approve Return</span>
            </button>
          </div>
        </div>

        {/* Action Required / Asset Alerts */}
        <div className="card border-danger">
          <div className="card-header border-bottom pb-2">
            <h2 className="text-danger flex-align-center gap-2"><AlertOctagon size={18}/> Asset Alerts</h2>
          </div>
          <div className="alert-list mt-3">
            <div className="alert-item bg-danger-light border-danger">
              <div className="alert-details">
                <h4 className="text-danger">Warranty Expiring (12 Assets)</h4>
                <p className="text-sm">Dell XPS laptops warranty expiring in &lt; 30 days.</p>
              </div>
              <button className="btn btn-outline btn-xs border-danger text-danger">Review</button>
            </div>
            <div className="alert-item bg-warning-light border-warning mt-2">
              <div className="alert-details">
                <h4 className="text-warning">Lost Asset Report</h4>
                <p className="text-sm">AF-099 (Projector) reported missing by IT.</p>
              </div>
              <button className="btn btn-outline btn-xs border-warning text-warning">Investigate</button>
            </div>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="card md-col-span-2">
          <div className="card-header border-bottom pb-2">
            <h2>Recent Activities</h2>
          </div>
          <div className="activity-timeline mt-3">
            <div className="timeline-item">
              <div className="timeline-icon bg-success-light text-success"><CheckCircle size={14}/></div>
              <div className="timeline-content">
                <p><strong>AF-104 (MacBook Pro)</strong> was successfully allocated to <strong>Sarah Jenkins</strong>.</p>
                <span className="text-xs text-muted">10 mins ago</span>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-info-light text-info"><FileCheck size={14}/></div>
              <div className="timeline-content">
                <p>Transfer request for <strong>AF-045 (Monitor)</strong> approved by Admin.</p>
                <span className="text-xs text-muted">1 hour ago</span>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-primary-light text-primary"><Plus size={14}/></div>
              <div className="timeline-content">
                <p><strong>15 new assets</strong> (Dell Monitors) were registered in the directory.</p>
                <span className="text-xs text-muted">3 hours ago</span>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-warning-light text-warning"><Settings size={14}/></div>
              <div className="timeline-content">
                <p><strong>AF-002 (Chair)</strong> moved to Maintenance Status.</p>
                <span className="text-xs text-muted">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssetManagerDashboard;
