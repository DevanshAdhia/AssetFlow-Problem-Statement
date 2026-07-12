import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import '../Login/Login.css';

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
        <p className="welcome-text">Reset Password</p>
      </div>
      
      <form onSubmit={handleReset} className="auth-form">
        <div className="form-group">
          <label className="form-label">New Password</label>
          <div className="input-with-icon">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              className="form-control pl-icon" 
              placeholder="Enter new password" 
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="input-with-icon">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              className="form-control pl-icon" 
              placeholder="Confirm new password" 
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
