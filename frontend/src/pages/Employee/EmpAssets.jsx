import React, { useState } from 'react';
import { Search, Filter, Box, Eye, Wrench, Undo2, ArrowRightLeft } from 'lucide-react';

const myAssets = [
  { id: 'AST-1001', name: 'MacBook Pro 16"', category: 'Laptop', brand: 'Apple', model: 'M2 Max', date: '2023-01-15', returnDate: '2026-01-15', status: 'Allocated', condition: 'Good' },
  { id: 'AST-1045', name: 'Dell UltraSharp 27"', category: 'Monitor', brand: 'Dell', model: 'U2723QE', date: '2023-02-10', returnDate: 'N/A', status: 'Allocated', condition: 'Excellent' },
  { id: 'AST-2030', name: 'Logitech MX Master 3S', category: 'Accessory', brand: 'Logitech', model: 'MX3S', date: '2023-03-05', returnDate: 'N/A', status: 'Allocated', condition: 'Good' },
  { id: 'AST-1088', name: 'iPhone 14 Pro', category: 'Mobile', brand: 'Apple', model: '14 Pro 256GB', date: '2023-06-20', returnDate: '2025-06-20', status: 'In Repair', condition: 'Fair' }
];

const EmpAssets = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = myAssets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Assets</h1>
          <p className="emp-page-subtitle">View and manage the equipment assigned to you.</p>
        </div>
        <div className="emp-header-actions">
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline btn-sm"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="emp-card">
        <div className="table-container">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Asset Tag</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Date</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Condition</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)' }}>{asset.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{asset.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.brand} {asset.model}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{asset.category}</td>
                  <td style={{ padding: '1rem' }}>{asset.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: asset.status === 'Allocated' ? 'var(--bg-success-light, rgba(34,197,94,0.1))' : 'var(--bg-warning-light, rgba(245,158,11,0.1))',
                      color: asset.status === 'Allocated' ? 'var(--success)' : 'var(--warning)'
                    }}>
                      {asset.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{asset.condition}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.4rem' }}><Eye size={14} /></button>
                      <button className="btn btn-outline btn-sm" title="Raise Maintenance" style={{ padding: '0.4rem', color: 'var(--warning)' }}><Wrench size={14} /></button>
                      <button className="btn btn-outline btn-sm" title="Return Request" style={{ padding: '0.4rem', color: 'var(--danger)' }}><Undo2 size={14} /></button>
                      <button className="btn btn-outline btn-sm" title="Transfer Request" style={{ padding: '0.4rem', color: 'var(--primary)' }}><ArrowRightLeft size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="emp-empty-state">
              <Box size={40} />
              <p>No assets found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpAssets;
