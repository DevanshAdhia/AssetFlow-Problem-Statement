import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Lock, Camera, Save, X, Building2, Briefcase, ShieldCheck, AlertCircle, Check } from 'lucide-react';

const getDefaultProfile = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth_user')) || {};
    const saved = JSON.parse(localStorage.getItem('emp_profile')) || {};
    return {
      name: saved.name || auth.name || 'Rahul Verma',
      employeeId: saved.employeeId || 'EMP-0042',
      email: saved.email || auth.email || 'employee@assetflow.com',
      phone: saved.phone || auth.phone || '+91 87654 32109',
      department: saved.department || auth.department || 'Sales',
      designation: saved.designation || 'Sales Executive',
      role: 'Employee',
      address: saved.address || '14-B, Lotus Colony, Bandra West, Mumbai – 400050',
      emergencyContact: saved.emergencyContact || '+91 99001 12233 (Amit Verma – Brother)',
      joinDate: saved.joinDate || 'March 15, 2022',
      avatar: saved.avatar || null,
    };
  } catch { return {}; }
};

const Toast = ({ msg, onClose }) => (
  <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, background: '#16a34a', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.65rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontSize: '0.875rem', fontWeight: 600, animation: 'slideUp 0.25s' }}>
    <Check size={17} /> {msg}
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '0.25rem' }}><X size={15} /></button>
  </div>
);

const EmpProfile = () => {
  const [profile, setProfile] = useState(getDefaultProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [pwModal, setPwModal] = useState(false);
  const [toast, setToast] = useState('');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  // Persist + broadcast
  const persist = (data) => {
    localStorage.setItem('emp_profile', JSON.stringify(data));
    // Also sync auth_user name/email so topbar updates
    try {
      const auth = JSON.parse(localStorage.getItem('auth_user')) || {};
      localStorage.setItem('auth_user', JSON.stringify({ ...auth, name: data.name, email: data.email }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  const handleSave = () => {
    setProfile(form);
    persist(form);
    setEditing(false);
    setToast('Profile updated successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const handleChangePw = () => {
    if (!pw.current) { alert('Please enter your current password.'); return; }
    if (pw.next !== pw.confirm) { alert('New passwords do not match.'); return; }
    if (pw.next.length < 6) { alert('Password must be at least 6 characters.'); return; }
    setPwModal(false);
    setPw({ current: '', next: '', confirm: '' });
    setToast('Password changed successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  const buildAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff&bold=true&size=200`;

  const infoFields = [
    { label: 'Full Name',         key: 'name',             icon: User,       editable: true },
    { label: 'Email Address',     key: 'email',            icon: Mail,       editable: true, type: 'email' },
    { label: 'Phone Number',      key: 'phone',            icon: Phone,      editable: true },
    { label: 'Department',        key: 'department',       icon: Building2,  editable: false },
    { label: 'Designation',       key: 'designation',      icon: Briefcase,  editable: false },
    { label: 'Role',              key: 'role',             icon: ShieldCheck,editable: false },
  ];

  return (
    <div className="emp-page">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}

      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">My Profile</h1>
          <p className="emp-page-subtitle">Manage your personal information and account settings.</p>
        </div>
        <div className="emp-header-actions">
          {editing ? (
            <>
              <button className="btn btn-outline" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><Save size={15} /> Save Changes</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => { setForm(profile); setEditing(true); }}>
              <Edit2 size={15} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* ─── Left Column: Avatar Card ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="emp-card" style={{ marginBottom: 0 }}>
            <div className="emp-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <img
                  src={profile.avatar || buildAvatar(profile.name)}
                  alt="Profile"
                  style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)', boxShadow: '0 4px 16px rgba(37,99,235,0.2)' }}
                />
                <button title="Change Photo" style={{ position: 'absolute', bottom: 2, right: 2, width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Camera size={14} />
                </button>
              </div>

              {/* Name & Role */}
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--secondary)' }}>{profile.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>{profile.designation}</div>
                <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(37,99,235,0.1)', color: 'var(--primary)' }}>
                  <ShieldCheck size={12} /> {profile.role}
                </div>
              </div>

              <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: '1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { label: 'Employee ID', value: profile.employeeId },
                  { label: 'Department', value: profile.department },
                  { label: 'Member Since', value: profile.joinDate },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.15rem' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="emp-card" style={{ marginBottom: 0 }}>
            <div className="emp-card-header"><h2 className="emp-card-title">Security</h2></div>
            <div className="emp-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.6rem' }} onClick={() => setPwModal(true)}>
                <Lock size={16} style={{ color: 'var(--warning)' }} /> Change Password
              </button>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Last password change: 60 days ago
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Info + Contact ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Personal Info */}
          <div className="emp-card" style={{ marginBottom: 0 }}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Personal Information</h2>
              {editing && <span style={{ fontSize: '0.75rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><AlertCircle size={13} /> Editing mode active</span>}
            </div>
            <div className="emp-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {infoFields.map(({ label, key, icon: Icon, editable, type }) => (
                  <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Icon size={13} style={{ color: 'var(--text-muted)' }} /> {label}
                      {!editable && <span style={{ fontSize: '0.65rem', background: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0 0.3rem', color: 'var(--text-muted)' }}>Read-only</span>}
                    </label>
                    {editing && editable ? (
                      <input
                        type={type || 'text'}
                        className="form-control"
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ marginTop: '0.25rem' }}
                      />
                    ) : (
                      <div style={{ padding: '0.55rem 0', fontWeight: 600, fontSize: '0.875rem', color: 'var(--secondary)', borderBottom: '1px dashed var(--border)' }}>
                        {profile[key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="emp-card" style={{ marginBottom: 0 }}>
            <div className="emp-card-header"><h2 className="emp-card-title">Contact & Address</h2></div>
            <div className="emp-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} style={{ color: 'var(--text-muted)' }} /> Office Address</label>
                  {editing ? (
                    <input type="text" className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{ marginTop: '0.25rem' }} />
                  ) : (
                    <div style={{ padding: '0.55rem 0', fontWeight: 600, fontSize: '0.875rem', color: 'var(--secondary)', borderBottom: '1px dashed var(--border)' }}>{profile.address}</div>
                  )}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={13} style={{ color: 'var(--text-muted)' }} /> Emergency Contact</label>
                  {editing ? (
                    <input type="text" className="form-control" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} style={{ marginTop: '0.25rem' }} />
                  ) : (
                    <div style={{ padding: '0.55rem 0', fontWeight: 600, fontSize: '0.875rem', color: 'var(--secondary)', borderBottom: '1px dashed var(--border)' }}>{profile.emergencyContact}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Change Password Modal ─── */}
      {pwModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setPwModal(false)}>
          <div className="emp-card" style={{ width: '100%', maxWidth: '420px', margin: 0 }} onClick={e => e.stopPropagation()}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Change Password</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setPwModal(false)}><X size={20} /></button>
            </div>
            <div className="emp-card-body">
              {[
                { label: 'Current Password', key: 'current' },
                { label: 'New Password', key: 'next' },
                { label: 'Confirm New Password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key} className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">{label}</label>
                  <input type="password" className="form-control" value={pw[key]} onChange={e => setPw({ ...pw, [key]: e.target.value })} placeholder="••••••••" />
                </div>
              ))}
              <div style={{ background: 'var(--bg-color)', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Password must be at least 6 characters. Use a mix of letters, numbers, and symbols for better security.
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setPwModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleChangePw}><Lock size={14} /> Update Password</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpProfile;
