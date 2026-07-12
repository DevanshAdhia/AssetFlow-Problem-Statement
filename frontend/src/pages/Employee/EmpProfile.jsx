import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Lock, Camera, Save, X } from 'lucide-react';

const defaultProfile = {
  name: 'Rahul Verma',
  employeeId: 'EMP-0042',
  email: 'employee@assetflow.com',
  phone: '+91 87654 32109',
  department: 'Sales',
  designation: 'Sales Executive',
  role: 'Employee',
  address: '14-B, Lotus Colony, Bandra West, Mumbai - 400050',
  emergencyContact: '+91 99001 12233 (Amit Verma)',
  joinDate: 'March 15, 2022',
  avatar: null,
};

const EmpProfile = () => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('emp_profile'));
      const auth = JSON.parse(localStorage.getItem('auth_user'));
      return saved || { ...defaultProfile, name: auth?.name || defaultProfile.name, email: auth?.email || defaultProfile.email };
    } catch { return defaultProfile; }
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  useEffect(() => { localStorage.setItem('emp_profile', JSON.stringify(profile)); }, [profile]);

  const handleSave = () => {
    setProfile(form);
    setEditing(false);
  };

  const buildAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=120`;

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Profile</h1>
          <p className="emp-page-subtitle">Manage your personal information and preferences.</p>
        </div>
        {!editing && (
          <button className="btn btn-primary btn-sm" onClick={() => { setForm(profile); setEditing(true); }}>
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left: Avatar Card */}
        <div className="emp-card" style={{ marginBottom: 0 }}>
          <div className="emp-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={profile.avatar || buildAvatar(profile.name)}
                alt="Avatar"
                style={{ width: 100, height: 100, borderRadius: '50%', border: '3px solid var(--primary)', objectFit: 'cover' }}
              />
              <button style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 700 }}>{profile.name}</h2>
              <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{profile.designation}</p>
              <span style={{ padding: '0.2rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(37,99,235,0.1)', color: 'var(--primary)' }}>{profile.role}</span>
            </div>
            <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', textAlign: 'left' }}>
              {[
                { label: 'Employee ID', value: profile.employeeId },
                { label: 'Department', value: profile.department },
                { label: 'Joined', value: profile.joinDate },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', color: 'var(--danger)' }}>
              <Lock size={15} /> Change Password
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="emp-card" style={{ marginBottom: 0 }}>
          <div className="emp-card-header">
            <h2 className="emp-card-title">Personal Information</h2>
            {editing && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave}><Save size={15} /> Save Changes</button>
              </div>
            )}
          </div>
          <div className="emp-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { label: 'Full Name', key: 'name', icon: User },
                { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
                { label: 'Phone Number', key: 'phone', icon: Phone },
                { label: 'Department', key: 'department', icon: null, readOnly: true },
                { label: 'Designation', key: 'designation', icon: null, readOnly: true },
              ].map(({ label, key, icon: Icon, type, readOnly }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  {editing && !readOnly ? (
                    <input
                      type={type || 'text'}
                      className="form-control"
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', color: 'var(--text-main)', fontWeight: 500 }}>
                      {Icon && <Icon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                      {profile[key]}
                    </div>
                  )}
                </div>
              ))}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Address</label>
                {editing ? (
                  <input type="text" className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem 0', color: 'var(--text-main)', fontWeight: 500 }}>
                    <MapPin size={16} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
                    {profile.address}
                  </div>
                )}
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Emergency Contact</label>
                {editing ? (
                  <input type="text" className="form-control" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                ) : (
                  <div style={{ padding: '0.5rem 0', color: 'var(--text-main)', fontWeight: 500 }}>{profile.emergencyContact}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpProfile;
