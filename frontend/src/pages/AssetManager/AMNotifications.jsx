import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Package, Wrench, ArrowRightLeft, Calendar } from 'lucide-react';

const INIT_NOTIFS = [
  { id:1, icon:Package,        color:'#2563EB', title:'Asset Assigned',          msg:'Dell XPS 15 (AF-001) has been assigned to you.',        time:'2 min ago',  read:false, type:'asset' },
  { id:2, icon:CheckCircle,    color:'#22C55E', title:'Transfer Approved',        msg:'Your transfer request for MacBook Pro was approved.',     time:'15 min ago', read:false, type:'transfer' },
  { id:3, icon:Wrench,         color:'#F59E0B', title:'Maintenance Approved',     msg:'Projector AF-009 maintenance request is approved.',      time:'1 hr ago',   read:false, type:'maintenance' },
  { id:4, icon:ArrowRightLeft, color:'#8B5CF6', title:'Return Approved',          msg:'Keyboard AF-031 return has been processed.',             time:'2 hrs ago',  read:true,  type:'transfer' },
  { id:5, icon:AlertCircle,    color:'#EF4444', title:'Audit Alert',              msg:'1 asset (AF-088) is missing from expected location.',    time:'5 hrs ago',  read:true,  type:'audit' },
  { id:6, icon:Calendar,       color:'#0EA5E9', title:'Overdue Return',           msg:'Van AF-201 return is overdue by 2 days.',                time:'Yesterday',  read:true,  type:'asset' },
];

const TABS = ['All', 'Asset', 'Transfer', 'Maintenance', 'Audit'];

const AMNotifications = () => {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [tab, setTab] = useState('All');

  const markAllRead  = () => setNotifs(p=>p.map(n=>({...n,read:true})));
  const markRead     = (id) => setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const deleteNotif  = (id) => setNotifs(p=>p.filter(n=>n.id!==id));

  const filtered = notifs.filter(n=> tab==='All' || n.type.toLowerCase()===tab.toLowerCase());
  const unread   = notifs.filter(n=>!n.read).length;

  return (
    <div className="am-page">
      <div className="am-page-header">
        <div>
          <h1 className="am-page-title am-flex am-gap-2"><Bell size={22}/> Notifications {unread>0 && <span className="am-badge-status am-badge-lost">{unread} new</span>}</h1>
          <p className="am-page-subtitle">Stay updated on asset events, approvals, and alerts.</p>
        </div>
        <button className="am-btn am-btn-outline" onClick={markAllRead}><CheckCircle size={15}/> Mark All Read</button>
      </div>

      <div style={{display:'flex',gap:'0.5rem',borderBottom:'1px solid var(--am-border)',paddingBottom:'0.5rem'}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{background:'none',border:'none',padding:'0.5rem 1rem',fontWeight:600,fontSize:'0.875rem',cursor:'pointer',
              color:tab===t?'var(--am-primary)':'var(--am-text-muted)',
              borderBottom:tab===t?'2px solid var(--am-primary)':'2px solid transparent',transition:'all 0.2s'}}>
            {t}
          </button>
        ))}
      </div>

      <div className="am-card">
        <div style={{display:'flex',flexDirection:'column'}}>
          {filtered.length>0 ? filtered.map((n,i)=>(
            <div key={n.id} onClick={()=>markRead(n.id)}
              style={{display:'flex',gap:'1rem',padding:'1rem 1.5rem',borderBottom:i<filtered.length-1?'1px solid var(--am-border)':'none',background:n.read?'transparent':'rgba(37,99,235,0.03)',cursor:'pointer',transition:'all 0.2s',alignItems:'flex-start'}}>
              <div style={{width:40,height:40,borderRadius:'50%',background:n.color+'18',color:n.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <n.icon size={18}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <h4 style={{fontSize:'0.875rem',fontWeight:n.read?500:700,margin:'0 0 4px',color:'var(--am-text)'}}>{n.title}</h4>
                  <span style={{fontSize:'0.72rem',color:'var(--am-text-muted)',whiteSpace:'nowrap',marginLeft:'1rem'}}>{n.time}</span>
                </div>
                <p style={{fontSize:'0.82rem',color:'var(--am-text-muted)',margin:0}}>{n.msg}</p>
              </div>
              {!n.read && <div style={{width:8,height:8,borderRadius:'50%',background:'var(--am-primary)',flexShrink:0,marginTop:6}}/>}
            </div>
          )) : (
            <div className="am-empty-state"><Bell size={40}/><span>No notifications in this category</span></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AMNotifications;
