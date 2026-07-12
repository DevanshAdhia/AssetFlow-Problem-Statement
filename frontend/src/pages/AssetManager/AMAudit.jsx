import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const ASSETS = [
  { id:'A001', tag:'AF-001', name:'Dell XPS 15',     expected:'IT Dept',      reported:'IT Dept',      status:'Verified' },
  { id:'A002', tag:'AF-045', name:'Sony 4K Monitor', expected:'Finance Dept', reported:'Storage Room', status:'Discrepancy' },
  { id:'A003', tag:'AF-102', name:'MacBook Pro',     expected:'Sales Dept',   reported:'Sales Dept',   status:'Verified' },
  { id:'A004', tag:'AF-088', name:'Projector',       expected:'Conf Room B',  reported:'Unknown',      status:'Missing' },
  { id:'A005', tag:'AF-201', name:'Delivery Van',    expected:'Parking Lot',  reported:'Parking Lot',  status:'Verified' },
];

const BADGE = { Verified:'am-badge-available', Discrepancy:'am-badge-maintenance', Missing:'am-badge-lost' };

const AMAudit = () => {
  const [assets, setAssets] = useState(ASSETS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [detail, setDetail] = useState(null);

  const verified    = assets.filter(a=>a.status==='Verified').length;
  const discrepancy = assets.filter(a=>a.status==='Discrepancy').length;
  const missing     = assets.filter(a=>a.status==='Missing').length;

  const filtered = assets.filter(a=>{
    const matchSearch = a.tag.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==='All' || a.status===filter;
    return matchSearch && matchFilter;
  });

  const handleResolve = (id) => {
    setAssets(p=>p.map(a=>a.id===id ? {...a,status:'Verified',reported:a.expected} : a));
    setDetail(null);
  };

  return (
    <div className="am-page">
      {detail && (
        <div className="am-modal-overlay" onClick={()=>setDetail(null)}>
          <div className="am-modal" onClick={e=>e.stopPropagation()}>
            <div className="am-modal-header">
              <h2 className="am-modal-title">Audit Detail — {detail.tag}</h2>
              <button className="am-close-btn" onClick={()=>setDetail(null)}><X size={18}/></button>
            </div>
            <div className="am-modal-body" style={{display:'flex',flexDirection:'column',gap:'0.85rem'}}>
              <div style={{display:'grid',gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',gap:'0.75rem'}}>
                {[['Asset Name',detail.name],['Asset Tag',detail.tag],['Expected Location',detail.expected],['Reported Location',detail.reported]].map(([l,v])=>(
                  <div key={l}><p style={{fontSize:'0.75rem',color:'var(--am-text-muted)',margin:'0 0 3px'}}>{l}</p><p style={{fontWeight:600,margin:0}}>{v}</p></div>
                ))}
              </div>
              <div><p style={{fontSize:'0.75rem',color:'var(--am-text-muted)',margin:'0 0 3px'}}>Status</p><span className={`am-badge-status ${BADGE[detail.status]}`}>{detail.status}</span></div>
            </div>
            <div className="am-modal-footer">
              <button className="am-btn am-btn-outline" onClick={()=>setDetail(null)}>Close</button>
              {detail.status!=='Verified' && <button className="am-btn am-btn-success" onClick={()=>handleResolve(detail.id)}><CheckCircle size={15}/> Mark Resolved</button>}
            </div>
          </div>
        </div>
      )}

      <div className="am-page-header">
        <div><h1 className="am-page-title">Asset Audit</h1><p className="am-page-subtitle">Verify asset locations and resolve discrepancies.</p></div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <button className="am-btn am-btn-outline" onClick={(e) => {
              const menu = e.currentTarget.nextElementSibling;
              menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }}>
              <Download size={16}/> Export <span style={{fontSize: '0.7rem', marginLeft: '2px'}}>▼</span>
            </button>
            <div className="am-dropdown" style={{ display: 'none', position: 'absolute', top: '100%', right: 0, marginTop: '4px', minWidth: '150px' }}>
              <button className="am-dropdown-item" onClick={(e) => { 
                e.currentTarget.parentElement.style.display = 'none'; 
                const rows = ['Asset ID,Tag,Name,Expected Location,Reported Location,Status', ...filtered.map(a=>`${a.id},${a.tag},"${a.name}","${a.expected}","${a.reported}",${a.status}`)];
                const blob = new Blob([rows.join('\n')], { type:'text/csv' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
                link.download = `Audit_${Date.now()}.csv`; link.click();
              }}>
                <FileText size={15}/> Export CSV
              </button>
              <button className="am-dropdown-item" onClick={(e) => { 
                e.currentTarget.parentElement.style.display = 'none'; 
                const ws = XLSX.utils.json_to_sheet(filtered.map(a => ({
                  'Asset ID': a.id, 'Tag': a.tag, 'Name': a.name, 'Expected Location': a.expected, 'Reported Location': a.reported, 'Status': a.status
                })));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Audit");
                XLSX.writeFile(wb, `Audit_${Date.now()}.xlsx`);
              }}>
                <FileSpreadsheet size={15}/> Export Excel
              </button>
            </div>
          </div>
          <button className="am-btn am-btn-primary"><ShieldCheck size={16}/> Start New Audit Cycle</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
        {[
          { label:'Verified',     value:verified,    color:'var(--am-success)', icon:CheckCircle },
          { label:'Discrepancy',  value:discrepancy, color:'var(--am-warning)', icon:AlertTriangle },
          { label:'Missing',      value:missing,     color:'var(--am-danger)',  icon:X },
        ].map((s,i)=>(
          <div key={i} className="am-card" style={{padding:'1.25rem',display:'flex',alignItems:'center',gap:'1rem',borderLeft:`4px solid ${s.color}`}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.color+'18',color:s.color,display:'flex',alignItems:'center',justifyContent:'center'}}><s.icon size={22}/></div>
            <div><div style={{fontSize:'1.6rem',fontWeight:800,color:s.color}}>{s.value}</div><div style={{fontSize:'0.78rem',color:'var(--am-text-muted)'}}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="am-card">
        <div className="am-card-header">
          <h3 className="am-card-title">Audit Cycle — Q3 2026</h3>
          <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <div className="am-search-bar" style={{width:220}}><Search size={14}/><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <select className="am-form-control" style={{width:140}} value={filter} onChange={e=>setFilter(e.target.value)}>
              {['All','Verified','Discrepancy','Missing'].map(f=><option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div className="am-table-container">
          <table className="am-table">
            <thead><tr><th>Asset ID</th><th>Tag</th><th>Name</th><th>Expected Location</th><th>Reported Location</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id}>
                  <td className="am-font-medium">{a.id}</td>
                  <td className="am-text-primary am-font-medium">{a.tag}</td>
                  <td>{a.name}</td>
                  <td>{a.expected}</td>
                  <td style={{color: a.expected!==a.reported ? 'var(--am-danger)' : 'inherit', fontWeight: a.expected!==a.reported ? 600 : 400}}>{a.reported}</td>
                  <td><span className={`am-badge-status ${BADGE[a.status]}`}>{a.status}</span></td>
                  <td><button className="am-btn am-btn-outline am-btn-xs" onClick={()=>setDetail(a)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AMAudit;
