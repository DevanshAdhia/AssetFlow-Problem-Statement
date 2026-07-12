import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import '../Login/Login.css';
import './Signup.css';

const ROLE_ROUTES = {
  Admin:             '/dashboard',
  'Asset Manager':   '/asset-manager/dashboard',
  'Department Head': '/dept-head/dashboard',
  Employee:          '/employee/dashboard',
};

const GOOGLE_ACCOUNTS = [
  { name: 'Bharat Rathor', email: 'bharat.rathor@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Bharat+Rathor&background=EA4335&color=fff&bold=true&size=80' },
  { name: 'Priya Sharma',  email: 'priya.sharma@gmail.com',  avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=34A853&color=fff&bold=true&size=80' },
  { name: 'Suresh Kumar',  email: 'suresh.kumar@gmail.com',  avatar: 'https://ui-avatars.com/api/?name=Suresh+Kumar&background=FBBC04&color=fff&bold=true&size=80' },
  { name: 'Rahul Verma',   email: 'rahul.verma@gmail.com',   avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=4285F4&color=fff&bold=true&size=80' },
];

const GoogleAccountPicker = ({ role, onSelect, onClose }) => {
  const modalRef = useRef(null);
  useEffect(() => {
    const h = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
      <div ref={modalRef} style={{ background:'#fff', borderRadius:28, width:400, maxWidth:'94vw', boxShadow:'0 24px 60px rgba(0,0,0,0.25)', overflow:'hidden', fontFamily:"'Google Sans','Segoe UI',sans-serif", animation:'gPickerIn 0.22s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ padding:'32px 32px 0', textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
            {[['G','#4285F4'],['o','#EA4335'],['o','#FBBC05'],['g','#4285F4'],['l','#34A853'],['e','#EA4335']].map(([l,c],i)=><span key={i} style={{fontSize:26,fontWeight:700,color:c}}>{l}</span>)}
          </div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:500, color:'#202124' }}>Sign in with Google</h2>
          <p style={{ margin:'8px 0 0', fontSize:14, color:'#5f6368' }}>Choose an account to continue to <strong>AssetFlow</strong></p>
        </div>
        <div style={{ padding:'16px 8px', maxHeight:280, overflowY:'auto' }}>
          {GOOGLE_ACCOUNTS.map(acc => (
            <button key={acc.email} onClick={() => onSelect(acc)} style={{ display:'flex', alignItems:'center', gap:14, width:'100%', padding:'12px 24px', border:'none', background:'transparent', cursor:'pointer', borderRadius:12, textAlign:'left', transition:'background 0.15s' }} onMouseEnter={e=>e.currentTarget.style.background='#f1f3f4'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <img src={acc.avatar} alt={acc.name} style={{ width:46, height:46, borderRadius:'50%', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:15, color:'#202124' }}>{acc.name}</div>
                <div style={{ fontSize:13, color:'#5f6368', marginTop:2 }}>{acc.email}</div>
              </div>
            </button>
          ))}
          <button onClick={onClose} style={{ display:'flex', alignItems:'center', gap:14, width:'100%', padding:'12px 24px', border:'none', background:'transparent', cursor:'pointer', borderRadius:12, textAlign:'left' }} onMouseEnter={e=>e.currentTarget.style.background='#f1f3f4'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <div style={{ width:46, height:46, borderRadius:'50%', background:'#f1f3f4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#5f6368" d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            </div>
            <div style={{ fontWeight:500, fontSize:15, color:'#202124' }}>Use another account</div>
          </button>
        </div>
        <div style={{ borderTop:'1px solid #e8eaed', padding:'16px 24px', display:'flex', justifyContent:'space-between', fontSize:12, color:'#5f6368' }}>
          <div style={{ display:'flex', gap:16 }}><a href="#" style={{ color:'#5f6368', textDecoration:'none' }}>Privacy</a><a href="#" style={{ color:'#5f6368', textDecoration:'none' }}>Terms</a></div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#5f6368', fontSize:12 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showGoogle, setShowGoogle] = useState(false);
  
  // Custom Country Dropdown State
  const [showCountries, setShowCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+1', flag: '🇺🇸' });

  const countries = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' }
  ];

  const handleGooglePick = (acc) => {
    const userData = {
      name: acc.name, email: acc.email, phone: '', department: 'General',
      role: role, status: 'Active', avatar: acc.avatar,
      joinDate: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('token', 'google-oauth-demo-token');
    window.dispatchEvent(new Event('storage'));
    window.location.href = ROLE_ROUTES[role] || '/employee/dashboard';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailVerified) {
      setError("Please verify your email to proceed.");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/^[A-Z]/.test(password)) {
      setError("Password must start with a capital letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    const fullPhone = `${selectedCountry.code}${phone}`;
    
    const newUser = {
      name: fullName,
      email: email,
      phone: fullPhone,
      department: 'General',
      role: role,
      status: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563EB&color=fff&bold=true&size=128`,
      joinDate: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone: fullPhone
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        navigate('/login');
      } else {
        setError(data.detail || 'Registration failed.');
      }
    } catch (err) {
      // Demo fallback if backend is offline
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      navigate('/login');
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setShowOtp(true);
        setSuccessMsg('OTP sent to your email.');
      } else {
        const data = await res.json();
        setError(data.detail || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Network error while sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length === 4) {
      try {
        const res = await fetch(API_ENDPOINTS.VERIFY_OTP, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: otp })
        });
        if (res.ok) {
          setEmailVerified(true);
          setShowOtp(false);
          setSuccessMsg('Email verified successfully!');
        } else {
          const data = await res.json();
          setError(data.detail || 'Invalid OTP.');
        }
      } catch (err) {
        setError('Network error while verifying OTP.');
      }
    } else {
      setError("Please enter a valid 4-digit OTP.");
    }
  };

  const ROLE_META = {
    Admin:             { color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  label: 'Full system access' },
    'Asset Manager':   { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', label: 'Manage all assets' },
    'Department Head': { color: '#0284c7', bg: 'rgba(2,132,199,0.08)',  label: 'Dept. oversight' },
    Employee:          { color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  label: 'Self-service portal' },
  };

  return (
    <>
      {showGoogle && <GoogleAccountPicker role={role} onSelect={handleGooglePick} onClose={() => setShowGoogle(false)} />}
      <div className="login-wrapper">
      <div className="auth-header">
        <h1 className="brand-logo">AssetFlow</h1>
        <p className="welcome-text">Create your employee account</p>
      </div>
      
      <form onSubmit={handleSignup} className="auth-form">
        {error && <div className="error-message text-danger mb-3 text-sm">{error}</div>}
        {successMsg && <div className="success-message text-success mb-3 text-sm">{successMsg}</div>}
        
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="verify-input-group">
            <input type="email" className="form-control" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={emailVerified} />
            {emailVerified ? (
              <span className="verified-badge"><CheckCircle2 size={18} /> Verified</span>
            ) : (
              <button type="button" className="btn btn-outline btn-verify" onClick={handleSendOtp}>
                Send OTP
              </button>
            )}
          </div>
        </div>

        {showOtp && !emailVerified && (
          <div className="form-group slide-down">
            <label className="form-label">Enter OTP</label>
            <div className="verify-input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="1234" 
                maxLength="4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className="btn btn-primary btn-verify" onClick={handleVerifyOtp}>
                Verify
              </button>
            </div>
            <p className="help-text">OTP sent! (Hint: Type any 4 digits)</p>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Phone</label>
          <div className="phone-input-group">
            
            <div className="custom-country-select">
              <div 
                className="country-select-trigger form-control" 
                onClick={() => setShowCountries(!showCountries)}
              >
                <span style={{ fontSize: '1.2rem' }}>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
                <ChevronDown size={14} className={`chevron-icon ${showCountries ? 'open' : ''}`} />
              </div>
              
              {showCountries && (
                <div className="country-options">
                  {countries.map(c => (
                    <div 
                      key={c.code} 
                      className="country-option"
                      onClick={() => {
                        setSelectedCountry(c);
                        setShowCountries(false);
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{c.flag}</span>
                      <span>{c.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input type="tel" className="form-control phone-number" placeholder="234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="form-group half-width">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" required />
            <span>I accept the <Link to="/terms" className="forgot-link">Terms and Conditions</Link></span>
          </label>
        </div>
          
        <div className="form-group mb-4">
          <label className="form-label">Register As</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 4 }}>
            {Object.entries(ROLE_META).map(([r, rm]) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                style={{
                  padding: '0.5rem 0.75rem', borderRadius: 10,
                  border: `2px solid ${role === r ? rm.color : 'var(--border)'}`,
                  background: role === r ? rm.bg : 'var(--surface)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: role === r ? rm.color : 'var(--text-main)' }}>{r}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{rm.label}</div>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '1rem' }}>Create Account</button>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button type="button" className="btn btn-outline w-100 btn-google" onClick={() => setShowGoogle(true)}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Continue with Google
        </button>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
    </>
  );
};

export default Signup;
