import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Wrench, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import './Maintenance.css';

const initialTasks = [
  { id: 't1', title: 'Projector bulb replacement', asset: 'Projector X-1', tag: 'AF-009', priority: 'High', column: 'pending', date: 'Oct 12' },
  { id: 't2', title: 'Laptop screen issues', asset: 'Dell XPS 15', tag: 'AF-042', priority: 'Medium', column: 'pending', date: 'Oct 14' },
  { id: 't3', title: 'Keyboard not responding', asset: 'Logitech K120', tag: 'AF-105', priority: 'Low', column: 'approved', date: 'Oct 10' },
  { id: 't4', title: 'Server rack cooling failure', asset: 'Server Rack B', tag: 'AF-002', priority: 'Critical', column: 'assigned', date: 'Oct 15' },
  { id: 't5', title: 'RAM Upgrade', asset: 'MacBook Pro', tag: 'AF-018', priority: 'Medium', column: 'in_progress', date: 'Oct 11' },
  { id: 't6', title: 'Network switch replacement', asset: 'Cisco Switch', tag: 'AF-088', priority: 'High', column: 'resolved', date: 'Oct 09' }
];

const Maintenance = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('admin_maintenance');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem('admin_maintenance', JSON.stringify(tasks));
  }, [tasks]);

  const [toastMessage, setToastMessage] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', asset: '', tag: '', priority: 'Medium', date: ''
  });

  const handleAddRequest = (e) => {
    e.preventDefault();
    const newTask = {
      id: `t${Date.now()}`,
      title: formData.title,
      asset: formData.asset,
      tag: formData.tag || `AF-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`,
      priority: formData.priority,
      column: 'pending',
      date: formData.date || 'Today'
    };
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setFormData({ title: '', asset: '', tag: '', priority: 'Medium', date: '' });
  };

  const moveTask = (taskId, newColumn, assetName) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, column: newColumn } : task
    ));

    if (newColumn === 'approved') {
      showToast(`Automation: ${assetName} status changed to "Under Maintenance". It is now masked from other workflows.`);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const columns = [
    { id: 'pending', title: 'Pending' },
    { id: 'approved', title: 'Approved' },
    { id: 'assigned', title: 'Technician Assigned' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'resolved', title: 'Resolved' }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-danger bg-danger-light border-danger';
      case 'High': return 'text-warning bg-warning-light border-warning';
      case 'Medium': return 'text-primary bg-primary-light border-primary';
      default: return 'text-muted bg-gray-light border-gray';
    }
  };

  const getNextColumn = (currentCol) => {
    const idx = columns.findIndex(c => c.id === currentCol);
    if (idx >= 0 && idx < columns.length - 1) {
      return columns[idx + 1].id;
    }
    return null;
  };

  return (
    <div className="maintenance-page">
      <div className="page-header flex-between">
        <div>
          <h1>Maintenance Management</h1>
          <p className="text-muted">Track and manage asset repairs via Kanban workflow.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Request
        </button>
      </div>

      {toastMessage && (
        <div className="automation-toast">
          <AlertTriangle size={18} />
          {toastMessage}
        </div>
      )}

      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.id} className="kanban-column">
            <div className="kanban-column-header">
              <h3>{col.title} <span>{tasks.filter(t => t.column === col.id).length}</span></h3>
            </div>
            
            <div className="kanban-cards-container">
              {tasks.filter(t => t.column === col.id).map(task => {
                const nextCol = getNextColumn(task.column);
                return (
                  <div key={task.id} className="kanban-card">
                    <div className="card-top flex-between">
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <MoreVertical size={16} className="text-muted cursor-pointer" />
                    </div>
                    
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-asset">{task.asset} <span className="text-muted">({task.tag})</span></p>
                    
                    <div className="card-bottom flex-between mt-2">
                      <div className="task-date flex-align-center gap-1 text-muted">
                        <Clock size={14} /> {task.date}
                      </div>
                      
                      {nextCol && (
                        <button 
                          className="btn btn-outline btn-xs"
                          onClick={() => moveTask(task.id, nextCol, task.asset)}
                        >
                          {col.id === 'pending' ? 'Approve' : 
                           col.id === 'approved' ? 'Assign' : 
                           col.id === 'assigned' ? 'Start' : 'Resolve'}
                        </button>
                      )}
                      {!nextCol && (
                        <span className="text-success flex-align-center gap-1">
                          <CheckCircle size={14} /> Done
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Maintenance Request</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddRequest}>
              <div className="modal-body">
                <div className="grid-form" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Issue Title *</label>
                    <input type="text" className="form-control" placeholder="e.g. Broken screen" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asset Name *</label>
                    <input type="text" className="form-control" placeholder="e.g. Dell XPS 15" required value={formData.asset} onChange={e => setFormData({...formData, asset: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asset Tag (Optional)</label>
                    <input type="text" className="form-control" placeholder="e.g. AF-042" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-control" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date Reported</label>
                    <input type="text" className="form-control" placeholder="e.g. Oct 16" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer mt-4 flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">Submit Request</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
