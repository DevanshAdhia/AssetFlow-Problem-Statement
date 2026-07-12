import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-react';
import './Audit.css';

const initialAuditData = [
  { id: 'A001', tag: 'AF-001', name: 'Dell XPS 15', expected: 'IT Dept (Floor 2)', reported: 'IT Dept (Floor 2)', status: 'Verified' },
  { id: 'A002', tag: 'AF-012', name: 'MacBook Air', expected: 'HR Dept (Floor 1)', reported: 'Marketing (Floor 3)', status: 'Pending' },
  { id: 'A003', tag: 'AF-045', name: 'Projector Y-2', expected: 'Conf Room B', reported: 'Unknown', status: 'Missing' },
  { id: 'A004', tag: 'AF-077', name: 'Office Chair', expected: 'Sales (Floor 4)', reported: 'Sales (Floor 4)', status: 'Verified' },
  { id: 'A005', tag: 'AF-089', name: 'Cisco Router', expected: 'Server Room', reported: 'Server Room', status: 'Verified' },
  { id: 'A006', tag: 'AF-102', name: 'iPad Pro', expected: 'Exec Office', reported: 'Unknown', status: 'Missing' }
];

const Audit = () => {
  const [auditData, setAuditData] = useState(() => {
    const saved = localStorage.getItem('admin_audit');
    return saved ? JSON.parse(saved) : initialAuditData;
  });

  useEffect(() => {
    localStorage.setItem('admin_audit', JSON.stringify(auditData));
  }, [auditData]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [reportLocation, setReportLocation] = useState('');
  const [reportStatus, setReportStatus] = useState('');

  const filteredData = auditData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified': return <span className="status-pill success"><CheckCircle size={14}/> Verified</span>;
      case 'Missing': return <span className="status-pill danger"><AlertTriangle size={14}/> Missing</span>;
      case 'Pending': return <span className="status-pill warning"><Clock size={14}/> Pending</span>;
      default: return null;
    }
  };

  const missingCount = auditData.filter(i => i.status === 'Missing').length;

  const handleUpdateClick = (item) => {
    setEditingItem(item);
    setReportLocation(item.reported === 'Unknown' ? '' : item.reported);
    setReportStatus(item.status);
    setShowUpdateModal(true);
  };

  const submitUpdate = () => {
    setAuditData(auditData.map(item => 
      item.id === editingItem.id ? { ...item, reported: reportLocation || 'Unknown', status: reportStatus } : item
    ));
    setShowUpdateModal(false);
  };

  return (
    <div className="audit-page">
      <div className="page-header flex-between">
        <div>
          <h1>Asset Audit & Verification</h1>
          <p className="text-primary font-medium flex-align-center gap-2 mt-1">
            <ShieldCheck size={18} /> Current Scope: Audit cycle beginning April - Q4
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Filter size={18} /> Filter
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            Create Audit Cycle
          </button>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Audit Cycle</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Audit Cycle Name</label>
                <input type="text" className="form-control" placeholder="e.g. Q4 End of Year Audit" />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Define Scope (Department / Location)</label>
                <select className="form-control">
                  <option>All Departments</option>
                  <option>IT Infrastructure</option>
                  <option>Human Resources</option>
                  <option>Facilities Management</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Assign Primary Auditor</label>
                <select className="form-control">
                  <option>Select Employee...</option>
                  <option>Alex Johnson (Dept Head)</option>
                  <option>Emma Davis (Asset Manager)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer mt-4 flex gap-2">
              <button className="btn btn-primary flex-1" onClick={() => setShowCreateModal(false)}>Initialize Cycle</button>
              <button className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="audit-stats-grid">
        <div className="stat-card">
          <h4>Total Assets</h4>
          <h2>{auditData.length}</h2>
        </div>
        <div className="stat-card border-success">
          <h4>Verified</h4>
          <h2>{auditData.filter(i => i.status === 'Verified').length}</h2>
        </div>
        <div className="stat-card border-warning">
          <h4>Pending</h4>
          <h2>{auditData.filter(i => i.status === 'Pending').length}</h2>
        </div>
        <div className="stat-card border-danger">
          <h4>Missing</h4>
          <h2>{missingCount}</h2>
        </div>
      </div>

      <div className="audit-content-grid">
        {/* Verification Table */}
        <div className="card audit-table-card col-span-2">
          <div className="card-header flex-between">
            <h2>Verification Checklist</h2>
            <div className="search-bar small">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search tag or name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="table-tabs mb-3">
            {['All', 'Verified', 'Pending', 'Missing'].map(tab => (
              <button 
                key={tab} 
                className={`tab-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Asset Name</th>
                  <th>Expected Location</th>
                  <th>Reported Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td className="font-medium text-primary">{item.tag}</td>
                    <td>{item.name}</td>
                    <td>{item.expected}</td>
                    <td>{item.reported}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <button className="btn btn-outline btn-xs" onClick={() => handleUpdateClick(item)}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discrepancy Reporting */}
        <div className="card discrepancy-card">
          <div className="card-header">
            <h2 className="text-danger flex-align-center gap-2">
              <AlertTriangle size={20} /> Discrepancy Reports
            </h2>
          </div>
          <div className="discrepancy-content">
            <div className="discrepancy-alert">
              <h3>{missingCount} Assets Flagged</h3>
              <p className="text-muted">Auto-generated reports are available for items marked as missing or in conflict.</p>
            </div>
            
            <div className="flagged-list">
              {auditData.filter(i => i.status === 'Missing').map(item => (
                <div key={item.id} className="flagged-item">
                  <span className="dot bg-danger"></span>
                  <div className="flagged-info">
                    <strong>{item.tag}</strong>
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary w-full mt-4 flex-center gap-2">
              <FileText size={18} /> View Audit Report
            </button>
            <button className="btn btn-outline w-full mt-2">
              Auto-generate PDF
            </button>
          </div>
        </div>
      </div>

      {showUpdateModal && editingItem && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Verification: {editingItem.tag}</h2>
              <button className="close-btn" onClick={() => setShowUpdateModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Asset Name</label>
                <input type="text" className="form-control" value={editingItem.name} disabled />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Expected Location</label>
                <input type="text" className="form-control" value={editingItem.expected} disabled />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Reported Location (Found At)</label>
                <input type="text" className="form-control" placeholder="Where was it actually found?" value={reportLocation} onChange={e => setReportLocation(e.target.value)} />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Verification Status</label>
                <select className="form-control" value={reportStatus} onChange={e => setReportStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified (Found)</option>
                  <option value="Missing">Missing</option>
                </select>
              </div>
            </div>
            <div className="modal-footer mt-4 flex gap-2">
              <button className="btn btn-primary flex-1" onClick={submitUpdate}>Save Update</button>
              <button className="btn btn-outline" onClick={() => setShowUpdateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audit;
