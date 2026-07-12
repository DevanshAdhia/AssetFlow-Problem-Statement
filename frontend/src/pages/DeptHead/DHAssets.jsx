import React, { useState, useRef } from 'react';
import { Search, Filter, Download, Eye, Edit2, X, Package, FileText, FileSpreadsheet, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import '../../layouts/DeptHeadLayout.css';

const ASSETS = [
  { id:1, tag:'AF-001', name:'Dell XPS 15 Laptop',    category:'Electronics', employee:'Rohan Mehta',    location:'Desk 3A', condition:'Good',      status:'Allocated',   updated:'12 Jul 2026' },
  { id:2, tag:'AF-022', name:'MacBook Pro 14"',        category:'Electronics', employee:'Sneha Kulkarni', location:'Desk 2B', condition:'Excellent',  status:'Allocated',   updated:'10 Jul 2026' },
  { id:3, tag:'AF-045', name:'4K Monitor',             category:'Electronics', employee:'—',              location:'Storage', condition:'Good',       status:'Available',   updated:'08 Jul 2026' },
  { id:4, tag:'AF-063', name:'Ergonomic Chair',        category:'Furniture',   employee:'Vivek Joshi',    location:'Desk 5C', condition:'Fair',       status:'Allocated',   updated:'05 Jul 2026' },
  { id:5, tag:'AF-078', name:'Projector Epson EB-X',  category:'Electronics', employee:'—',              location:'Conf A',  condition:'Good',       status:'Available',   updated:'01 Jul 2026' },
  { id:6, tag:'AF-091', name:'Standing Desk',          category:'Furniture',   employee:'Divya Nair',     location:'Desk 1A', condition:'Excellent',  status:'Allocated',   updated:'28 Jun 2026' },
  { id:7, tag:'AF-102', name:'Cisco IP Phone',         category:'Telecom',     employee:'Arjun Nair',     location:'Desk 4B', condition:'Good',       status:'Allocated',   updated:'25 Jun 2026' },
  { id:8, tag:'AF-115', name:'HP LaserJet Printer',   category:'Electronics', employee:'—',              location:'Print Bay',condition:'In Repair', status:'Maintenance', updated:'20 Jun 2026' },
  { id:9, tag:'AF-130', name:'External SSD 1TB',       category:'Electronics', employee:'Rohan Mehta',    location:'Desk 3A', condition:'Excellent',  status:'Allocated',   updated:'18 Jun 2026' },
  { id:10,tag:'AF-144', name:'Wireless Headset',       category:'Electronics', employee:'Sneha Kulkarni', location:'Desk 2B', condition:'Good',       status:'Allocated',   updated:'15 Jun 2026' },
];

const STATUS_BADGE = {
  Allocated:   'dh-badge-allocated',
  Available:   'dh-badge-available',
  Maintenance: 'dh-badge-maintenance',
  Reserved:    'dh-badge-info',
};
const CONDITION_COLOR = { Excellent:'#16a34a', Good:'#2563eb', Fair:'#d97706', 'In Repair':'#dc2626' };

const DHAssets = () => {
  const [assets] = useState(ASSETS);
  const [search, setSearch]  = useState('');
  const [catFilter, setCat]  = useState('All');
  const [statFilter, setStat] = useState('All');
  const [viewAsset, setView] = useState(null);
  const [selected, setSelected] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // table | card

  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (
      (a.tag.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.employee.toLowerCase().includes(q)) &&
      (catFilter  === 'All' || a.category === catFilter) &&
      (statFilter === 'All' || a.status   === statFilter)
    );
  });

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const allSelected = filtered.length > 0 && filtered.every(a => selected.includes(a.id));

  const exportCSV = () => {
    const rows = ['Asset Tag,Name,Category,Assigned To,Location,Condition,Status', ...filtered.map(a=>`${a.tag},"${a.name}",${a.category},"${a.employee}","${a.location}",${a.condition},${a.status}`)];
    const blob = new Blob([rows.join('\n')], { type:'text/csv' });
    const l = document.createElement('a'); l.href = URL.createObjectURL(blob);
    l.download = `DeptAssets_${Date.now()}.csv`; l.click();
  };
  const exportXLS = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(a => ({ 'Asset Tag':a.tag,'Name':a.name,'Category':a.category,'Assigned To':a.employee,'Location':a.location,'Condition':a.condition,'Status':a.status,'Last Updated':a.updated })));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Dept Assets');
    XLSX.writeFile(wb, `DeptAssets_${Date.now()}.xlsx`);
  };

  return (
    <div className="dh-page">
      {/* View Drawer */}
      {viewAsset && (
        <div className="dh-modal-overlay" onClick={() => setView(null)}>
          <div className="dh-modal" onClick={e => e.stopPropagation()}>
            <div className="dh-modal-header">
              <div>
                <h2 className="dh-modal-title"><Package size={18} style={{ display:'inline', marginRight:8, color:'#7c3aed' }}/>{viewAsset.name}</h2>
                <span style={{ fontSize:'0.78rem', color:'var(--dh-muted)' }}>{viewAsset.tag}</span>
              </div>
              <button className="dh-close-btn" onClick={() => setView(null)}><X size={18}/></button>
            </div>
            <div className="dh-modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
                {[
                  ['Asset Tag', viewAsset.tag], ['Category', viewAsset.category],
                  ['Assigned To', viewAsset.employee || '—'], ['Location', viewAsset.location],
                  ['Condition', viewAsset.condition], ['Last Updated', viewAsset.updated],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p style={{ margin:'0 0 3px', fontSize:'0.75rem', color:'var(--dh-muted)', fontWeight:600 }}>{l}</p>
                    <p style={{ margin:0, fontWeight:700 }}>{v}</p>
                  </div>
                ))}
                <div style={{ gridColumn:'span 2' }}>
                  <p style={{ margin:'0 0 3px', fontSize:'0.75rem', color:'var(--dh-muted)', fontWeight:600 }}>Status</p>
                  <span className={`dh-badge ${STATUS_BADGE[viewAsset.status]||'dh-badge-info'}`}>{viewAsset.status}</span>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ marginTop:'1.5rem' }}>
                <h4 style={{ fontSize:'0.85rem', fontWeight:700, margin:'0 0 0.75rem' }}>Asset Timeline</h4>
                {[
                  { action:'Allocated to '+viewAsset.employee, date:viewAsset.updated, status:'Allocated' },
                  { action:'Condition check passed', date:'01 Jun 2026', status:'Verified' },
                  { action:'Registered in system', date:'15 Jan 2026', status:'Registered' },
                ].map((t,i) => (
                  <div key={i} className="dh-timeline-item">
                    <div className="dh-timeline-dot" style={{ background:'rgba(124,58,237,0.1)', color:'#7c3aed' }}>
                      <Clock size={15}/>
                    </div>
                    <div>
                      <p style={{ margin:0, fontSize:'0.82rem', fontWeight:600 }}>{t.action}</p>
                      <span style={{ fontSize:'0.72rem', color:'var(--dh-muted)' }}>{t.date} · {t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dh-modal-footer">
              <button className="dh-btn dh-btn-outline" onClick={() => setView(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Department Assets</h1>
          <p className="dh-page-subtitle">{filtered.length} of {assets.length} assets shown · Engineering Department</p>
        </div>
        <div className="dh-header-actions">
          {/* Export */}
          <div style={{ position:'relative', zIndex:10 }}>
            <button className="dh-btn dh-btn-outline" onClick={e => {
              const m = e.currentTarget.nextElementSibling;
              m.style.display = m.style.display==='block'?'none':'block';
            }}><Download size={15}/> Export ▾</button>
            <div className="dh-dropdown" style={{ display:'none', position:'absolute', top:'100%', right:0, marginTop:4, minWidth:150 }}>
              <button className="dh-dropdown-item" onClick={() => { exportCSV(); }}><FileText size={14}/> Export CSV</button>
              <button className="dh-dropdown-item" onClick={() => { exportXLS(); }}><FileSpreadsheet size={14}/> Export Excel</button>
            </div>
          </div>
        </div>
      </div>

      <div className="dh-card">
        {/* Filters */}
        <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--dh-border)', display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap' }}>
          <div className="dh-search-bar" style={{ minWidth:240 }}>
            <Search size={14}/><input placeholder="Search name, tag, or employee..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="dh-form-control" value={catFilter} onChange={e=>setCat(e.target.value)}>
            <option value="All">All Categories</option>
            <option>Electronics</option><option>Furniture</option><option>Telecom</option>
          </select>
          <select className="dh-form-control" value={statFilter} onChange={e=>setStat(e.target.value)}>
            <option value="All">All Statuses</option>
            <option>Allocated</option><option>Available</option><option>Maintenance</option>
          </select>
          {selected.length > 0 && (
            <span style={{ marginLeft:'auto', fontSize:'0.82rem', color:'var(--dh-muted)' }}>{selected.length} selected</span>
          )}
        </div>

        <div className="dh-table-container">
          <table className="dh-table">
            <thead>
              <tr>
                <th style={{ width:40 }}><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : filtered.map(a=>a.id))}/></th>
                <th>Asset Tag</th><th>Asset Name</th><th>Category</th>
                <th>Assigned Employee</th><th>Location</th><th>Condition</th>
                <th>Status</th><th>Last Updated</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(a => (
                <tr key={a.id}>
                  <td><input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)}/></td>
                  <td style={{ fontWeight:700, color:'#7c3aed' }}>{a.tag}</td>
                  <td style={{ fontWeight:600 }}>{a.name}</td>
                  <td><span className="dh-badge dh-badge-info">{a.category}</span></td>
                  <td>{a.employee}</td>
                  <td style={{ color:'var(--dh-muted)' }}>{a.location}</td>
                  <td><span style={{ fontWeight:600, color:CONDITION_COLOR[a.condition]||'#374151' }}>{a.condition}</span></td>
                  <td><span className={`dh-badge ${STATUS_BADGE[a.status]||'dh-badge-info'}`}>{a.status}</span></td>
                  <td style={{ color:'var(--dh-muted)', fontSize:'0.8rem' }}>{a.updated}</td>
                  <td>
                    <button className="dh-btn dh-btn-xs dh-btn-outline" onClick={() => setView(a)} style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                      <Eye size={13}/> View
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={10}><div className="dh-empty-state"><Package size={40}/><span>No assets found</span></div></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid var(--dh-border)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.82rem', color:'var(--dh-muted)' }}>
          <span>Showing {filtered.length} of {assets.length} assets</span>
          <div style={{ display:'flex', gap:'0.35rem' }}>
            {[1,2,3].map(p => (
              <button key={p} className={`dh-btn dh-btn-xs ${p===1?'dh-btn-primary':'dh-btn-outline'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DHAssets;
