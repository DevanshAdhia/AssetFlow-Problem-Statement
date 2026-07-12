import React, { useState } from 'react';
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
  const [tasks, setTasks] = useState(initialTasks);
  const [toastMessage, setToastMessage] = useState('');

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
        <button className="btn btn-primary">
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
    </div>
  );
};

export default Maintenance;
