import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Plus, MapPin, Search } from 'lucide-react';

const resources = [
  { id: 'r1', name: 'Conference Room B5', type: 'Room', capacity: 7, amenities: ['TV', 'Whiteboard'], location: 'Floor 2' },
  { id: 'r4', name: 'Huddle Space A', type: 'Room', capacity: 4, amenities: ['Monitor'], location: 'Floor 1' },
  { id: 'r3', name: 'Mobile Projector X-1', type: 'Equipment', capacity: null, amenities: ['4K', 'HDMI'], location: 'IT Storage' }
];

const EmpBookings = () => {
  const [selectedResource, setSelectedResource] = useState(resources[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingPurpose, setBookingPurpose] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredResources = resources.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [timelines, setTimelines] = useState({
    'r1': [
      { time: '09:00 AM', status: 'available' },
      { time: '10:00 AM', status: 'booked', bookedBy: 'Marketing Team' },
      { time: '11:00 AM', status: 'booked', bookedBy: 'Marketing Team' },
      { time: '12:00 PM', status: 'available' },
      { time: '01:00 PM', status: 'available' },
      { time: '02:00 PM', status: 'booked', bookedBy: 'Client Meeting' },
      { time: '03:00 PM', status: 'available' },
      { time: '04:00 PM', status: 'available' },
      { time: '05:00 PM', status: 'available' }
    ]
  });

  const getTimeline = (resId) => {
    return timelines[resId] || [
      { time: '09:00 AM', status: 'available' },
      { time: '10:00 AM', status: 'available' },
      { time: '11:00 AM', status: 'available' },
      { time: '12:00 PM', status: 'available' },
      { time: '01:00 PM', status: 'available' },
      { time: '02:00 PM', status: 'available' },
      { time: '03:00 PM', status: 'available' },
      { time: '04:00 PM', status: 'available' },
      { time: '05:00 PM', status: 'available' }
    ];
  };

  const handleBook = () => {
    if (!selectedTimeSlot || !bookingPurpose) {
      alert("Please select a time and enter a purpose.");
      return;
    }
    const currentTimeline = getTimeline(selectedResource.id);
    const updatedTimeline = currentTimeline.map(slot => 
      slot.time === selectedTimeSlot 
        ? { ...slot, status: 'booked', bookedBy: bookingPurpose, isMine: true } 
        : slot
    );
    setTimelines({
      ...timelines,
      [selectedResource.id]: updatedTimeline
    });
    setShowModal(false);
    setSelectedTimeSlot('');
    setBookingPurpose('');
  };

  return (
    <div className="emp-page">
      <div className="emp-page-header">
        <div>
          <h1 className="emp-page-title">Resource Booking</h1>
          <p className="emp-page-subtitle">Reserve shared resources like meeting rooms and equipment.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="emp-card" style={{ marginBottom: 0 }}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Select Resource</h2>
            </div>
            <div className="emp-card-body">
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <Search size={18} className="text-muted" style={{ marginRight: '0.5rem' }} />
                  <input 
                    type="text" 
                    placeholder="Search rooms..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
                  />
                </div>
                {showDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 100, maxHeight: '250px', overflowY: 'auto', boxShadow: 'var(--shadow-md)' }}>
                    {filteredResources.map(res => (
                      <div 
                        key={res.id}
                        onClick={() => { setSelectedResource(res); setSearchTerm(''); setShowDropdown(false); }}
                        style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: selectedResource.id === res.id ? 'var(--bg-color)' : 'transparent' }}
                      >
                        <span style={{ fontWeight: 500 }}>{res.name}</span>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>{res.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{selectedResource.name}</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'var(--surface)', border: '1px solid var(--border)' }}>{selectedResource.type}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14}/> {selectedResource.location}</span>
                  {selectedResource.capacity && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={14}/> Capacity: {selectedResource.capacity}</span>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {selectedResource.amenities.map(a => (
                    <span key={a} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)' }}>{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="emp-card" style={{ marginBottom: 0 }}>
          <div className="emp-card-header">
            <div>
              <h2 className="emp-card-title text-primary">{selectedResource.name} Timeline</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarIcon size={14} /> Schedule for Today (Oct 12, 2026)
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Book Slot
            </button>
          </div>
          <div className="emp-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {getTimeline(selectedResource.id).map((slot, index) => (
                <div key={index} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
                  borderLeft: `4px solid ${slot.status === 'available' ? 'var(--success)' : 'var(--danger)'}`,
                  background: slot.status === 'available' ? 'var(--surface)' : 'var(--bg-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Clock size={16} className={slot.status === 'available' ? 'text-success' : 'text-danger'} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{slot.time}</span>
                  </div>
                  <div>
                    {slot.status === 'available' ? (
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelectedTimeSlot(slot.time); setShowModal(true); }}>Reserve</button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{slot.bookedBy}</span>
                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--danger)', color: '#fff', borderRadius: '4px' }}>Booked</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="emp-card" style={{ width: '90%', maxWidth: '500px', margin: 0 }}>
            <div className="emp-card-header">
              <h2 className="emp-card-title">Book {selectedResource.name}</h2>
            </div>
            <div className="emp-card-body">
              <div className="form-group mb-3">
                <label className="form-label">Time Slot</label>
                <select className="form-control" value={selectedTimeSlot} onChange={e => setSelectedTimeSlot(e.target.value)}>
                  <option value="">Select a time</option>
                  {getTimeline(selectedResource.id).filter(s => s.status === 'available').map(s => (
                    <option key={s.time} value={s.time}>{s.time}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Purpose</label>
                <input type="text" className="form-control" value={bookingPurpose} onChange={e => setBookingPurpose(e.target.value)} placeholder="e.g. Project Sync" />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleBook}>Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpBookings;
