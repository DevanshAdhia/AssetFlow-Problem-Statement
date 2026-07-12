import React, { useState } from 'react';
import { BookOpen, Plus, X, CheckCircle, Clock, Calendar, MapPin, Users } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const RESOURCES = [
  { id:1, name:'Meeting Room A',    type:'Room',      capacity:12, floor:'2nd Floor' },
  { id:2, name:'Meeting Room B',    type:'Room',      capacity:6,  floor:'2nd Floor' },
  { id:3, name:'Conference Hall',   type:'Room',      capacity:50, floor:'1st Floor' },
  { id:4, name:'Training Room 1',   type:'Room',      capacity:20, floor:'3rd Floor' },
  { id:5, name:'Projector A',       type:'Equipment', capacity:null, floor:'Shared' },
  { id:6, name:'Projector B',       type:'Equipment', capacity:null, floor:'Shared' },
  { id:7, name:'Company Van #1',    type:'Vehicle',   capacity:7,  floor:'Parking B1' },
  { id:8, name:'Company Van #2',    type:'Vehicle',   capacity:7,  floor:'Parking B1' },
];

const BOOKINGS_INIT = [
  { id:1, resource:'Meeting Room A', date:'12 Jul 2026', start:'15:00', end:'16:00', bookedBy:'Sneha Kulkarni', purpose:'Sprint Review',       participants:8,  status:'Upcoming' },
  { id:2, resource:'Projector B',    date:'13 Jul 2026', start:'10:00', end:'12:00', bookedBy:'Rohan Mehta',     purpose:'Client Presentation', participants:15, status:'Upcoming' },
  { id:3, resource:'Training Room 1',date:'14 Jul 2026', start:'14:00', end:'17:00', bookedBy:'Arjun Nair',      purpose:'Onboarding Session',  participants:5,  status:'Pending' },
  { id:4, resource:'Meeting Room B', date:'11 Jul 2026', start:'09:00', end:'10:00', bookedBy:'Vivek Joshi',     purpose:'1:1 Sync',            participants:2,  status:'Completed' },
  { id:5, resource:'Conference Hall',date:'10 Jul 2026', start:'14:00', end:'15:30', bookedBy:'Divya Nair',      purpose:'Quarterly Town Hall', participants:45, status:'Completed' },
  { id:6, resource:'Company Van #1', date:'15 Jul 2026', start:'08:00', end:'18:00', bookedBy:'Rohan Mehta',     purpose:'Client Site Visit',   participants:4,  status:'Approved' },
];

const STATUS_BADGE = { Pending:'dh-badge-pending', Approved:'dh-badge-approved', Upcoming:'dh-badge-info', Ongoing:'dh-badge-allocated', Completed:'dh-badge-available', Cancelled:'dh-badge-rejected' };
const TYPE_ICON = { Room: MapPin, Equipment: BookOpen, Vehicle: Calendar };

const DHBookings = () => {
  const [bookings, setBookings] = useState(BOOKINGS_INIT);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState('All');
  const [toast, setToast]       = useState(null);

  const [form, setForm] = useState({
    resource:'Meeting Room A', date:'', start:'', end:'', purpose:'', participants:'', notes:''
  });

  const f = (k,v) => setForm({...form, [k]:v});

  const filtered = bookings.filter(b => filter==='All' || b.status===filter);

  const handleBook = (e) => {
    e.preventDefault();
    if (!form.date || !form.start || !form.end || !form.purpose) return;
    const user = (() => { try { return JSON.parse(localStorage.getItem('auth_user')); } catch { return {}; } })();
    setBookings([{
      id: Date.now(), resource: form.resource, date: new Date(form.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),
      start: form.start, end: form.end, bookedBy: user.name || 'Dept Head', purpose: form.purpose,
      participants: parseInt(form.participants)||1, status: 'Pending'
    }, ...bookings]);
    setShowForm(false);
    setForm({ resource:'Meeting Room A', date:'', start:'', end:'', purpose:'', participants:'', notes:'' });
    setToast('Resource booked successfully!'); setTimeout(()=>setToast(null),4000);
  };

  return (
    <div className="dh-page">
      {toast && (
        <div style={{ position:'fixed',top:'1.25rem',right:'1.25rem',zIndex:9999,background:'#1e293b',color:'#fff',padding:'0.85rem 1.25rem',borderRadius:10,display:'flex',alignItems:'center',gap:'0.6rem',boxShadow:'0 8px 24px rgba(0,0,0,.18)',borderLeft:'4px solid #16a34a',minWidth:280 }}>
          <CheckCircle size={16} style={{color:'#16a34a'}}/>{toast}
        </div>
      )}

      {/* Booking Form Modal */}
      {showForm && (
        <div className="dh-modal-overlay" onClick={()=>setShowForm(false)}>
          <div className="dh-modal dh-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="dh-modal-header">
              <h2 className="dh-modal-title"><BookOpen size={18} style={{display:'inline',marginRight:8,color:'#2563eb'}}/>Book a Resource</h2>
              <button className="dh-close-btn" onClick={()=>setShowForm(false)}><X size={18}/></button>
            </div>
            <form onSubmit={handleBook}>
              <div className="dh-modal-body">
                <div style={{display:'grid',gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',gap:'1rem'}}>
                  <div>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>Resource *</label>
                    <select className="dh-form-control" style={{width:'100%'}} value={form.resource} onChange={e=>f('resource',e.target.value)}>
                      {RESOURCES.map(r=><option key={r.id} value={r.name}>{r.name} ({r.type}{r.capacity?` · ${r.capacity} seats`:''})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>Date *</label>
                    <input type="date" className="dh-form-control" style={{width:'100%'}} value={form.date} onChange={e=>f('date',e.target.value)} required/>
                  </div>
                  <div>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>Start Time *</label>
                    <input type="time" className="dh-form-control" style={{width:'100%'}} value={form.start} onChange={e=>f('start',e.target.value)} required/>
                  </div>
                  <div>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>End Time *</label>
                    <input type="time" className="dh-form-control" style={{width:'100%'}} value={form.end} onChange={e=>f('end',e.target.value)} required/>
                  </div>
                  <div>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>Participants</label>
                    <input type="number" className="dh-form-control" style={{width:'100%'}} placeholder="e.g. 8" value={form.participants} onChange={e=>f('participants',e.target.value)}/>
                  </div>
                  <div>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>Purpose *</label>
                    <input type="text" className="dh-form-control" style={{width:'100%'}} placeholder="Sprint Review, Client Demo..." value={form.purpose} onChange={e=>f('purpose',e.target.value)} required/>
                  </div>
                  <div style={{gridColumn:'span 2'}}>
                    <label style={{fontSize:'0.82rem',fontWeight:600,display:'block',marginBottom:6}}>Notes</label>
                    <textarea className="dh-form-control" rows={2} style={{width:'100%',resize:'vertical'}} value={form.notes} onChange={e=>f('notes',e.target.value)} placeholder="Any special requirements..."/>
                  </div>
                </div>
              </div>
              <div className="dh-modal-footer">
                <button type="button" className="dh-btn dh-btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                <button type="submit" className="dh-btn dh-btn-primary"><CheckCircle size={15}/> Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Resource Booking</h1>
          <p className="dh-page-subtitle">Book meeting rooms, equipment, and vehicles for your department.</p>
        </div>
        <button className="dh-btn dh-btn-primary" onClick={()=>setShowForm(true)}><Plus size={16}/> Book Resource</button>
      </div>

      {/* Resource Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0.75rem',marginBottom:'1.5rem'}}>
        {RESOURCES.map(r=>{
          const Icon = TYPE_ICON[r.type] || BookOpen;
          return (
            <div key={r.id} className="dh-card" style={{padding:'1rem',cursor:'pointer',transition:'all 0.15s'}} onClick={()=>{setForm({...form,resource:r.name});setShowForm(true);}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.5rem'}}>
                <div style={{width:34,height:34,borderRadius:8,background:'rgba(124,58,237,0.1)',color:'#2563eb',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={16}/></div>
                <div><p style={{margin:0,fontWeight:700,fontSize:'0.85rem'}}>{r.name}</p><span style={{fontSize:'0.72rem',color:'var(--dh-muted)'}}>{r.type} · {r.floor}</span></div>
              </div>
              {r.capacity && <span style={{fontSize:'0.75rem',color:'var(--dh-muted)'}}><Users size={12} style={{display:'inline',marginRight:4}}/>{r.capacity} seats</span>}
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
        {['All','Pending','Approved','Upcoming','Completed'].map(f=>(
          <button key={f} className={`dh-btn dh-btn-sm ${filter===f?'dh-btn-primary':'dh-btn-outline'}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="dh-card">
        <div className="dh-card-header"><h3 className="dh-card-title">All Bookings</h3></div>
        <div className="dh-table-container">
          <table className="dh-table">
            <thead><tr><th>Resource</th><th>Date</th><th>Time</th><th>Booked By</th><th>Purpose</th><th>Participants</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(b=>(
                <tr key={b.id}>
                  <td style={{fontWeight:600}}>{b.resource}</td>
                  <td>{b.date}</td>
                  <td style={{color:'var(--dh-muted)'}}>{b.start} – {b.end}</td>
                  <td>{b.bookedBy}</td>
                  <td>{b.purpose}</td>
                  <td style={{textAlign:'center'}}>{b.participants}</td>
                  <td><span className={`dh-badge ${STATUS_BADGE[b.status]}`}>{b.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={7}><div className="dh-empty-state"><BookOpen size={40}/><span>No bookings found</span></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DHBookings;
