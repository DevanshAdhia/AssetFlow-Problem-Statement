import React, { useState } from 'react';
import { Wrench, Plus, X, ChevronRight } from 'lucide-react';

const INIT_TASKS = {
  pending:    [
    { id:1, title:'Projector bulb replacement',  asset:'Projector X-1', tag:'AF-009', priority:'High',   technician:'Raj Kumar',  date:'12/07/2026', notes:'Bulb flickering during presentations' },
    { id:2, title:'Laptop keyboard not working', asset:'ThinkPad T14',  tag:'AF-031', priority:'Medium', technician:'Priya Patel', date:'13/07/2026', notes:'Several keys unresponsive' },
  ],
  approved:   [
    { id:3, title:'AC servicing — server room',  asset:'AC Unit',       tag:'AF-077', priority:'High',   technician:'Anil Verma', date:'11/07/2026', notes:'Annual maintenance due' },
  ],
  inProgress: [
    { id:4, title:'Van engine service',           asset:'Delivery Van',  tag:'AF-201', priority:'Low',    technician:'Ravi Singh', date:'10/07/2026', notes:'Scheduled service' },
  ],
  resolved:   [
    { id:5, title:'Monitor display flickering',   asset:'Dell Monitor',  tag:'AF-045', priority:'Medium', technician:'Meera Nair', date:'08/07/2026', notes:'Replaced display cable' },
  ],
};

const COLS = [
  { key:'pending',    label:'Pending',     color:'var(--am-warning)' },
  { key:'approved',   label:'Approved',    color:'var(--am-primary)' },
  { key:'inProgress', label:'In Progress', color:'var(--am-info,#0EA5E9)' },
  { key:'resolved',   label:'Resolved',    color:'var(--am-success)' },
];

const PRIORITY_STYLE = { High:'am-badge-lost', Medium:'am-badge-maintenance', Low:'am-badge-available' };

const AMMaintenance = () => {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', asset:'', tag:'', priority:'High', technician:'', date:'', notes:'' });

  const moveTask = (taskId, fromCol, toCol) => {
    const task = tasks[fromCol].find(t=>t.id===taskId);
    setTasks(p=>({
      ...p,
      [fromCol]: p[fromCol].filter(t=>t.id!==taskId),
      [toCol]:   [...p[toCol], task],
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newTask = { ...form, id: Date.now() };
    setTasks(p=>({ ...p, pending: [newTask, ...p.pending] }));
    setShowAdd(false);
    setForm({ title:'', asset:'', tag:'', priority:'High', technician:'', date:'', notes:'' });
  };

  const totalCount = Object.values(tasks).flat().length;

  return (
    <div className="am-page">
      {showAdd && (
        <div className="am-modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="am-modal" onClick={e=>e.stopPropagation()}>
            <div className="am-modal-header">
              <h2 className="am-modal-title">New Maintenance Task</h2>
              <button className="am-close-btn" onClick={()=>setShowAdd(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="am-modal-body" style={{display:'flex',flexDirection:'column',gap:'0.85rem'}}>
                <div className="am-form-group"><label className="am-form-label">Issue / Title *</label><input className="am-form-control" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required placeholder="e.g. Screen not turning on"/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                  <div className="am-form-group"><label className="am-form-label">Asset Name</label><input className="am-form-control" value={form.asset} onChange={e=>setForm(p=>({...p,asset:e.target.value}))} placeholder="Dell XPS Laptop"/></div>
                  <div className="am-form-group"><label className="am-form-label">Asset Tag</label><input className="am-form-control" value={form.tag} onChange={e=>setForm(p=>({...p,tag:e.target.value}))} placeholder="AF-001"/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                  <div className="am-form-group"><label className="am-form-label">Priority</label><select className="am-form-control" value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}><option>High</option><option>Medium</option><option>Low</option></select></div>
                  <div className="am-form-group"><label className="am-form-label">Technician</label><input className="am-form-control" value={form.technician} onChange={e=>setForm(p=>({...p,technician:e.target.value}))} placeholder="Technician name"/></div>
                </div>
                <div className="am-form-group"><label className="am-form-label">Target Date</label><input type="date" className="am-form-control" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
                <div className="am-form-group"><label className="am-form-label">Notes</label><textarea className="am-form-control" rows={2} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Additional details..."/></div>
              </div>
              <div className="am-modal-footer">
                <button type="button" className="am-btn am-btn-outline" onClick={()=>setShowAdd(false)}>Cancel</button>
                <button type="submit" className="am-btn am-btn-primary"><Plus size={15}/> Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="am-page-header">
        <div><h1 className="am-page-title">Maintenance Management</h1><p className="am-page-subtitle">Track and manage asset maintenance tasks across all stages.</p></div>
        <button className="am-btn am-btn-primary" onClick={()=>setShowAdd(true)}><Plus size={16}/> New Task</button>
      </div>

      {/* Kanban Board */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',alignItems:'start'}}>
        {COLS.map(col=>(
          <div key={col.key}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <span style={{width:10,height:10,borderRadius:'50%',background:col.color,display:'inline-block'}}/>
                <span style={{fontWeight:700,fontSize:'0.85rem'}}>{col.label}</span>
              </div>
              <span style={{background:'var(--am-bg)',border:'1px solid var(--am-border)',borderRadius:12,padding:'1px 8px',fontSize:'0.75rem',fontWeight:700}}>{tasks[col.key].length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {tasks[col.key].map(task=>(
                <div key={task.id} className="am-card" style={{padding:'1rem',borderTop:`3px solid ${col.color}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem'}}>
                    <h4 style={{fontSize:'0.85rem',fontWeight:700,margin:0,lineHeight:1.3}}>{task.title}</h4>
                    <span className={`am-badge-status ${PRIORITY_STYLE[task.priority]}`}>{task.priority}</span>
                  </div>
                  <p style={{fontSize:'0.78rem',color:'var(--am-text-muted)',margin:'0 0 0.5rem'}}>{task.asset} · {task.tag}</p>
                  <p style={{fontSize:'0.75rem',color:'var(--am-text-muted)',margin:'0 0 0.5rem'}}>👨‍🔧 {task.technician}</p>
                  {task.notes && <p style={{fontSize:'0.75rem',color:'var(--am-text-muted)',margin:'0 0 0.75rem',fontStyle:'italic'}}>"{task.notes}"</p>}
                  {/* Move buttons */}
                  <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
                    {COLS.filter(c=>c.key!==col.key).map(target=>(
                      <button key={target.key} className="am-btn am-btn-outline am-btn-xs" onClick={()=>moveTask(task.id, col.key, target.key)}>
                        → {target.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {tasks[col.key].length===0 && (
                <div style={{background:'var(--am-bg)',border:'2px dashed var(--am-border)',borderRadius:10,padding:'2rem',textAlign:'center',color:'var(--am-text-muted)',fontSize:'0.8rem'}}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AMMaintenance;
