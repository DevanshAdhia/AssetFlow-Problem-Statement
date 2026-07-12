import React, { useState } from 'react';
import { Search, Wrench, Eye, AlertTriangle, Plus, X, CheckCircle } from 'lucide-react';

const initialData = [
  { id: 'MNT-092', asset: 'MacBook Pro 16"', assetId: 'AST-1001', title: 'Battery draining fast', desc: 'Battery discharges within 2 hours even on light usage. Possibly requires replacement.', priority: 'High', status: 'Pending Approval', date: 'Oct 11, 2026' },
  { id: 'MNT-085', asset: 'Logitech MX Master 3S', assetId: 'AST-2030', title: 'Scroll wheel stuck', desc: 'Scroll wheel does not respond smoothly, gets stuck on horizontal scroll.', priority: 'Low', status: 'Resolved', date: 'Sep 25, 2026' },
  { id: 'MNT-081', asset: 'Dell UltraSharp 27"', assetId: 'AST-1045', title: 'Flickering screen on HDMI', desc: 'Screen flickers when connected via HDMI cable, works fine on DisplayPort.', priority: 'Medium', status: 'Technician Assigned', date: 'Sep 10, 2026' }
];

const PRIORITY_STYLE = { High: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' }, Medium: { bg: 'rgba(245,158,11,0.12)', color: '#d97706' }, Low: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' }, Critical: { bg: 'rgba(239,68,68,0.15)', color: '#b91c1c' } };
const STATUS_STYLE = { Resolved: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' }, 'Pending Approval': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' }, 'Technician Assigned': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' }, Cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' } };

const EmpMaintenance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [requests, setRequests] = useState(initialData);
  const [form, setForm] = useState({ asset: 'MacBook Pro 16" (AST-1001)', title: '', desc: '', priority: 'Medium' });

  const filtered = requests.filter(m =>
    m.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.title) { alert('Please enter an issue title.'); return; }
    const newReq = {
      id: `MNT-${String(Math.floor(Math.random() * 900 + 100))}`,
      asset: form.asset.split(' (')[0],
      assetId: form.asset.match(/\((.*?)\)/)?.[1] || '',
      title: form.title,
      desc: form.desc,
      priority: form.priority,
      status: 'Pending Approval',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setRequests([newReq, ...requests]);
    setForm({ asset: 'MacBook Pro 16" (AST-1001)', title: '', desc: '', priority: 'Medium' });
    setShowModal(false);
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Maintenance Requests</h1>
          <p className="emp-page-subtitle">Track and raise maintenance issues for your assigned assets.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search requests..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={15} /> Raise Request</button>
        </div>
      </div>

      <div className="emp-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                {['Request ID', 'Asset', 'Issue Title', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => {
                const ps = PRIORITY_STYLE[req.priority] || {};
                const ss = STATUS_STYLE[req.status] || { bg: '#f1f5f9', color: '#64748b' };
                return (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{req.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{req.asset}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.assetId}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{req.title}</td>
                    <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, ...ps }}>{req.priority}</span></td>
                    <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, ...ss }}>{req.status}</span></td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{req.date}</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.35rem 0.6rem' }} onClick={() => setViewRequest(req)}><Eye size={13} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
              <Wrench size={40} strokeWidth={1} /><p style={{ margin: 0 }}>No maintenance requests found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Raise Request Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '560px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Raise Maintenance Request</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Select Asset</label>
                <select className="form-control" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })}>
                  <option>MacBook Pro 16" (AST-1001)</option>
                  <option>Dell UltraSharp 27" (AST-1045)</option>
                  <option>Logitech MX Master 3S (AST-2030)</option>
                  <option>iPhone 14 Pro (AST-1088)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Issue Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input type="text" className="form-control" placeholder="Brief summary of the issue" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Detailed description of the issue..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Priority Level</label>
                <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <strong>Workflow:</strong> Submit → Pending Approval → Asset Manager Review → Technician Assigned → Resolved
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setViewRequest(null)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '500px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">{viewRequest.id} — {viewRequest.title}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setViewRequest(null)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              {[
                { label: 'Asset', value: `${viewRequest.asset} (${viewRequest.assetId})` },
                { label: 'Priority', value: viewRequest.priority },
                { label: 'Status', value: viewRequest.status },
                { label: 'Date Raised', value: viewRequest.date },
                { label: 'Description', value: viewRequest.desc },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.9rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setViewRequest(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpMaintenance;
