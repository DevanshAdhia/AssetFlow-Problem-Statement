import React, { useState } from 'react';
import { CheckSquare, Search, X, CheckCircle, XCircle, Eye, Clock, ChevronDown } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const INIT_REQUESTS = [
  { id:'REQ-0091', employee:'Rohan Mehta',    dept:'Engineering', asset:'Dell XPS 15 Laptop',  priority:'High',   purpose:'Project development workstation', expected:'30 Jul 2026', submitted:'12 Jul 2026, 09:45 AM', status:'Pending' },
  { id:'REQ-0088', employee:'Sneha Kulkarni', dept:'Engineering', asset:'4K Monitor AF-201',    priority:'Medium', purpose:'Dual-monitor setup for design work', expected:'31 Dec 2026', submitted:'12 Jul 2026, 06:30 AM', status:'Pending' },
  { id:'REQ-0085', employee:'Vivek Joshi',    dept:'Engineering', asset:'Wireless Headset',     priority:'Low',    purpose:'Remote calls and meetings',         expected:'30 Sep 2026', submitted:'11 Jul 2026, 04:00 PM', status:'Pending' },
  { id:'REQ-0082', employee:'Divya Nair',     dept:'Engineering', asset:'External SSD 1TB',     priority:'High',   purpose:'Database backup and data storage',  expected:'30 Aug 2026', submitted:'10 Jul 2026, 11:00 AM', status:'Pending' },
  { id:'REQ-0079', employee:'Arjun Nair',     dept:'Engineering', asset:'Ergonomic Chair',      priority:'Medium', purpose:'Long hours WFO support',            expected:'Permanent',    submitted:'09 Jul 2026, 03:15 PM', status:'Approved' },
  { id:'REQ-0075', employee:'Priya Menon',    dept:'Engineering', asset:'Cisco IP Phone',       priority:'Low',    purpose:'Internal communication',            expected:'Permanent',    submitted:'07 Jul 2026, 10:00 AM', status:'Rejected' },
];

const PRIORITY_COLOR = { High:'#dc2626', Medium:'#d97706', Low:'#16a34a' };
const PRIORITY_BG    = { High:'rgba(220,38,38,0.1)', Medium:'rgba(217,119,6,0.1)', Low:'rgba(22,163,74,0.1)' };
const STATUS_BADGE   = { Pending:'dh-badge-pending', Approved:'dh-badge-approved', Rejected:'dh-badge-rejected' };

const TIMELINE = ['Submitted','Under Review','Approved','Completed'];

const DHAllocation = () => {
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');
  const [detail,   setDetail]   = useState(null);
  const [action,   setAction]   = useState(null);  // { req, type:'approve'|'reject' }
  const [notes,    setNotes]    = useState('');
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, color='#16a34a') => { setToast({ msg, color }); setTimeout(() => setToast(null), 4000); };

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    return (r.employee.toLowerCase().includes(q) || r.asset.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) &&
      (filter === 'All' || r.status === filter);
  });

  const handleAction = () => {
    const newStatus = action.type === 'approve' ? 'Approved' : 'Rejected';
    setRequests(p => p.map(r => r.id === action.req.id ? { ...r, status: newStatus } : r));
    showToast(`${action.req.id} ${newStatus} successfully!`, action.type === 'approve' ? '#16a34a' : '#dc2626');
    setAction(null); setNotes('');
  };

  const pending  = requests.filter(r => r.status === 'Pending').length;
  const approved = requests.filter(r => r.status === 'Approved').length;
  const rejected = requests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="dh-page">
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:'1.25rem', right:'1.25rem', zIndex:9999, background:'#1e293b', color:'#fff', padding:'0.85rem 1.25rem', borderRadius:10, display:'flex', alignItems:'center', gap:'0.6rem', boxShadow:'0 8px 24px rgba(0,0,0,.18)', borderLeft:`4px solid ${toast.color}`, minWidth:280 }}>
          <CheckCircle size={16} style={{ color:toast.color, flexShrink:0 }}/>{toast.msg}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="dh-modal-overlay" onClick={() => setDetail(null)}>
          <div className="dh-modal dh-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="dh-modal-header">
              <div>
                <h2 className="dh-modal-title">Allocation Request — {detail.id}</h2>
                <span className={`dh-badge ${STATUS_BADGE[detail.status]}`}>{detail.status}</span>
              </div>
              <button className="dh-close-btn" onClick={() => setDetail(null)}><X size={18}/></button>
            </div>
            <div className="dh-modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
                {[['Request ID',detail.id],['Employee',detail.employee],['Department',detail.dept],['Asset Requested',detail.asset],['Priority',detail.priority],['Expected Return',detail.expected],['Submitted',detail.submitted]].map(([l,v])=>(
                  <div key={l}><p style={{ margin:'0 0 3px', fontSize:'0.75rem', color:'var(--dh-muted)', fontWeight:600 }}>{l}</p><p style={{ margin:0, fontWeight:700 }}>{v}</p></div>
                ))}
                <div style={{ gridColumn:'span 2' }}><p style={{ margin:'0 0 3px', fontSize:'0.75rem', color:'var(--dh-muted)', fontWeight:600 }}>Purpose</p><p style={{ margin:0 }}>{detail.purpose}</p></div>
              </div>
              {/* Timeline */}
              <h4 style={{ fontSize:'0.85rem', fontWeight:700, margin:'0 0 0.75rem' }}>Request Timeline</h4>
              <div style={{ display:'flex', gap:0 }}>
                {TIMELINE.map((step, i) => {
                  const active = i === 0 || (detail.status==='Approved' && i<=2) || (detail.status==='Rejected' && i===1);
                  return (
                    <React.Fragment key={step}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background: active ? '#7c3aed' : '#e5e7eb', color: active ? '#fff' : '#9ca3af', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700 }}>{i+1}</div>
                        <span style={{ fontSize:'0.72rem', marginTop:4, textAlign:'center', color: active ? '#7c3aed' : 'var(--dh-muted)', fontWeight: active ? 700 : 400 }}>{step}</span>
                      </div>
                      {i < TIMELINE.length-1 && <div style={{ flex:1, height:2, background: active && i<2 ? '#7c3aed' : '#e5e7eb', marginTop:15 }}/>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div className="dh-modal-footer">
              {detail.status === 'Pending' && (
                <>
                  <button className="dh-btn dh-btn-danger" onClick={() => { setDetail(null); setAction({ req:detail, type:'reject' }); }}><XCircle size={15}/> Reject</button>
                  <button className="dh-btn dh-btn-success" onClick={() => { setDetail(null); setAction({ req:detail, type:'approve' }); }}><CheckCircle size={15}/> Approve</button>
                </>
              )}
              <button className="dh-btn dh-btn-outline" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirm Modal */}
      {action && (
        <div className="dh-modal-overlay" onClick={() => setAction(null)}>
          <div className="dh-modal" style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>
            <div className="dh-modal-header">
              <h2 className="dh-modal-title">{action.type === 'approve' ? '✅ Approve Request' : '❌ Reject Request'}</h2>
              <button className="dh-close-btn" onClick={() => setAction(null)}><X size={18}/></button>
            </div>
            <div className="dh-modal-body">
              <p style={{ margin:'0 0 1rem', fontSize:'0.875rem' }}>
                You are {action.type === 'approve' ? 'approving' : 'rejecting'} request <strong>{action.req.id}</strong> for <strong>{action.req.employee}</strong> — <em>{action.req.asset}</em>.
              </p>
              <div className="form-group">
                <label style={{ fontSize:'0.82rem', fontWeight:600, display:'block', marginBottom:6 }}>
                  {action.type === 'approve' ? 'Approval Notes (optional)' : 'Rejection Reason *'}
                </label>
                <textarea className="dh-form-control" rows={3} style={{ width:'100%', resize:'vertical' }}
                  placeholder={action.type === 'approve' ? 'Add any notes...' : 'Provide a reason for rejection...'}
                  value={notes} onChange={e => setNotes(e.target.value)}/>
              </div>
            </div>
            <div className="dh-modal-footer">
              <button className="dh-btn dh-btn-outline" onClick={() => setAction(null)}>Cancel</button>
              <button className={`dh-btn ${action.type==='approve'?'dh-btn-success':'dh-btn-danger'}`} onClick={handleAction}>
                {action.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Allocation Requests</h1>
          <p className="dh-page-subtitle">Review and approve asset allocation requests for Engineering department.</p>
        </div>
        <div className="dh-header-actions">
          <span className="dh-badge dh-badge-pending">{pending} Pending</span>
          <span className="dh-badge dh-badge-approved">{approved} Approved</span>
          <span className="dh-badge dh-badge-rejected">{rejected} Rejected</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <div className="dh-search-bar" style={{ flex:1, minWidth:220 }}>
          <Search size={14}/><input placeholder="Search by employee, asset or request ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {['All','Pending','Approved','Rejected'].map(f => (
          <button key={f} className={`dh-btn ${filter===f?'dh-btn-primary':'dh-btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="dh-request-grid">
          {filtered.map(r => (
            <div key={r.id} className="dh-request-card">
              <div className="dh-request-card-header">
                <div>
                  <p style={{ margin:0, fontSize:'0.78rem', color:'var(--dh-muted)', fontWeight:600 }}>{r.id}</p>
                  <h3 style={{ margin:'2px 0 0', fontSize:'0.95rem', fontWeight:700 }}>{r.employee}</h3>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                  <span className={`dh-badge ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                  <span className="dh-badge" style={{ background:PRIORITY_BG[r.priority], color:PRIORITY_COLOR[r.priority] }}>{r.priority}</span>
                </div>
              </div>
              <div className="dh-request-card-body">
                <div className="dh-meta-row"><span>Asset Requested</span><span className="dh-meta-value">{r.asset}</span></div>
                <div className="dh-meta-row"><span>Purpose</span><span className="dh-meta-value" style={{ maxWidth:180, textAlign:'right', fontSize:'0.8rem' }}>{r.purpose}</span></div>
                <div className="dh-meta-row"><span>Expected Return</span><span className="dh-meta-value">{r.expected}</span></div>
                <div className="dh-meta-row"><span>Submitted</span><span className="dh-meta-value">{r.submitted}</span></div>
              </div>
              <div className="dh-request-card-footer">
                <button className="dh-btn dh-btn-xs dh-btn-outline" onClick={() => setDetail(r)}><Eye size={13}/> Details</button>
                {r.status === 'Pending' && (
                  <>
                    <button className="dh-btn dh-btn-xs dh-btn-danger" onClick={() => setAction({ req:r, type:'reject' })}><XCircle size={13}/> Reject</button>
                    <button className="dh-btn dh-btn-xs dh-btn-success" onClick={() => setAction({ req:r, type:'approve' })}><CheckCircle size={13}/> Approve</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dh-empty-state"><CheckSquare size={48}/><strong>No requests found</strong><span>Try adjusting your filters.</span></div>
      )}
    </div>
  );
};

export default DHAllocation;
