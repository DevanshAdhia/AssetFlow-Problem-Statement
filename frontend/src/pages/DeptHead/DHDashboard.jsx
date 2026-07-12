import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, CheckSquare, ArrowRightLeft, BookOpen, Wrench,
  TrendingUp, Clock, Users, AlertCircle, CheckCircle,
  Eye, Plus, FileBarChart, ChevronRight, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';
import '../../layouts/DeptHeadLayout.css';

const TT = { contentStyle: { borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.12)', background: '#fff', fontSize: 12 } };

const allocTrend   = [{ m:'Jan',req:4 },{ m:'Feb',req:7 },{ m:'Mar',req:5 },{ m:'Apr',req:9 },{ m:'May',req:6 },{ m:'Jun',req:11 },{ m:'Jul',req:8 }];
const statusData   = [{ name:'Allocated',v:38,c:'#7c3aed'},{ name:'Available',v:14,c:'#16a34a'},{ name:'Maintenance',v:5,c:'#d97706'},{ name:'Reserved',v:3,c:'#0284c7'}];
const bookingTrend = [{ m:'Jan',b:6 },{ m:'Feb',b:9 },{ m:'Mar',b:7 },{ m:'Apr',b:13 },{ m:'May',b:10 },{ m:'Jun',b:15 },{ m:'Jul',b:11 }];

const ACTIVITIES = [
  { icon: CheckSquare, color:'#7c3aed', msg:'Allocation request approved for Rohan Mehta — ThinkPad T14', time:'10m ago', type:'Approval' },
  { icon: ArrowRightLeft, color:'#d97706', msg:'Transfer request for Projector AF-009 sent to Asset Manager', time:'45m ago', type:'Transfer' },
  { icon: BookOpen, color:'#0284c7', msg:'Meeting Room B booked by Sneha Kulkarni for Sprint Review', time:'1h ago', type:'Booking' },
  { icon: AlertCircle, color:'#dc2626', msg:'Laptop AF-022 flagged for maintenance — overdue check', time:'3h ago', type:'Maintenance' },
  { icon: Users, color:'#16a34a', msg:'New employee Arjun Nair added to Engineering department', time:'1d ago', type:'HR' },
];

const PENDING_APPROVALS = [
  { id:'REQ-0091', employee:'Rohan Mehta', asset:'Dell XPS 15 Laptop', priority:'High', submitted:'2 hours ago' },
  { id:'REQ-0088', employee:'Sneha Kulkarni', asset:'4K Monitor AF-201', priority:'Medium', submitted:'5 hours ago' },
  { id:'REQ-0085', employee:'Vivek Joshi', asset:'Wireless Headset', priority:'Low', submitted:'1 day ago' },
  { id:'REQ-0082', employee:'Divya Nair', asset:'External SSD 1TB', priority:'High', submitted:'2 days ago' },
];

const UPCOMING_BOOKINGS = [
  { resource:'Meeting Room A', date:'Today, 3:00 PM', bookedBy:'Sneha Kulkarni', purpose:'Sprint Review' },
  { resource:'Projector B',    date:'Tomorrow, 10:00 AM', bookedBy:'Rohan Mehta', purpose:'Client Presentation' },
  { resource:'Training Room 1',date:'12 Jul, 2:00 PM',   bookedBy:'Arjun Nair',   purpose:'Onboarding Session' },
];

const PRIORITY_COLOR = { High:'#dc2626', Medium:'#d97706', Low:'#16a34a' };

const DHDashboard = () => {
  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem('auth_user')) || {}; } catch { return {}; } })();

  const KPI_CARDS = [
    { label:'Total Dept. Assets',    value:60,  delta:'↑ 3 this month', color:'#7c3aed', icon:Package },
    { label:'Allocated',             value:38,  delta:'63% utilization',  color:'#2563eb', icon:Users },
    { label:'Available',             value:14,  delta:'23% idle',          color:'#16a34a', icon:CheckCircle },
    { label:'Under Maintenance',     value:5,   delta:'2 critical',       color:'#d97706', icon:Wrench },
    { label:'Pending Allocations',   value:4,   delta:'Action required',  color:'#dc2626', icon:CheckSquare },
    { label:'Pending Transfers',     value:2,   delta:'Awaiting review',  color:'#b45309', icon:ArrowRightLeft },
    { label:"Today's Bookings",      value:3,   delta:'2 upcoming',       color:'#0284c7', icon:BookOpen },
    { label:'Dept. Employees',       value:18,  delta:'2 on leave today', color:'#374151', icon:Users },
  ];

  return (
    <div className="dh-page">
      {/* Welcome */}
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Good morning, {user.name?.split(' ')[0] || 'Head'} 👋</h1>
          <p className="dh-page-subtitle">{user.department || 'Engineering'} Department — {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <div className="dh-header-actions">
          <button className="dh-btn dh-btn-outline" onClick={() => navigate('/dept-head/reports')}><FileBarChart size={16}/> View Reports</button>
          <button className="dh-btn dh-btn-primary" onClick={() => navigate('/dept-head/bookings')}><Plus size={16}/> Book Resource</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dh-kpi-grid">
        {KPI_CARDS.map((k, i) => (
          <div key={i} className="dh-kpi-card" style={{ borderLeftColor: k.color }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <span className="dh-kpi-label">{k.label}</span>
              <div style={{ width:36, height:36, borderRadius:10, background:`${k.color}18`, color:k.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <k.icon size={18}/>
              </div>
            </div>
            <div className="dh-kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="dh-kpi-delta">{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
        {/* Asset status pie */}
        <div className="dh-card">
          <div className="dh-card-header"><h3 className="dh-card-title">Asset Status</h3></div>
          <div style={{ padding:'1rem', display:'flex', justifyContent:'center' }}>
            <PieChart width={220} height={190}>
              <Pie data={statusData} cx={110} cy={85} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="v">
                {statusData.map((e,i) => <Cell key={i} fill={e.c}/>)}
              </Pie>
              <Tooltip {...TT} formatter={(v,n)=>[v,n]}/>
              <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize:11 }}/>
            </PieChart>
          </div>
        </div>

        {/* Allocation trend */}
        <div className="dh-card">
          <div className="dh-card-header"><h3 className="dh-card-title">Allocation Trend</h3></div>
          <div style={{ padding:'1rem' }}>
            <ResponsiveContainer width="100%" height={175}>
              <AreaChart data={allocTrend} margin={{ top:5, right:5, left:-28, bottom:0 }}>
                <defs>
                  <linearGradient id="dhGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                <Tooltip {...TT}/>
                <Area type="monotone" dataKey="req" stroke="#7c3aed" strokeWidth={3} fill="url(#dhGrad)" dot={{ r:4, fill:'#7c3aed', strokeWidth:2, stroke:'#fff' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking trend */}
        <div className="dh-card">
          <div className="dh-card-header"><h3 className="dh-card-title">Booking Trend</h3></div>
          <div style={{ padding:'1rem' }}>
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={bookingTrend} margin={{ top:5, right:5, left:-28, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                <Tooltip {...TT}/>
                <Bar dataKey="b" fill="#0284c7" radius={[4,4,0,0]} barSize={20}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        {/* Pending Approvals */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h3 className="dh-card-title">⏳ Pending Approvals</h3>
            <button className="dh-btn dh-btn-sm dh-btn-outline" onClick={() => navigate('/dept-head/allocation')}>View All <ChevronRight size={13}/></button>
          </div>
          <div style={{ padding:'0.5rem 0' }}>
            {PENDING_APPROVALS.map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1.25rem', borderBottom:'1px solid var(--dh-border)' }}>
                <div className="dh-avatar-initials" style={{ fontSize:'0.7rem' }}>{r.employee.split(' ').map(w=>w[0]).join('')}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ margin:0, fontSize:'0.82rem', fontWeight:600 }}>{r.employee}</p>
                  <p style={{ margin:0, fontSize:'0.75rem', color:'var(--dh-muted)' }}>{r.asset}</p>
                </div>
                <span className="dh-badge" style={{ background:`${PRIORITY_COLOR[r.priority]}18`, color:PRIORITY_COLOR[r.priority] }}>{r.priority}</span>
                <button className="dh-btn dh-btn-xs dh-btn-primary" onClick={() => navigate('/dept-head/allocation')}>Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities + Upcoming Bookings */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {/* Upcoming Bookings */}
          <div className="dh-card">
            <div className="dh-card-header">
              <h3 className="dh-card-title">📅 Upcoming Bookings</h3>
              <button className="dh-btn dh-btn-sm dh-btn-outline" onClick={() => navigate('/dept-head/bookings')}>View All <ChevronRight size={13}/></button>
            </div>
            {UPCOMING_BOOKINGS.map((b, i) => (
              <div key={i} style={{ display:'flex', gap:'0.75rem', padding:'0.75rem 1.25rem', borderBottom:'1px solid var(--dh-border)', alignItems:'center' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'rgba(2,132,199,0.1)', color:'#0284c7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <BookOpen size={17}/>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:600, fontSize:'0.82rem' }}>{b.resource}</p>
                  <p style={{ margin:0, fontSize:'0.75rem', color:'var(--dh-muted)' }}>{b.date} · {b.bookedBy}</p>
                </div>
                <span className="dh-badge dh-badge-info">{b.purpose}</span>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="dh-card">
            <div className="dh-card-header">
              <h3 className="dh-card-title">⚡ Recent Activity</h3>
              <button className="dh-btn dh-btn-sm dh-btn-outline" onClick={() => navigate('/dept-head/activity-logs')}>View All <ChevronRight size={13}/></button>
            </div>
            <div style={{ maxHeight: 220, overflowY:'auto' }}>
              {ACTIVITIES.slice(0,4).map((a, i) => (
                <div key={i} style={{ display:'flex', gap:'0.75rem', padding:'0.6rem 1.25rem', borderBottom:'1px solid var(--dh-border)', alignItems:'flex-start' }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${a.color}18`, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <a.icon size={14}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:'0.8rem', lineHeight:1.4 }}>{a.msg}</p>
                    <span style={{ fontSize:'0.72rem', color:'var(--dh-muted)' }}>{a.time}</span>
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

export default DHDashboard;
