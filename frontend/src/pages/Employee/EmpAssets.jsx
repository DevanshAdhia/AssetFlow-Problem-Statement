import React, { useState } from 'react';
import { Search, Filter, Box, Eye, Wrench, Undo2, ArrowRightLeft, X, Calendar, Tag, Cpu, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const myAssets = [
  { id: 'AST-1001', name: 'MacBook Pro 16"', category: 'Laptop', brand: 'Apple', model: 'M2 Max', serial: 'FVFXQ2G0Q6LX', date: '2023-01-15', returnDate: '2026-01-15', status: 'Allocated', condition: 'Good', dept: 'Sales' },
  { id: 'AST-1045', name: 'Dell UltraSharp 27"', category: 'Monitor', brand: 'Dell', model: 'U2723QE', serial: 'CN-0JFHW7-72553', date: '2023-02-10', returnDate: 'N/A', status: 'Allocated', condition: 'Excellent', dept: 'Sales' },
  { id: 'AST-2030', name: 'Logitech MX Master 3S', category: 'Accessory', brand: 'Logitech', model: 'MX3S', serial: '2346-LGT-MX3S', date: '2023-03-05', returnDate: 'N/A', status: 'Allocated', condition: 'Good', dept: 'Sales' },
  { id: 'AST-1088', name: 'iPhone 14 Pro', category: 'Mobile', brand: 'Apple', model: '14 Pro 256GB', serial: 'DNPXQ9X4PLK1', date: '2023-06-20', returnDate: '2025-06-20', status: 'In Repair', condition: 'Fair', dept: 'Sales' }
];

const StatusBadge = ({ status }) => {
  const colors = {
    'Allocated': { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
    'In Repair': { bg: 'rgba(245,158,11,0.12)', color: '#d97706' },
    'Available': { bg: 'rgba(37,99,235,0.1)', color: '#2563eb' },
  };
  const s = colors[status] || { bg: '#f1f5f9', color: '#64748b' };
  return <span style={{ padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: s.bg, color: s.color }}>{status}</span>;
};

const EmpAssets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const categories = ['All', ...new Set(myAssets.map(a => a.category))];

  const filtered = myAssets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'All' || a.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Assets</h1>
          <p className="emp-page-subtitle">View and manage the equipment assigned to you.</p>
        </div>
        <div className="emp-header-actions">
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
            <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search assets..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 'auto', fontSize: '0.85rem' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="emp-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                {['Asset Tag', 'Name', 'Category', 'Assigned Date', 'Status', 'Condition', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{asset.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{asset.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.brand} · {asset.model}</div>
                  </td>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{asset.category}</td>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{asset.date}</td>
                  <td style={{ padding: '1rem' }}><StatusBadge status={asset.status} /></td>
                  <td style={{ padding: '1rem' }}>{asset.condition}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-outline btn-sm" title="View Details" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setSelectedAsset(asset)}>
                        <Eye size={13} />
                      </button>
                      <button className="btn btn-outline btn-sm" title="Raise Maintenance" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => navigate('/employee/maintenance')}>
                        <Wrench size={13} />
                      </button>
                      <button className="btn btn-outline btn-sm" title="Return Asset" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => navigate('/employee/returns')}>
                        <Undo2 size={13} />
                      </button>
                      <button className="btn btn-outline btn-sm" title="Transfer Asset" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: 'var(--primary)', borderColor: 'var(--primary)' }} onClick={() => navigate('/employee/transfers')}>
                        <ArrowRightLeft size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
              <Box size={40} strokeWidth={1} />
              <p style={{ margin: 0 }}>No assets match your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Asset Detail Drawer/Modal */}
      {selectedAsset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setSelectedAsset(null)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '560px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">{selectedAsset.name}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedAsset(null)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {[
                  { icon: Tag, label: 'Asset Tag', value: selectedAsset.id },
                  { icon: Cpu, label: 'Serial Number', value: selectedAsset.serial },
                  { icon: Box, label: 'Category', value: selectedAsset.category },
                  { icon: Box, label: 'Brand / Model', value: `${selectedAsset.brand} ${selectedAsset.model}` },
                  { icon: Calendar, label: 'Assigned Date', value: selectedAsset.date },
                  { icon: Calendar, label: 'Expected Return', value: selectedAsset.returnDate },
                  { icon: CheckCircle, label: 'Status', value: selectedAsset.status },
                  { icon: AlertCircle, label: 'Condition', value: selectedAsset.condition },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>{label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                      <Icon size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, color: 'var(--warning)' }} onClick={() => { setSelectedAsset(null); navigate('/employee/maintenance'); }}>
                  <Wrench size={15} /> Raise Maintenance
                </button>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, color: 'var(--danger)' }} onClick={() => { setSelectedAsset(null); navigate('/employee/returns'); }}>
                  <Undo2 size={15} /> Return Asset
                </button>
                <button className="btn btn-outline btn-sm" style={{ flex: 1, color: 'var(--primary)' }} onClick={() => { setSelectedAsset(null); navigate('/employee/transfers'); }}>
                  <ArrowRightLeft size={15} /> Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpAssets;
