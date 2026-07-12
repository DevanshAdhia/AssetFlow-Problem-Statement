import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Building2, Shield, ChevronDown } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './Login.css';

const DEMO_USERS = [
  {
    name: 'Bharat Rathor',
    email: 'admin@assetflow.com',
    password: 'admin123',
    phone: '+91 98765 43210',
    department: 'Engineering',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'Priya Sharma',
    email: 'manager@assetflow.com',
    password: 'manager123',
    phone: '+91 91234 56789',
    department: 'Operations',
    role: 'Asset Manager',
    status: 'Active',
  },
  {
    name: 'Suresh Kumar',
    email: 'depthead@assetflow.com',
    password: 'head123',
    phone: '+91 99887 76655',
    department: 'Engineering',
    role: 'Department Head',
    status: 'Active',
  },
  {
    name: 'Rahul Verma',
    email: 'employee@assetflow.com',
    password: 'emp123',
    phone: '+91 87654 32109',
    department: 'Sales',
    role: 'Employee',
    status: 'Active',
  },
];

const ROLE_ROUTES = {
  Admin:             '/dashboard',
  'Asset Manager':   '/asset-manager/dashboard',
  'Department Head': '/dept-head/dashboard',
  Employee:          '/dashboard',
};

const buildAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=128`;

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const saveAndRedirect = (user) => {
    const userData = {
      name:       user.name,
      email:      user.email,
      phone:      user.phone       || '',
      department: user.department  || '',
      role:       user.role        || 'Employee',
      status:     user.status      || 'Active',
      avatar:     user.avatar      || buildAvatar(user.name),
      joinDate:   user.joinDate    || new Date().toISOString().split('T')[0],
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('token', 'demo-token-' + Date.now());
    window.location.href = ROLE_ROUTES[userData.role] || '/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ── Check demo users first ──
    const demoMatch = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (demoMatch) {
      saveAndRedirect(demoMatch);
      return;
    }

    // ── Try real backend ──
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        const user = data.user || {
          name:       email.split('@')[0].replace('.', ' '),
          email:      email,
          phone:      '',
          department: '',
          role:       'Employee',
          status:     'Active',
        };
        saveAndRedirect(user);
      } else {
        setError(data.detail || 'Invalid credentials. Please try again.');
        setLoading(false);
      }
    } catch {
      // Backend offline — allow any email/password as demo
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      saveAndRedirect({ name, email, phone: '', department: 'General', role: 'Employee', status: 'Active' });
    }
  };

  const handleGoogleAuth = () => {
    saveAndRedirect({
      name:       'Google Demo User',
      email:      'demo@gmail.com',
      phone:      '+1 800 555 0199',
      department: 'Cloud Operations',
      role:       'Employee',
      status:     'Active',
      avatar:     buildAvatar('Google Demo User'),
    });
  };

  const fillDemo = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
          Enterprise Asset Management
        </p>
      </div>

      {/* Demo quick-login pills */}
      <div className="demo-pills">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Quick demo:</span>
        {DEMO_USERS.map(u => (
          <button key={u.role} type="button" className="demo-pill" onClick={() => fillDemo(u)}>
            <Shield size={12} /> {u.role}
          </button>
        ))}
      </div>

      <form onSubmit={handleLogin} className="auth-form">
        {error && <div className="error-message text-danger mb-3 text-sm">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-with-icon">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              className="form-control pl-icon"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" /> <span>Remember Me</span>
          </label>
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>

        <div className="auth-divider"><span>OR</span></div>

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
