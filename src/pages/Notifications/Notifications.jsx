import React from 'react';
import { notificationsList } from '../../data/mockData';
import { Bell } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  return (
    <div className="notifications-page">
      <div className="page-header flex-between">
        <div>
          <h1>Notifications</h1>
          <p className="text-muted">Stay updated with your latest alerts.</p>
        </div>
        <button className="btn btn-outline btn-sm">Mark all as read</button>
      </div>

      <div className="notifications-list">
        {notificationsList.map(notif => (
          <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
            <div className="notif-icon-wrapper">
              <Bell size={20} className={!notif.read ? 'text-primary' : 'text-muted'} />
            </div>
            <div className="notif-content">
              <h4>{notif.title}</h4>
              <p>{notif.message}</p>
              <span className="notif-time">{notif.time}</span>
            </div>
            {!notif.read && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
