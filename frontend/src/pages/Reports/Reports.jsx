import React from 'react';
import { Download, TrendingUp, AlertCircle, PieChart, Activity } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="page-header flex-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted">Actionable operational insights and resource utilization metrics.</p>
        </div>
        <button className="btn btn-primary">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      <div className="analytics-grid">
        {/* Asset Utilization Trends */}
        <div className="card analytics-card col-span-2">
          <div className="card-header">
            <h3><TrendingUp size={20} className="text-primary" /> Asset Utilization Trends</h3>
            <span className="badge bg-primary-light text-primary">Most Used vs Idle</span>
          </div>
          <div className="chart-container flex-end align-end">
            <div className="bar-group">
              <div className="bar-label">Laptops</div>
              <div className="bars">
                <div className="bar used" style={{ height: '85%' }} tooltip="Used: 85%"></div>
                <div className="bar idle" style={{ height: '15%' }} tooltip="Idle: 15%"></div>
              </div>
            </div>
            <div className="bar-group">
              <div className="bar-label">Monitors</div>
              <div className="bars">
                <div className="bar used" style={{ height: '60%' }} tooltip="Used: 60%"></div>
                <div className="bar idle" style={{ height: '40%' }} tooltip="Idle: 40%"></div>
              </div>
            </div>
            <div className="bar-group">
              <div className="bar-label">Projectors</div>
              <div className="bars">
                <div className="bar used" style={{ height: '30%' }} tooltip="Used: 30%"></div>
                <div className="bar idle" style={{ height: '70%' }} tooltip="Idle: 70%"></div>
              </div>
            </div>
            <div className="bar-group">
              <div className="bar-label">Phones</div>
              <div className="bars">
                <div className="bar used" style={{ height: '95%' }} tooltip="Used: 95%"></div>
                <div className="bar idle" style={{ height: '5%' }} tooltip="Idle: 5%"></div>
              </div>
            </div>
            <div className="bar-group">
              <div className="bar-label">Vehicles</div>
              <div className="bars">
                <div className="bar used" style={{ height: '75%' }} tooltip="Used: 75%"></div>
                <div className="bar idle" style={{ height: '25%' }} tooltip="Idle: 25%"></div>
              </div>
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot used-dot"></span> Active Allocation</span>
            <span className="legend-item"><span className="dot idle-dot"></span> Idle / Storage</span>
          </div>
        </div>

        {/* Assets due for maintenance */}
        <div className="card analytics-card">
          <div className="card-header">
            <h3><AlertCircle size={20} className="text-warning" /> Maintenance Alerts</h3>
          </div>
          <div className="maintenance-alerts">
            <div className="alert-row">
              <div className="alert-info">
                <span className="item-name">Projector X-1</span>
                <span className="item-status text-warning">Due in 5 days</span>
              </div>
              <div className="progress-bg"><div className="progress-fill bg-warning" style={{ width: '90%' }}></div></div>
            </div>
            <div className="alert-row">
              <div className="alert-info">
                <span className="item-name">HVAC Unit B</span>
                <span className="item-status text-danger">Overdue by 2 days</span>
              </div>
              <div className="progress-bg"><div className="progress-fill bg-danger" style={{ width: '100%' }}></div></div>
            </div>
            <div className="alert-row">
              <div className="alert-info">
                <span className="item-name">Delivery Van</span>
                <span className="item-status text-primary">Nearing retirement</span>
              </div>
              <div className="progress-bg"><div className="progress-fill bg-primary" style={{ width: '95%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Maintenance Frequency */}
        <div className="card analytics-card">
          <div className="card-header">
            <h3><Activity size={20} className="text-danger" /> Maintenance Frequency</h3>
          </div>
          <div className="frequency-chart">
            <div className="freq-row">
              <span>Laptops</span>
              <div className="freq-line"><div className="freq-fill" style={{ width: '40%' }}></div></div>
              <span>12/mo</span>
            </div>
            <div className="freq-row">
              <span>Printers</span>
              <div className="freq-line"><div className="freq-fill" style={{ width: '80%' }}></div></div>
              <span>24/mo</span>
            </div>
            <div className="freq-row">
              <span>Projectors</span>
              <div className="freq-line"><div className="freq-fill" style={{ width: '20%' }}></div></div>
              <span>6/mo</span>
            </div>
            <div className="freq-row">
              <span>Servers</span>
              <div className="freq-line"><div className="freq-fill" style={{ width: '10%' }}></div></div>
              <span>3/mo</span>
            </div>
          </div>
        </div>

        {/* Department Allocation Summary Heatmap */}
        <div className="card analytics-card col-span-2">
          <div className="card-header">
            <h3><PieChart size={20} className="text-success" /> Dept Allocation Heatmap</h3>
          </div>
          <div className="heatmap-container">
            <div className="heatmap-grid">
              <div className="hm-header"></div>
              <div className="hm-header">IT</div>
              <div className="hm-header">HR</div>
              <div className="hm-header">Finance</div>
              <div className="hm-header">Ops</div>
              
              <div className="hm-row-label">Laptops</div>
              <div className="hm-cell high">95</div>
              <div className="hm-cell low">12</div>
              <div className="hm-cell med">45</div>
              <div className="hm-cell high">78</div>
              
              <div className="hm-row-label">Monitors</div>
              <div className="hm-cell high">110</div>
              <div className="hm-cell low">5</div>
              <div className="hm-cell med">30</div>
              <div className="hm-cell med">60</div>
              
              <div className="hm-row-label">Furniture</div>
              <div className="hm-cell med">40</div>
              <div className="hm-cell high">120</div>
              <div className="hm-cell high">80</div>
              <div className="hm-cell high">200</div>
            </div>
            <div className="heatmap-legend mt-2">
              <span className="text-muted text-sm">Intensity:</span>
              <div className="hm-cell low">Low</div>
              <div className="hm-cell med">Medium</div>
              <div className="hm-cell high">High</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
