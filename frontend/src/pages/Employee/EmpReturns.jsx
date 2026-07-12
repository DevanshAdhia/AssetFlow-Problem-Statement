import React, { useState } from 'react';
import { Undo2, Plus, Eye, X, Search, Filter } from 'lucide-react';

const returnHistory = [
  { id: 'RET-031', asset: 'iPhone 14 Pro (AST-1088)', reason: 'Upgrading to new device', condition: 'Fair', status: 'Pending Review', date: 'Oct 10, 2026' },
  { id: 'RET-024', asset: 'Dell Keyboard (AST-3012)', reason: 'Keys stopped responding', condition: 'Poor', status: 'Completed', date: 'Sep 01, 2026' },
];

const EmpReturns = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = returnHistory.filter(r =>
    r.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Return Requests</h1>
          <p className="emp-page-subtitle">Initiate and track return requests for your assigned assets.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search returns..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={16} /> Filters</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={16} /> Return Asset</button>
        </div>
      </div>

      {/* Workflow Banner */}
      <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Return Workflow:</span>
        {['Submit Request', 'Asset Manager Review', 'Approved', 'Asset Returned'].map((step, i, arr) => (
          <React.Fragment key={step}>
            <span style={{ background: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 500, color: 'var(--secondary)' }}>{step}</span>
            {i < arr.length - 1 && <span style={{ color: 'var(--border)' }}>→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="emp-card">
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                {['Return ID', 'Asset', 'Reason', 'Condition', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)' }}>{r.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{r.asset}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{r.reason}</td>
                  <td style={{ padding: '1rem' }}>{r.condition}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: r.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: r.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{r.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: '0.4rem' }}><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="emp-empty-state"><Undo2 size={40} /><p>No return requests found.</p></div>}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="emp-card" style={{ width: '90%', maxWidth: '530px', margin: 0 }}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Create Return Request</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div className="form-group mb-3">
                <label className="form-label">Asset to Return</label>
                <select className="form-control">
                  <option>MacBook Pro 16" (AST-1001)</option>
                  <option>Dell UltraSharp 27" (AST-1045)</option>
                  <option>iPhone 14 Pro (AST-1088)</option>
                  <option>Logitech MX Master 3S (AST-2030)</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Reason for Return</label>
                <textarea className="form-control" rows="3" placeholder="Why are you returning this asset?"></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Current Condition</label>
                  <select className="form-control">
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                    <option>Damaged</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Return Date</label>
                  <input type="date" className="form-control" />
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Additional Comments</label>
                <textarea className="form-control" rows="2" placeholder="Any additional notes..."></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Submit Return Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpReturns;
