import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Shield, UserCheck } from 'lucide-react';
import './OrganizationSetup.css';

const OrganizationSetup = () => {
  const [activeTab, setActiveTab] = useState('departments');

  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT Infrastructure', head: 'Alex Johnson', parent: 'Technology', status: 'Active' },
    { id: 2, name: 'Human Resources', head: 'Sarah Smith', parent: 'Operations', status: 'Active' },
    { id: 3, name: 'Procurement', head: 'David Lee', parent: 'Finance', status: 'Inactive' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', count: 145, description: 'Laptops, Monitors, Phones' },
    { id: 2, name: 'Furniture', count: 320, description: 'Chairs, Desks, Cabinets' },
    { id: 3, name: 'Vehicles', count: 12, description: 'Company cars and vans' }
  ]);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Alex Johnson', dept: 'IT Infrastructure', role: 'Department Head', email: 'alex@example.com' },
    { id: 2, name: 'Mike Ross', dept: 'Legal', role: 'Employee', email: 'mike@example.com' },
    { id: 3, name: 'Emma Davis', dept: 'Facilities', role: 'Asset Manager', email: 'emma@example.com' }
  ]);

  const [locations, setLocations] = useState([
    { id: 1, name: 'Main HQ - Floor 1', type: 'Office', capacity: 150, status: 'Active' },
    { id: 2, name: 'Main HQ - Server Room', type: 'Data Center', capacity: 20, status: 'Active' },
    { id: 3, name: 'Downtown Branch', type: 'Office', capacity: 50, status: 'Active' },
    { id: 4, name: 'Storage Warehouse A', type: 'Storage', capacity: 500, status: 'Inactive' }
  ]);

  const handleDelete = (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    if (type === 'department') setDepartments(departments.filter(d => d.id !== id));
    if (type === 'category') setCategories(categories.filter(c => c.id !== id));
    if (type === 'location') setLocations(locations.filter(l => l.id !== id));
    if (type === 'employee') setEmployees(employees.filter(e => e.id !== id));
  };

  const handleAdd = () => {
    if (activeTab === 'departments') {
      const name = window.prompt("Enter Department Name:");
      if (name) setDepartments([...departments, { id: Date.now(), name, head: 'Unassigned', parent: 'None', status: 'Active' }]);
    }
    else if (activeTab === 'categories') {
      const name = window.prompt("Enter Category Name:");
      if (name) setCategories([...categories, { id: Date.now(), name, count: 0, description: 'New Category' }]);
    }
    else if (activeTab === 'locations') {
      const name = window.prompt("Enter Location Name:");
      if (name) setLocations([...locations, { id: Date.now(), name, type: 'Office', capacity: 0, status: 'Active' }]);
    }
    else if (activeTab === 'employees') {
      const name = window.prompt("Enter Employee Name:");
      if (name) setEmployees([...employees, { id: Date.now(), name, dept: 'Unassigned', role: 'Employee', email: `${name.toLowerCase().replace(' ', '.')}@example.com` }]);
    }
  };

  const handleEdit = (item, type) => {
    if (type === 'department') {
      const name = window.prompt("Edit Department Name:", item.name);
      if (name) setDepartments(departments.map(d => d.id === item.id ? { ...d, name } : d));
    }
    else if (type === 'category') {
      const name = window.prompt("Edit Category Name:", item.name);
      if (name) setCategories(categories.map(c => c.id === item.id ? { ...c, name } : c));
    }
    else if (type === 'location') {
      const name = window.prompt("Edit Location Name:", item.name);
      if (name) setLocations(locations.map(l => l.id === item.id ? { ...l, name } : l));
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-header">
        <div>
          <h1 className="page-title">Organization Setup</h1>
          <p className="page-subtitle">Manage departments, master asset categories, and assign roles.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
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
                      <span className={`status-badge ${dept.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEdit(dept, 'department')}><Edit2 size={16} /></button>
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
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEdit(cat, 'category')}><Edit2 size={16} /></button>
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
                      <span className={`status-badge ${loc.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                        {loc.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEdit(loc, 'location')}><Edit2 size={16} /></button>
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
                  <th className="text-right">Assign Role</th>
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
                    <td className="text-right">
                      <select className="form-control" defaultValue={emp.role} style={{ width: '160px', display: 'inline-block', padding: '0.25rem' }}>
                        <option value="Employee">Employee</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;
