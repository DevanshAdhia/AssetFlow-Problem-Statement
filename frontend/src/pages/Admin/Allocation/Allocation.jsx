import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, AlertOctagon, CheckCircle, Search, History, Send, ChevronDown, ChevronUp } from 'lucide-react';
import './Allocation.css';

const mockAssets = [
  { id: 'a1', tag: 'AF-001', name: 'Dell XPS 15 Laptop', status: 'Allocated', currentHolder: 'John Smith (IT)', location: 'Floor 2, IT Dept', condition: 'Good' },
  { id: 'a2', tag: 'AF-045', name: 'Sony 4K Monitor', status: 'Available', currentHolder: 'None (Storage)', location: 'Storage Room A', condition: 'New' },
  { id: 'a3', tag: 'AF-102', name: 'MacBook Pro', status: 'Available', currentHolder: 'None (Storage)', location: 'IT Dept (Floor 2)', condition: 'Good' },
  { id: 'a4', tag: 'AF-088', name: 'Conference Projector', status: 'Allocated', currentHolder: 'Meeting Room C', location: 'Conf Room B', condition: 'Fair' },
  { id: 'a5', tag: 'AF-201', name: 'Company Delivery Van', status: 'Available', currentHolder: 'None (Garage)', location: 'Parking Lot 1', condition: 'Good' }
];

const mockHistory = [
  { id: 1, date: '10/05/2026', action: 'Allocated to IT Dept', by: 'Admin' },
  { id: 2, date: '01/02/2026', action: 'Returned from Sales', by: 'Sarah Jenkins' },
  { id: 3, date: '15/01/2025', action: 'Initial Registration', by: 'System' }
];

const mockActiveAllocations = [
  { id: 1, tag: 'AF-001', asset: 'Dell XPS 15 Laptop', empId: 'EMP-1042', person: 'John Smith', department: 'IT', date: '10/05/2026', approvedBy: 'Admin (System)' },
  { id: 2, tag: 'AF-022', asset: 'MacBook Pro M3', empId: 'EMP-1088', person: 'Sarah Jenkins', department: 'Sales', date: '12/06/2026', approvedBy: 'David Lee' },
  { id: 3, tag: 'AF-031', asset: 'ThinkPad T14', empId: 'EMP-1105', person: 'Michael Chang', department: 'Development', date: '05/01/2026', approvedBy: 'Alex Johnson' }
];

const Allocation = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('admin_alloc_assets');
    return saved ? JSON.parse(saved) : mockAssets;
  });
  
  const [allocations, setAllocations] = useState(() => {
    const saved = localStorage.getItem('admin_allocations');
    return saved ? JSON.parse(saved) : mockActiveAllocations;
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('admin_history');
    return saved ? JSON.parse(saved) : mockHistory;
  });

  useEffect(() => { localStorage.setItem('admin_alloc_assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('admin_allocations', JSON.stringify(allocations)); }, [allocations]);
  useEffect(() => { localStorage.setItem('admin_history', JSON.stringify(history)); }, [history]);

  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  
  const [transferTo, setTransferTo] = useState('');
  const [transferReason, setTransferReason] = useState('');

  const isBlocked = selectedAsset.status === 'Allocated';

  const filteredAssets = assets.filter(asset => 
    asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!transferTo || !transferReason) {
      alert("Please fill in destination and reason.");
      return;
    }
    
    // Create new allocation
    const newAlloc = {
      id: Date.now(),
      tag: selectedAsset.tag,
      asset: selectedAsset.name,
      empId: 'EMP-NEW',
      person: transferTo,
      department: 'Assigned Dept',
      date: new Date().toLocaleDateString('en-GB'),
      approvedBy: 'Admin (System)'
    };
    
    // Update asset status
    const updatedAsset = { ...selectedAsset, status: 'Allocated', currentHolder: transferTo };
    setAssets(assets.map(a => a.id === selectedAsset.id ? updatedAsset : a));
    setSelectedAsset(updatedAsset);
    
    setAllocations([...allocations, newAlloc]);
    setHistory([{ id: Date.now(), date: new Date().toLocaleDateString('en-GB'), action: `Allocated to ${transferTo}`, by: 'Admin' }, ...history]);
    
    setTransferTo('');
    setTransferReason('');
    setActiveTab('directory');
  };

  const handleReturn = (id) => {
    if (!window.confirm("Return this asset?")) return;
    const alloc = allocations.find(a => a.id === id);
    setAllocations(allocations.filter(a => a.id !== id));
    
    const assetToUpdate = assets.find(a => a.tag === alloc.tag);
    if (assetToUpdate) {
      const updated = { ...assetToUpdate, status: 'Available', currentHolder: 'None (Storage)' };
      setAssets(assets.map(a => a.id === assetToUpdate.id ? updated : a));
      if (selectedAsset.id === assetToUpdate.id) setSelectedAsset(updated);
    }
    setHistory([{ id: Date.now(), date: new Date().toLocaleDateString('en-GB'), action: `Returned from ${alloc.person}`, by: 'Admin' }, ...history]);
  };

  return (
    <div className="allocation-page">
      <div className="page-header flex-between">
        <div>
          <h1>Allocation & Transfer</h1>
          <p className="text-muted">Manage asset assignments, track who is using what, and handle transfers.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setActiveTab('request')}>
            + New Allocation / Transfer
          </button>
        </div>
      </div>

      <div className="allocation-tabs mb-3">
        <button className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`} onClick={() => setActiveTab('directory')}>
          Active Allocations Directory
        </button>
        <button className={`tab-btn ${activeTab === 'request' ? 'active' : ''}`} onClick={() => setActiveTab('request')}>
          Transfer / Allocation Request
        </button>
      </div>

      {activeTab === 'directory' ? (
        <div className="card">
          <div className="card-header border-bottom pb-2">
            <h2>Current Employee Allocations</h2>
          </div>
          <div className="table-container mt-3">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Device / Asset</th>
                  <th>Employee ID</th>
                  <th>Allocated To</th>
                  <th>Department</th>
                  <th>Date Assigned</th>
                  <th>Approved By</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {allocations.length > 0 ? allocations.map(alloc => (
                  <tr key={alloc.id}>
                    <td className="font-medium text-primary">{alloc.tag}</td>
                    <td>{alloc.asset}</td>
                    <td className="font-medium text-muted">{alloc.empId}</td>
                    <td className="font-medium">{alloc.person}</td>
                    <td>{alloc.department}</td>
                    <td>{alloc.date}</td>
                    <td className="text-muted text-sm">{alloc.approvedBy}</td>
                    <td className="text-right">
                      <button className="btn btn-outline btn-xs" onClick={() => handleReturn(alloc.id)}>Return</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">No active allocations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="allocation-grid">
        {/* Left Column: Asset Selection & Form */}
        <div className="allocation-form-section flex-col gap-3">
          
          <div className="card">
            <div className="card-header">
              <h2>Select Asset</h2>
            </div>
            <div className="position-relative">
              <div className="search-bar w-full mb-3">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search by tag (e.g. AF-001)" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
              </div>
              
              {showDropdown && (
                <div className="dropdown-list">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map(asset => (
                      <div 
                        key={asset.id}
                        className={`dropdown-item ${selectedAsset.id === asset.id ? 'active' : ''}`}
                        onClick={() => { 
                          setSelectedAsset(asset); 
                          setSearchTerm(''); 
                          setShowDropdown(false); 
                        }}
                      >
                        <span className="font-medium">{asset.tag}</span>
                        <span className="text-muted text-sm ml-2">- {asset.name}</span>
                        <span className="text-muted text-sm ml-auto">({asset.status})</span>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item text-muted">No assets found matching "{searchTerm}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2>Transfer Request Form</h2>
            </div>
            
            {/* Conflict Handling Alert */}
            {isBlocked ? (
              <div className="conflict-alert bg-danger-light border-danger">
                <AlertOctagon size={24} className="text-danger" />
                <div>
                  <h4 className="text-danger m-0">Allocation Blocked</h4>
                  <p className="text-sm m-0 mt-1">This asset is already allocated. You must cancel the previous request or process a return before transferring.</p>
                </div>
              </div>
            ) : (
              <div className="conflict-alert bg-success-light border-success">
                <CheckCircle size={24} className="text-success" />
                <div>
                  <h4 className="text-success m-0">Asset Available</h4>
                  <p className="text-sm m-0 mt-1">This asset is clear for allocation.</p>
                </div>
              </div>
            )}

            <form className="transfer-form mt-3" onSubmit={handleTransfer}>
              <div className="form-group">
                <label className="form-label">From (Current)</label>
                <input type="text" className="form-control" value={selectedAsset.currentHolder} disabled />
              </div>
              
              <div className="form-group">
                <label className="form-label">To (Department / Employee)</label>
                <input type="text" className="form-control" placeholder="Select destination..." value={transferTo} onChange={e => setTransferTo(e.target.value)} disabled={isBlocked} />
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Transfer</label>
                <textarea className="form-control" rows="3" placeholder="Provide justification for this transfer..." value={transferReason} onChange={e => setTransferReason(e.target.value)} disabled={isBlocked}></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-2" disabled={isBlocked}>
                <Send size={18} /> Submit Transfer Request
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Asset Details & History */}
        <div className="allocation-details-section flex-col gap-3">
          
          <div className="card asset-details-card">
            <div className="card-header border-bottom pb-2">
              <h2 className="flex-align-center gap-2">
                {selectedAsset.tag} - {selectedAsset.name}
              </h2>
            </div>
            <div className="details-grid mt-3">
              <div className="detail-row">
                <span className="text-muted text-sm">Status</span>
                <span className={`font-medium ${isBlocked ? 'text-warning' : 'text-success'}`}>{selectedAsset.status}</span>
              </div>
              <div className="detail-row">
                <span className="text-muted text-sm">Location</span>
                <span className="font-medium">{selectedAsset.location}</span>
              </div>
              <div className="detail-row">
                <span className="text-muted text-sm">Condition</span>
                <span className="font-medium">{selectedAsset.condition}</span>
              </div>
            </div>
          </div>

          <div className="card history-card flex-1">
            <div 
              className="card-header pb-2 border-bottom flex-between" 
              onClick={() => setShowHistory(!showHistory)}
              style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <h2 className="flex-align-center gap-2 m-0"><History size={18} /> Allocation History</h2>
              {showHistory ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
            </div>
            
            {showHistory && (
              <div className="history-timeline mt-3">
                {history.map((item, index) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <p className="font-medium m-0">{item.action}</p>
                      <div className="timeline-meta text-muted text-xs flex-between mt-1">
                        <span>{item.date}</span>
                        <span>By: {item.by}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      )}
    </div>
  );
};

export default Allocation;
