import React, { useState } from 'react';
import { Activity, Search, Download, Filter, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const LOGS = [
  { id:1,  date:'12/07/2026 13:42', user:'Bharat Rathor', module:'Allocation',   action:'Allocated AF-001 to John Smith (IT)',           status:'Success' },
  { id:2,  date:'12/07/2026 12:15', user:'Asset Manager', module:'Asset',        action:'Registered 5 new Dell Monitors',                status:'Success' },
  { id:3,  date:'12/07/2026 11:30', user:'Bharat Rathor', module:'Maintenance',  action:'Approved maintenance for Projector AF-009',     status:'Success' },
  { id:4,  date:'11/07/2026 16:00', user:'System',        module:'Audit',        action:'Scheduled Q3 audit cycle',                     status:'Success' },
  { id:5,  date:'11/07/2026 14:22', user:'Sarah Jenkins', module:'Transfer',     action:'Requested transfer of MacBook Pro to Sales',    status:'Pending' },
  { id:6,  date:'11/07/2026 10:05', user:'Asset Manager', module:'Return',       action:'Processed return of AF-045 (Monitor)',          status:'Success' },
  { id:7,  date:'10/07/2026 09:45', user:'Bharat Rathor', module:'Asset',        action:'Deleted retired asset AF-099',                  status:'Success' },
  { id:8,  date:'10/07/2026 08:30', user:'System',        module:'Notification', action:'Sent overdue return alerts (3 assets)',         status:'Success' },
  { id:9,  date:'09/07/2026 17:11', user:'Michael Chang', module:'Allocation',   action:'Requested allocation of AF-201 to Dev team',   status:'Failed' },
  { id:10, date:'09/07/2026 15:50', user:'Asset Manager', module:'Audit',        action:'Marked AF-088 as discrepancy in Q3 audit',     status:'Success' },
];

const STATUS_STYLE = { Success:'am-badge-available', Failed:'am-badge-lost', Pending:'am-badge-pending' };
const MODULES = ['All', 'Allocation', 'Asset', 'Maintenance', 'Audit', 'Transfer', 'Return', 'Notification'];

const AMActivityLogs = () => {
  const [search, setSearch] = useState('');
  const [module, setModule] = useState('All');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = LOGS.filter(l => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
    const matchModule = module==='All' || l.module===module;
    return matchSearch && matchModule;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const handleExportCSV = () => {
    const rows = ['Date,User,Module,Action,Status', ...filtered.map(l=>`${l.date},${l.user},${l.module},"${l.action}",${l.status}`)];
    const blob = new Blob([rows.join('\n')], { type:'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `ActivityLogs_${Date.now()}.csv`; a.click();
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(l => ({
      Date: l.date, User: l.user, Module: l.module, Action: l.action, Status: l.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activity Logs");
    XLSX.writeFile(wb, `ActivityLogs_${Date.now()}.xlsx`);
  };

  return (
    <div className="am-page">
      <div className="am-page-header">
        <div><h1 className="am-page-title am-flex am-gap-2"><Activity size={22}/> Activity Logs</h1><p className="am-page-subtitle">Chronological record of every system action.</p></div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <button className="am-btn am-btn-outline" onClick={(e) => {
            const menu = e.currentTarget.nextElementSibling;
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
          }}>
            <Download size={16}/> Export <span style={{fontSize: '0.7rem', marginLeft: '2px'}}>▼</span>
          </button>
          <div className="am-dropdown" style={{ display: 'none', position: 'absolute', top: '100%', right: 0, marginTop: '4px', minWidth: '150px' }}>
            <button className="am-dropdown-item" onClick={(e) => { e.currentTarget.parentElement.style.display = 'none'; handleExportCSV(); }}>
              <FileText size={15}/> Export CSV
            </button>
            <button className="am-dropdown-item" onClick={(e) => { e.currentTarget.parentElement.style.display = 'none'; handleExportExcel(); }}>
              <FileSpreadsheet size={15}/> Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="am-card">
        <div className="am-card-header">
          <h3 className="am-card-title">{filtered.length} records found</h3>
          <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <div className="am-search-bar" style={{width:240}}><Search size={14}/><input placeholder="Search user or action..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/></div>
            <select className="am-form-control" style={{width:150}} value={module} onChange={e=>{setModule(e.target.value);setPage(1);}}>
              {MODULES.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div className="am-table-container">
          <table className="am-table">
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Module</th><th>Action</th><th>Status</th></tr>
            </thead>
            <tbody>
              {paginated.length>0 ? paginated.map(l=>(
                <tr key={l.id}>
                  <td className="am-text-sm am-text-muted" style={{whiteSpace:'nowrap'}}>{l.date}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(37,99,235,0.1)',color:'var(--am-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.72rem',fontWeight:700,flexShrink:0}}>
                      {l.user.charAt(0)}
                    </div>
                    <span style={{fontSize:'0.875rem',fontWeight:500}}>{l.user}</span>
                  </div></td>
                  <td><span className="am-badge-status am-badge-reserved">{l.module}</span></td>
                  <td style={{fontSize:'0.875rem',maxWidth:320}}>{l.action}</td>
                  <td><span className={`am-badge-status ${STATUS_STYLE[l.status]}`}>{l.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={5}><div className="am-empty-state"><Activity size={36}/><span>No logs match your filters</span></div></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',borderTop:'1px solid var(--am-border)'}}>
            <span style={{fontSize:'0.82rem',color:'var(--am-text-muted)'}}>Page {page} of {totalPages}</span>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <button className="am-btn am-btn-outline am-btn-sm" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>← Prev</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} className={`am-btn am-btn-sm ${p===page?'am-btn-primary':'am-btn-outline'}`} onClick={()=>setPage(p)}>{p}</button>
              ))}
              <button className="am-btn am-btn-outline am-btn-sm" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AMActivityLogs;
