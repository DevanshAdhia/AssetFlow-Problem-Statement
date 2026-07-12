import React, { useState } from 'react';
import { ArrowRightLeft, Search, X, CheckCircle, XCircle, Eye, Clock, ChevronRight } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const INIT = [
  { id:'TRF-0041', asset:'Dell XPS 15 Laptop (AF-001)', curEmp:'Rohan Mehta', tarEmp:'Vivek Joshi', curDept:'Engineering', tarDept:'Engineering', reason:'Project rotation — Vivek needs high-spec laptop for ML workload', requestedBy:'Rohan Mehta', date:'12 Jul 2026', priority:'High', status:'Pending' },
  { id:'TRF-0038', asset:'4K Monitor (AF-045)',          curEmp:'Storage',      tarEmp:'Sneha Kulkarni', curDept:'Engineering', tarDept:'Engineering', reason:'Dual-monitor setup approved for design team', requestedBy:'Sneha Kulkarni', date:'11 Jul 2026', priority:'Medium', status:'Pending' },
  { id:'TRF-0035', asset:'Ergonomic Chair (AF-063)',     curEmp:'Vivek Joshi',  tarEmp:'Arjun Nair',    curDept:'Engineering', tarDept:'Engineering', reason:'Desk reassignment after seating plan change', requestedBy:'HR Admin', date:'09 Jul 2026', priority:'Low', status:'Approved' },
  { id:'TRF-0032', asset:'MacBook Pro (AF-022)',         curEmp:'Sneha Kulkarni', tarEmp:'Divya Nair',  curDept:'Engineering', tarDept:'QA',          reason:'Cross-team testing support', requestedBy:'Divya Nair', date:'07 Jul 2026', priority:'High', status:'Rejected' },
];

const PR_CLR = { High:'#dc2626', Medium:'#d97706', Low:'#16a34a' };
const ST_BADGE = { Pending:'dh-badge-pending', Approved:'dh-badge-approved', Rejected:'dh-badge-rejected' };
const WORKFLOW = ['Pending','Dept Head Review','Approve / Reject','Asset Manager Approval','Transfer Complete'];

const DHTransfers = () => {
  const [items, setItems] = useState(INIT);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [detail, setDetail] = useState(null);
  const [action, setAction] = useState(null);
  const [notes, setNotes]   = useState('');
  const [toast, setToast]   = useState(null);

  const showToast = (msg,c='#16a34a') => { setToast({msg,c}); setTimeout(()=>setToast(null),4000); };

  const filtered = items.filter(r => {
    const q = search.toLowerCase();
    return (r.asset.toLowerCase().includes(q) || r.curEmp.toLowerCase().includes(q) || r.tarEmp.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
      && (filter==='All' || r.status===filter);
  });

  const doAction = () => {
    const s = action.type==='approve' ? 'Approved' : 'Rejected';
    setItems(p => p.map(r => r.id===action.req.id ? {...r,status:s} : r));
    showToast(`${action.req.id} ${s} successfully!`, action.type==='approve'?'#16a34a':'#dc2626');
    setAction(null); setNotes('');
  };

  return (
    <div className="dh-page">
      {toast && (
        <div style={{ position:'fixed',top:'1.25rem',right:'1.25rem',zIndex:9999,background:'#1e293b',color:'#fff',padding:'0.85rem 1.25rem',borderRadius:10,display:'flex',alignItems:'center',gap:'0.6rem',boxShadow:'0 8px 24px rgba(0,0,0,.18)',borderLeft:`4px solid ${toast.c}`,minWidth:280 }}>
          <CheckCircle size={16} style={{color:toast.c,flexShrink:0}}/>{toast.msg}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="dh-modal-overlay" onClick={()=>setDetail(null)}>
          <div className="dh-modal dh-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="dh-modal-header">
              <h2 className="dh-modal-title">Transfer Request — {detail.id}</h2>
              <button className="dh-close-btn" onClick={()=>setDetail(null)}><X size={18}/></button>
            </div>
            <div className="dh-modal-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1.5rem'}}>
                {[['Transfer ID',detail.id],['Asset',detail.asset],['Current Holder',detail.curEmp],['Target Employee',detail.tarEmp],['From Dept',detail.curDept],['To Dept',detail.tarDept],['Requested By',detail.requestedBy],['Request Date',detail.date],['Priority',detail.priority]].map(([l,v])=>(
                  <div key={l}><p style={{margin:'0 0 3px',fontSize:'0.75rem',color:'var(--dh-muted)',fontWeight:600}}>{l}</p><p style={{margin:0,fontWeight:700}}>{v}</p></div>
                ))}
                <div style={{gridColumn:'span 2'}}><p style={{margin:'0 0 3px',fontSize:'0.75rem',color:'var(--dh-muted)',fontWeight:600}}>Reason</p><p style={{margin:0}}>{detail.reason}</p></div>
              </div>
              {/* Workflow */}
              <h4 style={{fontSize:'0.85rem',fontWeight:700,margin:'0 0 0.75rem'}}>Transfer Workflow</h4>
              <div style={{display:'flex',gap:0}}>
                {WORKFLOW.map((step,i)=>{
                  const active = detail.status==='Pending' ? i<=1 : detail.status==='Approved' ? i<=3 : i<=2;
                  return (
                    <React.Fragment key={step}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:active?'#7c3aed':'#e5e7eb',color:active?'#fff':'#9ca3af',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700}}>{i+1}</div>
                        <span style={{fontSize:'0.68rem',marginTop:4,textAlign:'center',color:active?'#7c3aed':'var(--dh-muted)',fontWeight:active?700:400}}>{step}</span>
                      </div>
                      {i<WORKFLOW.length-1 && <div style={{flex:1,height:2,background:active&&i<3?'#7c3aed':'#e5e7eb',marginTop:13}}/>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="dh-modal-footer">
              {detail.status==='Pending' && (
                <>
                  <button className="dh-btn dh-btn-danger" onClick={()=>{setDetail(null);setAction({req:detail,type:'reject'});}}><XCircle size={15}/> Reject</button>
                  <button className="dh-btn dh-btn-success" onClick={()=>{setDetail(null);setAction({req:detail,type:'approve'});}}><CheckCircle size={15}/> Approve</button>
                </>
              )}
              <button className="dh-btn dh-btn-outline" onClick={()=>setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {action && (
        <div className="dh-modal-overlay" onClick={()=>setAction(null)}>
          <div className="dh-modal" style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <div className="dh-modal-header">
              <h2 className="dh-modal-title">{action.type==='approve'?'✅ Approve Transfer':'❌ Reject Transfer'}</h2>
              <button className="dh-close-btn" onClick={()=>setAction(null)}><X size={18}/></button>
            </div>
            <div className="dh-modal-body">
              <p style={{fontSize:'0.875rem',margin:'0 0 1rem'}}>
                {action.type==='approve'?'Approving':'Rejecting'} transfer <strong>{action.req.id}</strong> — <em>{action.req.asset}</em> from <strong>{action.req.curEmp}</strong> to <strong>{action.req.tarEmp}</strong>.
              </p>
              <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>{action.type==='approve'?'Notes (optional)':'Rejection Reason *'}</label>
              <textarea className="dh-form-control" rows={3} style={{width:'100%',resize:'vertical'}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder={action.type==='approve'?'Add notes...':'Reason for rejection...'}/>
            </div>
            <div className="dh-modal-footer">
              <button className="dh-btn dh-btn-outline" onClick={()=>setAction(null)}>Cancel</button>
              <button className={`dh-btn ${action.type==='approve'?'dh-btn-success':'dh-btn-danger'}`} onClick={doAction}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Transfer Requests</h1>
          <p className="dh-page-subtitle">Review inter-department and intra-department asset transfers.</p>
        </div>
      </div>

      <div style={{display:'flex',gap:'0.75rem',marginBottom:'1.25rem',flexWrap:'wrap'}}>
        <div className="dh-search-bar" style={{flex:1,minWidth:220}}>
          <Search size={14}/><input placeholder="Search asset, employee or ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {['All','Pending','Approved','Rejected'].map(f=>(
          <button key={f} className={`dh-btn ${filter===f?'dh-btn-primary':'dh-btn-outline'}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="dh-request-grid">
          {filtered.map(r=>(
            <div key={r.id} className="dh-request-card">
              <div className="dh-request-card-header">
                <div><p style={{margin:0,fontSize:'0.78rem',color:'var(--dh-muted)',fontWeight:600}}>{r.id}</p><h3 style={{margin:'2px 0 0',fontSize:'0.95rem',fontWeight:700}}>{r.asset}</h3></div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                  <span className={`dh-badge ${ST_BADGE[r.status]}`}>{r.status}</span>
                  <span className="dh-badge" style={{background:`${PR_CLR[r.priority]}18`,color:PR_CLR[r.priority]}}>{r.priority}</span>
                </div>
              </div>
              <div className="dh-request-card-body">
                <div className="dh-meta-row"><span>From</span><span className="dh-meta-value">{r.curEmp} ({r.curDept})</span></div>
                <div className="dh-meta-row"><span>To</span><span className="dh-meta-value">{r.tarEmp} ({r.tarDept})</span></div>
                <div className="dh-meta-row"><span>Requested By</span><span className="dh-meta-value">{r.requestedBy}</span></div>
                <div className="dh-meta-row"><span>Date</span><span className="dh-meta-value">{r.date}</span></div>
              </div>
              <div className="dh-request-card-footer">
                <button className="dh-btn dh-btn-xs dh-btn-outline" onClick={()=>setDetail(r)}><Eye size={13}/> Details</button>
                {r.status==='Pending' && (
                  <>
                    <button className="dh-btn dh-btn-xs dh-btn-danger" onClick={()=>setAction({req:r,type:'reject'})}><XCircle size={13}/></button>
                    <button className="dh-btn dh-btn-xs dh-btn-success" onClick={()=>setAction({req:r,type:'approve'})}><CheckCircle size={13}/></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dh-empty-state"><ArrowRightLeft size={48}/><strong>No transfer requests</strong><span>Try adjusting your filters.</span></div>
      )}
    </div>
  );
};

export default DHTransfers;
