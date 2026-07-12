import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
        <p className="welcome-text">Welcome Back, Please login to your account.</p>
      </div>
      
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              className="form-control pl-icon" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-with-icon">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              className="form-control pl-icon" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Remember Me</span>
          </label>
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button type="button" className="btn btn-outline w-100 btn-google" onClick={() => navigate('/dashboard')}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Continue with Google
        </button>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
