import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    const googleUser = {
      name: "Google User",
      email: "demo.user@gmail.com",
      phone: "+1 800 555 0199",
      department: "Cloud Operations",
      role: "Employee",
      status: "Active",
      avatar: "https://www.svgrepo.com/show/475656/google-color.svg"
    };
    localStorage.setItem('auth_user', JSON.stringify(googleUser));
    localStorage.setItem('token', 'google-oauth-demo-token');
    window.location.href = '/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        
        // If they don't have an auth_user, generate a basic one
        if (!localStorage.getItem('auth_user')) {
          localStorage.setItem('auth_user', JSON.stringify({
            name: email.split('@')[0],
            email: email,
            phone: '+1 234 567 8900',
            department: 'Engineering',
            role: 'Employee',
            status: 'Active',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
          }));
        }
        
        // Use window.location to force a reload so mockData.js grabs the new auth_user
        window.location.href = '/dashboard';
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Fallback for UI Demo
      const storedUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
      if (storedUser && storedUser.email === email) {
        localStorage.setItem('token', 'demo-token');
      } else {
        localStorage.setItem('auth_user', JSON.stringify({
          name: email.split('@')[0],
          email: email,
          phone: '+1 234 567 8900',
          department: 'Engineering',
          role: 'Employee',
          status: 'Active',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
        }));
        localStorage.setItem('token', 'demo-token');
      }
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
      </div>
      
      <form onSubmit={handleLogin} className="auth-form">
        {error && <div className="error-message text-danger mb-3 text-sm">{error}</div>}
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

        <button type="button" className="btn btn-outline w-100 btn-google" onClick={handleGoogleAuth}>
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
