import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, Tv, Monitor, Plus, MapPin } from 'lucide-react';
import './Bookings.css';

const resources = [
  { id: 'r1', name: 'Conference Room B5', type: 'Room', capacity: 7, amenities: ['TV', 'Whiteboard'], location: 'Floor 2' },
  { id: 'r2', name: 'Executive Boardroom', type: 'Room', capacity: 15, amenities: ['Video Conferencing', 'Dual Displays'], location: 'Floor 4' },
  { id: 'r3', name: 'Mobile Projector X-1', type: 'Equipment', capacity: null, amenities: ['4K', 'HDMI'], location: 'IT Storage' },
  { id: 'r4', name: 'Huddle Space A', type: 'Room', capacity: 4, amenities: ['Monitor'], location: 'Floor 1' }
];

const mockTimeline = [
  { time: '09:00 AM', status: 'available' },
  { time: '10:00 AM', status: 'booked', bookedBy: 'Marketing Team' },
  { time: '11:00 AM', status: 'booked', bookedBy: 'Marketing Team' },
  { time: '12:00 PM', status: 'available' },
  { time: '01:00 PM', status: 'available' },
  { time: '02:00 PM', status: 'booked', bookedBy: 'Client Meeting' },
  { time: '03:00 PM', status: 'available' },
  { time: '04:00 PM', status: 'available' },
  { time: '05:00 PM', status: 'available' }
];

const Bookings = () => {
  const [selectedResource, setSelectedResource] = useState(resources[0]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bookings-page">
      <div className="page-header flex-between">
        <div>
          <h1>Resource Booking</h1>
          <p className="text-muted">Reserve shared resources like conference rooms and specialized equipment.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Book a Slot
        </button>
      </div>

      <div className="bookings-grid">
        {/* Resource Selection Column */}
        <div className="resource-list flex-col gap-3">
          <div className="card">
            <div className="card-header border-bottom pb-2">
              <h2>Shared Resources</h2>
            </div>
            <div className="resource-items mt-3 flex-col gap-2">
              {resources.map(res => (
                <div 
                  key={res.id} 
                  className={`resource-card ${selectedResource.id === res.id ? 'active' : ''}`}
                  onClick={() => setSelectedResource(res)}
                >
                  <div className="res-header flex-between">
                    <h3 className="res-name">{res.name}</h3>
                    <span className="res-type text-xs bg-gray-light text-muted px-2 py-1 rounded">{res.type}</span>
                  </div>
                  <div className="res-meta flex-align-center gap-3 text-muted text-sm mt-2">
                    <span className="flex-align-center gap-1"><MapPin size={14}/> {res.location}</span>
                    {res.capacity && <span className="flex-align-center gap-1"><Users size={14}/> Cap: {res.capacity}</span>}
                  </div>
                  <div className="res-amenities flex gap-2 mt-2">
                    {res.amenities.map((amenity, idx) => (
                      <span key={idx} className="amenity-badge">{amenity}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline View Column */}
        <div className="timeline-view flex-col gap-3">
          <div className="card h-full">
            <div className="card-header border-bottom pb-2 flex-between">
              <div>
                <h2 className="text-primary">{selectedResource.name}</h2>
                <p className="text-sm text-muted m-0 mt-1 flex-align-center gap-2">
                  <CalendarIcon size={14} /> Schedule for Today (Oct 12, 2026)
                </p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(true)}>
                Book This Resource
              </button>
            </div>
            
            <div className="timeline-container mt-4">
              <div className="timeline-header flex-between text-sm text-muted font-medium mb-2 px-3">
                <span>Time Slot</span>
                <span>Availability Status</span>
              </div>
              
              <div className="time-slots">
                {mockTimeline.map((slot, index) => (
                  <div key={index} className={`time-slot-row ${slot.status}`}>
                    <div className="slot-time flex-align-center gap-2 font-medium">
                      <Clock size={16} className={slot.status === 'booked' ? 'text-danger' : 'text-success'} />
                      {slot.time}
                    </div>
                    <div className="slot-status">
                      {slot.status === 'available' ? (
                        <span className="badge bg-success-light text-success border-success">Available</span>
                      ) : (
                        <div className="booked-info flex-align-center gap-2">
                          <span className="badge bg-danger-light text-danger border-danger">Booked</span>
                          <span className="text-sm font-medium">{slot.bookedBy}</span>
                        </div>
                      )}
                    </div>
                    <div className="slot-action">
                      {slot.status === 'available' && (
                        <button className="btn btn-primary btn-xs" onClick={() => setShowModal(true)}>Reserve</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book a Resource</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Resource</label>
                <select className="form-control" defaultValue={selectedResource.id}>
                  {resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              
              <div className="grid-form mt-3">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" defaultValue="2026-10-12" />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <select className="form-control">
                    {mockTimeline.filter(s => s.status === 'available').map((s, idx) => (
                      <option key={idx}>{s.time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Booking Purpose</label>
                <input type="text" className="form-control" placeholder="e.g. Weekly Sync with Marketing" />
              </div>
            </div>
            <div className="modal-footer mt-4 flex gap-2">
              <button className="btn btn-primary flex-1" onClick={() => setShowModal(false)}>Confirm Booking</button>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
