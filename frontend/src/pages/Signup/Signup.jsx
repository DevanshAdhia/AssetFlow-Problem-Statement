import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import '../Login/Login.css'; // Reusing some auth styles
import './Signup.css';

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
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Custom Country Dropdown State
  const [showCountries, setShowCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ code: '+1', flag: 'us' });

  const countries = [
    { code: '+1', flag: 'us', name: 'United States' },
    { code: '+44', flag: 'gb', name: 'United Kingdom' },
    { code: '+91', flag: 'in', name: 'India' },
    { code: '+61', flag: 'au', name: 'Australia' },
    { code: '+81', flag: 'jp', name: 'Japan' }
  ];

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailVerified) {
      setError("Please verify your email to proceed.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    const fullPhone = `${selectedCountry.code}${phone}`;
    
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          confirm_password: confirmPassword,
          full_name: fullName,
          phone: fullPhone,
          otp: otp
        })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.detail || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error during registration.');
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

  return (
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
                <img src={`https://flagcdn.com/w20/${selectedCountry.flag}.png`} alt="flag" />
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
                      <img src={`https://flagcdn.com/w20/${c.flag}.png`} alt="flag" />
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

        <button type="submit" className="btn btn-primary w-100">Create Account</button>
        
        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button type="button" className="btn btn-outline w-100 btn-google" onClick={handleSignup}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Continue with Google
        </button>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
