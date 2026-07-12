import React, { useState } from 'react';
import { Search, Filter, Wrench, Eye, AlertTriangle, Plus, X } from 'lucide-react';

const maintenanceData = [
  { id: 'MNT-092', asset: 'MacBook Pro 16" (AST-1001)', title: 'Battery draining fast', priority: 'High', status: 'Pending Approval', date: 'Oct 11, 2026' },
  { id: 'MNT-085', asset: 'Logitech MX Master (AST-2030)', title: 'Scroll wheel stuck', priority: 'Low', status: 'Resolved', date: 'Sep 25, 2026' },
  { id: 'MNT-081', asset: 'Dell UltraSharp (AST-1045)', title: 'Flickering screen on HDMI', priority: 'Medium', status: 'Technician Assigned', date: 'Sep 10, 2026' }
];

const EmpMaintenance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = maintenanceData.filter(m => 
    m.asset.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Maintenance Requests</h1>
          <p className="emp-page-subtitle">Track and raise maintenance issues for your assigned assets.</p>
        </div>
        <div className="emp-header-actions">
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={16} /> Filters</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Raise Request
          </button>
        </div>
      </div>

      <div className="emp-card">
        <div className="table-container">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Request ID</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Asset</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Issue Title</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)' }}>{req.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{req.asset}</td>
                  <td style={{ padding: '1rem' }}>{req.title}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                      background: req.priority === 'High' ? 'var(--bg-danger-light, rgba(239,68,68,0.1))' : req.priority === 'Medium' ? 'var(--bg-warning-light, rgba(245,158,11,0.1))' : 'var(--bg-success-light, rgba(34,197,94,0.1))',
                      color: req.priority === 'High' ? 'var(--danger)' : req.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                    }}>
                      {req.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                      background: req.status === 'Resolved' ? 'var(--bg-success-light, rgba(34,197,94,0.1))' : 'var(--bg-warning-light, rgba(245,158,11,0.1))',
                      color: req.status === 'Resolved' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{req.date}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.4rem' }}><Eye size={14} /></button>
                      <button className="btn btn-outline btn-sm" title="Track Status" style={{ padding: '0.4rem', color: 'var(--primary)' }}><AlertTriangle size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="emp-empty-state">
              <Wrench size={40} />
              <p>No maintenance requests found.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="emp-card" style={{ width: '90%', maxWidth: '550px', margin: 0 }}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Raise Maintenance Request</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div className="emp-card-body">
              <div className="form-group mb-3">
                <label className="form-label">Select Asset</label>
                <select className="form-control">
                  <option>MacBook Pro 16" (AST-1001)</option>
                  <option>Dell UltraSharp 27" (AST-1045)</option>
                  <option>Logitech MX Master 3S (AST-2030)</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Issue Title</label>
                <input type="text" className="form-control" placeholder="Brief summary of the issue" />
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" placeholder="Detailed description of what went wrong..."></textarea>
              </div>
              <div className="grid-form col-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select className="form-control">
                    <option>Low (Cosmetic/Minor)</option>
                    <option>Medium (Impacting workflow)</option>
                    <option>High (Unable to work)</option>
                    <option>Critical (Safety/Security)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Attachments (Images/Docs)</label>
                  <input type="file" className="form-control" />
                </div>
              </div>
              
              <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <strong>Workflow:</strong> Request will be submitted to the Asset Manager for review. If approved, a technician will be assigned to resolve the issue.
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Submit Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpMaintenance;
