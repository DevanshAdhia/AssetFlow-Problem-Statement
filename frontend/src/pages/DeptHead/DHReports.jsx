import React from 'react';
import { FileText, Download, BarChart2, PieChart as PieIcon, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import '../../layouts/DeptHeadLayout.css';

const assetDist = [{ name: 'Electronics', value: 45, color: '#7c3aed' }, { name: 'Furniture', value: 25, color: '#0284c7' }, { name: 'Vehicles', value: 5, color: '#16a34a' }, { name: 'Telecom', value: 10, color: '#d97706' }];
const monthlyAlloc = [{ month: 'Jan', req: 12 }, { month: 'Feb', req: 19 }, { month: 'Mar', req: 15 }, { month: 'Apr', req: 22 }, { month: 'May', req: 18 }, { month: 'Jun', req: 25 }];
const bookingUtil = [{ resource: 'Meeting Room A', hours: 45 }, { resource: 'Meeting Room B', hours: 30 }, { resource: 'Projector A', hours: 25 }, { resource: 'Company Van', hours: 15 }];

const TT = { contentStyle: { borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.12)', background: '#fff', fontSize: 12 } };

const DHReports = () => {
  return (
    <div className="dh-page">
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Department Reports</h1>
          <p className="dh-page-subtitle">Analytics and insights for your department's assets and resources.</p>
        </div>
        <div className="dh-header-actions">
          <button className="dh-btn dh-btn-outline"><Download size={15}/> Export PDF</button>
          <button className="dh-btn dh-btn-primary"><Download size={15}/> Export Excel</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        
        {/* Asset Distribution */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h3 className="dh-card-title flex items-center gap-2"><PieIcon size={16} style={{ color: 'var(--dh-primary)' }}/> Asset Distribution</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={assetDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {assetDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip {...TT} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {assetDist.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }}></span> {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Allocation Requests */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h3 className="dh-card-title flex items-center gap-2"><Activity size={16} style={{ color: '#0284c7' }}/> Allocation Requests</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyAlloc}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip {...TT} />
                <Line type="monotone" dataKey="req" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Utilization */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h3 className="dh-card-title flex items-center gap-2"><BarChart2 size={16} style={{ color: '#16a34a' }}/> Resource Utilization (Hours)</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bookingUtil}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="resource" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip {...TT} />
                <Bar dataKey="hours" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DHReports;
