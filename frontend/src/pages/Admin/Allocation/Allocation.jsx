import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft, AlertOctagon, CheckCircle, Search,
  History, Send, ChevronDown, ChevronUp, X, BarChart2,
  Users, Package, TrendingUp, PieChart
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts';
import './Allocation.css';

/* ─── helpers ─── */
const getStoredUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'));
    return u?.name || u?.full_name || 'Bharat Rathor';
  } catch {
    return 'Bharat Rathor';
  }
};

const DEPARTMENTS = ['IT', 'Sales', 'HR', 'Finance', 'Operations', 'Development', 'Legal'];

const DEFAULT_ASSETS = [
  { id: 'a1', tag: 'AF-001', name: 'Dell XPS 15 Laptop',      status: 'Allocated', currentHolder: 'John Smith', location: 'Floor 2, IT Dept',   condition: 'Good', department: 'IT' },
  { id: 'a2', tag: 'AF-045', name: 'Sony 4K Monitor',          status: 'Available', currentHolder: null,          location: 'Storage Room A',       condition: 'New',  department: null },
  { id: 'a3', tag: 'AF-102', name: 'MacBook Pro',              status: 'Available', currentHolder: null,          location: 'IT Dept (Floor 2)',     condition: 'Good', department: null },
  { id: 'a4', tag: 'AF-088', name: 'Conference Projector',     status: 'Allocated', currentHolder: 'Meeting Room C', location: 'Conf Room B',       condition: 'Fair', department: 'Sales' },
  { id: 'a5', tag: 'AF-201', name: 'Company Delivery Van',     status: 'Available', currentHolder: null,          location: 'Parking Lot 1',        condition: 'Good', department: null },
];

const DEFAULT_ALLOCATIONS = [
  { id: 1, tag: 'AF-001', asset: 'Dell XPS 15 Laptop',    empId: 'EMP-1042', person: 'John Smith',     department: 'IT',          date: '10/05/2026', approvedBy: 'Admin (System)' },
  { id: 2, tag: 'AF-022', asset: 'MacBook Pro M3',         empId: 'EMP-1088', person: 'Sarah Jenkins',  department: 'Sales',       date: '12/06/2026', approvedBy: 'David Lee' },
  { id: 3, tag: 'AF-031', asset: 'ThinkPad T14',           empId: 'EMP-1105', person: 'Michael Chang',  department: 'Development', date: '05/01/2026', approvedBy: 'Alex Johnson' },
];

const DEFAULT_HISTORY = [
  { id: 1, date: '10/05/2026', action: 'Allocated to IT Dept',    by: 'Admin' },
  { id: 2, date: '01/02/2026', action: 'Returned from Sales',     by: 'Sarah Jenkins' },
  { id: 3, date: '15/01/2025', action: 'Initial Registration',    by: 'System' },
];

/* ─── Analytics data derived from allocations ─── */
const buildDeptData = (allocations) => {
  const map = {};
  allocations.forEach(a => {
    map[a.department] = (map[a.department] || 0) + 1;
  });
  return Object.entries(map).map(([name, count]) => ({ name, count }));
};

const PIE_COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#0EA5E9', '#EC4899'];

/* ─── Modal: New Allocation ─── */
const NewAllocationModal = ({ assets, currentUserName, onClose, onSubmit }) => {
  const available = assets.filter(a => a.status === 'Available');
  const [form, setForm] = useState({
    assetId: available[0]?.id || '',
    empId: '',
    person: '',
    department: DEPARTMENTS[0],
    reason: '',
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.assetId || !form.empId || !form.person) {
      alert('Please fill all required fields.');
      return;
    }
    onSubmit(form);
  };

  const selectedAsset = assets.find(a => a.id === form.assetId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content alloc-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Allocation / Transfer</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Asset selector */}
          <div className="form-group">
            <label className="form-label">Asset <span className="text-danger">*</span></label>
            <select className="form-control" value={form.assetId} onChange={e => set('assetId', e.target.value)} required>
              {available.length === 0 && <option value="">No available assets</option>}
              {available.map(a => (
                <option key={a.id} value={a.id}>{a.tag} — {a.name}</option>
              ))}
            </select>
          </div>

          {/* From field — current user */}
          <div className="form-group">
            <label className="form-label">From (Current Admin)</label>
            <input className="form-control" value={currentUserName} disabled />
          </div>

          {/* Asset location info */}
          {selectedAsset && (
            <div className="alloc-asset-info">
              <span><strong>Location:</strong> {selectedAsset.location}</span>
              <span><strong>Condition:</strong> {selectedAsset.condition}</span>
            </div>
          )}

          <div className="modal-divider" />

          {/* Employee details */}
          <div className="grid-form col-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Employee ID <span className="text-danger">*</span></label>
              <input className="form-control" placeholder="EMP-1234" value={form.empId} onChange={e => set('empId', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Employee Name <span className="text-danger">*</span></label>
              <input className="form-control" placeholder="Full name" value={form.person} onChange={e => set('person', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select className="form-control" value={form.department} onChange={e => set('department', e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reason / Notes</label>
            <textarea className="form-control" rows={2} placeholder="e.g. New employee onboarding" value={form.reason} onChange={e => set('reason', e.target.value)} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={available.length === 0}>
              <Send size={16} /> Confirm Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const Allocation = () => {
  const currentUserName = getStoredUser();

  const [activeTab, setActiveTab] = useState('directory');
  const [showModal, setShowModal]   = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const [assets, setAssets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_alloc_assets')) || DEFAULT_ASSETS; }
    catch { return DEFAULT_ASSETS; }
  });
  const [allocations, setAllocations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_allocations')) || DEFAULT_ALLOCATIONS; }
    catch { return DEFAULT_ALLOCATIONS; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_history')) || DEFAULT_HISTORY; }
    catch { return DEFAULT_HISTORY; }
  });

  useEffect(() => { localStorage.setItem('admin_alloc_assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('admin_allocations', JSON.stringify(allocations)); }, [allocations]);
  useEffect(() => { localStorage.setItem('admin_history', JSON.stringify(history)); }, [history]);

  /* Transfer request tab state */
  const [selectedAsset, setSelectedAsset] = useState(assets[0]);
  const [searchTerm, setSearchTerm]       = useState('');
  const [showDropdown, setShowDropdown]   = useState(false);
  const [transferTo, setTransferTo]       = useState('');
  const [transferReason, setTransferReason] = useState('');

  const isBlocked = selectedAsset?.status === 'Allocated';
  const filteredAssets = assets.filter(a =>
    a.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* Analytics */
  const deptData   = buildDeptData(allocations);
  const statusData = [
    { name: 'Allocated',    value: assets.filter(a => a.status === 'Allocated').length },
    { name: 'Available',    value: assets.filter(a => a.status === 'Available').length },
    { name: 'Maintenance',  value: assets.filter(a => a.status === 'Maintenance').length },
  ].filter(d => d.value > 0);

  /* Handlers */
  const handleNewAllocation = (form) => {
    const asset = assets.find(a => a.id === form.assetId);
    if (!asset) return;

    const newAlloc = {
      id: Date.now(),
      tag: asset.tag,
      asset: asset.name,
      empId: form.empId,
      person: form.person,
      department: form.department,
      date: new Date().toLocaleDateString('en-GB'),
      approvedBy: currentUserName,
    };

    const updatedAsset = { ...asset, status: 'Allocated', currentHolder: form.person, department: form.department };
    setAssets(prev => prev.map(a => a.id === asset.id ? updatedAsset : a));
    setAllocations(prev => [newAlloc, ...prev]);
    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      action: `Allocated ${asset.tag} to ${form.person} (${form.department})`,
      by: currentUserName,
    }, ...prev]);
    setShowModal(false);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferTo || !transferReason) { alert('Fill in destination and reason.'); return; }

    const newAlloc = {
      id: Date.now(),
      tag: selectedAsset.tag,
      asset: selectedAsset.name,
      empId: 'EMP-NEW',
      person: transferTo,
      department: 'Assigned Dept',
      date: new Date().toLocaleDateString('en-GB'),
      approvedBy: currentUserName,
    };
    const updatedAsset = { ...selectedAsset, status: 'Allocated', currentHolder: transferTo };
    setAssets(prev => prev.map(a => a.id === selectedAsset.id ? updatedAsset : a));
    setSelectedAsset(updatedAsset);
    setAllocations(prev => [...prev, newAlloc]);
    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      action: `Transferred to ${transferTo}`,
      by: currentUserName,
    }, ...prev]);
    setTransferTo(''); setTransferReason('');
    setActiveTab('directory');
  };

  const handleReturn = (id) => {
    if (!window.confirm('Return this asset to storage?')) return;
    const alloc = allocations.find(a => a.id === id);
    setAllocations(prev => prev.filter(a => a.id !== id));
    const assetToUpdate = assets.find(a => a.tag === alloc.tag);
    if (assetToUpdate) {
      const updated = { ...assetToUpdate, status: 'Available', currentHolder: null, department: null };
      setAssets(prev => prev.map(a => a.id === assetToUpdate.id ? updated : a));
      if (selectedAsset?.id === assetToUpdate.id) setSelectedAsset(updated);
    }
    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      action: `Returned from ${alloc.person} (${alloc.department})`,
      by: currentUserName,
    }, ...prev]);
  };

  return (
    <div className="allocation-page">

      {/* Modal */}
      {showModal && (
        <NewAllocationModal
          assets={assets}
          currentUserName={currentUserName}
          onClose={() => setShowModal(false)}
          onSubmit={handleNewAllocation}
        />
      )}

      {/* Page header */}
      <div className="page-header flex-between">
        <div>
          <h1>Allocation &amp; Transfer</h1>
          <p className="text-muted">Manage asset assignments, track who is using what, and handle transfers.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Allocation / Transfer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="allocation-tabs">
        {[
          { key: 'directory', label: 'Active Allocations Directory' },
          { key: 'request',   label: 'Transfer / Allocation Request' },
          { key: 'analytics', label: '📊 Analytics' },
        ].map(t => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >{t.label}</button>
        ))}
      </div>

      {/* ── TAB: Directory ── */}
      {activeTab === 'directory' && (
        <div className="card">
          <div className="card-header border-bottom pb-2">
            <h2>Current Employee Allocations</h2>
            <span className="text-muted text-sm">Logged in as: <strong>{currentUserName}</strong></span>
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
                  <tr><td colSpan="8" className="text-center text-muted py-4">No active allocations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: Transfer Request ── */}
      {activeTab === 'request' && (
        <div className="allocation-grid">
          {/* Left */}
          <div className="flex-col gap-3">
            <div className="card">
              <div className="card-header"><h2>Select Asset</h2></div>
              <div className="position-relative">
                <div className="search-bar w-full mb-3">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search by tag (e.g. AF-001)"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </div>
                {showDropdown && (
                  <div className="dropdown-list">
                    {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                      <div
                        key={asset.id}
                        className={`dropdown-item ${selectedAsset?.id === asset.id ? 'active' : ''}`}
                        onClick={() => { setSelectedAsset(asset); setSearchTerm(''); setShowDropdown(false); }}
                      >
                        <span className="font-medium">{asset.tag}</span>
                        <span className="text-muted text-sm ml-2">— {asset.name}</span>
                        <span className="text-muted text-sm ml-auto">({asset.status})</span>
                      </div>
                    )) : (
                      <div className="dropdown-item text-muted">No assets found for "{searchTerm}"</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h2>Transfer Request Form</h2></div>

              {isBlocked ? (
                <div className="conflict-alert bg-danger-light border-danger">
                  <AlertOctagon size={24} className="text-danger" />
                  <div>
                    <h4 className="text-danger m-0">Allocation Blocked</h4>
                    <p className="text-sm m-0 mt-1">Asset is already allocated. Return it first before transferring.</p>
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

              <form className="transfer-form mt-3" onSubmit={handleTransferSubmit}>
                <div className="form-group">
                  <label className="form-label">From (Current Admin)</label>
                  <input type="text" className="form-control" value={currentUserName} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">To (Department / Employee)</label>
                  <input type="text" className="form-control" placeholder="Enter destination..." value={transferTo} onChange={e => setTransferTo(e.target.value)} disabled={isBlocked} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Transfer</label>
                  <textarea className="form-control" rows="3" placeholder="Provide justification..." value={transferReason} onChange={e => setTransferReason(e.target.value)} disabled={isBlocked} />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2" disabled={isBlocked}>
                  <Send size={18} /> Submit Transfer Request
                </button>
              </form>
            </div>
          </div>

          {/* Right */}
          <div className="flex-col gap-3">
            {selectedAsset && (
              <div className="card asset-details-card">
                <div className="card-header border-bottom pb-2">
                  <h2>{selectedAsset.tag} — {selectedAsset.name}</h2>
                </div>
                <div className="details-grid mt-3">
                  <div className="detail-row">
                    <span className="text-muted text-sm">Current Holder</span>
                    <span className="font-medium">{selectedAsset.currentHolder || `${currentUserName} (Storage)`}</span>
                  </div>
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
            )}

            <div className="card flex-1">
              <div
                className="card-header pb-2 border-bottom"
                onClick={() => setShowHistory(!showHistory)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <h2 className="flex-align-center gap-2 m-0"><History size={18} /> Allocation History</h2>
                {showHistory ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
              </div>
              {showHistory && (
                <div className="history-timeline mt-3">
                  {history.map(item => (
                    <div key={item.id} className="timeline-item">
                      <div className="timeline-dot" />
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

      {/* ── TAB: Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="analytics-grid">
          {/* KPI row */}
          <div className="alloc-kpi-row">
            {[
              { label: 'Total Allocated',  value: allocations.length,                        icon: <Users size={22} />,   color: 'var(--primary)' },
              { label: 'Assets Available', value: assets.filter(a => a.status === 'Available').length,  icon: <Package size={22} />, color: 'var(--success)' },
              { label: 'Total Assets',     value: assets.length,                             icon: <BarChart2 size={22} />,color: 'var(--warning)' },
              { label: 'Departments Active', value: [...new Set(allocations.map(a => a.department))].length, icon: <TrendingUp size={22} />, color: '#8B5CF6' },
            ].map((k, i) => (
              <div key={i} className="alloc-kpi-card card">
                <div className="alloc-kpi-icon" style={{ background: k.color + '18', color: k.color }}>{k.icon}</div>
                <div>
                  <div className="alloc-kpi-value">{k.value}</div>
                  <div className="alloc-kpi-label text-muted">{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="analytics-charts-row">
            {/* Bar chart: allocations by dept */}
            <div className="card analytics-chart-card">
              <h3 className="chart-title">Allocations by Department</h3>
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={deptData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-4">No allocation data yet.</div>
              )}
            </div>

            {/* Pie chart: asset status */}
            <div className="card analytics-chart-card">
              <h3 className="chart-title">Asset Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RechartsPieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {statusData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation log table */}
          <div className="card">
            <div className="card-header pb-2 border-bottom">
              <h2>Recent Allocation Activity</h2>
            </div>
            <div className="table-container mt-3">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>Performed By</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 8).map(h => (
                    <tr key={h.id}>
                      <td className="text-muted text-sm">{h.date}</td>
                      <td>{h.action}</td>
                      <td className="font-medium">{h.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allocation;
