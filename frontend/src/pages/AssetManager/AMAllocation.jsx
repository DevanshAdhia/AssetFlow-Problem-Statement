import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle, X, Send, AlertOctagon, Search, History, Clock, Filter } from 'lucide-react';

const ASSETS = [
  { id:'a1', tag:'AF-001', name:'Dell XPS 15 Laptop',      status:'Available',  location:'Storage A',    condition:'Good', holder:null },
  { id:'a2', tag:'AF-045', name:'Sony 4K Monitor',          status:'Allocated',  location:'IT Floor 2',   condition:'Good', holder:'John Smith' },
  { id:'a3', tag:'AF-102', name:'MacBook Pro M3',           status:'Available',  location:'Storage B',    condition:'New',  holder:null },
  { id:'a4', tag:'AF-088', name:'Conference Projector',     status:'Allocated',  location:'Conf Room B',  condition:'Fair', holder:'Meeting Room C' },
  { id:'a5', tag:'AF-201', name:'Company Delivery Van',     status:'Available',  location:'Parking Lot',  condition:'Good', holder:null },
];

const ALLOCATIONS = [
  { id:1, tag:'AF-002', asset:'ThinkPad T14',      empId:'EMP-1042', person:'John Smith',    dept:'IT',          date:'10/05/2026', approvedBy:'Asset Manager' },
  { id:2, tag:'AF-022', asset:'MacBook Pro M3',    empId:'EMP-1088', person:'Sarah Jenkins', dept:'Sales',       date:'12/06/2026', approvedBy:'Admin' },
  { id:3, tag:'AF-031', asset:'HP Elite Tablet',   empId:'EMP-1105', person:'Michael Chang', dept:'Development', date:'05/01/2026', approvedBy:'Asset Manager' },
];

const DEPTS = ['IT', 'Sales', 'HR', 'Finance', 'Development', 'Operations', 'Legal', 'Marketing'];

const Badge = ({ status }) => {
  const cls = { Available:'am-badge-available', Allocated:'am-badge-allocated', Maintenance:'am-badge-maintenance' };
  return <span className={`am-badge-status ${cls[status] || 'am-badge-reserved'}`}>{status}</span>;
};

const AMAllocation = () => {
  const [tab, setTab] = useState('directory');
  const [assets, setAssets] = useState(ASSETS);
  const [allocations, setAllocations] = useState(ALLOCATIONS);
  const [history, setHistory] = useState([
    { id:1, date:'10/05/2026', action:'AF-002 Allocated to John Smith (IT)', by:'Asset Manager' },
    { id:2, date:'01/06/2026', action:'AF-045 Returned from Finance Dept', by:'Admin' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(assets.find(a=>a.status==='Available'));
  const [form, setForm] = useState({ empId:'', person:'', dept: DEPTS[0], reason:'' });
  const [toast, setToast] = useState(null);

  const getUser = () => { try { const u = JSON.parse(localStorage.getItem('auth_user')); return u?.name||'Asset Manager'; } catch { return 'Asset Manager'; } };

  const showToast = (msg, type='success') => { setToast({msg, type}); setTimeout(()=>setToast(null), 3000); };

  const handleAllocate = (e) => {
    e.preventDefault();
    if (!form.empId || !form.person) return alert('Fill all required fields');
    const asset = assets.find(a=>a.id===selectedAsset.id);
    const newAlloc = { id:Date.now(), tag:asset.tag, asset:asset.name, empId:form.empId, person:form.person, dept:form.dept, date:new Date().toLocaleDateString('en-GB'), approvedBy:getUser() };
    setAllocations(p=>[newAlloc,...p]);
    setAssets(p=>p.map(a=>a.id===asset.id ? {...a, status:'Allocated', holder:form.person} : a));
    setHistory(p=>[{ id:Date.now(), date:new Date().toLocaleDateString('en-GB'), action:`${asset.tag} allocated to ${form.person} (${form.dept})`, by:getUser() }, ...p]);
    setForm({ empId:'', person:'', dept:DEPTS[0], reason:'' });
    setShowModal(false);
    setTab('directory');
    showToast(`${asset.name} successfully allocated to ${form.person}`);
  };

  const handleReturn = (id) => {
    if (!window.confirm('Confirm return of this asset?')) return;
    const alloc = allocations.find(a=>a.id===id);
    setAllocations(p=>p.filter(a=>a.id!==id));
    setAssets(p=>p.map(a=>a.tag===alloc.tag ? {...a, status:'Available', holder:null} : a));
    setHistory(p=>[{ id:Date.now(), date:new Date().toLocaleDateString('en-GB'), action:`${alloc.tag} returned by ${alloc.person}`, by:getUser() }, ...p]);
    showToast(`${alloc.asset} returned to storage`);
  };

  const availableAssets = assets.filter(a=>a.status==='Available');
  const filteredAllocs = allocations.filter(a=>
    a.tag.toLowerCase().includes(search.toLowerCase()) ||
    a.person.toLowerCase().includes(search.toLowerCase()) ||
    a.asset.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="am-page">
      {toast && <div className={`am-toast ${toast.type}`}>{toast.msg}</div>}

      {showModal && (
        <div className="am-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="am-modal" onClick={e=>e.stopPropagation()}>
            <div className="am-modal-header">
              <h2 className="am-modal-title">New Allocation</h2>
              <button className="am-close-btn" onClick={()=>setShowModal(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleAllocate}>
              <div className="am-modal-body" style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div className="am-form-group">
                  <label className="am-form-label">Asset *</label>
                  <select className="am-form-control" value={selectedAsset?.id} onChange={e=>setSelectedAsset(assets.find(a=>a.id===e.target.value))} required>
                    {availableAssets.map(a=><option key={a.id} value={a.id}>{a.tag} — {a.name}</option>)}
                  </select>
                </div>
                {selectedAsset && (
                  <div style={{display:'flex',gap:'1rem',padding:'0.6rem',background:'var(--am-bg)',borderRadius:8,fontSize:'0.8rem',color:'var(--am-text-muted)'}}>
                    <span><strong>Location:</strong> {selectedAsset.location}</span>
                    <span><strong>Condition:</strong> {selectedAsset.condition}</span>
                  </div>
                )}
                <div className="am-form-group">
                  <label className="am-form-label">Approved By</label>
                  <input className="am-form-control" value={getUser()} disabled />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                  <div className="am-form-group">
                    <label className="am-form-label">Employee ID *</label>
                    <input className="am-form-control" placeholder="EMP-1234" value={form.empId} onChange={e=>setForm(p=>({...p,empId:e.target.value}))} required />
                  </div>
                  <div className="am-form-group">
                    <label className="am-form-label">Employee Name *</label>
                    <input className="am-form-control" placeholder="Full name" value={form.person} onChange={e=>setForm(p=>({...p,person:e.target.value}))} required />
                  </div>
                </div>
                <div className="am-form-group">
                  <label className="am-form-label">Department</label>
                  <select className="am-form-control" value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}>
                    {DEPTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="am-form-group">
                  <label className="am-form-label">Purpose / Notes</label>
                  <textarea className="am-form-control" rows={2} placeholder="e.g. New employee onboarding" value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))} />
                </div>
              </div>
              <div className="am-modal-footer">
                <button type="button" className="am-btn am-btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
                <button type="submit" className="am-btn am-btn-primary" disabled={availableAssets.length===0}>
                  <Send size={15}/> Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="am-page-header">
        <div><h1 className="am-page-title">Allocation & Transfer</h1><p className="am-page-subtitle">Manage asset assignments and handle transfer requests.</p></div>
        <div className="am-header-actions">
          <button className="am-btn am-btn-primary" onClick={()=>setShowModal(true)}><ArrowRightLeft size={16}/> New Allocation</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'0.5rem',borderBottom:'1px solid var(--am-border)',paddingBottom:'0.5rem'}}>
        {[['directory','Active Allocations'],['transfer','Transfer Request'],['history','History']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{background:'none',border:'none',padding:'0.5rem 1rem',fontWeight:600,fontSize:'0.875rem',cursor:'pointer',
              color: tab===k ? 'var(--am-primary)' : 'var(--am-text-muted)',
              borderBottom: tab===k ? '2px solid var(--am-primary)' : '2px solid transparent',
              transition:'all 0.2s'}}>
            {l}
          </button>
        ))}
      </div>

      {/* Directory tab */}
      {tab==='directory' && (
        <div className="am-card">
          <div className="am-card-header">
            <h3 className="am-card-title">Current Allocations ({filteredAllocs.length})</h3>
            <div className="am-search-bar" style={{width:260}}>
              <Search size={14}/><input placeholder="Search asset, employee..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>
          <div className="am-table-container">
            <table className="am-table">
              <thead><tr><th>Asset Tag</th><th>Asset</th><th>Emp ID</th><th>Allocated To</th><th>Department</th><th>Date</th><th>Approved By</th><th>Action</th></tr></thead>
              <tbody>
                {filteredAllocs.length>0 ? filteredAllocs.map(a=>(
                  <tr key={a.id}>
                    <td className="am-text-primary am-font-medium">{a.tag}</td>
                    <td className="am-font-medium">{a.asset}</td>
                    <td className="am-text-muted">{a.empId}</td>
                    <td>{a.person}</td>
                    <td><span className="am-badge-status am-badge-reserved">{a.dept}</span></td>
                    <td className="am-text-sm am-text-muted">{a.date}</td>
                    <td className="am-text-sm">{a.approvedBy}</td>
                    <td><button className="am-btn am-btn-outline am-btn-xs" onClick={()=>handleReturn(a.id)}>Return</button></td>
                  </tr>
                )) : <tr><td colSpan={8}><div className="am-empty-state"><CheckCircle size={36}/><span>No active allocations</span></div></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer tab */}
      {tab==='transfer' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
          <div className="am-card">
            <div className="am-card-header"><h3 className="am-card-title">Select Asset</h3></div>
            <div className="am-card-body" style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {assets.map(a=>(
                <div key={a.id} onClick={()=>setSelectedAsset(a)}
                  style={{padding:'0.75rem',borderRadius:8,border:`1px solid ${selectedAsset?.id===a.id ? 'var(--am-primary)' : 'var(--am-border)'}`,cursor:'pointer',background:selectedAsset?.id===a.id?'rgba(37,99,235,0.05)':'var(--am-bg)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div><p style={{margin:0,fontWeight:600,fontSize:'0.875rem'}}>{a.tag} — {a.name}</p><p style={{margin:0,fontSize:'0.78rem',color:'var(--am-text-muted)'}}>{a.location}</p></div>
                    <Badge status={a.status}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="am-card">
            <div className="am-card-header"><h3 className="am-card-title">Transfer Request</h3></div>
            <div className="am-card-body">
              {selectedAsset?.status==='Allocated' ? (
                <div style={{display:'flex',gap:'0.75rem',padding:'0.85rem',borderRadius:8,border:'1px solid var(--am-danger)',background:'rgba(239,68,68,0.05)',marginBottom:'1rem'}}>
                  <AlertOctagon size={20} style={{color:'var(--am-danger)',flexShrink:0}}/>
                  <div><strong style={{color:'var(--am-danger)'}}>Allocation Blocked</strong><p style={{fontSize:'0.8rem',margin:'3px 0 0',color:'var(--am-text-muted)'}}>Return the asset first before transferring.</p></div>
                </div>
              ) : (
                <div style={{display:'flex',gap:'0.75rem',padding:'0.85rem',borderRadius:8,border:'1px solid var(--am-success)',background:'rgba(34,197,94,0.05)',marginBottom:'1rem'}}>
                  <CheckCircle size={20} style={{color:'var(--am-success)',flexShrink:0}}/>
                  <div><strong style={{color:'var(--am-success)'}}>Asset Available</strong><p style={{fontSize:'0.8rem',margin:'3px 0 0',color:'var(--am-text-muted)'}}>This asset is clear for allocation.</p></div>
                </div>
              )}
              <div className="am-form-group"><label className="am-form-label">From (Current Manager)</label><input className="am-form-control" value={getUser()} disabled/></div>
              <div className="am-form-group"><label className="am-form-label">To (Employee / Department)</label><input className="am-form-control" placeholder="Enter destination..." disabled={selectedAsset?.status==='Allocated'}/></div>
              <div className="am-form-group"><label className="am-form-label">Reason</label><textarea className="am-form-control" rows={3} placeholder="Justification..." disabled={selectedAsset?.status==='Allocated'}/></div>
              <button className="am-btn am-btn-primary" style={{width:'100%'}} disabled={selectedAsset?.status==='Allocated'} onClick={()=>setShowModal(true)}>
                <Send size={16}/> Submit Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History tab */}
      {tab==='history' && (
        <div className="am-card">
          <div className="am-card-header"><h3 className="am-card-title am-flex am-gap-2"><History size={16}/> Allocation History</h3></div>
          <div style={{padding:'1rem 1.5rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            {history.map(h=>(
              <div key={h.id} style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:'var(--am-primary)',marginTop:5,flexShrink:0}}/>
                <div style={{padding:'0.7rem 1rem',background:'var(--am-bg)',borderRadius:8,border:'1px solid var(--am-border)',flex:1}}>
                  <p style={{margin:0,fontWeight:500,fontSize:'0.875rem'}}>{h.action}</p>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:'0.75rem',color:'var(--am-text-muted)'}}>
                    <span>{h.date}</span><span>By: {h.by}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AMAllocation;
