import React, { useState } from 'react';
import { Download, Filter, Search, Shield, User, Settings, Package } from 'lucide-react';
import { activityLogsData } from '../../../data/mockData';
import './ActivityLogs.css';

const ActivityLogs = () => {
  return (
    <div className="activity-logs-page">
      <div className="page-header">
        <h1>Activity Logs</h1>
        <p className="text-muted">Track all system activities and user actions.</p>
      </div>

      <div className="table-container card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activityLogsData.map(log => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>
                  <div className="user-cell">
                    <span className="user-initial">{log.user.charAt(0)}</span>
                    {log.user}
                  </div>
                </td>
                <td>{log.action}</td>
                <td>
                  <span className={`status-pill ${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
