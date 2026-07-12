import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Building2, Shield, Calendar,
  Edit2, Save, X, Camera, Key, CheckCircle, ArrowLeft
} from 'lucide-react';
import './Profile.css';

const buildAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=128`;

const getUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('auth_user'));
    return u || {};
  } catch { return {}; }
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser]       = useState(getUser());
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ ...getUser() });
  const [saved, setSaved]     = useState(false);
  const [pwMode, setPwMode]   = useState(false);
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const fileRef = useRef(null);

  const save = () => {
    const updated = { ...user, ...form };
    // Only fall back to initials avatar if no real image has been set
    if (!updated.avatar) {
      updated.avatar = buildAvatar(updated.name);
    }
    localStorage.setItem('auth_user', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setUser(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const cancel = () => {
    setForm({ ...user });
    setEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newAvatar = ev.target.result;
      if (editing) {
        setForm(p => ({ ...p, avatar: newAvatar }));
      } else {
        const updated = { ...user, avatar: newAvatar };
        localStorage.setItem('auth_user', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        setUser(updated);
        setForm(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const savePassword = () => {
    if (!pwForm.next || pwForm.next.length < 6) return setPwError('New password must be at least 6 characters.');
    if (pwForm.next !== pwForm.confirm) return setPwError('Passwords do not match.');
    setPwError('');
    setPwMode(false);
    setPwForm({ current: '', next: '', confirm: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const avatarSrc = (editing ? form.avatar : user.avatar) || buildAvatar(user.name || 'User');

  const roleColors = {
    Admin:           { bg: 'rgba(37,99,235,0.1)',   color: '#2563EB' },
    'Asset Manager': { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
    Employee:        { bg: 'rgba(34,197,94,0.1)',   color: '#16a34a' },
  };
  const rc = roleColors[user.role] || roleColors.Employee;

  return (
    <div className="profile-page">
      {/* Toast */}
      {saved && (
        <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', background:'#1e293b', color:'#fff', padding:'0.85rem 1.25rem', borderRadius:10, display:'flex', alignItems:'center', gap:'0.5rem', zIndex:1000, boxShadow:'0 8px 24px rgba(0,0,0,0.2)', borderLeft:'4px solid var(--success)' }}>
          <CheckCircle size={16} style={{ color:'var(--success)' }}/> Profile updated successfully!
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1>My Profile</h1>
          <p className="text-muted">Manage your account information and security settings.</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {!editing ? (
            <>
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={() => { setForm({...user}); setEditing(true); }}>
                <Edit2 size={16} /> Edit Profile
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={cancel}><X size={16}/> Cancel</button>
              <button className="btn btn-primary" onClick={save}><Save size={16}/> Save Changes</button>
            </>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card" style={{ maxWidth: 860 }}>
        <div className="profile-header-bg" />
        <div className="profile-content">

          {/* Avatar + basic identity */}
          <div style={{ display:'flex', alignItems:'flex-end', gap:'1.5rem', marginTop:'-50px', marginBottom:'1.75rem' }}>
            <div className="profile-avatar-wrapper" style={{ marginTop:0, marginBottom:0, flexShrink: 0 }}>
              <img
                src={avatarSrc}
                alt={user.name}
                className="profile-avatar-large"
                onError={e => { e.target.src = buildAvatar(user.name || 'User'); }}
                style={{ backgroundColor: 'var(--surface)' }}
              />
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarUpload} />
              <div className="upload-overlay" onClick={() => fileRef.current.click()}>
                <Camera size={22} style={{ color:'#fff' }} />
              </div>
              <span className="profile-status-badge">{user.status || 'Active'}</span>
            </div>

            <div style={{ paddingBottom:'0.5rem', zIndex: 1 }}>
              <h2 style={{ margin:0, fontSize:'1.4rem', fontWeight:700 }}>{user.name}</h2>
              <p style={{ margin:'2px 0 6px', color:'var(--text-muted)', fontSize:'0.875rem' }}>{user.email}</p>
              <span style={{ padding:'0.2rem 0.75rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700, background: rc.bg, color: rc.color }}>
                {user.role || 'Employee'}
              </span>
            </div>
          </div>

          <hr className="divider" />

          {/* Fields */}
          {editing ? (
            /* ── Edit mode ── */
            <div>
              <p className="text-muted text-sm" style={{ marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <Camera size={14}/> Click on avatar to change photo
              </p>
              <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap:'1rem' }}>
                {[
                  { key:'name',       label:'Full Name *',      type:'text',  icon:User,      placeholder:'Your full name' },
                  { key:'email',      label:'Email Address *',  type:'email', icon:Mail,      placeholder:'your@email.com' },
                  { key:'phone',      label:'Phone Number',     type:'tel',   icon:Phone,     placeholder:'+91 9876543210' },
                  { key:'department', label:'Department',       type:'text',  icon:Building2, placeholder:'Engineering' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <div className="input-with-icon">
                      <f.icon className="input-icon" size={16} />
                      <input
                        type={f.type}
                        className="form-control pl-icon"
                        placeholder={f.placeholder}
                        value={form[f.key] || ''}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    </div>
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div style={{ padding:'0.55rem 0.85rem', background:'var(--bg-color)', borderRadius:8, border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'0.875rem' }}>
                    {user.role} <span style={{ fontSize:'0.72rem' }}>(contact admin to change)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="profile-details-grid">
              {[
                { label:'Full Name',    value: user.name,       icon: User },
                { label:'Email',        value: user.email,      icon: Mail },
                { label:'Phone',        value: user.phone || '—', icon: Phone },
                { label:'Department',   value: user.department || '—', icon: Building2 },
                { label:'Role',         value: user.role,       icon: Shield },
                { label:'Member Since', value: user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'}) : '—', icon: Calendar },
              ].map((d, i) => (
                <div key={i} className="detail-item">
                  <span className="detail-label" style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    <d.icon size={13} /> {d.label}
                  </span>
                  <span className="detail-value">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Change Password section */}
          {!editing && (
            <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1.5rem', marginTop:'1.5rem' }}>
              {!pwMode ? (
                <button className="btn btn-outline" onClick={() => setPwMode(true)}>
                  <Key size={16}/> Change Password
                </button>
              ) : (
                <div style={{ maxWidth: 400 }}>
                  <h3 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:'1rem' }}>Change Password</h3>
                  {pwError && <p style={{ color:'var(--danger)', fontSize:'0.82rem', marginBottom:'0.75rem' }}>{pwError}</p>}
                  {[
                    { label:'Current Password', key:'current' },
                    { label:'New Password',      key:'next' },
                    { label:'Confirm Password',  key:'confirm' },
                  ].map(f => (
                    <div key={f.key} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input
                        type="password"
                        className="form-control"
                        value={pwForm[f.key]}
                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                  <div style={{ display:'flex', gap:'0.75rem' }}>
                    <button className="btn btn-primary" onClick={savePassword}><Save size={15}/> Update Password</button>
                    <button className="btn btn-outline" onClick={() => { setPwMode(false); setPwError(''); }}><X size={15}/> Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
