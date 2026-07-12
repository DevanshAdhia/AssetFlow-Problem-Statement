import React, { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DEPT_DATA   = [{ name:'IT', v:320 },{ name:'Sales', v:195 },{ name:'HR', v:88 },{ name:'Dev', v:210 },{ name:'Ops', v:145 },{ name:'Legal', v:60 }];
const MAINT_DATA  = [{ m:'Jan',i:4 },{ m:'Feb',i:7 },{ m:'Mar',i:5 },{ m:'Apr',i:12 },{ m:'May',i:8 },{ m:'Jun',i:15 },{ m:'Jul',i:6 }];
const STATUS_DATA = [{ name:'Available',v:432,c:'#22C55E' },{ name:'Allocated',v:715,c:'#2563EB' },{ name:'Maint.',v:45,c:'#F59E0B' },{ name:'Reserved',v:38,c:'#8B5CF6' }];
const UTIL_DATA   = [{ name:'IT',pct:85 },{ name:'Sales',pct:67 },{ name:'HR',pct:42 },{ name:'Dev',pct:78 },{ name:'Ops',pct:55 }];

const TT = { contentStyle:{ borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.15)', background:'var(--am-surface)', color:'var(--am-text)' } };

const AMReports = () => {
  const [period, setPeriod] = useState('Q3 2026');

  const handleExport = () => {
    const rows = ['Department,Assets\n', ...DEPT_DATA.map(d=>`${d.name},${d.v}`)];
    const blob = new Blob([rows.join('\n')], { type:'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `AssetFlow_Report_${Date.now()}.csv`; a.click();
  };

  return (
    <div className="am-page">
      <div className="am-page-header">
        <div><h1 className="am-page-title">Reports & Analytics</h1><p className="am-page-subtitle">Asset utilization, maintenance trends and performance metrics.</p></div>
        <div className="am-header-actions">
          <select className="am-form-control" style={{width:130}} value={period} onChange={e=>setPeriod(e.target.value)}>
            {['Q3 2026','Q2 2026','Q1 2026'].map(p=><option key={p}>{p}</option>)}
          </select>
          <button className="am-btn am-btn-outline" onClick={handleExport}><Download size={16}/> Export CSV</button>
        </div>
      </div>

      {/* KPI summary */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          { label:'Asset Utilization', value:'72.3%', delta:'↑ 4.2% vs last quarter',  color:'#2563EB' },
          { label:'Avg Maintenance',   value:'8.3 days', delta:'↓ 1.2 days resolved faster', color:'#22C55E' },
          { label:'Idle Assets',       value:'124',   delta:'12 assets unused 60+ days', color:'#F59E0B' },
          { label:'Retirement Due',    value:'10',    delta:'3 assets this quarter',     color:'#EF4444' },
        ].map((k,i)=>(
          <div key={i} className="am-card" style={{padding:'1.25rem',borderLeft:`4px solid ${k.color}`}}>
            <p style={{fontSize:'0.75rem',color:'var(--am-text-muted)',margin:'0 0 6px'}}>{k.label}</p>
            <p style={{fontSize:'1.5rem',fontWeight:800,color:k.color,margin:0}}>{k.value}</p>
            <p style={{fontSize:'0.72rem',color:'var(--am-text-muted)',margin:'4px 0 0'}}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
        {/* Department allocation */}
        <div className="am-card">
          <div className="am-card-header"><h3 className="am-card-title">Department Allocation</h3></div>
          <div style={{padding:'1rem'}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DEPT_DATA} margin={{top:5,right:5,left:-25,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--am-border)"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'var(--am-text-muted)',fontSize:11}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--am-text-muted)',fontSize:11}}/>
                <Tooltip {...TT}/>
                <Bar dataKey="v" fill="#2563EB" radius={[4,4,0,0]} barSize={30}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="am-card">
          <div className="am-card-header"><h3 className="am-card-title">Asset Status Breakdown</h3></div>
          <div style={{padding:'1rem',display:'flex',justifyContent:'center'}}>
            <PieChart width={260} height={220}>
              <Pie data={STATUS_DATA} cx={130} cy={100} innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="v">
                {STATUS_DATA.map((e,i)=><Cell key={i} fill={e.c}/>)}
              </Pie>
              <Tooltip {...TT} formatter={(v,n)=>[v,n]}/>
              <Legend/>
            </PieChart>
          </div>
        </div>

        {/* Maintenance trend */}
        <div className="am-card">
          <div className="am-card-header"><h3 className="am-card-title">Maintenance Incidents (YTD)</h3></div>
          <div style={{padding:'1rem'}}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MAINT_DATA} margin={{top:5,right:5,left:-25,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--am-border)"/>
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fill:'var(--am-text-muted)',fontSize:11}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:'var(--am-text-muted)',fontSize:11}}/>
                <Tooltip {...TT}/>
                <Line type="monotone" dataKey="i" stroke="#EF4444" strokeWidth={3} dot={{r:4,fill:'#EF4444',stroke:'#fff',strokeWidth:2}} activeDot={{r:6}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization by dept */}
        <div className="am-card">
          <div className="am-card-header"><h3 className="am-card-title">Utilization % by Department</h3></div>
          <div style={{padding:'1rem'}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={UTIL_DATA} margin={{top:5,right:5,left:-25,bottom:5}} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--am-border)"/>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill:'var(--am-text-muted)',fontSize:11}} unit="%"/>
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill:'var(--am-text-muted)',fontSize:11}} width={45}/>
                <Tooltip {...TT} formatter={v=>[`${v}%`,'Utilization']}/>
                <Bar dataKey="pct" fill="#22C55E" radius={[0,4,4,0]} barSize={18}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div className="am-card">
        <div className="am-card-header"><h3 className="am-card-title am-text-danger">⚠ Action Required</h3></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',padding:'1.25rem 1.5rem'}}>
          <div>
            <h4 style={{fontSize:'0.875rem',fontWeight:700,color:'var(--am-danger)',marginBottom:'0.5rem'}}>Idle Assets (&gt;60 days)</h4>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              {['Camera AF-0301 — Unused 72 days','Chair AF-0410 — Unused 45 days','Laptop AF-0020 — Unused 61 days'].map((i,idx)=>(
                <li key={idx} style={{fontSize:'0.82rem',color:'var(--am-text-muted)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'var(--am-danger)',flexShrink:0}}/>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{fontSize:'0.875rem',fontWeight:700,color:'var(--am-warning)',marginBottom:'0.5rem'}}>Retirement / Service Due</h4>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              {['Forklift AF-0087 — Service due in 5 days','Laptop AF-0020 — 4 yrs old, nearing retirement','Van AF-0201 — Annual inspection overdue'].map((i,idx)=>(
                <li key={idx} style={{fontSize:'0.82rem',color:'var(--am-text-muted)',display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:'var(--am-warning)',flexShrink:0}}/>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMReports;
