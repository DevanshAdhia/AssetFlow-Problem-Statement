import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, CheckCircle, ArrowRightLeft, Calendar, Wrench,
  AlertTriangle, Archive, Plus, Send, FileCheck, Settings2,
  ArrowDownCircle, Bell, TrendingUp, Clock, BarChart2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const KPI_DATA = [
  { label: 'Total Assets',       value: 1248, icon: Package,       color: '#2563EB', bg: 'rgba(37,99,235,0.1)',   delta: '+12 this month' },
  { label: 'Available',          value: 432,  icon: CheckCircle,   color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   delta: '+5 returned' },
  { label: 'Allocated',          value: 715,  icon: ArrowRightLeft, color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)', delta: '57.3% utilization' },
  { label: 'Reserved',           value: 38,   icon: Calendar,      color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', delta: '4 expiring soon' },
  { label: 'Under Maintenance',  value: 45,   icon: Wrench,        color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', delta: '8 pending approval' },
  { label: 'Lost / Missing',     value: 8,    icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  delta: '↑2 from last month' },
  { label: 'Retired',            value: 10,   icon: Archive,       color: '#64748B', bg: 'rgba(100,116,139,0.1)', delta: '3 this quarter' },
];

const PENDING_APPROVALS = [
  { id: 1, type: 'Transfer',    asset: 'MacBook Pro (AF-104)',   from: 'John Smith',     to: 'Sarah Jenkins', dept: 'Sales',  time: '10 min ago', urgent: true },
  { id: 2, type: 'Maintenance', asset: 'Projector (AF-009)',     from: 'IT Dept',        to: 'Tech Team',     dept: 'IT',     time: '1 hr ago',   urgent: false },
  { id: 3, type: 'Return',      asset: 'Dell Monitor (AF-045)',  from: 'Michael Chang',  to: 'Storage',       dept: 'Dev',    time: '2 hrs ago',  urgent: false },
];

const ACTIVITIES = [
  { id: 1, icon: CheckCircle,  color: '#22C55E', text: 'AF-104 (MacBook Pro) allocated to Sarah Jenkins', time: '10 mins ago' },
  { id: 2, icon: FileCheck,    color: '#0EA5E9', text: 'Transfer for AF-045 (Monitor) approved by Admin', time: '1 hour ago' },
  { id: 3, icon: Plus,         color: '#2563EB', text: '15 new Dell Monitors registered in directory',    time: '3 hours ago' },
  { id: 4, icon: Wrench,       color: '#F59E0B', text: 'AF-002 (Chair) moved to Maintenance status',      time: 'Yesterday' },
  { id: 5, icon: ArrowDownCircle, color:'#8B5CF6', text: 'AF-088 (Projector) returned by Meeting Room C', time: 'Yesterday' },
];

const UPCOMING_RETURNS = [
  { tag: 'AF-022', name: 'MacBook Pro M3', person: 'Sarah Jenkins', dept: 'Sales',  due: 'Today',     overdue: true },
  { tag: 'AF-031', name: 'ThinkPad T14',  person: 'Michael Chang', dept: 'Dev',    due: 'Tomorrow',  overdue: false },
  { tag: 'AF-055', name: 'DSLR Camera',   person: 'Priya Sharma',  dept: 'Mktg',   due: '15 Jul',    overdue: false },
];

const ALERTS = [
  { id: 1, type: 'danger',  title: 'Warranty Expiring — 12 Assets', desc: 'Dell XPS laptops expiring within 30 days.' },
  { id: 2, type: 'warning', title: 'Lost Asset Report', desc: 'AF-099 (Projector) reported missing by IT dept.' },
  { id: 3, type: 'warning', title: 'Overdue Returns — 3 Assets', desc: 'AF-022, AF-031, AF-077 past return date.' },
];

const DEPT_DATA = [
  { name: 'IT',     assets: 320 },
  { name: 'Sales',  assets: 195 },
  { name: 'HR',     assets: 88 },
  { name: 'Dev',    assets: 210 },
  { name: 'Ops',    assets: 145 },
  { name: 'Legal',  assets: 60 },
];

const STATUS_PIE = [
  { name: 'Available',   value: 432, color: '#22C55E' },
  { name: 'Allocated',   value: 715, color: '#2563EB' },
  { name: 'Maintenance', value: 45,  color: '#F59E0B' },
  { name: 'Reserved',    value: 38,  color: '#8B5CF6' },
  { name: 'Lost',        value: 8,   color: '#EF4444' },
  { name: 'Retired',     value: 10,  color: '#64748B' },
];

const MONTHLY_REG = [
  { month: 'Jan', count: 45 }, { month: 'Feb', count: 78 },
  { month: 'Mar', count: 52 }, { month: 'Apr', count: 91 },
  { month: 'May', count: 68 }, { month: 'Jun', count: 112 },
  { month: 'Jul', count: 43 },
];

const StatusBadge = ({ type }) => {
  const map = {
    Transfer:    'am-badge-reserved',
    Maintenance: 'am-badge-maintenance',
    Return:      'am-badge-available',
  };
  return <span className={`am-badge-status ${map[type] || ''}`}>{type}</span>;
};

const AssetManagerDashboard = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState(PENDING_APPROVALS);

  const handleApprove = (id) => setApprovals(prev => prev.filter(a => a.id !== id));
  const handleReject  = (id) => setApprovals(prev => prev.filter(a => a.id !== id));

  return (
    <div className="am-page">

      {/* Header */}
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title">Asset Manager Dashboard</h1>
          <p className="am-page-subtitle">Real-time overview of asset operations and required actions.</p>
        </div>
        <div className="am-header-actions">
          <button className="am-btn am-btn-outline" onClick={() => navigate('/asset-manager/reports')}>
            <BarChart2 size={16} /> Reports
          </button>
          <button className="am-btn am-btn-primary" onClick={() => navigate('/asset-manager/assets')}>
            <Plus size={16} /> Register Asset
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="am-kpi-grid">
        {KPI_DATA.map((k, i) => (
          <div key={i} className="am-kpi-card">
            <div className="am-kpi-icon" style={{ background: k.bg, color: k.color }}>
              <k.icon size={22} />
            </div>
            <div>
              <div className="am-kpi-value" style={{ color: k.color }}>{k.value.toLocaleString()}</div>
              <div className="am-kpi-label">{k.label}</div>
              <div className="am-text-xs am-text-muted am-mt-1">{k.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="am-card">
        <div className="am-card-header">
          <h3 className="am-card-title">Quick Actions</h3>
        </div>
        <div className="am-card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Register Asset',      icon: Plus,            color: '#2563EB', path: '/asset-manager/assets' },
            { label: 'Allocate Asset',      icon: ArrowRightLeft,  color: '#22C55E', path: '/asset-manager/allocation' },
            { label: 'Approve Transfer',    icon: FileCheck,       color: '#0EA5E9', path: '/asset-manager/allocation' },
            { label: 'Approve Maintenance', icon: Settings2,       color: '#F59E0B', path: '/asset-manager/maintenance' },
            { label: 'Approve Return',      icon: ArrowDownCircle, color: '#8B5CF6', path: '/asset-manager/allocation' },
          ].map((a, i) => (
            <button key={i} className="am-quick-action-btn" onClick={() => navigate(a.path)}
              style={{ background: a.color + '12', borderColor: a.color + '30', color: a.color }}>
              <a.icon size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--am-text)', marginTop: 4 }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Pending Approvals */}
          <div className="am-card">
            <div className="am-card-header">
              <h3 className="am-card-title am-flex am-gap-2">
                <Clock size={16} className="am-text-warning" /> Pending Approvals
                <span className="am-badge-status am-badge-pending">{approvals.length}</span>
              </h3>
              <button className="am-btn am-btn-outline am-btn-sm" onClick={() => navigate('/asset-manager/allocation')}>View All</button>
            </div>
            <div className="am-table-container">
              <table className="am-table">
                <thead>
                  <tr>
                    <th>Type</th><th>Asset</th><th>From → To</th><th>Dept</th><th>Time</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {approvals.length > 0 ? approvals.map(a => (
                    <tr key={a.id}>
                      <td><StatusBadge type={a.type} /></td>
                      <td className="am-font-medium">{a.asset}</td>
                      <td className="am-text-muted am-text-sm">{a.from} → {a.to}</td>
                      <td><span className="am-badge-status am-badge-reserved">{a.dept}</span></td>
                      <td className="am-text-xs am-text-muted">{a.time}</td>
                      <td>
                        <div className="am-flex am-gap-1">
                          <button className="am-btn am-btn-success am-btn-xs" onClick={() => handleApprove(a.id)}>Approve</button>
                          <button className="am-btn am-btn-outline am-btn-xs" onClick={() => handleReject(a.id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6}>
                      <div className="am-empty-state" style={{ padding: '1.5rem' }}>
                        <CheckCircle size={32} />
                        <span>All caught up! No pending approvals.</span>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Returns */}
          <div className="am-card">
            <div className="am-card-header">
              <h3 className="am-card-title">Upcoming Returns</h3>
            </div>
            <div className="am-table-container">
              <table className="am-table">
                <thead><tr><th>Tag</th><th>Asset</th><th>Holder</th><th>Dept</th><th>Due Date</th></tr></thead>
                <tbody>
                  {UPCOMING_RETURNS.map((r, i) => (
                    <tr key={i}>
                      <td className="am-text-primary am-font-medium">{r.tag}</td>
                      <td className="am-font-medium">{r.name}</td>
                      <td>{r.person}</td>
                      <td>{r.dept}</td>
                      <td><span className={`am-badge-status ${r.overdue ? 'am-badge-lost' : 'am-badge-available'}`}>{r.due}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts row */}
          <div className="am-grid-2">
            <div className="am-card">
              <div className="am-card-header"><h3 className="am-card-title">Department Allocation</h3></div>
              <div className="am-card-body">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={DEPT_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--am-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--am-text-muted)', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--am-text-muted)', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', background: 'var(--am-surface)', color: 'var(--am-text)' }} />
                    <Bar dataKey="assets" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="am-card">
              <div className="am-card-header"><h3 className="am-card-title">Monthly Registrations</h3></div>
              <div className="am-card-body">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={MONTHLY_REG} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--am-border)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--am-text-muted)', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--am-text-muted)', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', background: 'var(--am-surface)', color: 'var(--am-text)' }} />
                    <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Asset Distribution Pie */}
          <div className="am-card">
            <div className="am-card-header"><h3 className="am-card-title">Asset Distribution</h3></div>
            <div className="am-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PieChart width={200} height={170}>
                <Pie data={STATUS_PIE} cx={100} cy={85} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {STATUS_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '0.8rem', background: 'var(--am-surface)' }} />
              </PieChart>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                {STATUS_PIE.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                      {s.name}
                    </span>
                    <strong>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Asset Alerts */}
          <div className="am-card">
            <div className="am-card-header">
              <h3 className="am-card-title am-text-danger am-flex am-gap-1">
                <AlertTriangle size={16} /> Asset Alerts
              </h3>
            </div>
            <div className="am-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ALERTS.map(a => (
                <div key={a.id} style={{ padding: '0.75rem', borderRadius: 8, border: `1px solid var(--am-${a.type})`, background: `rgba(${a.type === 'danger' ? '239,68,68' : '245,158,11'},0.06)` }}>
                  <h4 style={{ fontSize: '0.83rem', fontWeight: 700, color: `var(--am-${a.type})`, margin: '0 0 3px' }}>{a.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--am-text-muted)', margin: 0 }}>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="am-card">
            <div className="am-card-header">
              <h3 className="am-card-title">Recent Activity</h3>
              <button className="am-btn am-btn-outline am-btn-sm" onClick={() => navigate('/asset-manager/activity-logs')}>View All</button>
            </div>
            <div className="am-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {ACTIVITIES.map(a => (
                <div key={a.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: a.color + '18', color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <a.icon size={14} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', margin: 0 }}>{a.text}</p>
                    <span style={{ fontSize: '0.72rem', color: 'var(--am-text-muted)' }}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssetManagerDashboard;
