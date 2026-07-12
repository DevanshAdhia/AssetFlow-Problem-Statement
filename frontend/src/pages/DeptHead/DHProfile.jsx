import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Building2, MapPin, Edit2, CheckCircle, Lock, Bell, Camera, X, Save, Eye, EyeOff } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const buildAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=150`;

const DHProfile = () => {
  const [user, setUser] = useState({ name: '', email: '', phone: '', department: '', role: '', avatar: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [pwModal, setPwModal] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_user'));
      if (u) {
        if (!u.avatar) u.avatar = buildAvatar(u.name);
        setUser(u); setFormData(u);
      }
    } catch (e) {}
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = editMode
        ? { ...formData, avatar: ev.target.result }
        : { ...user, avatar: ev.target.result };
      if (editMode) {
        setFormData(updated);
      } else {
        setUser(updated);
        localStorage.setItem('auth_user', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      }
      setToast('Profile picture updated!');
      setTimeout(() => setToast(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...formData };
    localStorage.setItem('auth_user', JSON.stringify(updated));
    setUser(updated);
    setEditMode(false);
    setToast('Profile updated successfully!');
    setTimeout(() => setToast(null), 4000);
    window.dispatchEvent(new Event('storage'));
  };

  const handleChangePw = () => {
    if (!pw.current) { setPwError('Enter your current password.'); return; }
    if (pw.next.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pw.next !== pw.confirm) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setPwModal(false);
    setPw({ current: '', next: '', confirm: '' });
    setToast('Password changed successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  const avatarSrc = (editMode ? formData.avatar : user.avatar) || buildAvatar(user.name || 'User');

  return (
    <div className="dh-page">
      {toast && (
        <div style={{ position:'fixed', top:'1.25rem', right:'1.25rem', zIndex:9999, background:'#1e293b', color:'#fff', padding:'0.85rem 1.25rem', borderRadius:10, display:'flex', alignItems:'center', gap:'0.6rem', boxShadow:'0 8px 24px rgba(0,0,0,.18)', borderLeft:'4px solid #16a34a', minWidth:280 }}>
          <CheckCircle size={16} style={{ color:'#16a34a' }}/>{toast}
        </div>
      )}

      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">My Profile</h1>
          <p className="dh-page-subtitle">Manage your personal information and preferences.</p>
        </div>
        {!editMode && (
          <button className="dh-btn dh-btn-primary" onClick={() => { setFormData({...user}); setEditMode(true); }}>
            <Edit2 size={15}/> Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Profile Card */}
        <div className="dh-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <img
              src={avatarSrc}
              alt={user.name}
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--dh-primary)', boxShadow: '0 4px 16px rgba(37,99,235,0.2)' }}
              onError={e => { e.target.src = buildAvatar(user.name); }}
            />
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            <button
              onClick={() => fileRef.current.click()}
              title="Change photo"
              style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--dh-primary)', border: '2px solid #fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <Camera size={15} />
            </button>
          </div>

          <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 700 }}>{user.name}</h2>
          <span className="dh-badge dh-badge-allocated" style={{ marginBottom: '1.5rem' }}>{user.role}</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--dh-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <Mail size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>{user.email || '—'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <Phone size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>{user.phone || '—'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <Building2 size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>{user.department ? `${user.department} Dept.` : '—'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <MapPin size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>Bangalore, HQ</span>
            </div>
          </div>
        </div>

        {/* Details / Edit Form */}
        <div className="dh-card">
          <div className="dh-card-header">
            <h3 className="dh-card-title">{editMode ? 'Edit Information' : 'Personal Information'}</h3>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {editMode ? (
              <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input className="dh-form-control" style={{ width: '100%' }} value={formData.name || ''} onChange={e=>setFormData({...formData, name:e.target.value})} required/>
                </div>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" className="dh-form-control" style={{ width: '100%' }} value={formData.email || ''} onChange={e=>setFormData({...formData, email:e.target.value})} required/>
                </div>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Phone Number</label>
                  <input className="dh-form-control" style={{ width: '100%' }} value={formData.phone || ''} onChange={e=>setFormData({...formData, phone:e.target.value})}/>
                </div>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Department</label>
                  <input className="dh-form-control" style={{ width: '100%', background: 'var(--dh-bg)' }} value={formData.department || ''} disabled/>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="button" className="dh-btn dh-btn-outline" onClick={() => { setEditMode(false); setFormData(user); }}><X size={15}/> Cancel</button>
                  <button type="submit" className="dh-btn dh-btn-primary"><Save size={15}/> Save Changes</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Full Name</p><p style={{ margin: 0, fontWeight: 600 }}>{user.name || '—'}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Email Address</p><p style={{ margin: 0, fontWeight: 600 }}>{user.email || '—'}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Phone Number</p><p style={{ margin: 0, fontWeight: 600 }}>{user.phone || '—'}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Department</p><p style={{ margin: 0, fontWeight: 600 }}>{user.department || '—'}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Designation</p><p style={{ margin: 0, fontWeight: 600 }}>{user.role || 'Department Head'}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Member Since</p><p style={{ margin: 0, fontWeight: 600 }}>{user.joinDate || '—'}</p></div>
              </div>
            )}
          </div>
          
          {/* Security section — Change Password */}
          {!editMode && (
            <>
              <div className="dh-card-header" style={{ borderTop: '1px solid var(--dh-border)' }}>
                <h3 className="dh-card-title">Security</h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {!pwModal ? (
                  <button className="dh-btn dh-btn-outline" style={{ justifyContent: 'center', width: '100%' }} onClick={() => setPwModal(true)}>
                    <Lock size={15}/> Change Password
                  </button>
                ) : (
                  <div style={{ maxWidth: 400 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Change Password</h4>
                    {pwError && <p style={{ color: '#dc2626', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{pwError}</p>}
                    {[
                      { label: 'Current Password', key: 'current' },
                      { label: 'New Password', key: 'next' },
                      { label: 'Confirm New Password', key: 'confirm' },
                    ].map(f => (
                      <div key={f.key} style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPw ? 'text' : 'password'}
                            className="dh-form-control"
                            style={{ width: '100%', paddingRight: '2.5rem' }}
                            placeholder="••••••••"
                            value={pw[f.key]}
                            onChange={e => setPw(prev => ({ ...prev, [f.key]: e.target.value }))}
                          />
                          <button type="button" onClick={() => setShowPw(p => !p)}
                            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dh-muted)' }}>
                            {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                          </button>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="dh-btn dh-btn-primary" onClick={handleChangePw}><Save size={15}/> Update Password</button>
                      <button className="dh-btn dh-btn-outline" onClick={() => { setPwModal(false); setPwError(''); setPw({ current:'', next:'', confirm:'' }); }}><X size={15}/> Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DHProfile;
