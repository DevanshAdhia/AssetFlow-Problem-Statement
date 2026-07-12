import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, BookOpen, CheckSquare, Wrench, Users } from 'lucide-react';
import '../../layouts/DeptHeadLayout.css';

const EVENTS = [
  { id:1, title:'Sprint Review', type:'Meeting',     date:'2026-07-12', time:'15:00–16:00', color:'#2563eb' },
  { id:2, title:'Client Demo — Projector B', type:'Booking', date:'2026-07-13', time:'10:00–12:00', color:'#0284c7' },
  { id:3, title:'Onboarding — Training Room', type:'Booking', date:'2026-07-14', time:'14:00–17:00', color:'#0284c7' },
  { id:4, title:'Laptop AF-022 Maintenance', type:'Maintenance', date:'2026-07-15', time:'All Day', color:'#d97706' },
  { id:5, title:'Allocation Review — Divya', type:'Approval', date:'2026-07-16', time:'09:00', color:'#16a34a' },
  { id:6, title:'Team Standup', type:'Meeting', date:'2026-07-12', time:'09:30–09:45', color:'#2563eb' },
  { id:7, title:'Quarterly Town Hall', type:'Meeting', date:'2026-07-18', time:'14:00–15:30', color:'#2563eb' },
  { id:8, title:'Van Booking — Client Visit', type:'Booking', date:'2026-07-15', time:'08:00–18:00', color:'#0284c7' },
];

const TYPE_ICON = { Meeting: Users, Booking: BookOpen, Maintenance: Wrench, Approval: CheckSquare };
const TYPE_FILTER = ['All','Meeting','Booking','Maintenance','Approval'];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const DHCalendar = () => {
  const [month, setMonth] = useState(6); // July = 6
  const [year, setYear]   = useState(2026);
  const [filter, setFilter] = useState('All');

  const firstDay  = new Date(year, month, 1).getDay();
  const daysInMo  = new Date(year, month+1, 0).getDate();
  const today     = new Date();
  const isToday   = (d) => today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;

  const getEventsForDay = (d) => {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return EVENTS.filter(e => e.date === ds && (filter==='All' || e.type===filter));
  };

  const prevMonth = () => { if (month===0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMo; d++) cells.push(d);

  return (
    <div className="dh-page">
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Department Calendar</h1>
          <p className="dh-page-subtitle">Meetings, bookings, approvals and maintenance — all in one view.</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem',flexWrap:'wrap',alignItems:'center'}}>
        {TYPE_FILTER.map(f=>(
          <button key={f} className={`dh-btn dh-btn-sm ${filter===f?'dh-btn-primary':'dh-btn-outline'}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:4}}>
          {[{c:'#2563eb',l:'Meeting'},{c:'#0284c7',l:'Booking'},{c:'#d97706',l:'Maintenance'},{c:'#16a34a',l:'Approval'}].map(i=>(
            <span key={i.l} style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.72rem',color:'var(--dh-muted)',marginLeft:12}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:i.c,display:'inline-block'}}/>{i.l}
            </span>
          ))}
        </div>
      </div>

      <div className="dh-card">
        {/* Month nav */}
        <div className="dh-card-header">
          <button className="dh-btn dh-btn-outline dh-btn-sm" onClick={prevMonth}><ChevronLeft size={16}/></button>
          <h3 className="dh-card-title" style={{fontSize:'1.1rem'}}>{MONTHS[month]} {year}</h3>
          <button className="dh-btn dh-btn-outline dh-btn-sm" onClick={nextMonth}><ChevronRight size={16}/></button>
        </div>

        {/* Calendar grid */}
        <div style={{padding:'1rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:0}}>
            {DAYS.map(d=>(
              <div key={d} style={{padding:'0.5rem',textAlign:'center',fontSize:'0.78rem',fontWeight:700,color:'var(--dh-muted)',borderBottom:'2px solid var(--dh-border)'}}>{d}</div>
            ))}
            {cells.map((d,i)=>{
              const events = d ? getEventsForDay(d) : [];
              return (
                <div key={i} style={{
                  minHeight:90, padding:'0.35rem',
                  borderRight: (i%7!==6)?'1px solid var(--dh-border)':'none',
                  borderBottom:'1px solid var(--dh-border)',
                  background: d && isToday(d) ? 'rgba(124,58,237,0.05)' : 'transparent'
                }}>
                  {d && (
                    <>
                      <span style={{
                        fontSize:'0.8rem', fontWeight: isToday(d)?800:500,
                        color: isToday(d)?'#2563eb':'var(--dh-text)',
                        display:'inline-block', marginBottom:2,
                        ...(isToday(d) ? { background:'#2563eb', color:'#fff', width:24, height:24, borderRadius:'50%', textAlign:'center', lineHeight:'24px' } : {})
                      }}>{d}</span>
                      {events.slice(0,2).map(ev=>(
                        <div key={ev.id} style={{
                          background:`${ev.color}18`, color:ev.color,
                          fontSize:'0.68rem', fontWeight:600, padding:'2px 5px',
                          borderRadius:4, marginBottom:2, lineHeight:1.3,
                          borderLeft:`3px solid ${ev.color}`, cursor:'default'
                        }} title={`${ev.title}\n${ev.time}`}>
                          {ev.title.length > 18 ? ev.title.slice(0,18)+'…' : ev.title}
                        </div>
                      ))}
                      {events.length > 2 && <span style={{fontSize:'0.65rem',color:'var(--dh-muted)'}}>+{events.length-2} more</span>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="dh-card" style={{marginTop:'1.25rem'}}>
        <div className="dh-card-header"><h3 className="dh-card-title">Upcoming Events</h3></div>
        <div>
          {EVENTS.filter(e=>filter==='All'||e.type===filter).map(ev=>{
            const Icon = TYPE_ICON[ev.type] || CalendarDays;
            return (
              <div key={ev.id} style={{display:'flex',gap:'0.75rem',padding:'0.8rem 1.25rem',borderBottom:'1px solid var(--dh-border)',alignItems:'center'}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${ev.color}18`,color:ev.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Icon size={16}/></div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:'0.85rem',fontWeight:600}}>{ev.title}</p>
                  <span style={{fontSize:'0.75rem',color:'var(--dh-muted)'}}>{ev.date} · {ev.time}</span>
                </div>
                <span className="dh-badge" style={{background:`${ev.color}18`,color:ev.color}}>{ev.type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DHCalendar;
