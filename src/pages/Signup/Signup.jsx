import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css'; // Reusing some auth styles

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
        <p className="welcome-text">Create your employee account</p>
      </div>
      
      <form onSubmit={handleSignup} className="auth-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" placeholder="John Doe" required />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="john@example.com" required />
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="tel" className="form-control" placeholder="+1 234 567 890" required />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Create password" required />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type="password" className="form-control" placeholder="Confirm password" required />
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" required />
            <span>I accept the <Link to="/terms" className="forgot-link">Terms and Conditions</Link></span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100">Create Account</button>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
