import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Edit2, Trash2, QrCode, Download, 
  MoreHorizontal, Eye, Box, FileText, Image as ImageIcon
} from 'lucide-react';
import '../Admin/Assets/Assets.css';
import './AssetManagerAssets.css';

const initialAssets = [
  { id: 1, tag: 'AF-001', name: 'Dell XPS 15 Laptop', brand: 'Dell', category: 'Electronics', status: 'Allocated', location: 'IT Dept (Floor 2)', cost: '$1,500' },
  { id: 2, tag: 'AF-045', name: 'Sony 4K Monitor', brand: 'Sony', category: 'Electronics', status: 'Available', location: 'Storage Room A', cost: '$400' },
  { id: 3, tag: 'AF-102', name: 'Ergonomic Office Chair', brand: 'Herman Miller', category: 'Furniture', status: 'In Repair', location: 'Maintenance Bay', cost: '$900' }
];

const AssetManagerAssets = () => {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('am_assets');
    return saved ? JSON.parse(saved) : initialAssets;
  });

  useEffect(() => {
    localStorage.setItem('am_assets', JSON.stringify(assets));
  }, [assets]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '', category: 'Electronics', department: '', brand: '', model: '',
    serial: '', manufacturer: '', purchaseDate: '', warranty: '', cost: '', 
    supplier: '', location: '', description: '', isShared: false, isBookable: false
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset.id);
    setNewAssetName(asset.name);
    setNewAssetBrand(asset.brand || '');
    setNewAssetCategory(asset.category);
    setNewAssetLocation(asset.location);
    setNewAssetStatus(asset.status);
    setNewAssetCost(asset.cost ? asset.cost.replace('$', '').replace(',', '') : '');
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="status-badge bg-success-light text-success border-success">Available</span>;
      case 'Allocated': return <span className="status-badge bg-primary-light text-primary border-primary">Allocated</span>;
      case 'In Repair': return <span className="status-badge bg-warning-light text-warning border-warning">In Repair</span>;
      default: return <span className="status-badge bg-gray-light text-muted border-gray">{status}</span>;
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Asset name is required');
    const newAsset = {
      id: Date.now(),
      tag: `AF-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`,
      name: formData.name,
      brand: formData.brand || 'N/A',
      category: formData.category,
      status: 'Available',
      location: formData.location || 'Unassigned',
      cost: formData.cost || '$0'
    };
    setAssets([newAsset, ...assets]);
    setShowModal(false);
  };

  return (
    <div className="assets-page" style={{ padding: '1.5rem', width: '100%' }}>
      <div className="page-header flex-between mb-4">
        <div>
          <h1>Asset Directory</h1>
          <p className="text-muted">Comprehensive inventory of all organizational assets.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline"><Download size={18} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Register Asset
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header filters-header">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search by tag, name, or serial..." />
            <button className="icon-btn qr-btn" title="Scan QR Code"><QrCode size={16}/></button>
          </div>
          
          <div className="filter-group">
            <select className="form-control filter-select">
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
            </select>
            <select className="form-control filter-select">
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
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
              {assets.map(asset => (
                <tr key={asset.id}>
                  <td className="font-medium text-primary">{asset.tag}</td>
                  <td className="font-medium">{asset.name}</td>
                  <td className="text-muted">{asset.category}</td>
                  <td>{getStatusBadge(asset.status)}</td>
                  <td>{asset.location}</td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="icon-btn" title="View Details"><Eye size={16}/></button>
                      <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEdit(asset)}><Edit2 size={16}/></button>
                      <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(asset.id)}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header border-bottom pb-3">
              <h2 className="text-xl">Register New Asset</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <div className="modal-body custom-scrollbar" style={{maxHeight: '70vh', overflowY: 'auto', padding: '1.5rem 0'}}>
              <form id="assetRegistrationForm" onSubmit={handleRegister}>
                <h3 className="text-sm font-bold text-primary mb-3">Basic Information</h3>
                <div className="grid-form col-3 mb-4">
                  <div className="form-group">
                    <label className="form-label">Asset Name *</label>
                    <input type="text" className="form-control" placeholder="e.g. ThinkPad T14" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Electronics</option><option>Furniture</option><option>Vehicles</option><option>Software</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asset Tag (Auto-generated)</label>
                    <input type="text" className="form-control bg-gray-light" value="AF-***" disabled />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-primary mb-3">Specifications & Identity</h3>
                <div className="grid-form col-3 mb-4">
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input type="text" className="form-control" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model</label>
                    <input type="text" className="form-control" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Serial Number</label>
                    <input type="text" className="form-control" value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})} />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-primary mb-3">Purchase & Location Info</h3>
                <div className="grid-form col-3 mb-4">
                  <div className="form-group">
                    <label className="form-label">Purchase Date</label>
                    <input type="date" className="form-control" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost ($)</label>
                    <input type="text" className="form-control" placeholder="0.00" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Location</label>
                    <input type="text" className="form-control" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>
                
                <h3 className="text-sm font-bold text-primary mb-3">Permissions & Media</h3>
                <div className="grid-form col-2 mb-4">
                  <div className="form-group flex-align-center gap-2">
                    <input type="checkbox" id="isShared" checked={formData.isShared} onChange={e => setFormData({...formData, isShared: e.target.checked})} />
                    <label htmlFor="isShared" className="m-0">Shared Asset (Multiple Users)</label>
                  </div>
                  <div className="form-group flex-align-center gap-2">
                    <input type="checkbox" id="isBookable" checked={formData.isBookable} onChange={e => setFormData({...formData, isBookable: e.target.checked})} />
                    <label htmlFor="isBookable" className="m-0">Bookable Resource (Rooms/Equip)</label>
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="media-uploads flex gap-3">
                  <button type="button" className="btn btn-outline border-dashed flex-1 flex-center py-4"><ImageIcon size={24} className="mr-2 text-muted"/> Upload Asset Image</button>
                  <button type="button" className="btn btn-outline border-dashed flex-1 flex-center py-4"><FileText size={24} className="mr-2 text-muted"/> Upload Invoice / Docs</button>
                </div>

              </form>
            </div>
            
            <div className="modal-footer pt-3 border-top flex gap-2">
              <button type="submit" form="assetRegistrationForm" className="btn btn-primary flex-1">Register Asset</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagerAssets;
