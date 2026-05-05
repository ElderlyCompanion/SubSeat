'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import StaffSystem from "../components/StaffSystem";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: ${G}; color: ${C}; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse  { 0%,100% { box-shadow:0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow:0 0 0 10px rgba(86,59,231,0); } }
  @keyframes spin   { to { transform:rotate(360deg); } }

  .fu  { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
  .d1  { animation-delay:.05s; }
  .d2  { animation-delay:.1s;  }
  .d3  { animation-delay:.15s; }

  .stat-card {
    background:${W}; border-radius:16px; padding:22px;
    border:1.5px solid #eee; transition:all .2s;
  }
  .stat-card:hover { border-color:${P}; box-shadow:0 8px 28px rgba(86,59,231,.10); }

  .nav-item {
    display:flex; align-items:center; gap:10px;
    padding:10px 14px; border-radius:12px; cursor:pointer;
    font-size:13px; font-weight:600; color:#888;
    transition:all .18s; border:none; background:transparent;
    font-family:'Poppins',sans-serif; width:100%; text-align:left;
  }
  .nav-item:hover  { background:${L}; color:${P}; }
  .nav-item.active { background:${P}; color:${W}; }

  .inp {
    width:100%; padding:12px 14px; border-radius:10px;
    border:1.5px solid #e0e0e0; background:${W};
    font-family:'Poppins',sans-serif; font-size:14px; color:${C};
    outline:none; transition:border-color .2s;
  }
  .inp:focus { border-color:${P}; box-shadow:0 0 0 3px rgba(86,59,231,.08); }
  select.inp option { background:${W}; }

  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:${P}; color:${W}; border:none;
    padding:11px 20px; border-radius:10px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:14px;
    cursor:pointer; transition:all .2s;
  }
  .btn-p:hover { background:#4429d4; transform:translateY(-1px); }
  .btn-p:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  .btn-s {
    display:inline-flex; align-items:center; gap:6px;
    background:transparent; color:${P}; border:1.5px solid ${P};
    padding:9px 18px; border-radius:10px;
    font-family:'Poppins',sans-serif; font-weight:600; font-size:13px;
    cursor:pointer; transition:all .2s;
  }
  .btn-s:hover { background:${L}; }

  .service-card {
    background:${W}; border-radius:14px; padding:18px 20px;
    border:1.5px solid #eee; transition:all .2s;
    display:flex; justify-content:space-between; align-items:center;
  }
  .service-card:hover { border-color:${P}; }

  .cal-day {
    aspect-ratio:1; border-radius:10px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; cursor:pointer;
    transition:all .18s; font-family:'Poppins',sans-serif;
    font-size:13px; font-weight:600; color:${C};
    border:1.5px solid transparent; position:relative;
  }
  .cal-day:hover    { background:${L}; border-color:${P}; }
  .cal-day.today    { background:${P}; color:${W}; }
  .cal-day.has-appt { border-color:${P}; color:${P}; }
  .cal-day.selected { background:${L}; border-color:${P}; }
  .cal-day.other    { color:#ccc; }

  .appt-slot {
    background:${L}; border-radius:12px; padding:14px 16px;
    border-left:4px solid ${P}; margin-bottom:10px;
  }

  .type-tab {
    padding:8px 16px; border-radius:8px; border:1.5px solid #eee;
    background:${W}; font-family:'Poppins',sans-serif; font-weight:600;
    font-size:13px; cursor:pointer; transition:all .18s; color:#888;
  }
  .type-tab.active { background:${P}; color:${W}; border-color:${P}; }
  .type-tab:hover  { border-color:${P}; color:${P}; }

  .booking-row {
    display:grid; padding:14px 0;
    border-bottom:1px solid #f0f0f0; align-items:center;
  }
  .booking-row:last-child { border-bottom:none; }

  @media(max-width:900px) {
    .dash-grid    { grid-template-columns:1fr !important; }
    .sidebar-col  { display:none !important; }
    .stats-grid   { grid-template-columns:1fr 1fr !important; }
    .two-col      { grid-template-columns:1fr !important; }
    .cal-grid-col { grid-template-columns:1fr !important; }
  }
  @media(max-width:480px) {
    .stats-grid { grid-template-columns:1fr 1fr !important; }
  }
`;

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const days   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const fmt    = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtT   = d => new Date(d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

/* ── SIDEBAR ── */
const NAV = [
  { id:"overview",    icon:"📊", label:"Overview"     },
  { id:"calendar",    icon:"📅", label:"Calendar"     },
  { id:"bookings",    icon:"📋", label:"All Bookings" },
  { id:"services",    icon:"💼", label:"Services"     },
  { id:"subscribers", icon:"👥", label:"Subscribers"  },
  { id:"staff",       icon:"🧑‍🤝‍🧑", label:"Staff & Team" },
  { id:"profile",     icon:"🏪", label:"Edit Profile" },
  { id:"share",       icon:"🔗", label:"Share & QR"   },
];

function Sidebar({ active, setActive, business, onSignOut }) {
  return (
    <div style={{ background:W, borderRadius:20, padding:20, border:"1.5px solid #eee", position:"sticky", top:88, height:"fit-content" }}>
      <div style={{ textAlign:"center", marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ width:60, height:60, borderRadius:16, background:business?.logo_url?"transparent":L, margin:"0 auto 10px", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>
          {business?.logo_url ? <img src={business.logo_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "✂️"}
        </div>
        <div style={{ fontWeight:800, fontSize:14, color:C, marginBottom:2 }}>{business?.business_name||"Your Business"}</div>
        <div style={{ fontSize:12, color:"#888" }}>{business?.city||""}</div>
        {business?.is_mobile && <div style={{ display:"inline-block", background:"#f0fdf4", borderRadius:100, padding:"2px 10px", fontSize:10, fontWeight:700, color:"#166534", marginTop:4 }}>🚐 Mobile Pro</div>}
        {business?.tier==="partner" && <div style={{ display:"inline-block", background:P, borderRadius:100, padding:"2px 10px", fontSize:10, fontWeight:700, color:W, marginTop:6 }}>Partner ✓</div>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {NAV.map(n=>(
          <button key={n.id} className={`nav-item ${active===n.id?"active":""}`} onClick={()=>setActive(n.id)}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ borderTop:"1px solid #f0f0f0", marginTop:10, paddingTop:10 }}>
          <a href={`/${business?.category}/${business?.slug}`} target="_blank" style={{ textDecoration:"none" }}>
            <button className="nav-item"><span>👁️</span>View My Profile</button>
          </a>
          <button className="nav-item" onClick={onSignOut} style={{ color:"#e53e3e" }}><span>🚪</span>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

/* ── JOURNEY LINKS — for mobile barbers ── */
function JourneyLinks({ booking }) {
  if (!booking?.customer_address) return null;

  const address   = `${booking.customer_address}${booking.customer_postcode ? ", " + booking.customer_postcode : ""}`;
  const encoded   = encodeURIComponent(address);
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
  const appleUrl  = `https://maps.apple.com/?daddr=${encoded}&dirflg=d`;
  const wazeUrl   = `https://waze.com/ul?q=${encoded}&navigate=yes`;
  const fmtTime   = booking.start_time
    ? new Date(booking.start_time).toLocaleString("en-GB",{ weekday:"short", day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" })
    : "";

  return (
    <div style={{ background:`linear-gradient(135deg,${P},#7c3aed)`, borderRadius:14, padding:18, marginTop:12 }}>
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.65)", marginBottom:4, letterSpacing:1 }}>📍 JOURNEY TO CUSTOMER</div>
        <div style={{ fontSize:14, fontWeight:800, color:W }}>{address}</div>
        {fmtTime && <div style={{ fontSize:12, color:"rgba(255,255,255,.65)", marginTop:2 }}>🕐 {fmtTime}</div>}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[
          { label:"🗺️ Google Maps", url:googleUrl, bg:W,                       color:P  },
          { label:"🍎 Apple Maps",  url:appleUrl,  bg:"rgba(255,255,255,.15)", color:W  },
          { label:"🔵 Waze",        url:wazeUrl,   bg:"rgba(255,255,255,.15)", color:W  },
        ].map((btn,i) => (
          <a key={i} href={btn.url} target="_blank" rel="noopener noreferrer"
            style={{
              flex:1, minWidth:100, display:"flex", alignItems:"center", justifyContent:"center",
              gap:5, background:btn.bg, color:btn.color,
              border: i > 0 ? "1px solid rgba(255,255,255,.3)" : "none",
              borderRadius:9, padding:"10px 12px",
              fontFamily:"Poppins,sans-serif", fontWeight:700, fontSize:12,
              textDecoration:"none",
            }}
          >
            {btn.label}
          </a>
        ))}
      </div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginTop:10, textAlign:"center" }}>
        Tap to open with live traffic in your maps app
      </div>
    </div>
  );
}

/* ── OVERVIEW ── */
function Overview({ business, subscribers, bookings, services, setActive }) {
  const today   = bookings.filter(b => new Date(b.start_time).toDateString() === new Date().toDateString());
  const mrr     = subscribers.reduce((a,s) => a + parseFloat(s.monthly_price||0), 0);
  const oneOffs = bookings.filter(b => b.booking_type === "one_off");

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>Good {new Date().getHours()<12?"morning":"afternoon"}, {business?.business_name} 👋</h2>
        <p style={{ fontSize:14, color:"#888", marginTop:4 }}>Here's what's happening today.</p>
      </div>

      <div className="stats-grid fu" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { label:"Today's Appointments", val:today.length,         icon:"📅", color:P         },
          { label:"Active Subscribers",   val:subscribers.length,   icon:"👥", color:"#22c55e" },
          { label:"Monthly Revenue",      val:`£${mrr.toFixed(0)}`, icon:"💰", color:"#f59e0b" },
          { label:"One-Off Bookings",     val:oneOffs.length,       icon:"📋", color:"#8b5cf6" },
        ].map((s,i)=>(
          <div key={i} className="stat-card fu" style={{ animationDelay:`${i*.05}s` }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:12, color:"#888", marginBottom:3 }}>{s.label}</div>
            <div style={{ fontWeight:900, fontSize:26, color:s.color, letterSpacing:"-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="fu d1" style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontWeight:700, fontSize:16, color:C }}>Today's Appointments</h3>
          <button className="btn-s" onClick={()=>setActive("calendar")}>View Calendar</button>
        </div>
        {today.length===0 ? (
          <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>📅</div>
            <div style={{ fontSize:14 }}>No appointments today</div>
          </div>
        ) : today.map((b,i)=>(
          <div key={i} className="appt-slot">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C }}>Appointment #{i+1}</div>
                <div style={{ fontSize:12, color:"#666", marginTop:2 }}>{fmtT(b.start_time)} — {fmtT(b.end_time)}</div>
              </div>
              <span style={{ background:b.status==="confirmed"?"#dcfce7":"#fef3c7", color:b.status==="confirmed"?"#166534":"#92400e", borderRadius:100, padding:"3px 12px", fontSize:11, fontWeight:700 }}>
                {b.status}
              </span>
            </div>
            {/* Journey links for mobile barbers on overview */}
            {business?.is_mobile && <JourneyLinks booking={b} />}
          </div>
        ))}
      </div>

      <div className="fu d2" style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:18 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>Quick Actions</h3>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {[
            { label:"Add Service",   icon:"➕", action:()=>setActive("services")  },
            { label:"View Calendar", icon:"📅", action:()=>setActive("calendar")  },
            { label:"Manage Staff",  icon:"👥", action:()=>setActive("staff")     },
            { label:"Share Profile", icon:"🔗", action:()=>setActive("share")     },
          ].map((a,i)=>(
            <button key={i} onClick={a.action}
              style={{ display:"flex", alignItems:"center", gap:8, background:L, border:"none", borderRadius:10, padding:"10px 16px", fontFamily:"Poppins", fontWeight:600, fontSize:13, color:P, cursor:"pointer" }}>
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="fu d3" style={{ background:`linear-gradient(135deg,${P} 0%,#7c5cff 100%)`, borderRadius:18, padding:24 }}>
        <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.75)", marginBottom:6 }}>🔗 Your SubSeat Profile</div>
        <div style={{ fontWeight:800, fontSize:17, color:W, marginBottom:12 }}>subseat.co.uk/{business?.category}/{business?.slug}</div>
        <button onClick={()=>navigator.clipboard.writeText(`https://subseat.co.uk/${business?.category}/${business?.slug}`)}
          style={{ background:"rgba(255,255,255,.2)", color:W, border:"1px solid rgba(255,255,255,.3)", borderRadius:10, padding:"10px 20px", fontFamily:"Poppins", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          Copy Link
        </button>
      </div>
    </div>
  );
}

/* ── CALENDAR ── */
function Calendar({ bookings, business }) {
  const [current, setCurrent]       = useState(new Date());
  const [selected, setSelected]     = useState(null);
  const [showAddBooking, setShowAdd]= useState(false);
  const [newBooking, setNewBooking] = useState({ customer_name:"", service:"", time:"09:00", duration:45, type:"one_off", notes:"" });
  const [saving, setSaving]         = useState(false);
  const [localBookings, setLocalBkgs] = useState(bookings);

  const year        = current.getFullYear();
  const month       = current.getMonth();
  const first       = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today       = new Date();

  const getDayBookings = (day) => localBookings.filter(b => {
    const d = new Date(b.start_time);
    return d.getDate()===day && d.getMonth()===month && d.getFullYear()===year;
  });

  const selectedBookings = selected ? getDayBookings(selected) : [];

  const handleAddBooking = async () => {
    setSaving(true);
    const startDt = new Date(year, month, selected);
    const [h,m]   = newBooking.time.split(":").map(Number);
    startDt.setHours(h, m, 0, 0);
    const endDt = new Date(startDt.getTime() + newBooking.duration * 60000);
    const { data, error } = await supabase.from("bookings").insert({
      business_id:    business.id,
      customer_id:    null,
      start_time:     startDt.toISOString(),
      end_time:       endDt.toISOString(),
      status:         "confirmed",
      booking_type:   newBooking.type,
      payment_status: newBooking.type==="cash_walk_in"?"cash_paid":"pay_in_shop",
      source:         "admin",
      notes:          newBooking.notes || newBooking.customer_name,
    }).select().single();
    if (!error && data) setLocalBkgs(prev=>[...prev, data]);
    setShowAdd(false);
    setNewBooking({ customer_name:"", service:"", time:"09:00", duration:45, type:"one_off", notes:"" });
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>Calendar</h2>
        <button className="btn-p" onClick={()=>setShowAdd(true)}>+ Add Booking</button>
      </div>

      {showAddBooking && (
        <>
          <div onClick={()=>setShowAdd(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:998, backdropFilter:"blur(4px)" }} />
          <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:999, background:W, borderRadius:"24px 24px 0 0", padding:"28px 24px 40px", maxWidth:520, margin:"0 auto", boxShadow:"0 -8px 60px rgba(0,0,0,.2)" }}>
            <div style={{ width:40, height:4, borderRadius:4, background:"#e0e0e0", margin:"0 auto 20px" }} />
            <h3 style={{ fontWeight:800, fontSize:18, color:C, marginBottom:18 }}>Add Booking {selected?`— ${months[month]} ${selected}`:""}</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Customer Name</label>
                <input className="inp" placeholder="e.g. Jordan Smith" value={newBooking.customer_name} onChange={e=>setNewBooking({...newBooking,customer_name:e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Service</label>
                <input className="inp" placeholder="e.g. Skin Fade" value={newBooking.service} onChange={e=>setNewBooking({...newBooking,service:e.target.value})} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Time</label>
                  <input className="inp" type="time" value={newBooking.time} onChange={e=>setNewBooking({...newBooking,time:e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Duration (mins)</label>
                  <input className="inp" type="number" value={newBooking.duration} onChange={e=>setNewBooking({...newBooking,duration:e.target.value})} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Booking Type</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[{val:"one_off",label:"One-Off"},{val:"membership",label:"Membership"},{val:"cash_walk_in",label:"Cash/Walk-In"}].map(t=>(
                    <button key={t.val} className={`type-tab ${newBooking.type===t.val?"active":""}`} onClick={()=>setNewBooking({...newBooking,type:t.val})}>{t.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Notes</label>
                <input className="inp" placeholder="Any notes..." value={newBooking.notes} onChange={e=>setNewBooking({...newBooking,notes:e.target.value})} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-p" onClick={handleAddBooking} disabled={saving} style={{ flex:2 }}>{saving?"Saving...":"Confirm Booking"}</button>
                <button onClick={()=>setShowAdd(false)} style={{ flex:1, background:G, border:"none", borderRadius:10, fontFamily:"Poppins", fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="cal-grid-col" style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
        <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <button onClick={()=>setCurrent(new Date(year,month-1,1))} style={{ background:G, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <span style={{ fontWeight:800, fontSize:18, color:C }}>{months[month]} {year}</span>
            <button onClick={()=>setCurrent(new Date(year,month+1,1))} style={{ background:G, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
            {days.map(d=><div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:700, color:"#aaa", padding:"4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {Array(first===0?6:first-1).fill(null).map((_,i)=><div key={`e${i}`} />)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const day     = i+1;
              const isToday = day===today.getDate() && month===today.getMonth() && year===today.getFullYear();
              const dayBkgs = getDayBookings(day);
              const isSel   = selected===day;
              return (
                <div key={day} className={`cal-day ${isToday?"today":""} ${dayBkgs.length>0&&!isToday?"has-appt":""} ${isSel&&!isToday?"selected":""}`} onClick={()=>setSelected(day)}>
                  {day}
                  {dayBkgs.length>0 && (
                    <div style={{ display:"flex", gap:2, marginTop:2 }}>
                      {dayBkgs.slice(0,3).map((_,j)=><div key={j} style={{ width:4, height:4, borderRadius:"50%", background:isToday?W:P }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY DETAIL — with journey links for mobile barbers */}
        <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontWeight:700, fontSize:16, color:C }}>{selected?`${months[month]} ${selected}`:"Select a day"}</h3>
            {selected && <button className="btn-p" style={{ fontSize:12, padding:"7px 14px" }} onClick={()=>setShowAdd(true)}>+ Add</button>}
          </div>
          {!selected && (
            <div style={{ textAlign:"center", padding:"32px 0", color:"#aaa" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>📅</div>
              <div style={{ fontSize:13 }}>Click a day to view appointments</div>
            </div>
          )}
          {selected && selectedBookings.length===0 && (
            <div style={{ textAlign:"center", padding:"32px 0", color:"#aaa" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
              <div style={{ fontSize:13, marginBottom:12 }}>No appointments</div>
              <button className="btn-p" style={{ fontSize:12 }} onClick={()=>setShowAdd(true)}>Add Booking</button>
            </div>
          )}
          {selectedBookings.map((b,i)=>(
            <div key={i} className="appt-slot">
              <div style={{ fontWeight:700, fontSize:14, color:C, marginBottom:4 }}>{b.notes||`Appointment #${i+1}`}</div>
              <div style={{ fontSize:12, color:"#666", marginBottom:6 }}>{fmtT(b.start_time)} — {fmtT(b.end_time)}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <span style={{ background:b.booking_type==="membership"?"#dcfce7":b.booking_type==="cash_walk_in"?"#fef3c7":"#e0e7ff", color:b.booking_type==="membership"?"#166534":b.booking_type==="cash_walk_in"?"#92400e":"#3730a3", borderRadius:100, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
                  {b.booking_type==="cash_walk_in"?"Cash/Walk-In":b.booking_type==="membership"?"Membership":"One-Off"}
                </span>
                <span style={{ background:"#f0fdf4", color:"#166534", borderRadius:100, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{b.status}</span>
              </div>
              {/* 🚐 JOURNEY LINKS — only shows for mobile barbers when customer address exists */}
              {business?.is_mobile && <JourneyLinks booking={b} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── ALL BOOKINGS ── */
function AllBookings({ bookings, business }) {
  const [filter, setFilter] = useState("all");
  const filtered = bookings.filter(b => filter==="all" ? true : b.booking_type===filter);
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:16 }}>All Bookings</h2>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {[{val:"all",label:"All"},{val:"membership",label:"Memberships"},{val:"one_off",label:"One-Off"},{val:"cash_walk_in",label:"Cash/Walk-In"}].map(f=>(
          <button key={f.val} className={`type-tab ${filter===f.val?"active":""}`} onClick={()=>setFilter(f.val)}>{f.label}</button>
        ))}
      </div>
      <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:"#aaa" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📋</div>
            <div style={{ fontSize:14 }}>No bookings yet</div>
          </div>
        ) : (
          <>
            <div className="booking-row" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr", borderBottom:"1px solid #f0f0f0", marginBottom:4 }}>
              {["Details","Date & Time","Type","Status"].map(h=>(
                <div key={h} style={{ fontSize:11, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
              ))}
            </div>
            {filtered.map((b,i)=>(
              <div key={b.id||i}>
                <div className="booking-row" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr" }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:C }}>{b.notes||"Appointment"}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{b.payment_status}</div>
                    {b.customer_address && <div style={{ fontSize:11, color:"#888", marginTop:2 }}>📍 {b.customer_address}</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:13, color:C }}>{fmt(b.start_time)}</div>
                    <div style={{ fontSize:11, color:"#888" }}>{fmtT(b.start_time)}</div>
                  </div>
                  <span style={{ background:b.booking_type==="membership"?"#dcfce7":b.booking_type==="cash_walk_in"?"#fef3c7":"#e0e7ff", color:b.booking_type==="membership"?"#166534":b.booking_type==="cash_walk_in"?"#92400e":"#3730a3", borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700, width:"fit-content" }}>
                    {b.booking_type==="cash_walk_in"?"Cash":b.booking_type==="membership"?"Member":"One-Off"}
                  </span>
                  <span style={{ background:b.status==="confirmed"?"#dcfce7":"#fef3c7", color:b.status==="confirmed"?"#166534":"#92400e", borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700, width:"fit-content" }}>
                    {b.status}
                  </span>
                </div>
                {/* Journey links in all bookings view for mobile barbers */}
                {business?.is_mobile && b.customer_address && (
                  <div style={{ paddingBottom:10 }}><JourneyLinks booking={b} /></div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ── SERVICES ── */
function Services({ services, businessId, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [newSvc,  setNewSvc]  = useState({ name:"", monthly_price:"", one_off_price:"", duration_minutes:45, description:"", service_type:"membership" });

  const memberships = services.filter(s => s.monthly_price > 0);
  const oneOffs     = services.filter(s => s.one_off_price > 0);

  const handleAdd = async () => {
    if (!newSvc.name) return;
    setSaving(true);
    await supabase.from("services").insert({
      business_id:      businessId,
      name:             newSvc.name,
      description:      newSvc.description,
      monthly_price:    newSvc.monthly_price || 0,
      one_off_price:    newSvc.one_off_price || null,
      duration_minutes: parseInt(newSvc.duration_minutes),
      buffer_minutes:   10,
      is_active:        true,
    });
    setNewSvc({ name:"", monthly_price:"", one_off_price:"", duration_minutes:45, description:"", service_type:"membership" });
    setShowAdd(false);
    setSaving(false);
    onRefresh();
  };

  const toggle = async (id, current) => {
    await supabase.from("services").update({ is_active:!current }).eq("id",id);
    onRefresh();
  };

  const renderCard = (s) => (
    <div key={s.id} className="service-card" style={{ marginBottom:12, opacity:s.is_active?1:.6 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:4 }}>{s.name}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:4 }}>
          {s.monthly_price > 0 && <span style={{ fontSize:13, color:P, fontWeight:700 }}>£{parseFloat(s.monthly_price).toFixed(0)}/month</span>}
          {s.one_off_price > 0 && <span style={{ fontSize:13, color:"#f59e0b", fontWeight:700 }}>£{parseFloat(s.one_off_price).toFixed(0)} one-off</span>}
          <span style={{ fontSize:12, color:"#888" }}>⏱ {s.duration_minutes} mins</span>
        </div>
        {s.description && <div style={{ fontSize:12, color:"#aaa" }}>{s.description}</div>}
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <span style={{ background:s.is_active?"#dcfce7":"#fee2e2", color:s.is_active?"#166534":"#991b1b", borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{s.is_active?"Active":"Paused"}</span>
        <button onClick={()=>toggle(s.id, s.is_active)} style={{ background:G, border:"none", borderRadius:8, padding:"7px 14px", fontFamily:"Poppins", fontWeight:600, fontSize:12, cursor:"pointer" }}>{s.is_active?"Pause":"Activate"}</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>Services & Pricing</h2>
        <button className="btn-p" onClick={()=>setShowAdd(!showAdd)}>+ Add Service</button>
      </div>
      {showAdd && (
        <div style={{ background:W, borderRadius:18, padding:24, border:`2px dashed ${P}`, marginBottom:20 }}>
          <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>New Service</h3>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:8 }}>Service Type</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[
                { val:"membership", label:"📅 Subscription / Membership", desc:"Monthly recurring" },
                { val:"one_off",    label:"💈 One-Off Service",            desc:"Single visit"     },
                { val:"both",       label:"🔄 Both",                       desc:"Monthly + one-off"},
              ].map(t=>(
                <button key={t.val} onClick={()=>setNewSvc({...newSvc,service_type:t.val})}
                  style={{ flex:1, minWidth:130, padding:"12px 14px", borderRadius:12, border:`2px solid ${newSvc.service_type===t.val?P:"#eee"}`, background:newSvc.service_type===t.val?L:W, cursor:"pointer", textAlign:"left", transition:"all .2s" }}>
                  <div style={{ fontWeight:700, fontSize:13, color:newSvc.service_type===t.val?P:C, marginBottom:2 }}>{t.label}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <input className="inp" placeholder="Service name" value={newSvc.name} onChange={e=>setNewSvc({...newSvc,name:e.target.value})} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {(newSvc.service_type==="membership"||newSvc.service_type==="both") && (
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Monthly Price (£)</label>
                  <input className="inp" type="number" placeholder="59" value={newSvc.monthly_price} onChange={e=>setNewSvc({...newSvc,monthly_price:e.target.value})} />
                </div>
              )}
              {(newSvc.service_type==="one_off"||newSvc.service_type==="both") && (
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>One-Off Price (£)</label>
                  <input className="inp" type="number" placeholder="25" value={newSvc.one_off_price} onChange={e=>setNewSvc({...newSvc,one_off_price:e.target.value})} />
                </div>
              )}
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Duration (mins)</label>
                <input className="inp" type="number" placeholder="45" value={newSvc.duration_minutes} onChange={e=>setNewSvc({...newSvc,duration_minutes:e.target.value})} />
              </div>
            </div>
            <input className="inp" placeholder="Description (optional)" value={newSvc.description} onChange={e=>setNewSvc({...newSvc,description:e.target.value})} />
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-p" onClick={handleAdd} disabled={saving||!newSvc.name} style={{ flex:1 }}>{saving?"Saving...":"Add Service"}</button>
              <button onClick={()=>setShowAdd(false)} style={{ flex:1, background:G, border:"none", borderRadius:10, fontFamily:"Poppins", fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <span style={{ fontSize:20 }}>📅</span>
          <h3 style={{ fontWeight:700, fontSize:16, color:C }}>Subscription Plans</h3>
          <span style={{ background:L, borderRadius:100, padding:"2px 10px", fontSize:11, fontWeight:700, color:P }}>{memberships.length}</span>
        </div>
        {memberships.length===0 ? <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa", fontSize:13 }}>No subscription plans yet</div> : memberships.map(renderCard)}
      </div>
      <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:20 }}>💈</span>
          <h3 style={{ fontWeight:700, fontSize:16, color:C }}>One-Off Services</h3>
          <span style={{ background:"#fef3c7", borderRadius:100, padding:"2px 10px", fontSize:11, fontWeight:700, color:"#92400e" }}>{oneOffs.length}</span>
        </div>
        <p style={{ fontSize:12, color:"#888", marginBottom:16 }}>No SubSeat fee on one-off services. Day 7 upsell email sent automatically.</p>
        {oneOffs.length===0 ? <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa", fontSize:13 }}>No one-off services yet</div> : oneOffs.map(renderCard)}
      </div>
    </div>
  );
}

/* ── SUBSCRIBERS ── */
function Subscribers({ subscribers }) {
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:16 }}>Subscribers ({subscribers.length})</h2>
      <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
        {subscribers.length===0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:"#aaa" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>👥</div>
            <h3 style={{ fontWeight:700, fontSize:18, color:C, marginBottom:8 }}>No subscribers yet</h3>
            <p style={{ fontSize:14, maxWidth:300, margin:"0 auto 20px" }}>Share your SubSeat profile link to start getting subscribers.</p>
          </div>
        ) : subscribers.map((s,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:i<subscribers.length-1?"1px solid #f0f0f0":"none" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👤</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C }}>Subscriber #{i+1}</div>
                <div style={{ fontSize:12, color:"#888" }}>£{parseFloat(s.monthly_price||0).toFixed(0)}/month</div>
              </div>
            </div>
            <span style={{ background:"#dcfce7", borderRadius:100, padding:"3px 12px", fontSize:11, fontWeight:700, color:"#166534" }}>Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PROFILE EDITOR — with mobile barber toggle ── */
function ProfileEditor({ business, onRefresh }) {
  const [form, setForm] = useState({
    business_name:       business?.business_name       || "",
    description:         business?.description         || "",
    phone:               business?.phone               || "",
    email:               business?.email               || "",
    whatsapp_number:     business?.whatsapp_number     || "",
    address:             business?.address             || "",
    city:                business?.city                || "",
    postcode:            business?.postcode            || "",
    is_mobile:           business?.is_mobile           || false,
    travel_radius_miles: business?.travel_radius_miles || 10,
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("businesses").update(form).eq("id", business.id);
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false), 2000);
    onRefresh();
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>Edit Profile</h2>
      <div style={{ background:W, borderRadius:18, padding:28, border:"1.5px solid #eee" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* STANDARD FIELDS */}
          {[
            { label:"Business Name",  key:"business_name",   placeholder:"Your business name"     },
            { label:"Phone",          key:"phone",            placeholder:"07700 000000"           },
            { label:"Business Email", key:"email",            placeholder:"hello@yourbusiness.com" },
            { label:"WhatsApp",       key:"whatsapp_number",  placeholder:"07700 000000"           },
            { label:"Street Address", key:"address",          placeholder:"14 Brick Lane"          },
          ].map(f=>(
            <div key={f.key}>
              <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>{f.label}</label>
              <input className="inp" placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} />
            </div>
          ))}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>City</label>
              <input className="inp" placeholder="London" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Postcode</label>
              <input className="inp" placeholder="E1 6RF" value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value})} />
            </div>
          </div>

          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Description</label>
            <textarea className="inp" rows={4} placeholder="Tell customers about your business..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ resize:"vertical" }} />
          </div>

          {/* ── MOBILE PROFESSIONAL TOGGLE ── */}
          <div style={{
            background: form.is_mobile ? "#f0fdf4" : G,
            border: `1.5px solid ${form.is_mobile ? "#bbf7d0" : "#eee"}`,
            borderRadius:14, padding:"18px 20px", transition:"all .2s",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: form.is_mobile ? 16 : 0 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:3 }}>🚐 Mobile Professional</div>
                <div style={{ fontSize:12, color:"#888" }}>I travel to customers — they book me at their location</div>
              </div>
              <button
                onClick={() => setForm(f => ({ ...f, is_mobile:!f.is_mobile }))}
                style={{
                  width:48, height:26, borderRadius:100, border:"none",
                  background: form.is_mobile ? P : "#e0e0e0",
                  cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0,
                }}
              >
                <div style={{
                  position:"absolute", top:3,
                  left: form.is_mobile ? 25 : 3,
                  width:20, height:20, borderRadius:"50%", background:W,
                  transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.2)",
                }} />
              </button>
            </div>

            {form.is_mobile && (
              <div style={{ paddingTop:16, borderTop:"1px solid #d1fae5" }}>
                <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:8 }}>
                  Travel radius: <strong>{form.travel_radius_miles} miles</strong>
                </label>
                <input
                  type="range" min={1} max={50} step={1}
                  value={form.travel_radius_miles}
                  onChange={e => setForm(f => ({ ...f, travel_radius_miles:Number(e.target.value) }))}
                  style={{ width:"100%", accentColor:P, marginBottom:8 }}
                />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#bbb", marginBottom:14 }}>
                  <span>1 mile</span><span>50 miles</span>
                </div>
                <div style={{ background:P, borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>🗺️</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:W, marginBottom:2 }}>Map links sent automatically</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.75)" }}>
                      After each booking you'll get Google Maps, Apple Maps and Waze links to your customer's location — one tap to start your journey.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="btn-p" onClick={handleSave} disabled={saving} style={{ alignSelf:"flex-start", padding:"12px 28px" }}>
            {saving?"Saving...":saved?"✅ Saved!":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SHARE & QR ── */
function Share({ business }) {
  const [copied, setCopied] = useState(false);
  const url = `https://subseat.co.uk/${business?.category}/${business?.slug}`;
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>Share & QR Code</h2>
      <div style={{ background:`linear-gradient(135deg,${P} 0%,#7c5cff 100%)`, borderRadius:20, padding:28, marginBottom:20 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,.75)", marginBottom:8 }}>🔗 Your Profile URL</div>
        <div style={{ fontWeight:800, fontSize:18, color:W, marginBottom:16, wordBreak:"break-all" }}>{url}</div>
        <button onClick={()=>{navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
          style={{ background:"rgba(255,255,255,.2)", color:W, border:"1px solid rgba(255,255,255,.3)", borderRadius:10, padding:"12px 24px", fontFamily:"Poppins", fontWeight:700, fontSize:14, cursor:"pointer" }}>
          {copied?"✅ Copied!":"Copy Link"}
        </button>
      </div>
      <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {[
          { icon:"📸", platform:"Instagram", tip:`Add to your Instagram bio: "${url}"` },
          { icon:"💬", platform:"WhatsApp",  tip:"Share your link in your WhatsApp status or broadcast list" },
          { icon:"🎵", platform:"TikTok",    tip:`Add to your TikTok bio: "${url}"` },
          { icon:"📱", platform:"QR Code",   tip:"Download your QR code to print in your shop or on business cards" },
        ].map((s,i)=>(
          <div key={i} style={{ background:W, borderRadius:16, padding:20, border:"1.5px solid #eee" }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:6 }}>{s.platform}</div>
            <div style={{ fontSize:12, color:"#888", lineHeight:1.5 }}>{s.tip}</div>
            {s.platform==="WhatsApp" && (
              <button onClick={()=>window.open(`https://wa.me/?text=Book with me on SubSeat: ${url}`,"_blank")}
                style={{ marginTop:12, background:"#22c55e", color:W, border:"none", borderRadius:8, padding:"8px 16px", fontFamily:"Poppins", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                Share on WhatsApp
              </button>
            )}
            {s.platform==="QR Code" && (
              <button onClick={()=>window.open(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`,"_blank")}
                style={{ marginTop:12, background:P, color:W, border:"none", borderRadius:8, padding:"8px 16px", fontFamily:"Poppins", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                Download QR Code
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function DashboardPage() {
  const [user,          setUser]    = useState(null);
  const [business,      setBusiness]= useState(null);
  const [services,      setServices]= useState([]);
  const [subscribers,   setSubs]    = useState([]);
  const [bookings,      setBookings]= useState([]);
  const [loading,       setLoading] = useState(true);
  const [activeSection, setActive]  = useState("overview");

  useEffect(()=>{ loadData(); },[]);

  const loadData = async () => {
    setLoading(true);
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { window.location.href="/auth"; return; }
    setUser(user);

    const { data:biz } = await supabase.from("businesses").select("*").eq("owner_id",user.id).maybeSingle();
    if (!biz) { window.location.href="/onboarding"; return; }
    setBusiness(biz);

    const [{ data:svcs },{ data:subs },{ data:bkgs }] = await Promise.all([
      supabase.from("services").select("*").eq("business_id",biz.id).order("created_at",{ ascending:false }),
      supabase.from("subscriptions").select("*").eq("business_id",biz.id).eq("status","active"),
      supabase.from("bookings").select("*").eq("business_id",biz.id).order("start_time",{ ascending:true }),
    ]);

    setServices(svcs||[]);
    setSubs(subs||[]);
    setBookings(bkgs||[]);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href="/";
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:14 }}>
        <div style={{ width:40, height:40, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
        <div style={{ color:"#888", fontSize:14 }}>Loading your dashboard...</div>
      </div>
    </>
  );

  const props = { business, services, subscribers, bookings, onRefresh:loadData };

  return (
    <>
      <style>{css}</style>

      {/* NAV — with back to homepage link */}
      <nav style={{ background:W, borderBottom:"1px solid #eee", padding:"0 5%", height:72, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:32, height:32, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", animation:"pulse 3s infinite" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:16 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:17, color:P }}>SubSeat</span>
        </a>
        <span style={{ fontSize:14, fontWeight:600, color:"#888" }}>Business Dashboard</span>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:13, color:"#888" }}>{user?.email}</span>
          <button onClick={handleSignOut} style={{ background:G, border:"none", borderRadius:8, padding:"8px 14px", fontFamily:"Poppins", fontWeight:600, fontSize:12, cursor:"pointer", color:"#e53e3e" }}>Sign Out</button>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="dash-grid" style={{ maxWidth:1280, margin:"0 auto", padding:"28px 5%", display:"grid", gridTemplateColumns:"240px 1fr", gap:24 }}>
        <div className="sidebar-col">
          <Sidebar active={activeSection} setActive={setActive} business={business} onSignOut={handleSignOut} />
        </div>
        <div className="fu">
          {activeSection==="overview"    && <Overview    {...props} setActive={setActive} />}
          {activeSection==="calendar"    && <Calendar    {...props} />}
          {activeSection==="bookings"    && <AllBookings {...props} />}
          {activeSection==="services"    && <Services    {...props} businessId={business?.id} />}
          {activeSection==="subscribers" && <Subscribers {...props} />}
          {activeSection==="staff"       && <StaffSystem business={business} bookings={bookings} subscriptions={subscribers} isOwner={true} />}
          {activeSection==="profile"     && <ProfileEditor business={business} onRefresh={loadData} />}
          {activeSection==="share"       && <Share       business={business} />}
        </div>
      </div>
    </>
  );
}