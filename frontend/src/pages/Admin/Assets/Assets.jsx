import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, QrCode, Download, Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Assets.css';

const initialAssets = [
  { id: 1, tag: 'AF-001', name: 'Dell XPS 15 Laptop', category: 'Electronics', status: 'Allocated', location: 'IT Dept (Floor 2)' },
  { id: 2, name: 'Sony 4K Monitor', tag: 'AF-045', category: 'Electronics', status: 'Available', location: 'Storage Room A' },
  { id: 3, name: 'Ergonomic Office Chair', tag: 'AF-102', category: 'Furniture', status: 'In Repair', location: 'Maintenance Bay' },
  { id: 4, name: 'Conference Projector Y-2', tag: 'AF-088', category: 'Electronics', status: 'Allocated', location: 'Conf Room B' },
  { id: 5, name: 'Company Delivery Van', tag: 'AF-201', category: 'Vehicles', status: 'Available', location: 'Parking Lot 1' }
];

const Assets = () => {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('admin_assets');
    return saved ? JSON.parse(saved) : initialAssets;
  });

  useEffect(() => {
    localStorage.setItem('admin_assets', JSON.stringify(assets));
  }, [assets]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAssetStatus, setNewAssetStatus] = useState('Available');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef(null);

  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Electronics');
  const [newAssetSerial, setNewAssetSerial] = useState('');
  const [newAssetLocation, setNewAssetLocation] = useState('Main HQ - IT Dept');
  const [newAssetAssignee, setNewAssetAssignee] = useState('');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset.id);
    setNewAssetName(asset.name);
    setNewAssetCategory(asset.category);
    setNewAssetLocation(asset.location);
    setNewAssetStatus(asset.status);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!newAssetName) {
      alert("Asset name is required.");
      return;
    }
    
    if (editingId) {
      setAssets(assets.map(a => a.id === editingId ? {
        ...a,
        name: newAssetName,
        category: newAssetCategory,
        status: newAssetStatus,
        location: newAssetLocation
      } : a));
    } else {
      const newId = Date.now();
      const newTag = `AF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const newAsset = {
        id: newId,
        tag: newTag,
        name: newAssetName,
        category: newAssetCategory,
        status: newAssetStatus,
        location: newAssetLocation,
        assignee: newAssetStatus === 'Allocated' ? newAssetAssignee : null
      };
      setAssets([newAsset, ...assets]);
    }
    
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setNewAssetName('');
    setNewAssetSerial('');
    setNewAssetStatus('Available');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="status-badge bg-success-light text-success border-success">Available</span>;
      case 'Allocated': return <span className="status-badge bg-primary-light text-primary border-primary">Allocated</span>;
      case 'In Repair': return <span className="status-badge bg-warning-light text-warning border-warning">In Repair</span>;
      default: return <span className="status-badge bg-gray-light text-muted border-gray">{status}</span>;
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const importedAssets = data.map(row => ({
          id: Date.now() + Math.random(),
          tag: row['Asset Tag'] || row.tag || `AF-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          name: row['Asset Name'] || row.name || 'Unknown Asset',
          category: row['Category'] || row.category || 'Uncategorized',
          status: row['Status'] || row.status || 'Available',
          location: row['Location'] || row.location || 'Unknown'
        }));

        setAssets(prev => [...importedAssets, ...prev]);
        alert(`Successfully imported ${importedAssets.length} assets!`);
      } catch (err) {
        alert("Error parsing file. Please ensure it's a valid Excel or CSV.");
      }
      e.target.value = null; // reset
    };
    reader.readAsBinaryString(file);
  };

  const handleExportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(assets.map(a => ({
      'Asset Tag': a.tag,
      'Asset Name': a.name,
      'Category': a.category,
      'Status': a.status,
      'Location': a.location
    })));
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AssetFlow_Assets_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets.map(a => ({
      'Asset Tag': a.tag,
      'Asset Name': a.name,
      'Category': a.category,
      'Status': a.status,
      'Location': a.location
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, `AssetFlow_Assets_${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowExportMenu(false);
  };

  return (
    <div className="assets-page">
      <div className="page-header flex-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1>Asset Directory</h1>
          <p className="text-muted">Manage all registered physical assets and devices across the organization.</p>
        </div>
        
        <div className="flex gap-2" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            onChange={handleImport} 
          />

          <button className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
            <Upload size={18} /> Import Data
          </button>

          <div style={{ position: 'relative' }}>
            <button className="btn btn-outline" onClick={() => setShowExportMenu(!showExportMenu)}>
              <Download size={18} /> Export <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>▼</span>
            </button>
            {showExportMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 100, minWidth: '180px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                <div 
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                  onClick={handleExportExcel}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileSpreadsheet size={16} className="text-success" /> Export as Excel
                </div>
                <div 
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }} 
                  onClick={handleExportCSV}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileSpreadsheet size={16} className="text-primary" /> Export as CSV
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" onClick={() => { setEditingId(null); setShowModal(true); }}>
            <Plus size={18} /> Register Asset
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header filters-header">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search by Tag, Name, Serial or QR Code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="icon-btn qr-btn" title="Scan QR Code"><QrCode size={16}/></button>
          </div>
          
          <div className="filter-group">
            <select className="form-control filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Vehicles">Vehicles</option>
            </select>
            <select className="form-control filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="In Repair">In Repair</option>
            </select>
            <button className="btn btn-outline filter-btn">
              <Filter size={16} /> Advanced
            </button>
          </div>
        </div>

        <div className="table-container mt-3">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td className="font-medium text-primary">{asset.tag}</td>
                  <td className="font-medium">{asset.name}</td>
                  <td className="text-muted">{asset.category}</td>
                  <td>{getStatusBadge(asset.status)}</td>
                  <td>{asset.location}</td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" title="Edit Asset" onClick={() => handleEdit(asset)}><Edit2 size={16}/></button>
                      <button className="icon-btn delete-btn" title="Delete Asset" onClick={() => handleDelete(asset.id)}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No assets found matching the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Asset' : 'Register New Asset'}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="grid-form">
                <div className="form-group">
                  <label className="form-label">Asset Name</label>
                  <input type="text" className="form-control" placeholder="e.g. MacBook Pro M3" value={newAssetName} onChange={e => setNewAssetName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" value={newAssetCategory} onChange={e => setNewAssetCategory(e.target.value)}>
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Vehicles</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Serial Number</label>
                  <input type="text" className="form-control" placeholder="e.g. SN-998822" value={newAssetSerial} onChange={e => setNewAssetSerial(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select className="form-control" value={newAssetLocation} onChange={e => setNewAssetLocation(e.target.value)}>
                    <option>Main HQ - IT Dept</option>
                    <option>Storage Room A</option>
                  </select>
                </div>
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Initial Status</label>
                <select 
                  className="form-control" 
                  value={newAssetStatus}
                  onChange={(e) => setNewAssetStatus(e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Allocated">Allocated</option>
                  <option value="In Repair">In Repair</option>
                </select>
              </div>

              {newAssetStatus === 'Allocated' && (
                <div className="form-group mt-3" style={{ animation: 'fadeIn 0.2s ease' }}>
                  <label className="form-label text-primary">Assign To (Employee / Asset Manager)</label>
                  <select className="form-control border-primary" value={newAssetAssignee} onChange={e => setNewAssetAssignee(e.target.value)}>
                    <option value="">Select recipient...</option>
                    <option value="emp1">Alex Johnson (Dept Head - IT)</option>
                    <option value="emp2">Sarah Smith (Asset Manager - HR)</option>
                    <option value="emp3">Michael Chang (Employee - Dev)</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer mt-4 flex gap-2">
              <button className="btn btn-primary flex-1" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Register Asset'}
              </button>
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
