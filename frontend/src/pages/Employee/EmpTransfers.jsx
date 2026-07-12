import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Eye, X, Search } from 'lucide-react';

const initialTransfers = [
  { id: 'TRF-015', asset: 'Dell UltraSharp 27"', assetId: 'AST-1045', to: 'Priya Mehta', dept: 'Marketing', reason: 'Project requirement', comments: 'Needed for design workstation setup.', status: 'Under Review', date: 'Oct 09, 2026' },
  { id: 'TRF-010', asset: 'iPhone 14 Pro', assetId: 'AST-1088', to: 'Arun Sharma', dept: 'Engineering', reason: 'Team lead needed mobile device', comments: '', status: 'Completed', date: 'Aug 15, 2026' },
];

const STATUS_STYLE = {
  'Under Review': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  Completed:     { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  Approved:      { bg: 'rgba(37,99,235,0.1)',   color: '#2563eb' },
  Rejected:      { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
};

const EmpTransfers = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewTransfer, setViewTransfer] = useState(null);
  const [transfers, setTransfers] = useState(initialTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ asset: 'MacBook Pro 16" (AST-1001)', to: 'Priya Mehta', dept: 'Engineering', reason: '', comments: '' });

  const filtered = transfers.filter(t =>
    t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.reason) { alert('Please enter a reason for transfer.'); return; }
    const newTransfer = {
      id: `TRF-${String(Math.floor(Math.random() * 900 + 16))}`,
      asset: form.asset.split(' (')[0],
      assetId: form.asset.match(/\((.*?)\)/)?.[1] || '',
      to: form.to,
      dept: form.dept,
      reason: form.reason,
      comments: form.comments,
      status: 'Under Review',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setTransfers([newTransfer, ...transfers]);
    setForm({ asset: 'MacBook Pro 16" (AST-1001)', to: 'Priya Mehta', dept: 'Engineering', reason: '', comments: '' });
    setShowModal(false);
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Transfer Requests</h1>
          <p className="emp-page-subtitle">Transfer your assigned assets to another employee or department.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search transfers..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={15} /> Transfer Asset</button>
        </div>
      </div>

      {/* Workflow */}
      <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.82rem' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Transfer Workflow:</span>
        {['Submit Request', 'Dept Head Review', 'Asset Manager Review', 'Transfer Completed'].map((step, i, arr) => (
          <React.Fragment key={step}>
            <span style={{ background: 'var(--surface)', padding: '0.2rem 0.65rem', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 500 }}>{step}</span>
            {i < arr.length - 1 && <span style={{ color: 'var(--border)' }}>→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="emp-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                {['Transfer ID', 'Asset', 'Transfer To', 'Department', 'Reason', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const ss = STATUS_STYLE[t.status] || { bg: '#f1f5f9', color: '#64748b' };
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{t.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{t.asset}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.assetId}</div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{t.to}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t.dept}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', maxWidth: 160 }}>{t.reason}</td>
                    <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, ...ss }}>{t.status}</span></td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t.date}</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.35rem 0.6rem' }} onClick={() => setViewTransfer(t)}><Eye size={13} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
              <ArrowRightLeft size={40} strokeWidth={1} /><p style={{ margin: 0 }}>No transfer requests found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Transfer Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '540px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Create Transfer Request</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Asset to Transfer</label>
                <select className="form-control" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })}>
                  <option>MacBook Pro 16" (AST-1001)</option>
                  <option>Dell UltraSharp 27" (AST-1045)</option>
                  <option>iPhone 14 Pro (AST-1088)</option>
                  <option>Logitech MX Master 3S (AST-2030)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Transfer To (Employee)</label>
                  <select className="form-control" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}>
                    {['Priya Mehta', 'Arun Sharma', 'Kavya Reddy', 'Rohan Joshi', 'Suresh Kumar'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Department</label>
                  <select className="form-control" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                    {['Engineering', 'Marketing', 'Sales', 'Operations', 'HR'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Reason for Transfer <span style={{ color: 'var(--danger)' }}>*</span></label>
                <textarea className="form-control" rows="3" placeholder="Explain why this transfer is needed..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Additional Comments</label>
                <input type="text" className="form-control" placeholder="Any additional notes..." value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Transfer Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewTransfer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setViewTransfer(null)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '480px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Transfer — {viewTransfer.id}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setViewTransfer(null)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              {[{ label: 'Asset', value: `${viewTransfer.asset} (${viewTransfer.assetId})` }, { label: 'Transfer To', value: viewTransfer.to }, { label: 'Department', value: viewTransfer.dept }, { label: 'Reason', value: viewTransfer.reason }, { label: 'Status', value: viewTransfer.status }, { label: 'Date', value: viewTransfer.date }, { label: 'Comments', value: viewTransfer.comments || '—' }].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.9rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn btn-outline" onClick={() => setViewTransfer(null)}>Close</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpTransfers;
