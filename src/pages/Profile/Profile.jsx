import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../../data/mockData';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="text-muted">Manage your account information and preferences.</p>
      </div>

      <div className="profile-card">
        <div className="profile-header-bg"></div>
        <div className="profile-content">
          <div className="profile-avatar-wrapper">
            <img src={currentUser.avatar} alt="Profile" className="profile-avatar-large" />
            <span className="status-badge">{currentUser.status}</span>
          </div>
          
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{currentUser.name}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{currentUser.email}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{currentUser.phone}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span className="detail-value">{currentUser.department}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Role</span>
              <span className="detail-value">{currentUser.role}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
            <button className="btn btn-outline" onClick={() => navigate('/change-password')}>Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
