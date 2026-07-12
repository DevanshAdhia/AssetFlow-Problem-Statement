import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Shield, UserCheck } from 'lucide-react';
import './OrganizationSetup.css';

const OrganizationSetup = () => {
  const [activeTab, setActiveTab] = useState('departments');

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('org_departments');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'IT Infrastructure', head: 'Alex Johnson', parent: 'Technology', status: 'Active' },
      { id: 2, name: 'Human Resources', head: 'Sarah Smith', parent: 'Operations', status: 'Active' },
      { id: 3, name: 'Procurement', head: 'David Lee', parent: 'Finance', status: 'Inactive' }
    ];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('org_categories');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Electronics', count: 145, description: 'Laptops, Monitors, Phones' },
      { id: 2, name: 'Furniture', count: 320, description: 'Chairs, Desks, Cabinets' },
      { id: 3, name: 'Vehicles', count: 12, description: 'Company cars and vans' }
    ];
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('org_employees');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Alex Johnson', dept: 'IT Infrastructure', role: 'Department Head', email: 'alex@example.com' },
      { id: 2, name: 'Mike Ross', dept: 'Legal', role: 'Employee', email: 'mike@example.com' },
      { id: 3, name: 'Emma Davis', dept: 'Facilities', role: 'Asset Manager', email: 'emma@example.com' }
    ];
  });

  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('org_locations');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Main HQ - Floor 1', type: 'Office', capacity: 150, status: 'Active' },
      { id: 2, name: 'Main HQ - Server Room', type: 'Data Center', capacity: 20, status: 'Active' },
      { id: 3, name: 'Downtown Branch', type: 'Office', capacity: 50, status: 'Active' },
      { id: 4, name: 'Storage Warehouse A', type: 'Storage', capacity: 500, status: 'Inactive' }
    ];
  });

  useEffect(() => { localStorage.setItem('org_departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('org_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('org_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('org_locations', JSON.stringify(locations)); }, [locations]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDelete = (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    if (type === 'department') setDepartments(departments.filter(d => d.id !== id));
    if (type === 'category') setCategories(categories.filter(c => c.id !== id));
    if (type === 'location') setLocations(locations.filter(l => l.id !== id));
    if (type === 'employee') setEmployees(employees.filter(e => e.id !== id));
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditId(null);
    setFormData({}); // clear form
    setShowModal(true);
  };

  const openEditModal = (item, type) => {
    setModalMode('edit');
    setEditId(item.id);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newId = Date.now();
      if (activeTab === 'departments') {
        setDepartments([...departments, { id: newId, name: formData.name, head: formData.head || 'Unassigned', parent: formData.parent || 'None', status: formData.status || 'Active' }]);
      } else if (activeTab === 'categories') {
        setCategories([...categories, { id: newId, name: formData.name, count: formData.count || 0, description: formData.description || '' }]);
      } else if (activeTab === 'locations') {
        setLocations([...locations, { id: newId, name: formData.name, type: formData.type || 'Office', capacity: formData.capacity || 0, status: formData.status || 'Active' }]);
      } else if (activeTab === 'employees') {
        setEmployees([...employees, { id: newId, name: formData.name, email: formData.email, dept: formData.dept || 'Unassigned', role: formData.role || 'Employee' }]);
      }
    } else {
      // Edit Mode
      if (activeTab === 'departments') {
        setDepartments(departments.map(d => d.id === editId ? { ...d, ...formData } : d));
      } else if (activeTab === 'categories') {
        setCategories(categories.map(c => c.id === editId ? { ...c, ...formData } : c));
      } else if (activeTab === 'locations') {
        setLocations(locations.map(l => l.id === editId ? { ...l, ...formData } : l));
      } else if (activeTab === 'employees') {
        setEmployees(employees.map(emp => emp.id === editId ? { ...emp, ...formData } : emp));
      }
    }
    setShowModal(false);
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <div>
          <h1 className="page-title">Organization Setup</h1>
          <p className="page-subtitle">Manage departments, master asset categories, and assign roles.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            <span>Add {activeTab === 'departments' ? 'Department' : activeTab === 'categories' ? 'Category' : activeTab === 'locations' ? 'Location' : 'Employee'}</span>
          </button>
        </div>
      </div>

      <div className="setup-tabs mb-3">
        <button className={`tab-btn ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>
          Departments
        </button>
        <button className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          Asset Categories
        </button>
        <button className={`tab-btn ${activeTab === 'locations' ? 'active' : ''}`} onClick={() => setActiveTab('locations')}>
          Locations
        </button>
        <button className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
          Employee Directory (Roles)
        </button>
      </div>

      <div className="card setup-card">
        <div className="card-header filters-header">
          <h2 className="card-title">
            {activeTab === 'departments' ? 'Departments Directory' : 
             activeTab === 'categories' ? 'Master Asset Categories' :
             activeTab === 'locations' ? 'Registered Locations' : 'Employee Role Assignment'}
          </h2>
          <div className="filters">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder={`Search ${activeTab}...`} />
            </div>
            <button className="btn btn-outline filter-btn">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        <div className="table-container">
          {activeTab === 'departments' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Department Head</th>
                  <th>Parent Dept.</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td className="fw-medium">{dept.name}</td>
                    <td>{dept.head}</td>
                    <td>{dept.parent}</td>
                    <td>
                      <span className={`status-badge ${(dept.status || 'Active') === 'Active' ? 'bg-success-light text-success border-success' : 'bg-gray text-muted border-gray'}`}>
                        {dept.status || 'Active'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => openEditModal(dept, 'department')}><Edit2 size={16} /></button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(dept.id, 'department')}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'categories' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Total Assets</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="fw-medium text-primary">{cat.name}</td>
                    <td>{cat.description}</td>
                    <td>{cat.count} items</td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => openEditModal(cat, 'category')}><Edit2 size={16} /></button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(cat.id, 'category')}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'locations' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Location Name</th>
                  <th>Type</th>
                  <th>Capacity (Est. Assets)</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id}>
                    <td className="fw-medium">{loc.name}</td>
                    <td className="text-muted">{loc.type}</td>
                    <td>{loc.capacity}</td>
                    <td>
                      <span className={`status-badge ${(loc.status || 'Active') === 'Active' ? 'bg-success-light text-success border-success' : 'bg-gray text-muted border-gray'}`}>
                        {loc.status || 'Active'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => openEditModal(loc, 'location')}><Edit2 size={16} /></button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(loc.id, 'location')}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'employees' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>System Role</th>
                  <th className="text-right">Assign Role / Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="fw-medium">{emp.name}</td>
                    <td className="text-muted">{emp.email}</td>
                    <td>{emp.dept}</td>
                    <td>
                      <span className={`role-badge ${emp.role === 'Employee' ? 'bg-gray' : 'bg-primary-light text-primary border-primary'}`}>
                        {emp.role === 'Employee' ? <UserCheck size={14} className="mr-1 inline-block" /> : <Shield size={14} className="mr-1 inline-block" />}
                        {emp.role}
                      </span>
                    </td>
                    <td className="text-right flex gap-2 justify-end items-center">
                      <select 
                        className="role-select m-0" 
                        value={emp.role} 
                        onChange={(e) => {
                           setEmployees(employees.map(em => em.id === emp.id ? {...em, role: e.target.value} : em));
                        }}>
                        <option value="Employee">Employee</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button className="icon-btn edit-btn ml-2" title="Edit Details" onClick={() => openEditModal(emp, 'employee')}><Edit2 size={16} /></button>
                      <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(emp.id, 'employee')}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dynamic Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add' : 'Edit'} {activeTab === 'departments' ? 'Department' : activeTab === 'categories' ? 'Category' : activeTab === 'locations' ? 'Location' : 'Employee'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleModalSubmit}>
              <div className="modal-body">
                {activeTab === 'departments' && (
                  <div className="grid-form">
                    <div className="form-group">
                      <label className="form-label">Department Name *</label>
                      <input type="text" className="form-control" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department Head</label>
                      <input type="text" className="form-control" value={formData.head || ''} onChange={e => setFormData({...formData, head: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Parent Department</label>
                      <input type="text" className="form-control" value={formData.parent || ''} onChange={e => setFormData({...formData, parent: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-control" value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="grid-form">
                    <div className="form-group">
                      <label className="form-label">Category Name *</label>
                      <input type="text" className="form-control" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Total Assets (Initial)</label>
                      <input type="number" className="form-control" value={formData.count || 0} onChange={e => setFormData({...formData, count: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="3" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                  </div>
                )}

                {activeTab === 'locations' && (
                  <div className="grid-form">
                    <div className="form-group">
                      <label className="form-label">Location Name *</label>
                      <input type="text" className="form-control" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location Type</label>
                      <select className="form-control" value={formData.type || 'Office'} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="Office">Office</option>
                        <option value="Data Center">Data Center</option>
                        <option value="Storage">Storage</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Capacity (Est. Assets)</label>
                      <input type="number" className="form-control" value={formData.capacity || 0} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-control" value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'employees' && (
                  <div className="grid-form">
                    <div className="form-group">
                      <label className="form-label">Employee Name *</label>
                      <input type="text" className="form-control" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input type="text" className="form-control" value={formData.dept || ''} onChange={e => setFormData({...formData, dept: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select className="form-control" value={formData.role || 'Employee'} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="Employee">Employee</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer mt-4 flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">{modalMode === 'add' ? 'Add' : 'Save Changes'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrganizationSetup;
