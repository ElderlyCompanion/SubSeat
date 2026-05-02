'use client';
import { useState, useEffect, use } from "react";
import { supabase } from "../../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; background:${G}; color:${C}; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(86,59,231,.4)} 50%{box-shadow:0 0 0 10px rgba(86,59,231,0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }

  .fu { animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both }
  .d1 { animation-delay:.08s }
  .d2 { animation-delay:.16s }
  .d3 { animation-delay:.24s }

  .service-card {
    background:${W}; border-radius:14px; padding:18px 20px;
    border:2px solid #eee; cursor:pointer; transition:all .2s;
  }
  .service-card:hover   { border-color:${P}; transform:translateY(-2px); }
  .service-card.selected { border-color:${P}; background:${L}; }

  .time-slot {
    padding:12px 16px; border-radius:10px; border:2px solid #eee;
    background:${W}; cursor:pointer; transition:all .18s;
    font-family:'Poppins',sans-serif; font-weight:600; font-size:14px;
    text-align:center; color:${C};
  }
  .time-slot:hover    { border-color:${P}; color:${P}; }
  .time-slot.selected { border-color:${P}; background:${P}; color:${W}; }
  .time-slot.taken    { opacity:.4; cursor:not-allowed; text-decoration:line-through; }

  .step-dot {
    width:32px; height:32px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:800; flex-shrink:0; transition:all .2s;
  }
  .step-dot.done    { background:${P}; color:${W}; }
  .step-dot.active  { background:${P}; color:${W}; box-shadow:0 0 0 6px ${L}; }
  .step-dot.pending { background:#eee; color:#aaa; }

  .inp {
    width:100%; padding:12px 14px; border-radius:10px;
    border:1.5px solid #e0e0e0; background:${W};
    font-family:'Poppins',sans-serif; font-size:14px; color:${C};
    outline:none; transition:border-color .2s;
  }
  .inp:focus { border-color:${P}; box-shadow:0 0 0 3px rgba(86,59,231,.08); }

  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:${P}; color:${W}; border:none;
    padding:14px 28px; border-radius:12px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:15px;
    cursor:pointer; transition:all .2s; width:100%;
  }
  .btn-p:hover    { background:#4429d4; transform:translateY(-1px); }
  .btn-p:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  .btn-s {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:transparent; color:${P}; border:2px solid ${P};
    padding:12px 24px; border-radius:12px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:14px;
    cursor:pointer; transition:all .2s; width:100%;
  }
  .btn-s:hover { background:${L}; }

  .cal-day {
    aspect-ratio:1; border-radius:10px; display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:600; cursor:pointer; transition:all .18s;
    border:1.5px solid transparent;
  }
  .cal-day:hover    { background:${L}; border-color:${P}; }
  .cal-day.selected { background:${P}; color:${W}; }
  .cal-day.today    { border-color:${P}; color:${P}; font-weight:800; }
  .cal-day.past     { opacity:.35; cursor:not-allowed; }
  .cal-day.disabled { opacity:.35; cursor:not-allowed; }

  @media(max-width:768px) {
    .booking-layout { grid-template-columns:1fr !important; }
  }
`;

const months   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function generateTimeSlots(openTime="09:00", closeTime="18:00", duration=45, buffer=10) {
  const slots = [];
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur + duration <= end) {
    const h = Math.floor(cur/60).toString().padStart(2,"0");
    const m = (cur%60).toString().padStart(2,"0");
    slots.push(`${h}:${m}`);
    cur += duration + buffer;
  }
  return slots;
}

const STEPS = ["Service","Date","Time","Your Details","Confirm"];

export default function BookingPage({ params }) {
  const { slug, category } = use(params);

  const [business,   setBusiness]   = useState(null);
  const [services,   setServices]   = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [step,       setStep]       = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed,  setConfirmed]  = useState(false);

  // Booking state
  const [selectedService, setSelectedService] = useState(null);
  const [currentMonth,    setCurrentMonth]    = useState(new Date());
  const [selectedDate,    setSelectedDate]    = useState(null);
  const [selectedTime,    setSelectedTime]    = useState(null);
  const [bookingType,     setBookingType]     = useState("one_off");
  const [customerInfo,    setCustomerInfo]    = useState({ full_name:"", email:"", phone:"", notes:"" });

  useEffect(() => { loadBusiness(); }, [slug]);

  const loadBusiness = async () => {
    setLoading(true);
    const { data:biz } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!biz) { setLoading(false); return; }
    setBusiness(biz);

    const [{ data:svcs },{ data:bkgs }] = await Promise.all([
      supabase.from("services").select("*").eq("business_id", biz.id).eq("is_active", true),
      supabase.from("bookings").select("start_time,end_time").eq("business_id", biz.id).in("status",["confirmed","pending"]),
    ]);

    setServices(svcs || []);
    setBookings(bkgs || []);
    setLoading(false);
  };

  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date();

  const isSlotTaken = (date, time) => {
    if (!date) return false;
    const [h,m] = time.split(":").map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(h, m, 0, 0);
    const dur = (selectedService?.duration_minutes||45) * 60000;
    const slotEnd = new Date(slotStart.getTime() + dur);
    return bookings.some(b => {
      const bStart = new Date(b.start_time);
      const bEnd   = new Date(b.end_time);
      return slotStart < bEnd && slotEnd > bStart;
    });
  };

  const timeSlots = selectedService
    ? generateTimeSlots("09:00","18:00", selectedService.duration_minutes||45, 10)
    : [];

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const { data:{ user } } = await supabase.auth.getUser();

      const [h,m] = selectedTime.split(":").map(Number);
      const startDt = new Date(selectedDate);
      startDt.setHours(h, m, 0, 0);
      const endDt = new Date(startDt.getTime() + (selectedService.duration_minutes||45)*60000);

      // Upsert customer profile if guest
      let customerId = user?.id || null;
      if (!user && customerInfo.email) {
        const { data:existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customerInfo.email)
          .maybeSingle();
        customerId = existingProfile?.id || null;
      }

      // Create booking
      const { data:booking, error } = await supabase.from("bookings").insert({
        business_id:    business.id,
        customer_id:    customerId,
        service_id:     selectedService.id,
        booking_type:   bookingType,
        start_time:     startDt.toISOString(),
        end_time:       endDt.toISOString(),
        status:         "confirmed",
        payment_status: bookingType==="cash_walk_in"?"cash_paid":"pay_in_shop",
        source:         "website",
        notes:          customerInfo.notes,
      }).select().single();

      if (!error && booking) {
        // Queue confirmation notification
        await supabase.from("notification_queue").insert([
          {
            business_id:       business.id,
            booking_id:        booking.id,
            channel:           "email",
            notification_type: "booking_confirmation_customer",
            recipient:         customerInfo.email,
            subject:           `Booking confirmed with ${business.business_name}`,
            message:           `Hi ${customerInfo.full_name}, your appointment with ${business.business_name} is confirmed for ${startDt.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})} at ${selectedTime}.`,
            status:            "pending",
            scheduled_for:     new Date().toISOString(),
          },
          {
            business_id:       business.id,
            booking_id:        booking.id,
            channel:           "email",
            notification_type: "booking_confirmation_business",
            recipient:         business.email || "",
            subject:           `New booking from ${customerInfo.full_name}`,
            message:           `${customerInfo.full_name} booked ${selectedService.name} for ${startDt.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})} at ${selectedTime}.`,
            status:            "pending",
            scheduled_for:     new Date().toISOString(),
          },
        ]);

        // Log booking event
        await supabase.from("booking_events").insert({
          booking_id:        booking.id,
          business_id:       business.id,
          customer_id:       customerId,
          event_type:        "booking_created",
          event_description: `${customerInfo.full_name} booked ${selectedService.name}`,
          metadata:          { booking_type:bookingType, service:selectedService.name, time:selectedTime },
        });

        setConfirmed(true);
      }
    } catch(err) { console.error(err); }
    setSubmitting(false);
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:14 }}>
        <div style={{ width:36, height:36, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
        <div style={{ color:"#888", fontSize:14 }}>Loading booking page...</div>
      </div>
    </>
  );

  if (!business) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:14, textAlign:"center", padding:24 }}>
        <div style={{ fontSize:56 }}>🔍</div>
        <h2 style={{ fontWeight:800, fontSize:24, color:C }}>Business not found</h2>
        <a href="/discover" style={{ color:P, fontWeight:600, fontSize:14 }}>Back to Discover</a>
      </div>
    </>
  );

  // CONFIRMED STATE
  if (confirmed) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:20, textAlign:"center", padding:24, background:G }}>
        <div style={{ background:W, borderRadius:24, padding:"48px 40px", maxWidth:480, width:"100%", boxShadow:"0 20px 60px rgba(86,59,231,.12)", border:`1.5px solid ${L}` }}>
          <div style={{ width:80, height:80, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 20px" }}>✅</div>
          <h2 style={{ fontWeight:900, fontSize:26, color:C, marginBottom:8 }}>Booking Confirmed!</h2>
          <p style={{ fontSize:15, color:"#666", marginBottom:8 }}>
            <strong>{customerInfo.full_name}</strong>, your appointment with <strong>{business.business_name}</strong> is confirmed.
          </p>
          <div style={{ background:L, borderRadius:14, padding:"16px 20px", margin:"20px 0", textAlign:"left" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:"#888" }}>Service</span>
              <span style={{ fontSize:13, fontWeight:700, color:C }}>{selectedService?.name}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:"#888" }}>Date</span>
              <span style={{ fontSize:13, fontWeight:700, color:C }}>{selectedDate?.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"long"})}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:"#888" }}>Time</span>
              <span style={{ fontSize:13, fontWeight:700, color:C }}>{selectedTime}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:13, color:"#888" }}>Price</span>
              <span style={{ fontSize:13, fontWeight:700, color:P }}>£{parseFloat(selectedService?.one_off_price||selectedService?.monthly_price||0).toFixed(0)}</span>
            </div>
          </div>
          <p style={{ fontSize:13, color:"#888", marginBottom:24 }}>A confirmation email has been sent to {customerInfo.email}</p>

          {/* ADD TO CALENDAR */}
          <button onClick={()=>{
            const start = new Date(selectedDate);
            const [h,mm] = selectedTime.split(":").map(Number);
            start.setHours(h,mm,0,0);
            const end = new Date(start.getTime()+(selectedService?.duration_minutes||45)*60000);
            const fmt = d => d.toISOString().replace(/-|:|\.\d{3}/g,"");
            window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment at ${business.business_name}`)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(`Booked via SubSeat — ${selectedService?.name}`)}`, "_blank");
          }} style={{ background:G, border:`1.5px solid #eee`, borderRadius:12, padding:"12px", fontFamily:"Poppins", fontWeight:700, fontSize:14, cursor:"pointer", width:"100%", marginBottom:10, color:C }}>
            📅 Add to Google Calendar
          </button>

          {/* MEMBERSHIP UPSELL */}
          {selectedService?.monthly_price > 0 && (
            <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:14, padding:"16px 18px", marginBottom:16, textAlign:"left" }}>
              <div style={{ fontWeight:700, fontSize:14, color:"#166534", marginBottom:4 }}>💡 Save with a membership</div>
              <div style={{ fontSize:12, color:"#166534", marginBottom:10 }}>
                Subscribe for £{parseFloat(selectedService.monthly_price).toFixed(0)}/month and get priority booking + better value every month.
              </div>
              <a href={`/${category}/${slug}`} style={{ fontSize:12, fontWeight:700, color:"#166534", textDecoration:"underline" }}>
                View membership plans →
              </a>
            </div>
          )}

          <div style={{ display:"flex", gap:10 }}>
            <a href="/discover" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:L, color:P, textDecoration:"none", borderRadius:12, padding:"12px", fontFamily:"Poppins", fontWeight:700, fontSize:13 }}>
              Find More
            </a>
            <a href="/profile" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:P, color:W, textDecoration:"none", borderRadius:12, padding:"12px", fontFamily:"Poppins", fontWeight:700, fontSize:13 }}>
              My Bookings
            </a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:W, borderBottom:"1px solid #eee", padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href={`/${category}/${slug}`} style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", color:C, fontWeight:600, fontSize:14 }}>
          ← {business.business_name}
        </a>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:P, display:"flex", alignItems:"center", justifyContent:"center", animation:"pulse 3s infinite", position:"relative" }}>
            <div style={{ position:"absolute", right:-3, top:"50%", transform:"translateY(-50%)", width:9, height:9, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:14 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:16, color:P }}>SubSeat</span>
        </div>
        <div style={{ fontSize:13, color:"#888", fontWeight:600 }}>Book Appointment</div>
      </nav>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 5%" }}>

        {/* PROGRESS STEPS */}
        <div className="fu" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:40, overflowX:"auto" }}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div className={`step-dot ${i<step?"done":i===step?"active":"pending"}`}>
                  {i<step ? "✓" : i+1}
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:i<=step?P:"#aaa", whiteSpace:"nowrap" }}>{s}</span>
              </div>
              {i<STEPS.length-1 && (
                <div style={{ width:40, height:2, background:i<step?P:"#eee", margin:"0 4px 20px", transition:"background .3s", flexShrink:0 }} />
              )}
            </div>
          ))}
        </div>

        {/* BUSINESS HEADER */}
        <div className="fu d1" style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:24, display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:64, height:64, borderRadius:16, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>✂️</div>
          <div>
            <div style={{ fontWeight:800, fontSize:20, color:C }}>{business.business_name}</div>
            <div style={{ fontSize:14, color:"#888" }}>{business.city} · {business.category}</div>
            {business.rating && <div style={{ fontSize:13, color:"#f59e0b", fontWeight:600, marginTop:4 }}>★ {business.rating}</div>}
          </div>
        </div>

        {/* STEP 0 — SERVICE */}
        {step===0 && (
          <div className="fu">
            <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:6 }}>Choose a service</h2>
            <p style={{ fontSize:14, color:"#888", marginBottom:20 }}>Select the service you'd like to book.</p>

            {services.length===0 ? (
              <div style={{ background:W, borderRadius:18, padding:"40px 24px", border:"1.5px solid #eee", textAlign:"center", color:"#888" }}>
                No services available yet. Check back soon!
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {services.map(s=>(
                  <div key={s.id}
                    className={`service-card ${selectedService?.id===s.id?"selected":""}`}
                    onClick={()=>{ setSelectedService(s); setBookingType(s.one_off_price?"one_off":"membership"); }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:16, color:C, marginBottom:4 }}>{s.name}</div>
                        <div style={{ fontSize:13, color:"#888", marginBottom:8 }}>⏱ {s.duration_minutes} mins</div>
                        {s.description && <div style={{ fontSize:12, color:"#aaa" }}>{s.description}</div>}
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0, marginLeft:16 }}>
                        {s.one_off_price > 0 && (
                          <div style={{ fontWeight:800, fontSize:20, color:C }}>£{parseFloat(s.one_off_price).toFixed(0)}</div>
                        )}
                        {s.monthly_price > 0 && (
                          <div style={{ fontSize:12, color:P, fontWeight:600 }}>£{parseFloat(s.monthly_price).toFixed(0)}/mo membership</div>
                        )}
                      </div>
                    </div>
                    {selectedService?.id===s.id && s.one_off_price>0 && s.monthly_price>0 && (
                      <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(86,59,231,.2)" }}>
                        <div style={{ fontSize:12, fontWeight:700, color:P, marginBottom:8 }}>How would you like to book?</div>
                        <div style={{ display:"flex", gap:8 }}>
                          <button onClick={e=>{e.stopPropagation();setBookingType("one_off")}}
                            style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${bookingType==="one_off"?P:"#eee"}`, background:bookingType==="one_off"?P:W, color:bookingType==="one_off"?W:C, fontFamily:"Poppins", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                            One-Off · £{parseFloat(s.one_off_price).toFixed(0)}
                          </button>
                          <button onClick={e=>{e.stopPropagation();setBookingType("membership")}}
                            style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${bookingType==="membership"?P:"#eee"}`, background:bookingType==="membership"?P:W, color:bookingType==="membership"?W:C, fontFamily:"Poppins", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                            Subscribe · £{parseFloat(s.monthly_price).toFixed(0)}/mo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button className="btn-p" style={{ marginTop:24 }} disabled={!selectedService} onClick={()=>setStep(1)}>
              Continue → Choose Date
            </button>
          </div>
        )}

        {/* STEP 1 — DATE */}
        {step===1 && (
          <div className="fu">
            <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:6 }}>Choose a date</h2>
            <p style={{ fontSize:14, color:"#888", marginBottom:20 }}>Select when you'd like your appointment.</p>
            <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <button onClick={()=>setCurrentMonth(new Date(year,month-1,1))} style={{ background:G, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
                <span style={{ fontWeight:800, fontSize:17, color:C }}>{months[month]} {year}</span>
                <button onClick={()=>setCurrentMonth(new Date(year,month+1,1))} style={{ background:G, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:8 }}>
                {dayNames.map(d=><div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:700, color:"#aaa", padding:"3px 0" }}>{d}</div>)}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
                {Array(first===0?6:first-1).fill(null).map((_,i)=><div key={`e${i}`}/>)}
                {Array(daysInMonth).fill(null).map((_,i)=>{
                  const day  = i+1;
                  const date = new Date(year,month,day);
                  const isPast = date < new Date(today.setHours(0,0,0,0));
                  const isSel  = selectedDate?.toDateString()===date.toDateString();
                  const isTod  = date.toDateString()===new Date().toDateString();
                  const isSun  = date.getDay()===0;
                  return (
                    <div key={day}
                      className={`cal-day ${isPast||isSun?"past":""} ${isSel?"selected":""} ${isTod&&!isSel?"today":""}`}
                      onClick={()=>{ if(!isPast&&!isSun){ setSelectedDate(date); setSelectedTime(null); } }}>
                      {day}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize:11, color:"#aaa", marginTop:12, textAlign:"center" }}>Sundays are closed</div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={()=>setStep(0)}>← Back</button>
              <button className="btn-p" disabled={!selectedDate} onClick={()=>setStep(2)}>Continue → Choose Time</button>
            </div>
          </div>
        )}

        {/* STEP 2 — TIME */}
        {step===2 && (
          <div className="fu">
            <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:6 }}>Choose a time</h2>
            <p style={{ fontSize:14, color:"#888", marginBottom:20 }}>
              Available slots for {selectedDate?.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}
            </p>
            <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                {timeSlots.map(time=>{
                  const taken = isSlotTaken(selectedDate, time);
                  return (
                    <button key={time}
                      className={`time-slot ${selectedTime===time?"selected":""} ${taken?"taken":""}`}
                      onClick={()=>!taken&&setSelectedTime(time)}
                      disabled={taken}>
                      {time}
                    </button>
                  );
                })}
              </div>
              {timeSlots.length===0 && (
                <div style={{ textAlign:"center", padding:"32px 0", color:"#888", fontSize:14 }}>
                  No available slots for this day.
                </div>
              )}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={()=>setStep(1)}>← Back</button>
              <button className="btn-p" disabled={!selectedTime} onClick={()=>setStep(3)}>Continue → Your Details</button>
            </div>
          </div>
        )}

        {/* STEP 3 — CUSTOMER DETAILS */}
        {step===3 && (
          <div className="fu">
            <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:6 }}>Your details</h2>
            <p style={{ fontSize:14, color:"#888", marginBottom:20 }}>We'll send your confirmation to these details.</p>
            <div style={{ background:W, borderRadius:18, padding:28, border:"1.5px solid #eee", marginBottom:20 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { label:"Full Name *", key:"full_name", type:"text",  placeholder:"Jordan Smith"             },
                  { label:"Email *",     key:"email",     type:"email", placeholder:"your@email.com"           },
                  { label:"Phone",       key:"phone",     type:"tel",   placeholder:"07700 000000"             },
                  { label:"Notes",       key:"notes",     type:"text",  placeholder:"Anything we should know?" },
                ].map(f=>(
                  <div key={f.key}>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>{f.label}</label>
                    <input className="inp" type={f.type} placeholder={f.placeholder}
                      value={customerInfo[f.key]} onChange={e=>setCustomerInfo({...customerInfo,[f.key]:e.target.value})} />
                  </div>
                ))}
              </div>

              {/* MARKETING CONSENT */}
              <div style={{ background:G, borderRadius:10, padding:"12px 14px", marginTop:14 }}>
                <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                  <input type="checkbox" defaultChecked style={{ marginTop:2, accentColor:P, width:15, height:15 }} />
                  <span style={{ fontSize:12, color:"#666", lineHeight:1.5 }}>
                    Send me booking reminders and updates. I can opt out anytime.
                  </span>
                </label>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={()=>setStep(2)}>← Back</button>
              <button className="btn-p"
                disabled={!customerInfo.full_name||!customerInfo.email}
                onClick={()=>setStep(4)}>
                Continue → Confirm
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONFIRM */}
        {step===4 && (
          <div className="fu">
            <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:6 }}>Confirm your booking</h2>
            <p style={{ fontSize:14, color:"#888", marginBottom:20 }}>Review your appointment details below.</p>
            <div style={{ background:W, borderRadius:18, padding:28, border:"1.5px solid #eee", marginBottom:20 }}>
              {[
                { label:"Business",   val:business.business_name                                                                  },
                { label:"Service",    val:selectedService?.name                                                                   },
                { label:"Duration",   val:`${selectedService?.duration_minutes} mins`                                             },
                { label:"Date",       val:selectedDate?.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})   },
                { label:"Time",       val:selectedTime                                                                            },
                { label:"Type",       val:bookingType==="one_off"?"One-Off Booking":"Membership Booking"                         },
                { label:"Price",      val:`£${parseFloat(bookingType==="one_off"?(selectedService?.one_off_price||0):(selectedService?.monthly_price||0)).toFixed(0)}${bookingType==="membership"?"/mo":""}` },
                { label:"Your Name",  val:customerInfo.full_name                                                                  },
                { label:"Email",      val:customerInfo.email                                                                     },
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:i<8?"1px solid #f0f0f0":"none" }}>
                  <span style={{ fontSize:13, color:"#888", fontWeight:500 }}>{r.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:C, textAlign:"right", maxWidth:"60%" }}>{r.val}</span>
                </div>
              ))}
            </div>

            {bookingType==="cash_walk_in"||bookingType==="one_off" ? (
              <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:12, padding:"14px 16px", marginBottom:16, fontSize:13, color:"#166534", fontWeight:500 }}>
                💳 Payment will be taken at the venue. Please bring cash or card.
              </div>
            ) : null}

            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-s" onClick={()=>setStep(3)}>← Back</button>
              <button className="btn-p" disabled={submitting} onClick={handleConfirmBooking}>
                {submitting ? "Confirming..." : "✅ Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}