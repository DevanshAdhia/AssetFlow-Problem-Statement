import React, { useState } from 'react';
import { Undo2, Plus, Eye, X, Search } from 'lucide-react';

const initialReturns = [
  { id: 'RET-031', asset: 'iPhone 14 Pro', assetId: 'AST-1088', reason: 'Upgrading to new device', condition: 'Fair', status: 'Pending Review', date: 'Oct 10, 2026', comments: 'Minor scratches on the back panel.' },
  { id: 'RET-024', asset: 'Dell Keyboard', assetId: 'AST-3012', reason: 'Keys stopped responding', condition: 'Poor', status: 'Completed', date: 'Sep 01, 2026', comments: '' },
];

const STATUS_STYLE = {
  'Pending Review': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
  Completed: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  Approved: { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
};

const EmpReturns = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewReturn, setViewReturn] = useState(null);
  const [returns, setReturns] = useState(initialReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ asset: 'MacBook Pro 16" (AST-1001)', reason: '', condition: 'Good', returnDate: '', comments: '' });

  const filtered = returns.filter(r =>
    r.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!form.reason) { alert('Please enter a reason for return.'); return; }
    const newReturn = {
      id: `RET-${String(Math.floor(Math.random() * 900 + 32))}`,
      asset: form.asset.split(' (')[0],
      assetId: form.asset.match(/\((.*?)\)/)?.[1] || '',
      reason: form.reason,
      condition: form.condition,
      status: 'Pending Review',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      comments: form.comments,
    };
    setReturns([newReturn, ...returns]);
    setForm({ asset: 'MacBook Pro 16" (AST-1001)', reason: '', condition: 'Good', returnDate: '', comments: '' });
    setShowModal(false);
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Return Requests</h1>
          <p className="emp-page-subtitle">Initiate and track return requests for your assigned assets.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search returns..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={15} /> Return Asset</button>
        </div>
      </div>

      {/* Workflow */}
      <div style={{ background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: '8px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.82rem' }}>
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Return Workflow:</span>
        {['Submit Request', 'Asset Manager Review', 'Approved', 'Asset Returned'].map((step, i, arr) => (
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
                {['Return ID', 'Asset', 'Reason', 'Condition', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const ss = STATUS_STYLE[r.status] || { bg: '#f1f5f9', color: '#64748b' };
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{r.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{r.asset}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.assetId}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', maxWidth: 200 }}>{r.reason}</td>
                    <td style={{ padding: '1rem' }}>{r.condition}</td>
                    <td style={{ padding: '1rem' }}><span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, ...ss }}>{r.status}</span></td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.date}</td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.35rem 0.6rem' }} onClick={() => setViewReturn(r)}><Eye size={13} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
              <Undo2 size={40} strokeWidth={1} /><p style={{ margin: 0 }}>No return requests found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Return Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '530px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Create Return Request</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Asset to Return</label>
                <select className="form-control" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })}>
                  <option>MacBook Pro 16" (AST-1001)</option>
                  <option>Dell UltraSharp 27" (AST-1045)</option>
                  <option>iPhone 14 Pro (AST-1088)</option>
                  <option>Logitech MX Master 3S (AST-2030)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Reason for Return <span style={{ color: 'var(--danger)' }}>*</span></label>
                <textarea className="form-control" rows="3" placeholder="Why are you returning this asset?" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Condition</label>
                  <select className="form-control" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                    {['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Return Date</label>
                  <input type="date" className="form-control" value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Additional Comments</label>
                <textarea className="form-control" rows="2" placeholder="Any additional notes..." value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Return Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewReturn && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setViewReturn(null)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '480px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Return Request — {viewReturn.id}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setViewReturn(null)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              {[{ label: 'Asset', value: `${viewReturn.asset} (${viewReturn.assetId})` }, { label: 'Reason', value: viewReturn.reason }, { label: 'Condition', value: viewReturn.condition }, { label: 'Status', value: viewReturn.status }, { label: 'Date', value: viewReturn.date }, { label: 'Comments', value: viewReturn.comments || '—' }].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '0.9rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.9rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{value}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button className="btn btn-outline" onClick={() => setViewReturn(null)}>Close</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpReturns;
