import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Download } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [departmentData] = useState([
    { name: 'Technology', utilization: 85 },
    { name: 'Operations', utilization: 65 },
    { name: 'Finance', utilization: 45 },
    { name: 'HR', utilization: 30 },
    { name: 'Legal', utilization: 20 },
  ]);

  const [maintenanceData] = useState([
    { month: 'Jan', incidents: 4 },
    { month: 'Feb', incidents: 7 },
    { month: 'Mar', incidents: 5 },
    { month: 'Apr', incidents: 12 },
    { month: 'May', incidents: 8 },
    { month: 'Jun', incidents: 15 },
  ]);

  const handleExportCSV = () => {
    // Combine both data sets into a CSV format
    const csvRows = [];
    
    // Header for Department Utilization
    csvRows.push("--- Department Utilization ---");
    csvRows.push("Department,Utilization (%)");
    departmentData.forEach(row => {
      csvRows.push(`${row.name},${row.utilization}`);
    });
    
    csvRows.push(""); // Empty row
    
    // Header for Maintenance Data
    csvRows.push("--- Maintenance Incidents (YTD) ---");
    csvRows.push("Month,Incidents");
    maintenanceData.forEach(row => {
      csvRows.push(`${row.month},${row.incidents}`);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `AssetFlow_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <div className="page-header flex-between mb-4">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Real-time asset utilization and maintenance metrics.</p>
        </div>
        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={18} /> Export Full Report
        </button>
      </div>

      {/* Row 1: Utilization Bar Chart + Details on the side */}
      <div className="report-row card">
        <div className="report-chart-section">
          <h3 className="chart-title">Utilization by Department (%)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(37, 99, 235, 0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="utilization" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="report-details-section">
          <h3 className="stat-title">Most Used Assets</h3>
          <ul className="stat-ul text-muted">
            <li><strong>Room B2:</strong> 34 bookings this month</li>
            <li><strong>Van AF-343:</strong> 21 trips this month</li>
            <li><strong>Projector AF-335:</strong> 18 uses across 3 departments</li>
          </ul>
          <div className="insight-box mt-3">
            <span className="insight-badge bg-primary-light text-primary">Insight</span>
            <p className="text-sm mt-2">Technology department has highest utilization (85%). Consider allocating more high-tier laptops to balance load.</p>
          </div>
        </div>
      </div>

      {/* Row 2: Maintenance Line Chart + Details on the side */}
      <div className="report-row card mt-4">
        <div className="report-chart-section">
          <h3 className="chart-title">Maintenance Incidents (YTD)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={maintenanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={3} dot={{r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-details-section">
          <h3 className="stat-title">Action Required</h3>
          
          <div className="alert-list">
            <div className="alert-item">
              <h4 className="alert-title text-danger">Idle Assets</h4>
              <ul className="stat-ul text-muted text-sm">
                <li>Camera AF-0301 : Unused for 60+ days</li>
                <li>Chair AF-0410 : Unused for 45 days</li>
              </ul>
            </div>
            
            <div className="alert-item mt-3">
              <h4 className="alert-title text-warning">Maintenance / Retirement</h4>
              <ul className="stat-ul text-muted text-sm">
                <li>Forklift AF-0087 : Service due in 5 days</li>
                <li>Laptop AF-0020 : 4 years old (Nearing retirement)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Reports;
