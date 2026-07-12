import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, QrCode } from 'lucide-react';
import './Assets.css';

const mockAssets = [
  { id: 1, tag: 'AF-001', name: 'Dell XPS 15 Laptop', category: 'Electronics', status: 'Allocated', location: 'IT Dept (Floor 2)' },
  { id: 2, name: 'Sony 4K Monitor', tag: 'AF-045', category: 'Electronics', status: 'Available', location: 'Storage Room A' },
  { id: 3, name: 'Ergonomic Office Chair', tag: 'AF-102', category: 'Furniture', status: 'In Repair', location: 'Maintenance Bay' },
  { id: 4, name: 'Conference Projector Y-2', tag: 'AF-088', category: 'Electronics', status: 'Allocated', location: 'Conf Room B' },
  { id: 5, name: 'Company Delivery Van', tag: 'AF-201', category: 'Vehicles', status: 'Available', location: 'Parking Lot 1' }
];

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="status-badge bg-success-light text-success border-success">Available</span>;
      case 'Allocated': return <span className="status-badge bg-primary-light text-primary border-primary">Allocated</span>;
      case 'In Repair': return <span className="status-badge bg-warning-light text-warning border-warning">In Repair</span>;
      default: return <span className="status-badge bg-gray-light text-muted border-gray">{status}</span>;
    }
  };

  return (
    <div className="assets-page">
      <div className="page-header flex-between">
        <div>
          <h1>Asset Directory</h1>
          <p className="text-muted">Manage all registered physical assets and devices across the organization.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Register Asset
        </button>
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
                      <button className="icon-btn edit-btn" title="Edit Asset"><Edit2 size={16}/></button>
                      <button className="icon-btn delete-btn" title="Delete Asset"><Trash2 size={16}/></button>
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
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register New Asset</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="grid-form">
                <div className="form-group">
                  <label className="form-label">Asset Name</label>
                  <input type="text" className="form-control" placeholder="e.g. MacBook Pro M3" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control">
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Vehicles</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Serial Number</label>
                  <input type="text" className="form-control" placeholder="e.g. SN-998822" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <select className="form-control">
                    <option>Main HQ - IT Dept</option>
                    <option>Storage Room A</option>
                  </select>
                </div>
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Initial Status</label>
                <select className="form-control">
                  <option>Available</option>
                  <option>Allocated</option>
                  <option>In Repair</option>
                </select>
              </div>
            </div>
            <div className="modal-footer mt-4 flex gap-2">
              <button className="btn btn-primary flex-1" onClick={() => setShowModal(false)}>Register Asset</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
