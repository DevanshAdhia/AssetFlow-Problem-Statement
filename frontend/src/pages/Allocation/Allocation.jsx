import React, { useState } from 'react';
import { ArrowRightLeft, AlertOctagon, CheckCircle, Search, History, Send } from 'lucide-react';
import './Allocation.css';

const mockAssets = [
  { id: 'a1', tag: 'AF-001', name: 'Dell XPS 15 Laptop', status: 'Allocated', currentHolder: 'John Smith (IT)', location: 'Floor 2, IT Dept', condition: 'Good' },
  { id: 'a2', tag: 'AF-045', name: 'Sony 4K Monitor', status: 'Available', currentHolder: 'None (Storage)', location: 'Storage Room A', condition: 'New' }
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
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const isBlocked = selectedAsset.status === 'Allocated';

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
                </tr>
              </thead>
              <tbody>
                {mockActiveAllocations.map(alloc => (
                  <tr key={alloc.id}>
                    <td className="font-medium text-primary">{alloc.tag}</td>
                    <td>{alloc.asset}</td>
                    <td className="font-medium text-muted">{alloc.empId}</td>
                    <td className="font-medium">{alloc.person}</td>
                    <td>{alloc.department}</td>
                    <td>{alloc.date}</td>
                    <td className="text-muted text-sm">{alloc.approvedBy}</td>
                  </tr>
                ))}
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
            <div className="search-bar w-full mb-3">
              <Search size={18} />
              <input type="text" placeholder="Search by tag (e.g. AF-001)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="asset-selector flex gap-2">
              <button className={`btn ${selectedAsset.id === 'a1' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelectedAsset(mockAssets[0])}>
                AF-001 (Allocated)
              </button>
              <button className={`btn ${selectedAsset.id === 'a2' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelectedAsset(mockAssets[1])}>
                AF-045 (Available)
              </button>
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

            <form className="transfer-form mt-3" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">From (Current)</label>
                <input type="text" className="form-control" value={selectedAsset.currentHolder} disabled />
              </div>
              
              <div className="form-group">
                <label className="form-label">To (Department / Employee)</label>
                <input type="text" className="form-control" placeholder="Select destination..." disabled={isBlocked} />
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Transfer</label>
                <textarea className="form-control" rows="3" placeholder="Provide justification for this transfer..." disabled={isBlocked}></textarea>
              </div>

              <button className="btn btn-primary w-full mt-2" disabled={isBlocked}>
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
            <div className="card-header pb-2 border-bottom">
              <h2 className="flex-align-center gap-2"><History size={18} /> Allocation History</h2>
            </div>
            <div className="history-timeline mt-3">
              {mockHistory.map((item, index) => (
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
          </div>

        </div>
      </div>
      )}
    </div>
  );
};

export default Allocation;
