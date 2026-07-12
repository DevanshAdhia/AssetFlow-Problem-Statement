import React, { useState } from 'react';
import { Search, Eye, X, Package, CheckSquare, Clock } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const EMPLOYEES = [
  { id: 'E-001', name: 'Rohan Mehta',     role: 'Senior Software Engineer', email: 'rohan.m@assetflow.com',   phone: '+91 9876543210', status: 'Active', assets: 3 },
  { id: 'E-002', name: 'Sneha Kulkarni',  role: 'UI/UX Designer',           email: 'sneha.k@assetflow.com',   phone: '+91 9876543211', status: 'Active', assets: 2 },
  { id: 'E-003', name: 'Vivek Joshi',     role: 'DevOps Engineer',          email: 'vivek.j@assetflow.com',   phone: '+91 9876543212', status: 'Active', assets: 4 },
  { id: 'E-004', name: 'Divya Nair',      role: 'QA Automation Lead',       email: 'divya.n@assetflow.com',   phone: '+91 9876543213', status: 'Active', assets: 2 },
  { id: 'E-005', name: 'Arjun Nair',      role: 'Software Engineer II',     email: 'arjun.n@assetflow.com',   phone: '+91 9876543214', status: 'On Leave', assets: 1 },
  { id: 'E-006', name: 'Priya Menon',     role: 'Product Manager',          email: 'priya.m@assetflow.com',   phone: '+91 9876543215', status: 'Active', assets: 3 },
];

const MOCK_ASSETS = [
  { tag: 'AF-001', name: 'Dell XPS 15', status: 'Allocated' },
  { tag: 'AF-130', name: 'External SSD 1TB', status: 'Allocated' },
  { tag: 'AF-099', name: 'Wireless Mouse', status: 'Allocated' },
];

const DHEmployees = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewEmp, setViewEmp] = useState(null);

  const filtered = EMPLOYEES.filter(e => {
    const q = search.toLowerCase();
    return (e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)) &&
           (filter === 'All' || e.status === filter);
  });

  return (
    <div className="dh-page">
      {/* Employee Details Drawer */}
      {viewEmp && (
        <div className="dh-modal-overlay" onClick={() => setViewEmp(null)}>
          <div className="dh-modal dh-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="dh-modal-header">
              <h2 className="dh-modal-title flex items-center gap-2">
                <div className="dh-avatar-initials">{viewEmp.name.split(' ').map(w=>w[0]).join('')}</div>
                {viewEmp.name}
              </h2>
              <button className="dh-close-btn" onClick={() => setViewEmp(null)}><X size={18}/></button>
            </div>
            <div className="dh-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div><p style={{ margin: '0 0 3px', fontSize: '0.75rem', color: 'var(--dh-muted)', fontWeight: 600 }}>Employee ID</p><p style={{ margin: 0, fontWeight: 700 }}>{viewEmp.id}</p></div>
                <div><p style={{ margin: '0 0 3px', fontSize: '0.75rem', color: 'var(--dh-muted)', fontWeight: 600 }}>Role</p><p style={{ margin: 0, fontWeight: 700 }}>{viewEmp.role}</p></div>
                <div><p style={{ margin: '0 0 3px', fontSize: '0.75rem', color: 'var(--dh-muted)', fontWeight: 600 }}>Email</p><p style={{ margin: 0 }}>{viewEmp.email}</p></div>
                <div><p style={{ margin: '0 0 3px', fontSize: '0.75rem', color: 'var(--dh-muted)', fontWeight: 600 }}>Phone</p><p style={{ margin: 0 }}>{viewEmp.phone}</p></div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '0.75rem', color: 'var(--dh-muted)', fontWeight: 600 }}>Status</p>
                  <span className={`dh-badge ${viewEmp.status === 'Active' ? 'dh-badge-available' : 'dh-badge-maintenance'}`}>{viewEmp.status}</span>
                </div>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 1rem', borderBottom: '1px solid var(--dh-border)', paddingBottom: '0.5rem' }}>Assigned Assets ({viewEmp.assets})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MOCK_ASSETS.slice(0, viewEmp.assets).map(a => (
                  <div key={a.tag} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--dh-bg)', borderRadius: 8, border: '1px solid var(--dh-border)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Package size={16} style={{ color: 'var(--dh-primary)' }} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{a.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dh-muted)' }}>{a.tag}</p>
                      </div>
                    </div>
                    <span className="dh-badge dh-badge-allocated">{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dh-modal-footer">
              <button className="dh-btn dh-btn-outline" onClick={() => setViewEmp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Employees</h1>
          <p className="dh-page-subtitle">View and manage employees within your department.</p>
        </div>
      </div>

      <div className="dh-card">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--dh-border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="dh-search-bar" style={{ minWidth: 260 }}>
            <Search size={14}/><input placeholder="Search name, role or email..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="dh-form-control" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div className="dh-table-container">
          <table className="dh-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Assets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(e => (
                <tr key={e.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="dh-avatar-initials">{e.name.split(' ').map(w=>w[0]).join('')}</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>{e.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dh-muted)' }}>{e.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{e.role}</td>
                  <td>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>{e.email}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--dh-muted)' }}>{e.phone}</p>
                  </td>
                  <td><span className={`dh-badge ${e.status === 'Active' ? 'dh-badge-available' : 'dh-badge-maintenance'}`}>{e.status}</span></td>
                  <td><span className="dh-badge dh-badge-info">{e.assets} Assets</span></td>
                  <td>
                    <button className="dh-btn dh-btn-xs dh-btn-outline" onClick={() => setViewEmp(e)}>
                      <Eye size={13}/> View Details
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6}><div className="dh-empty-state"><Users size={40}/><span>No employees found</span></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DHEmployees;
