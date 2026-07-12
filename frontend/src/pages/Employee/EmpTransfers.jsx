import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Eye, Search, Filter, X } from 'lucide-react';

const transferHistory = [
  { id: 'TRF-015', asset: 'Dell UltraSharp 27" (AST-1045)', to: 'Priya Mehta', dept: 'Marketing', reason: 'Project requirement', status: 'Under Review', date: 'Oct 09, 2026' },
  { id: 'TRF-010', asset: 'iPhone 14 Pro (AST-1088)', to: 'Arun Sharma', dept: 'Engineering', reason: 'Team lead needed mobile device', status: 'Completed', date: 'Aug 15, 2026' },
];

const EmpTransfers = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transferHistory.filter(t =>
    t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Transfer Requests</h1>
          <p className="emp-page-subtitle">Transfer your assigned assets to another employee or department.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search transfers..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={16} /> Filters</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={16} /> Transfer Asset</button>
        </div>
      </div>

      {/* Workflow Banner */}
      <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Transfer Workflow:</span>
        {['Submit Request', 'Dept Head Review', 'Asset Manager Review', 'Transfer Completed'].map((step, i, arr) => (
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
                {['Transfer ID', 'Asset', 'Transfer To', 'Department', 'Reason', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)' }}>{t.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{t.asset}</td>
                  <td style={{ padding: '1rem' }}>{t.to}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t.dept}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t.reason}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: t.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: t.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{t.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-outline btn-sm" style={{ padding: '0.4rem' }}><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="emp-empty-state"><ArrowRightLeft size={40} /><p>No transfer requests found.</p></div>}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="emp-card" style={{ width: '90%', maxWidth: '540px', margin: 0 }}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Create Transfer Request</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div className="form-group mb-3">
                <label className="form-label">Asset to Transfer</label>
                <select className="form-control">
                  <option>MacBook Pro 16" (AST-1001)</option>
                  <option>Dell UltraSharp 27" (AST-1045)</option>
                  <option>iPhone 14 Pro (AST-1088)</option>
                  <option>Logitech MX Master 3S (AST-2030)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Transfer To (Employee)</label>
                  <select className="form-control">
                    <option>Priya Mehta</option>
                    <option>Arun Sharma</option>
                    <option>Kavya Reddy</option>
                    <option>Rohan Joshi</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Department</label>
                  <select className="form-control">
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Reason for Transfer</label>
                <textarea className="form-control" rows="3" placeholder="Explain why this transfer is needed..."></textarea>
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Additional Comments</label>
                <input type="text" className="form-control" placeholder="Any additional notes for reviewer..." />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Submit Transfer Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpTransfers;
