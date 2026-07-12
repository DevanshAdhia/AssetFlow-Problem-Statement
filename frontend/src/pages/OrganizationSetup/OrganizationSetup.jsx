import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import './OrganizationSetup.css';

const OrganizationSetup = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT Infrastructure', head: 'Alex Johnson', parent: 'Technology', status: 'Active' },
    { id: 2, name: 'Human Resources', head: 'Sarah Smith', parent: 'Operations', status: 'Active' },
    { id: 3, name: 'Procurement', head: 'David Lee', parent: 'Finance', status: 'Inactive' },
    { id: 4, name: 'Software Development', head: 'Michael Chang', parent: 'Technology', status: 'Active' },
    { id: 5, name: 'Facilities Management', head: 'Emma Davis', parent: 'Operations', status: 'Active' }
  ]);

  return (
    <div className="setup-container">
      <div className="setup-header">
        <div>
          <h1 className="page-title">Organization Setup</h1>
          <p className="page-subtitle">Manage departments, categories, and organizational structure.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Plus size={18} />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      <div className="card setup-card">
        <div className="card-header filters-header">
          <h2 className="card-title">Departments Directory</h2>
          <div className="filters">
            <div className="search-box">
              <Search size={16} />
              <input type="text" placeholder="Search departments..." />
            </div>
            <button className="btn btn-outline filter-btn">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        <div className="table-container">
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
                      <button className="icon-btn edit-btn" title="Edit Department">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn delete-btn" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetup;
