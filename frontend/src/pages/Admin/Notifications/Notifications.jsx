import React, { useState } from 'react';
import { notificationsList } from '../../../data/mockData';
import { Bell } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notificationsList.filter(notif => 
    activeTab === 'all' || notif.type === activeTab
  );

  return (
    <div className="notifications-page">
      <div className="page-header flex-between">
        <div>
          <h1>Notifications</h1>
          <p className="text-muted">Stay updated with your latest alerts.</p>
        </div>
        <button className="btn btn-outline btn-sm">Mark all as read</button>
      </div>

      <div className="notification-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >All</button>
        <button 
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >Alerts</button>
        <button 
          className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >Approvals</button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >Bookings</button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">No notifications found for this category.</div>
        ) : (
          filteredNotifications.map(notif => (
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
        )))}
      </div>
    </div>
  );
};

export default Notifications;
