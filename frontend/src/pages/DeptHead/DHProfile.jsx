import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, MapPin, Edit2, CheckCircle, Lock, Bell } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const buildAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=150`;

const DHProfile = () => {
  const [user, setUser] = useState({ name: 'Loading...', email: '', phone: '', department: '', role: '', avatar: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_user'));
      if (u) {
        if (!u.avatar) u.avatar = buildAvatar(u.name);
        setUser(u); setFormData(u);
      }
    } catch (e) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...formData, avatar: buildAvatar(formData.name) };
    localStorage.setItem('auth_user', JSON.stringify(updated));
    setUser(updated);
    setEditMode(false);
    setToast('Profile updated successfully!');
    setTimeout(() => setToast(null), 4000);
    window.dispatchEvent(new Event('storage'));
  };

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
          <button className="dh-btn dh-btn-primary" onClick={() => setEditMode(true)}>
            <Edit2 size={15}/> Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Profile Card */}
        <div className="dh-card" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <img src={user.avatar} alt={user.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--dh-bg)', boxShadow: 'var(--dh-shadow)' }} />
          </div>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 700 }}>{user.name}</h2>
          <span className="dh-badge dh-badge-allocated" style={{ marginBottom: '1.5rem' }}>{user.role}</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--dh-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <Mail size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <Phone size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>{user.phone || '+91 98765 43210'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--dh-text)' }}>
              <Building2 size={16} style={{ color: 'var(--dh-muted)' }}/> <span style={{ fontSize: '0.85rem' }}>{user.department} Dept.</span>
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
                  <input className="dh-form-control" style={{ width: '100%' }} value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/>
                </div>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" className="dh-form-control" style={{ width: '100%' }} value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required/>
                </div>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Phone Number</label>
                  <input className="dh-form-control" style={{ width: '100%' }} value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/>
                </div>
                <div><label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>Department</label>
                  <input className="dh-form-control" style={{ width: '100%', background: 'var(--dh-bg)' }} value={formData.department} disabled/>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="button" className="dh-btn dh-btn-outline" onClick={() => { setEditMode(false); setFormData(user); }}>Cancel</button>
                  <button type="submit" className="dh-btn dh-btn-primary">Save Changes</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Full Name</p><p style={{ margin: 0, fontWeight: 600 }}>{user.name}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Email Address</p><p style={{ margin: 0, fontWeight: 600 }}>{user.email}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Phone Number</p><p style={{ margin: 0, fontWeight: 600 }}>{user.phone || '+91 98765 43210'}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Department</p><p style={{ margin: 0, fontWeight: 600 }}>{user.department}</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Designation</p><p style={{ margin: 0, fontWeight: 600 }}>Department Head</p></div>
                <div><p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--dh-muted)' }}>Emergency Contact</p><p style={{ margin: 0, fontWeight: 600 }}>+91 91234 56780</p></div>
              </div>
            )}
          </div>
          
          {!editMode && (
            <>
              <div className="dh-card-header" style={{ borderTop: '1px solid var(--dh-border)' }}>
                <h3 className="dh-card-title">Security & Preferences</h3>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button className="dh-btn dh-btn-outline" style={{ justifyContent: 'center' }}><Lock size={15}/> Change Password</button>
                <button className="dh-btn dh-btn-outline" style={{ justifyContent: 'center' }}><Bell size={15}/> Notification Settings</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DHProfile;
