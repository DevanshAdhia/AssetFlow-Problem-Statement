import React from 'react';
import './Reports.css';

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="reports-top-charts">
        
        {/* Utilization by department - Bar Chart Mock */}
        <div className="chart-box blue-box">
          <div className="chart-title">Utilization by department</div>
          <div className="bar-chart-mock">
            <div className="bar-wrapper"><div className="bar-yellow" style={{height: '40%'}}></div></div>
            <div className="bar-wrapper"><div className="bar-yellow" style={{height: '60%'}}></div></div>
            <div className="bar-wrapper"><div className="bar-yellow" style={{height: '90%'}}></div></div>
            <div className="bar-wrapper"><div className="bar-yellow" style={{height: '50%'}}></div></div>
            <div className="bar-wrapper"><div className="bar-yellow" style={{height: '40%'}}></div></div>
            <div className="bar-wrapper"><div className="bar-yellow" style={{height: '80%'}}></div></div>
            <div className="chart-base-line"></div>
          </div>
        </div>

        {/* Maintenance Frequency - Line Chart Mock */}
        <div className="chart-box blue-box">
          <div className="chart-title">Maintenance Frequency</div>
          <div className="line-chart-mock">
            {/* Using an SVG to draw a zig-zag line resembling a line chart */}
            <svg width="100%" height="150px" viewBox="0 0 400 150" preserveAspectRatio="none">
              <polyline 
                points="10,120 70,70 120,90 200,40 250,55 330,10 390,20" 
                fill="none" 
                stroke="#ff4d4d" 
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="chart-base-line"></div>
          </div>
        </div>
      </div>

      <div className="reports-middle-stats mt-4">
        <div className="stat-list">
          <h3 className="stat-title">Most used assets</h3>
          <ul className="stat-ul text-muted">
            <li>Room B2: 34 booking this month</li>
            <li>Van AF-343: 21 trips this month</li>
            <li>Projector AF-335: 18 uses</li>
          </ul>
        </div>
        
        <div className="stat-list">
          <h3 className="stat-title">Idle assets</h3>
          <ul className="stat-ul text-muted">
            <li>Camera AF-0301 : unused 60+ days</li>
            <li>chair AF-0410 : unused 45 days</li>
          </ul>
        </div>
      </div>

      <div className="divider-line"></div>

      <div className="reports-bottom-stats">
        <h3 className="stat-title">Assets due for maintenance / nearing retirement</h3>
        <ul className="stat-ul text-muted">
          <li>Forklift AF-0087 : service due in 5 days</li>
          <li>Laptop AF-0020 : 4 years old : nearing retirement</li>
        </ul>
      </div>

      <div className="reports-actions mt-4">
        <button className="btn btn-export">Export report</button>
      </div>

    </div>
  );
};

export default Reports;
