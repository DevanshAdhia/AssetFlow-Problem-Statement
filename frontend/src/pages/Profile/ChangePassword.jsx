import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const ChangePassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Change Password</h1>
        <p className="text-muted">Update your account password to stay secure.</p>
      </div>

      <div className="card max-w-md">
        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-control" placeholder="Enter current password" required />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-control" placeholder="Enter new password" required />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" className="form-control" placeholder="Confirm new password" required />
          </div>

          <div className="form-actions mt-4">
            <button type="submit" className="btn btn-primary">Update Password</button>
            <button type="button" className="btn btn-outline ml-2" onClick={() => navigate('/profile')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
