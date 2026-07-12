import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import '../Login/Login.css';

const ForgotPassword = () => {
  return (
    <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
        <p className="welcome-text">Forgot Password?</p>
        <p className="text-sm mt-2">Enter your email to receive a reset link</p>
      </div>
      
      <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              className="form-control pl-icon" 
              placeholder="Enter your email" 
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-4">Send Reset Link</button>
        
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
