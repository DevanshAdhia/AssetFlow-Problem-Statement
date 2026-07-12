import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Plus, Edit2, Trash2, QrCode, Download, Upload,
  MoreHorizontal, Eye, Box, FileText, Image as ImageIcon, FileSpreadsheet,
  CheckCircle, AlertCircle, X as XIcon
} from 'lucide-react';
import * as XLSX from 'xlsx';
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
  const importRef = useRef(null);
  
  // Filtering & View states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewAsset, setViewAsset] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: '' }
  
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

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        if (!rows.length) { showToast('error', 'File is empty or has no data rows.'); return; }
        const imported = rows.map((r, i) => ({
          id: Date.now() + i,
          tag: r['Asset Tag'] || r['tag'] || `AF-${String(Date.now() + i).slice(-3)}`,
          name: r['Asset Name'] || r['name'] || 'Unnamed Asset',
          brand: r['Brand'] || r['brand'] || 'N/A',
          category: r['Category'] || r['category'] || 'General',
          status: r['Status'] || r['status'] || 'Available',
          location: r['Location'] || r['location'] || 'Unassigned',
          cost: r['Cost'] || r['cost'] || '$0',
        }));
        setAssets(prev => [...imported, ...prev]);
        showToast('success', `${imported.length} asset(s) imported successfully!`);
      } catch (err) {
        showToast('error', 'Failed to parse file. Please use a valid CSV or Excel file.');
      }
      // Reset input so same file can be re-imported
      e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="assets-page" style={{ padding: '1.5rem', width: '100%' }}>
      
      {/* Toast notification */}
      {toast && (
        <div style={{
          position:'fixed', top:'1.25rem', right:'1.25rem', zIndex:9999,
          background: toast.type==='success' ? '#1e293b' : '#fff1f2',
          color: toast.type==='success' ? '#fff' : '#dc2626',
          padding:'0.85rem 1.25rem', borderRadius:'10px',
          display:'flex', alignItems:'center', gap:'0.6rem',
          boxShadow:'0 8px 24px rgba(0,0,0,0.18)',
          borderLeft: toast.type==='success' ? '4px solid #22c55e' : '4px solid #ef4444',
          minWidth: '280px', maxWidth: '420px'
        }}>
          {toast.type==='success' ? <CheckCircle size={18} style={{color:'#22c55e',flexShrink:0}}/> : <AlertCircle size={18} style={{color:'#ef4444',flexShrink:0}}/>}
          <span style={{flex:1, fontSize:'0.875rem'}}>{toast.msg}</span>
          <button onClick={()=>setToast(null)} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',padding:0}}><XIcon size={16}/></button>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        ref={importRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleImport}
      />

      <div className="page-header flex-between mb-4">
        <div>
          <h1>Asset Directory</h1>
          <p className="text-muted">Comprehensive inventory of all organizational assets.</p>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          {/* Import Button */}
          <button className="btn btn-outline" onClick={() => importRef.current.click()}
            title="Import assets from CSV or Excel file"
            style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <Upload size={16} /> Import
          </button>

          {/* Export Dropdown */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <button className="btn btn-outline" onClick={(e) => {
              const menu = e.currentTarget.nextElementSibling;
              menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }}>
              <Download size={16} /> Export <span style={{fontSize: '0.7rem', marginLeft: '4px'}}>▼</span>
            </button>
            <div className="am-dropdown" style={{ display: 'none', position: 'absolute', top: '100%', right: 0, marginTop: '4px', minWidth: '160px' }}>
              <button className="am-dropdown-item" onClick={(e) => { 
                e.currentTarget.parentElement.style.display = 'none'; 
                const rows = ['Asset Tag,Asset Name,Category,Status,Location,Cost', ...filteredAssets.map(a=>`${a.tag},"${a.name}",${a.category},${a.status},"${a.location}","${a.cost}"`)]
                const blob = new Blob([rows.join('\n')], { type:'text/csv' });
                const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
                link.download = `Assets_${Date.now()}.csv`; link.click();
              }}>
                <FileText size={15}/> Export CSV
              </button>
              <button className="am-dropdown-item" onClick={(e) => { 
                e.currentTarget.parentElement.style.display = 'none'; 
                const ws = XLSX.utils.json_to_sheet(filteredAssets.map(a => ({
                  'Asset Tag': a.tag, 'Asset Name': a.name, 'Brand': a.brand, 'Category': a.category, 'Status': a.status, 'Location': a.location, 'Cost': a.cost
                })));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Assets");
                XLSX.writeFile(wb, `Assets_${Date.now()}.xlsx`);
              }}>
                <FileSpreadsheet size={15}/> Export Excel
              </button>
            </div>
          </div>

          {/* Register Asset */}
          <button className="btn btn-primary" onClick={() => setShowModal(true)}
            style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginLeft:'0.25rem' }}>
            <Plus size={16} /> Register Asset
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header filters-header">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search by tag or name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <button className="icon-btn qr-btn" title="Scan QR Code"><QrCode size={16}/></button>
          </div>
          
          <div className="filter-group">
            <select className="form-control filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
            </select>
            <select className="form-control filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
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
              {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                <tr key={asset.id}>
                  <td className="font-medium text-primary">{asset.tag}</td>
                  <td className="font-medium">{asset.name}</td>
                  <td className="text-muted">{asset.category}</td>
                  <td>{getStatusBadge(asset.status)}</td>
                  <td>{asset.location}</td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="icon-btn" title="View Details" onClick={() => setViewAsset(asset)}><Eye size={16}/></button>
                      <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEdit(asset)}><Edit2 size={16}/></button>
                      <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(asset.id)}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="text-center text-muted py-4">No assets found matching the filters.</td></tr>
              )}
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

      {/* View Asset Details Modal */}
      {viewAsset && (
        <div className="modal-overlay" onClick={() => setViewAsset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header border-bottom pb-3">
              <h2 className="text-xl flex gap-2"><Box size={22} className="text-primary"/> Asset Details</h2>
              <button className="close-btn" onClick={() => setViewAsset(null)}>&times;</button>
            </div>
            
            <div className="modal-body py-4">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div><p className="text-muted mb-1 text-sm">Asset Tag</p><p className="font-bold text-primary">{viewAsset.tag}</p></div>
                <div><p className="text-muted mb-1 text-sm">Asset Name</p><p className="font-bold">{viewAsset.name}</p></div>
                <div><p className="text-muted mb-1 text-sm">Category</p><p className="font-bold">{viewAsset.category}</p></div>
                <div><p className="text-muted mb-1 text-sm">Brand</p><p className="font-bold">{viewAsset.brand || 'N/A'}</p></div>
                <div><p className="text-muted mb-1 text-sm">Location</p><p className="font-bold">{viewAsset.location}</p></div>
                <div><p className="text-muted mb-1 text-sm">Cost</p><p className="font-bold">{viewAsset.cost}</p></div>
                <div style={{ gridColumn: 'span 2' }}><p className="text-muted mb-1 text-sm">Current Status</p>{getStatusBadge(viewAsset.status)}</div>
              </div>
            </div>
            
            <div className="modal-footer pt-3 border-top flex gap-2 justify-end">
              <button className="btn btn-outline" onClick={() => setViewAsset(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagerAssets;
