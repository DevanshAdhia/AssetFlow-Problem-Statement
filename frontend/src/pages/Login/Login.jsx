import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, CheckCircle2, ChevronDown, Shield } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './Login.css';

const DEMO_USERS = [
  { name: 'Bharat Rathor',  email: 'admin@assetflow.com',    password: 'admin123',   phone: '+91 98765 43210', department: 'Engineering', role: 'Admin',            status: 'Active' },
  { name: 'Priya Sharma',   email: 'manager@assetflow.com',  password: 'manager123', phone: '+91 91234 56789', department: 'Operations',   role: 'Asset Manager',    status: 'Active' },
  { name: 'Suresh Kumar',   email: 'depthead@assetflow.com', password: 'head123',    phone: '+91 99887 76655', department: 'Engineering', role: 'Department Head',  status: 'Active' },
  { name: 'Rahul Verma',    email: 'employee@assetflow.com', password: 'emp123',     phone: '+91 87654 32109', department: 'Sales',       role: 'Employee',         status: 'Active' },
];

const ROLE_ROUTES = {
  Admin:             '/dashboard',
  'Asset Manager':   '/asset-manager/dashboard',
  'Department Head': '/dept-head/dashboard',
  Employee:          '/employee/dashboard',
};

// Simulated Google accounts for the picker
const GOOGLE_ACCOUNTS = [
  { name: 'Bharat Rathor',  email: 'bharat.rathor@gmail.com',   avatar: 'https://ui-avatars.com/api/?name=Bharat+Rathor&background=EA4335&color=fff&bold=true&size=80' },
  { name: 'Priya Sharma',   email: 'priya.sharma@gmail.com',    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=34A853&color=fff&bold=true&size=80' },
  { name: 'Suresh Kumar',   email: 'suresh.kumar@gmail.com',    avatar: 'https://ui-avatars.com/api/?name=Suresh+Kumar&background=FBBC04&color=fff&bold=true&size=80' },
  { name: 'Rahul Verma',    email: 'rahul.verma@gmail.com',     avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=4285F4&color=fff&bold=true&size=80' },
];

const buildAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=128`;

// ── Google Account Picker Modal ──────────────────────────────────────────────
const GoogleAccountPicker = ({ role, onSelect, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div ref={modalRef} style={{
        background: '#fff', borderRadius: 28, width: 400, maxWidth: '94vw',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
        fontFamily: "'Google Sans', 'Segoe UI', sans-serif",
        animation: 'gPickerIn 0.22s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Google modal header */}
        <div style={{ padding: '32px 32px 0', textAlign: 'center' }}>
          {/* Google logo */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#4285F4' }}>G</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#EA4335' }}>o</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#FBBC05' }}>o</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#4285F4' }}>g</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#34A853' }}>l</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#EA4335' }}>e</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 500, color: '#202124' }}>Sign in with Google</h2>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#5f6368' }}>
            Choose an account to continue to <strong>AssetFlow</strong>
          </p>
        </div>

        {/* Account list */}
        <div style={{ padding: '16px 8px', maxHeight: 280, overflowY: 'auto' }}>
          {GOOGLE_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              onClick={() => onSelect(acc)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                width: '100%', padding: '12px 24px', border: 'none',
                background: 'transparent', cursor: 'pointer', borderRadius: 12,
                textAlign: 'left', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f3f4'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <img src={acc.avatar} alt={acc.name} style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 15, color: '#202124' }}>{acc.name}</div>
                <div style={{ fontSize: 13, color: '#5f6368', marginTop: 2 }}>{acc.email}</div>
              </div>
            </button>
          ))}

          {/* Use another account */}
          <button
            onClick={() => onClose()}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              width: '100%', padding: '12px 24px', border: 'none',
              background: 'transparent', cursor: 'pointer', borderRadius: 12,
              textAlign: 'left', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f3f4'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#5f6368" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            </div>
            <div style={{ fontWeight: 500, fontSize: 15, color: '#202124' }}>Use another account</div>
          </button>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e8eaed', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5f6368' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ color: '#5f6368', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#5f6368', textDecoration: 'none' }}>Terms of Service</a>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368', fontSize: 12 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Login Component ─────────────────────────────────────────────────────
const Login = () => {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [role,        setRole]        = useState('Employee');
  const [showPw,      setShowPw]      = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showGoogle,  setShowGoogle]  = useState(false);
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
    window.dispatchEvent(new Event('storage'));
    window.location.href = ROLE_ROUTES[userData.role] || '/dashboard';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const demoMatch = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (demoMatch) { saveAndRedirect(demoMatch); return; }

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        saveAndRedirect(data.user || { name: email.split('@')[0], email, phone: '', department: '', role, status: 'Active' });
      } else {
        setError(data.detail || 'Invalid credentials. Please try again.');
        setLoading(false);
      }
    } catch {
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      saveAndRedirect({ name, email, phone: '', department: 'General', role, status: 'Active' });
    }
  };

  // Called when user picks a Google account from the modal
  const handleGooglePick = (acc) => {
    setShowGoogle(false);
    saveAndRedirect({
      name:       acc.name,
      email:      acc.email,
      phone:      '',
      department: 'General',
      role:       role,
      status:     'Active',
      avatar:     acc.avatar,
    });
  };

  const fillDemo = (user) => { setEmail(user.email); setPassword(user.password); setError(''); };

  const ROLE_META = {
    Admin:             { color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  label: 'Full system access' },
    'Asset Manager':   { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', label: 'Manage all assets' },
    'Department Head': { color: '#0284c7', bg: 'rgba(2,132,199,0.08)',  label: 'Dept. oversight' },
    Employee:          { color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  label: 'Self-service portal' },
  };
  const rm = ROLE_META[role] || ROLE_META.Employee;

  return (
    <>
      {showGoogle && <GoogleAccountPicker role={role} onSelect={handleGooglePick} onClose={() => setShowGoogle(false)} />}

      <div className="login-wrapper">
        {/* Brand */}
        <div className="auth-header">
          <h1 className="brand-logo">AssetFlow</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            Enterprise Asset Management
          </p>
        </div>

        {/* Demo credential cards */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            🔑 Demo Credentials — click to auto-fill
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            {DEMO_USERS.map(u => {
              const colors = {
                Admin: '#2563EB', 'Asset Manager': '#7c3aed',
                'Department Head': '#0284c7', Employee: '#16a34a',
              };
              const c = colors[u.role] || '#2563EB';
              return (
                <button key={u.email} onClick={() => { fillDemo(u); setRole(u.role); }}
                  style={{
                    background: 'var(--surface)', border: `1.5px solid var(--border)`,
                    borderRadius: 10, padding: '0.5rem 0.6rem', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.15s', borderLeft: `3px solid ${c}`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: c, marginBottom: 2 }}>{u.role}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{u.email}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>pw: {u.password}</div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="error-message text-danger mb-3 text-sm">{error}</div>}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input type="email" className="form-control pl-icon"
                placeholder="Enter your email" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input type={showPw ? 'text' : 'password'} className="form-control pl-icon"
                style={{ paddingRight: '2.75rem' }}
                placeholder="Enter your password" value={password}
                onChange={e => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div className="form-group">
            <label className="form-label">Login As</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {Object.keys(ROLE_META).map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  style={{
                    padding: '0.5rem 0.75rem', borderRadius: 10, border: `2px solid ${role === r ? ROLE_META[r].color : 'var(--border)'}`,
                    background: role === r ? ROLE_META[r].bg : 'var(--surface)', cursor: 'pointer',
                    textAlign: 'left', transition: 'all 0.15s',
                  }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: role === r ? ROLE_META[r].color : 'var(--text-main)' }}>{r}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{ROLE_META[r].label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing in…' : `Sign in as ${role}`}
          </button>

          <div className="auth-divider"><span>OR</span></div>

          {/* Google button — opens picker modal */}
          <button type="button" className="btn btn-outline w-100 btn-google" onClick={() => setShowGoogle(true)}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
            Continue with Google
          </button>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
