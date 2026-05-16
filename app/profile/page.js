'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
  @keyframes shimmer{ 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .fu  { animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both }
  .d1  { animation-delay:.05s }
  .d2  { animation-delay:.1s  }
  .d3  { animation-delay:.15s }
  .d4  { animation-delay:.2s  }

  .nav-item {
    display:flex; align-items:center; gap:10px;
    padding:10px 14px; border-radius:12px; cursor:pointer;
    font-size:13px; font-weight:600; color:#888;
    transition:all .18s; border:none; background:transparent;
    font-family:'Poppins',sans-serif; width:100%; text-align:left;
  }
  .nav-item:hover  { background:${L}; color:${P}; }
  .nav-item.active { background:${P}; color:${W}; }

  .card {
    background:${W}; border-radius:18px; padding:24px;
    border:1.5px solid #eee; transition:all .2s;
  }
  .card:hover { border-color:${P}; box-shadow:0 8px 28px rgba(86,59,231,.08); }

  .stat-card {
    background:${W}; border-radius:16px; padding:20px;
    border:1.5px solid #eee; transition:all .2s;
  }
  .stat-card:hover { border-color:${P}; transform:translateY(-2px); }

  .sub-card {
    background:${W}; border-radius:16px; padding:20px;
    border:1.5px solid #eee; transition:all .2s; cursor:pointer;
  }
  .sub-card:hover { border-color:${P}; box-shadow:0 8px 24px rgba(86,59,231,.10); transform:translateY(-1px); }

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
    padding:11px 22px; border-radius:10px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:14px;
    cursor:pointer; transition:all .2s;
  }
  .btn-p:hover { background:#4429d4; transform:translateY(-1px); }

  .btn-s {
    display:inline-flex; align-items:center; gap:6px;
    background:transparent; color:${P}; border:1.5px solid ${P};
    padding:9px 18px; border-radius:10px;
    font-family:'Poppins',sans-serif; font-weight:600; font-size:13px;
    cursor:pointer; transition:all .2s;
  }
  .btn-s:hover { background:${L}; }

  .progress-bar {
    height:8px; border-radius:100px; background:#f0f0f0; overflow:hidden;
  }
  .progress-fill {
    height:100%; border-radius:100px;
    background:linear-gradient(90deg,${P},#7c5cff);
    transition:width .6s cubic-bezier(.22,1,.36,1);
  }

  .reward-card {
    background:linear-gradient(135deg,${P} 0%,#7c5cff 100%);
    border-radius:18px; padding:24px; color:${W};
  }

  .notif-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 0; border-bottom:1px solid #f0f0f0;
  }
  .notif-row:last-child { border-bottom:none; }

  .toggle {
    width:44px; height:24px; border-radius:100px; cursor:pointer;
    position:relative; transition:background .2s; flex-shrink:0; border:none;
  }
  .toggle-knob {
    position:absolute; top:3px; width:18px; height:18px;
    border-radius:50%; background:${W}; transition:left .2s;
  }

  .cal-day {
    aspect-ratio:1; border-radius:9px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; cursor:default;
    font-size:12px; font-weight:600; color:${C};
    border:1.5px solid transparent; transition:all .18s;
  }
  .cal-day.has-appt { background:${L}; border-color:${P}; color:${P}; cursor:pointer; }
  .cal-day.today    { background:${P}; color:${W}; }
  .cal-day.other    { color:#ccc; }

  .saved-card {
    display:flex; align-items:center; gap:14px;
    padding:14px; background:${W}; border-radius:14px;
    border:1.5px solid #eee; transition:all .2s; cursor:pointer;
  }
  .saved-card:hover { border-color:${P}; transform:translateY(-1px); }

  @media(max-width:900px) {
    .profile-grid { grid-template-columns:1fr !important; }
    .sidebar-col  { display:none !important; }
    .stats-4      { grid-template-columns:1fr 1fr !important; }
    .two-col      { grid-template-columns:1fr !important; }
  }
`;

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const daysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const fmtDate = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtTime = d => new Date(d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

/* ── SIDEBAR ── */
const NAV = [
  { id:"overview",      icon:"🏠", label:"My Overview"       },
  { id:"subscriptions", icon:"💳", label:"My Subscriptions"  },
  { id:"calendar",      icon:"📅", label:"My Calendar"       },
  { id:"spend",         icon:"💰", label:"Spend & Savings"   },
  { id:"saved",         icon:"❤️",  label:"Saved Professionals"},
  { id:"rewards",       icon:"🎁", label:"Rewards & Referrals"},
  { id:"notifications", icon:"🔔", label:"Notifications"     },
  { id:"account",       icon:"👤", label:"My Account"        },
];

function Sidebar({ active, setActive, profile, onSignOut }) {
  return (
    <div style={{ background:W, borderRadius:20, padding:20, border:"1.5px solid #eee", position:"sticky", top:88, height:"fit-content" }}>
      <div style={{ textAlign:"center", marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f0f0f0" }}>
        <div style={{ width:68, height:68, borderRadius:"50%", background:L, margin:"0 auto 10px", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, border:`3px solid ${W}`, boxShadow:`0 4px 16px rgba(86,59,231,.15)` }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : "👤"}
        </div>
        <div style={{ fontWeight:800, fontSize:14, color:C, marginBottom:2 }}>{profile?.full_name||"Welcome!"}</div>
        <div style={{ fontSize:11, color:"#888" }}>SubSeat Member</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {NAV.map(n=>(
          <button key={n.id} className={`nav-item ${active===n.id?"active":""}`} onClick={()=>setActive(n.id)}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ borderTop:"1px solid #f0f0f0", marginTop:10, paddingTop:10 }}>
          <a href="/discover" style={{ textDecoration:"none" }}>
            <button className="nav-item"><span>🔍</span>Find Professionals</button>
          </a>
          <button className="nav-item" onClick={onSignOut} style={{ color:"#e53e3e" }}><span>🚪</span>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

/* ── OVERVIEW ── */
function Overview({ profile, subscriptions, bookings, points, setActive }) {
  const upcoming    = bookings.filter(b => new Date(b.start_time) >= new Date() && b.status !== "cancelled");
  const totalSpend  = subscriptions.reduce((a,s) => a+parseFloat(s.monthly_price||0), 0);
  const totalSavings= subscriptions.reduce((a,s) => {
    const oneOff = parseFloat(s.services?.one_off_price||0);
    const monthly= parseFloat(s.monthly_price||0);
    return a + Math.max(0, oneOff * 4 - monthly);
  }, 0);

  // Profile completeness
  const fields = [
    { label:"Name",     done:!!profile?.full_name    },
    { label:"Photo",    done:!!profile?.avatar_url   },
    { label:"Phone",    done:!!profile?.phone        },
    { label:"Birthday", done:!!profile?.date_of_birth},
    { label:"Email",    done:true                    },
  ];
  const pct = Math.round(fields.filter(f=>f.done).length / fields.length * 100);

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>
          Good {new Date().getHours()<12?"morning":"afternoon"}, {profile?.full_name?.split(" ")[0]||"there"} 👋
        </h2>
        <p style={{ fontSize:14, color:"#888", marginTop:4 }}>Here's your SubSeat overview.</p>
      </div>

      {/* STATS */}
      <div className="stats-4 fu" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        {[
          { label:"Active Subscriptions", val:subscriptions.length,          icon:"💳", color:P         },
          { label:"Upcoming Appointments",val:upcoming.length,               icon:"📅", color:"#22c55e" },
          { label:"Monthly Spend",        val:`£${totalSpend.toFixed(0)}`,   icon:"💰", color:"#f59e0b" },
          { label:"Loyalty Points",       val:points,                        icon:"⭐", color:"#8b5cf6" },
        ].map((s,i)=>(
          <div key={i} className="stat-card fu" style={{ animationDelay:`${i*.05}s` }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:11, color:"#888", marginBottom:3 }}>{s.label}</div>
            <div style={{ fontWeight:900, fontSize:24, color:s.color, letterSpacing:"-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* PROFILE COMPLETENESS */}
      {pct < 100 && (
        <div className="card fu d1" style={{ marginBottom:18, borderColor:pct>60?"#bbf7d0":"#fde68a" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:2 }}>Complete your profile</div>
              <div style={{ fontSize:12, color:"#888" }}>Unlock rewards and birthday offers</div>
            </div>
            <div style={{ fontWeight:900, fontSize:22, color:P }}>{pct}%</div>
          </div>
          <div className="progress-bar" style={{ marginBottom:12 }}>
            <div className="progress-fill" style={{ width:`${pct}%` }} />
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {fields.filter(f=>!f.done).map((f,i)=>(
              <button key={i} onClick={()=>setActive("account")}
                style={{ background:"#fef3c7", border:"none", borderRadius:8, padding:"5px 12px", fontSize:12, fontWeight:600, color:"#92400e", cursor:"pointer" }}>
                + Add {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING APPOINTMENTS */}
      <div className="card fu d2" style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontWeight:700, fontSize:16, color:C }}>Upcoming Appointments</h3>
          <button className="btn-s" style={{ fontSize:12 }} onClick={()=>setActive("calendar")}>View All</button>
        </div>
        {upcoming.length===0 ? (
          <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>📅</div>
            <div style={{ fontSize:14, marginBottom:12 }}>No upcoming appointments</div>
            <a href="/discover"><button className="btn-p" style={{ fontSize:13 }}>Find a Professional</button></a>
          </div>
        ) : upcoming.slice(0,3).map((b,i)=>(
          <div key={i} style={{ background:L, borderRadius:12, padding:"14px 16px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C }}>
                {new Date(b.start_time).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}
              </div>
              <div style={{ fontSize:12, color:P, fontWeight:600, marginTop:2 }}>{fmtTime(b.start_time)}</div>
            </div>
            <span style={{ background:P, color:W, borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700 }}>{b.status}</span>
          </div>
        ))}
      </div>

      {/* SUBSCRIPTION UPSELL — shown when no subscriptions */}
      {subscriptions.length === 0 && (
        <div className="fu d3" style={{ background:`linear-gradient(135deg,#0f0f1a,#1a1040)`, borderRadius:20, padding:28, marginBottom:18, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(86,59,231,.2)" }} />
          <div style={{ position:"absolute", bottom:-30, left:-10, width:80, height:80, borderRadius:"50%", background:"rgba(86,59,231,.15)" }} />
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>✂️</div>
            <div style={{ fontWeight:900, fontSize:20, color:W, marginBottom:8, letterSpacing:"-0.5px" }}>
              Never miss your regular appointment again
            </div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,.7)", marginBottom:20, lineHeight:1.7 }}>
              Subscribe to your favourite barber or salon. Lock in your slot every month, get automatic reminders and save money compared to one-off bookings.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
              {[
                ["🔒", "Priority booking. Your slot. Always guaranteed."],
                ["💰", "Discounted member pricing every month."],
                ["🎂", "Birthday rewards and exclusive member perks."],
                ["🔔", "Automatic reminders so you never forget."],
              ].map(([icon, text]) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:"rgba(255,255,255,.85)" }}>
                  <span style={{ fontSize:16 }}>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <a href="/discover" style={{ textDecoration:"none" }}>
              <button style={{ background:P, color:W, border:"none", borderRadius:12, padding:"13px 24px", fontFamily:"Poppins", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 6px 20px rgba(86,59,231,.5)" }}>
                Find a Professional to Subscribe →
              </button>
            </a>
          </div>
        </div>
      )}

      {/* SAVINGS BANNER — shown when subscribed */}
      {totalSavings > 0 && (
        <div style={{ background:`linear-gradient(135deg,#22c55e,#16a34a)`, borderRadius:18, padding:24, color:W }} className="fu d3">
          <div style={{ fontSize:28, marginBottom:6 }}>💚</div>
          <div style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>You're saving £{totalSavings.toFixed(0)}/month</div>
          <div style={{ fontSize:13, opacity:.85 }}>vs booking everything at one-off prices. Keep it up!</div>
        </div>
      )}

      {/* ADD MORE — shown when has subscriptions but no savings data */}
      {subscriptions.length > 0 && totalSavings === 0 && (
        <div style={{ background:`linear-gradient(135deg,${P},#7c5cff)`, borderRadius:18, padding:24, color:W }} className="fu d3">
          <div style={{ fontWeight:800, fontSize:18, marginBottom:6 }}>✨ Add more professionals</div>
          <div style={{ fontSize:13, opacity:.85, marginBottom:16 }}>Hair, nails, lashes, brows, massage and more. Subscribe and save across all your beauty needs.</div>
          <a href="/discover" style={{ textDecoration:"none" }}>
            <button style={{ background:"rgba(255,255,255,.2)", color:W, border:"1px solid rgba(255,255,255,.3)", borderRadius:10, padding:"10px 20px", fontFamily:"Poppins", fontWeight:700, fontSize:13, cursor:"pointer" }}>
              Discover More →
            </button>
          </a>
        </div>
      )}
    </div>
  );
}

/* ── SUBSCRIPTIONS ── */
function Subscriptions({ subscriptions, setActive }) {
  const [cancelling, setCancelling] = useState(null);
  const [cancelled,  setCancelled]  = useState([]);

  const handleCancel = async (sub) => {
    if (!confirm(`Cancel your subscription with ${sub.businesses?.business_name}?\n\nYou keep access until the end of your billing period.`)) return;
    setCancelling(sub.id);
    try {
      const res  = await fetch("/api/cancel-subscription", {
        method:  "POST",
        headers: { "Content-Type":"application/json" },
        body:    JSON.stringify({ subscriptionId: sub.id }),
      });
      const data = await res.json();
      if (data.success) setCancelled(prev=>[...prev, sub.id]);
      else alert(data.error || "Something went wrong. Please try again.");
    } catch { alert("Something went wrong. Please try again."); }
    setCancelling(null);
  };

  if (subscriptions.length===0) return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>My Subscriptions</h2>
      <div style={{ background:`linear-gradient(135deg,#0f0f1a,#1a1040)`, borderRadius:20, padding:"40px 32px", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:16 }}>✂️</div>
        <h3 style={{ fontWeight:900, fontSize:22, color:W, marginBottom:10, letterSpacing:"-0.5px" }}>
          Your first subscription is waiting
        </h3>
        <p style={{ color:"rgba(255,255,255,.65)", marginBottom:24, maxWidth:360, margin:"0 auto 24px", lineHeight:1.75, fontSize:14 }}>
          Stop booking one visit at a time. Subscribe to your favourite professional and lock in your regular slot, every month, automatically.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, maxWidth:400, margin:"0 auto 28px", textAlign:"left" }}>
          {[
            ["🔒", "Priority slot. Always secured."],
            ["💰", "Member pricing. Save monthly."],
            ["🔔", "Automatic reminders."],
            ["🎂", "Birthday and loyalty rewards."],
          ].map(([icon, text]) => (
            <div key={text} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"rgba(255,255,255,.8)" }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
        <a href="/discover">
          <button style={{ background:P, color:W, border:"none", borderRadius:12, padding:"14px 28px", fontFamily:"Poppins", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:"0 6px 20px rgba(86,59,231,.5)" }}>
            Find a Professional →
          </button>
        </a>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginTop:14 }}>Free to join. Cancel anytime.</p>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>My Subscriptions ({subscriptions.length})</h2>
        <a href="/discover"><button className="btn-s">+ Add Another</button></a>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {subscriptions.map((s,i)=>{
          const oneOff  = parseFloat(s.services?.one_off_price||0);
          const monthly = parseFloat(s.monthly_price||0);
          const saving  = Math.max(0, oneOff*4 - monthly);
          return (
            <div key={i} className="sub-card">
              <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ width:56, height:56, borderRadius:14, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>✂️</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:16, color:C, marginBottom:2 }}>{s.businesses?.business_name||"Business"}</div>
                      <div style={{ fontSize:13, color:"#888" }}>{s.businesses?.city} · {s.businesses?.category}</div>
                    </div>
                    <span style={{ background:"#dcfce7", borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700, color:"#166534" }}>Active ✓</span>
                  </div>

                  <div style={{ display:"flex", gap:16, marginTop:12, flexWrap:"wrap" }}>
                    <div>
                      <div style={{ fontSize:11, color:"#888", marginBottom:2 }}>Monthly</div>
                      <div style={{ fontWeight:800, fontSize:18, color:P }}>£{monthly.toFixed(0)}</div>
                    </div>
                    {saving > 0 && (
                      <div>
                        <div style={{ fontSize:11, color:"#888", marginBottom:2 }}>Saving vs one-off</div>
                        <div style={{ fontWeight:800, fontSize:18, color:"#22c55e" }}>£{saving.toFixed(0)}/mo</div>
                      </div>
                    )}
                  </div>

                  {/* USAGE BAR */}
                  <div style={{ marginTop:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:11, color:"#888" }}>Visits this month</span>
                      <span style={{ fontSize:11, fontWeight:700, color:C }}>0 / {s.visits_per_month||4}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width:"0%" }} />
                    </div>
                  </div>

                  <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap", alignItems:"center" }}>
                    <a href={`/${s.businesses?.category}/${s.businesses?.slug}`} style={{ textDecoration:"none" }}>
                      <button style={{ background:L, border:"none", borderRadius:8, padding:"8px 14px", fontFamily:"Poppins", fontWeight:600, fontSize:12, color:P, cursor:"pointer" }}>
                        View Profile
                      </button>
                    </a>
                    {!cancelled.includes(s.id) && s.status !== "cancelling" ? (
                      <button
                        onClick={()=>handleCancel(s)}
                        disabled={cancelling===s.id}
                        style={{ background:"none", border:"none", padding:"8px 4px", fontFamily:"Poppins", fontWeight:400, fontSize:11, color:"#bbb", cursor:"pointer", textDecoration:"underline" }}>
                        {cancelling===s.id ? "Cancelling..." : "cancel subscription"}
                      </button>
                    ) : (
                      <span style={{ fontSize:11, color:"#e53e3e", padding:"8px 4px" }}>Cancellation pending</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── CALENDAR ── */
function CustomerCalendar({ bookings }) {
  const [current,  setCurrent]  = useState(new Date());
  const [selected, setSelected] = useState(null);

  const year  = current.getFullYear();
  const month = current.getMonth();
  const first = new Date(year,month,1).getDay();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const today = new Date();

  const getDayBookings = day => bookings.filter(b => {
    const d = new Date(b.start_time);
    return d.getDate()===day && d.getMonth()===month && d.getFullYear()===year;
  });

  const upcoming = bookings
    .filter(b => new Date(b.start_time) >= new Date() && b.status !== "cancelled")
    .sort((a,b) => new Date(a.start_time) - new Date(b.start_time));

  const past = bookings
    .filter(b => new Date(b.start_time) < new Date() || b.status === "completed")
    .sort((a,b) => new Date(b.start_time) - new Date(a.start_time));

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>My Calendar</h2>
      <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, marginBottom:24 }}>
        {/* CALENDAR */}
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <button onClick={()=>setCurrent(new Date(year,month-1,1))} style={{ background:G, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <span style={{ fontWeight:800, fontSize:17, color:C }}>{months[month]} {year}</span>
            <button onClick={()=>setCurrent(new Date(year,month+1,1))} style={{ background:G, border:"none", borderRadius:8, width:36, height:36, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
            {daysShort.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:"#aaa", padding:"3px 0" }}>{d}</div>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {Array(first===0?6:first-1).fill(null).map((_,i)=><div key={`e${i}`} />)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const day     = i+1;
              const isToday = day===today.getDate() && month===today.getMonth() && year===today.getFullYear();
              const dayBkgs = getDayBookings(day);
              return (
                <div key={day}
                  className={`cal-day ${isToday?"today":""} ${dayBkgs.length>0&&!isToday?"has-appt":""}`}
                  onClick={()=>dayBkgs.length>0&&setSelected(day)}>
                  {day}
                  {dayBkgs.length>0 && <div style={{ width:5, height:5, borderRadius:"50%", background:isToday?W:P, marginTop:1 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY DETAIL */}
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:15, color:C, marginBottom:14 }}>
            {selected ? `${months[month]} ${selected}` : "Select a day"}
          </h3>
          {!selected && (
            <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
              <div style={{ fontSize:13 }}>Tap a highlighted day to see your appointments</div>
            </div>
          )}
          {selected && getDayBookings(selected).map((b,i)=>(
            <div key={i} style={{ background:L, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ fontWeight:700, fontSize:14, color:C, marginBottom:4 }}>Appointment</div>
              <div style={{ fontSize:12, color:"#666" }}>{fmtTime(b.start_time)}</div>
              <div style={{ marginTop:8 }}>
                <span style={{ background:P, color:W, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING */}
      <div className="card" style={{ marginBottom:16 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>Upcoming ({upcoming.length})</h3>
        {upcoming.length===0 ? (
          <div style={{ textAlign:"center", padding:"20px 0", color:"#aaa", fontSize:13 }}>No upcoming appointments</div>
        ) : upcoming.map((b,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<upcoming.length-1?"1px solid #f0f0f0":"none" }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>✂️</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C }}>Appointment</div>
                <div style={{ fontSize:12, color:"#888" }}>
                  {new Date(b.start_time).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})} at {fmtTime(b.start_time)}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ background:"#dcfce7", color:"#166534", borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{b.status}</span>
              <button onClick={()=>{
                const dt  = new Date(b.start_time);
                const end = new Date(b.end_time||new Date(dt.getTime()+3600000));
                const fmt = d => d.toISOString().replace(/-|:|\.\d{3}/g,"");
                window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Appointment&dates=${fmt(dt)}/${fmt(end)}`,"_blank");
              }} style={{ background:G, border:"none", borderRadius:8, padding:"6px 12px", fontFamily:"Poppins", fontWeight:600, fontSize:11, cursor:"pointer" }}>
                📅 Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAST */}
      <div className="card">
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>Past Appointments ({past.length})</h3>
        {past.length===0 ? (
          <div style={{ textAlign:"center", padding:"20px 0", color:"#aaa", fontSize:13 }}>No past appointments</div>
        ) : past.slice(0,5).map((b,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<Math.min(past.length,5)-1?"1px solid #f0f0f0":"none" }}>
            <div style={{ fontSize:14, color:C, fontWeight:500 }}>{fmtDate(b.start_time)}</div>
            <span style={{ background:G, color:"#888", borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SPEND & SAVINGS ── */
function SpendSavings({ subscriptions, bookings }) {
  const totalMonthly   = subscriptions.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
  const totalAnnual    = totalMonthly * 12;
  const totalSaved     = subscriptions.reduce((a,s)=>{
    const oneOff  = parseFloat(s.services?.one_off_price||0);
    const monthly = parseFloat(s.monthly_price||0);
    return a + Math.max(0, oneOff*4 - monthly);
  }, 0);
  const totalVisits    = bookings.filter(b=>b.status==="completed").length;

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>Spend & Savings</h2>

      <div className="stats-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:22 }}>
        {[
          { label:"Monthly Spend",    val:`£${totalMonthly.toFixed(0)}`,  icon:"💳", color:P         },
          { label:"Annual Spend",     val:`£${totalAnnual.toFixed(0)}`,   icon:"📆", color:"#8b5cf6" },
          { label:"Saving Per Month", val:`£${totalSaved.toFixed(0)}`,    icon:"💚", color:"#22c55e" },
          { label:"Total Visits",     val:totalVisits,                    icon:"✂️", color:"#f59e0b" },
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:11, color:"#888", marginBottom:3 }}>{s.label}</div>
            <div style={{ fontWeight:900, fontSize:22, color:s.color, letterSpacing:"-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* PER SUBSCRIPTION BREAKDOWN */}
      <div className="card" style={{ marginBottom:18 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>Breakdown by Subscription</h3>
        {subscriptions.length===0 ? (
          <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa", fontSize:13 }}>No subscriptions yet</div>
        ) : subscriptions.map((s,i)=>{
          const oneOff  = parseFloat(s.services?.one_off_price||0);
          const monthly = parseFloat(s.monthly_price||0);
          const saving  = Math.max(0, oneOff*4 - monthly);
          return (
            <div key={i} style={{ padding:"16px 0", borderBottom:i<subscriptions.length-1?"1px solid #f0f0f0":"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>✂️</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:C }}>{s.businesses?.business_name||"Business"}</div>
                    <div style={{ fontSize:12, color:"#888" }}>{s.businesses?.city}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:800, fontSize:16, color:P }}>£{monthly.toFixed(0)}/mo</div>
                  {saving>0 && <div style={{ fontSize:12, color:"#22c55e", fontWeight:600 }}>Saving £{saving.toFixed(0)}/mo</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STRIPE PLACEHOLDER */}
      <div style={{ background:"#f8f7ff", borderRadius:18, padding:24, border:"1.5px dashed #c4b5fd", textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>💳</div>
        <div style={{ fontWeight:700, fontSize:16, color:C, marginBottom:6 }}>Full Payment History Coming Soon</div>
        <div style={{ fontSize:13, color:"#888", maxWidth:320, margin:"0 auto" }}>
          Once Stripe is connected you'll see your full invoice history, next billing dates and receipts here.
        </div>
      </div>
    </div>
  );
}

/* ── SAVED PROFESSIONALS ── */
function SavedProfessionals({ saved, onUnsave }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>Saved Professionals</h2>
        <a href="/discover"><button className="btn-p" style={{ fontSize:13 }}>+ Discover More</button></a>
      </div>

      {saved.length===0 ? (
        <div className="card" style={{ textAlign:"center", padding:"56px 24px" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>❤️</div>
          <h3 style={{ fontWeight:700, fontSize:18, color:C, marginBottom:8 }}>No saved professionals yet</h3>
          <p style={{ color:"#888", marginBottom:24 }}>Heart any professional on their profile page to save them here.</p>
          <a href="/discover"><button className="btn-p">Find Professionals</button></a>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {saved.map((s,i)=>(
            <div key={i} className="saved-card">
              <div style={{ width:52, height:52, borderRadius:14, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>✂️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:2 }}>{s.business_name}</div>
                <div style={{ fontSize:12, color:"#888" }}>{s.category} · {s.city}</div>
                {s.rating && <div style={{ fontSize:12, color:"#f59e0b", marginTop:2 }}>★ {s.rating}</div>}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <a href={`/${s.category}/${s.slug}`} style={{ textDecoration:"none" }}>
                  <button style={{ background:L, border:"none", borderRadius:8, padding:"8px 14px", fontFamily:"Poppins", fontWeight:600, fontSize:12, color:P, cursor:"pointer" }}>View</button>
                </a>
                <button onClick={()=>onUnsave(s.id)} style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:8, padding:"8px 12px", fontFamily:"Poppins", fontWeight:600, fontSize:12, color:"#e53e3e", cursor:"pointer" }}>♡</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── REWARDS & REFERRALS ── */
function Rewards({ points, profile }) {
  const [copied, setCopied] = useState(false);
  const referralCode = `SUBSEAT-${(profile?.full_name||"USER").split(" ")[0].toUpperCase()}-${Math.floor(1000+Math.random()*9000)}`;

  const tiers = [
    { name:"Bronze",   min:0,    max:100,  color:"#cd7f32", perks:["Priority booking hints","Early access to new professionals"]          },
    { name:"Silver",   min:100,  max:300,  color:"#9ca3af", perks:["5% off one-off bookings","Birthday reward unlocked"]                  },
    { name:"Gold",     min:300,  max:600,  color:"#f59e0b", perks:["10% off one-off bookings","Free month every 6 months","VIP support"]  },
    { name:"Platinum", min:600,  max:9999, color:P,         perks:["15% off everything","Dedicated account manager","Exclusive events"]   },
  ];

  const currentTier = tiers.find(t => points >= t.min && points < t.max) || tiers[0];
  const nextTier    = tiers[tiers.indexOf(currentTier)+1];
  const pctToNext   = nextTier ? Math.round((points-currentTier.min)/(nextTier.min-currentTier.min)*100) : 100;

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>Rewards & Referrals</h2>

      {/* POINTS CARD */}
      <div className="reward-card fu" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.7)", marginBottom:4, textTransform:"uppercase", letterSpacing:1 }}>Loyalty Points</div>
            <div style={{ fontWeight:900, fontSize:48, letterSpacing:"-2px", marginBottom:4 }}>{points}</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,.8)" }}>
              {currentTier.name} Member
              {nextTier && ` · ${nextTier.min-points} points to ${nextTier.name}`}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,.15)", borderRadius:16, padding:"14px 18px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:4 }}>⭐</div>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.8)" }}>{currentTier.name}</div>
          </div>
        </div>
        {nextTier && (
          <div style={{ marginTop:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,.7)" }}>Progress to {nextTier.name}</span>
              <span style={{ fontSize:12, fontWeight:700 }}>{pctToNext}%</span>
            </div>
            <div style={{ height:6, borderRadius:100, background:"rgba(255,255,255,.2)", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pctToNext}%`, background:W, borderRadius:100, transition:"width .6s" }} />
            </div>
          </div>
        )}
      </div>

      {/* HOW TO EARN */}
      <div className="card fu d1" style={{ marginBottom:20 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>How to Earn Points</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }} className="two-col">
          {[
            { icon:"✂️", action:"Complete an appointment",    pts:10  },
            { icon:"💳", action:"Subscribe to a plan",        pts:50  },
            { icon:"👤", action:"Complete your profile",      pts:25  },
            { icon:"🎂", action:"Birthday bonus",             pts:100 },
            { icon:"📣", action:"Refer a friend",             pts:75  },
            { icon:"⭐", action:"Leave a review",             pts:15  },
          ].map((e,i)=>(
            <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", background:G, borderRadius:12 }}>
              <div style={{ fontSize:22 }}>{e.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C }}>{e.action}</div>
                <div style={{ fontSize:11, color:P, fontWeight:700 }}>+{e.pts} points</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIER PERKS */}
      <div className="card fu d2" style={{ marginBottom:20 }}>
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:16 }}>Tier Perks</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {tiers.map((t,i)=>(
            <div key={i} style={{ padding:"14px 16px", borderRadius:12, border:`2px solid ${t.name===currentTier.name?t.color:"#eee"}`, background:t.name===currentTier.name?`${t.color}10`:"transparent" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ fontWeight:800, fontSize:15, color:t.color }}>{t.name}</div>
                <div style={{ fontSize:12, color:"#888" }}>{t.min}+ points</div>
                {t.name===currentTier.name && <span style={{ background:t.color, color:W, borderRadius:100, padding:"2px 10px", fontSize:10, fontWeight:700 }}>Current</span>}
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {t.perks.map((p,j)=><div key={j} style={{ fontSize:11, color:"#555" }}>• {p}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REFERRAL */}
      <div className="card fu d3">
        <h3 style={{ fontWeight:700, fontSize:16, color:C, marginBottom:6 }}>🎁 Refer a Friend</h3>
        <p style={{ fontSize:13, color:"#888", marginBottom:16 }}>Share your referral code. When a friend signs up and subscribes, you both get 75 points.</p>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ flex:1, background:G, borderRadius:10, padding:"12px 16px", fontWeight:800, fontSize:16, color:P, letterSpacing:1, minWidth:200 }}>
            {referralCode}
          </div>
          <button className="btn-p" onClick={()=>{ navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
            {copied?"✅ Copied!":"Copy Code"}
          </button>
        </div>
        <button onClick={()=>window.open(`https://wa.me/?text=Join SubSeat with my referral code ${referralCode} and we both get rewards! https://subseat.co.uk/auth`,"_blank")}
          style={{ marginTop:12, background:"#22c55e", color:W, border:"none", borderRadius:10, padding:"10px 20px", fontFamily:"Poppins", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          💬 Share on WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ── NOTIFICATIONS ── */
function Notifications() {
  const [prefs, setPrefs] = useState({
    booking_confirmation: true,
    appointment_reminder: true,
    membership_updates:   true,
    birthday_offers:      true,
    new_professionals:    false,
    marketing_emails:     false,
    whatsapp_reminders:   true,
    sms_reminders:        false,
  });

  const toggle = key => setPrefs(p=>({...p,[key]:!p[key]}));
  const [saved, setSaved] = useState(false);

  const groups = [
    {
      title:"Booking Notifications",
      items:[
        { key:"booking_confirmation", label:"Booking confirmations",      desc:"Get notified when a booking is confirmed"         },
        { key:"appointment_reminder", label:"Appointment reminders",      desc:"24h and 2h reminders before your appointment"    },
      ]
    },
    {
      title:"Membership Notifications",
      items:[
        { key:"membership_updates",   label:"Membership updates",         desc:"Renewals, cancellations and plan changes"         },
        { key:"birthday_offers",      label:"Birthday offers",            desc:"Receive birthday treats from your professionals"  },
      ]
    },
    {
      title:"Discovery",
      items:[
        { key:"new_professionals",    label:"New professionals near you", desc:"Be first to know when new businesses join SubSeat"},
        { key:"marketing_emails",     label:"Offers and promotions",      desc:"Special deals and SubSeat news"                  },
      ]
    },
    {
      title:"Channels",
      items:[
        { key:"whatsapp_reminders",   label:"WhatsApp reminders",         desc:"Receive reminders via WhatsApp (coming soon)"    },
        { key:"sms_reminders",        label:"SMS reminders",              desc:"Receive reminders via SMS (coming soon)"         },
      ]
    },
  ];

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>Notification Preferences</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {groups.map((g,gi)=>(
          <div key={gi} className="card">
            <h3 style={{ fontWeight:700, fontSize:14, color:C, marginBottom:14, paddingBottom:10, borderBottom:"1px solid #f0f0f0" }}>{g.title}</h3>
            {g.items.map(item=>(
              <div key={item.key} className="notif-row">
                <div style={{ flex:1, paddingRight:16 }}>
                  <div style={{ fontWeight:600, fontSize:14, color:C }}>{item.label}</div>
                  <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{item.desc}</div>
                </div>
                <button className="toggle"
                  style={{ background:prefs[item.key]?P:"#e0e0e0" }}
                  onClick={()=>toggle(item.key)}>
                  <div className="toggle-knob" style={{ left:prefs[item.key]?23:3 }} />
                </button>
              </div>
            ))}
          </div>
        ))}
        <button className="btn-p" onClick={()=>{ setSaved(true); setTimeout(()=>setSaved(false),2000); }} style={{ alignSelf:"flex-start", padding:"12px 28px" }}>
          {saved?"✅ Saved!":"Save Preferences"}
        </button>
      </div>
    </div>
  );
}

/* ── ACCOUNT ── */
function Account({ profile, user, onRefresh }) {
  const [form, setForm]           = useState({ full_name:profile?.full_name||"", phone:profile?.phone||"" });
  const [dob, setDob]             = useState(profile?.date_of_birth||"");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(profile?.avatar_url||null);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const ext  = file.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error:upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert:true });
      if (!upErr) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        await supabase.from("profiles").update({ avatar_url:data.publicUrl }).eq("id",user.id);
        onRefresh();
      }
    } catch(err) { console.error(err); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ ...form, date_of_birth:dob||null }).eq("id",user.id);
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),2000);
    onRefresh();
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>My Account</h2>
      <div className="card">
        {/* PHOTO */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28, paddingBottom:24, borderBottom:"1px solid #f0f0f0" }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:88, height:88, borderRadius:"50%", background:L, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, border:`3px solid ${W}`, boxShadow:`0 4px 16px rgba(86,59,231,.2)` }}>
              {preview ? <img src={preview} alt="Profile" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
            </div>
            {uploading && (
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(86,59,231,.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:24, height:24, border:"2px solid rgba(255,255,255,.4)", borderTop:`2px solid ${W}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:4 }}>Profile Photo</div>
            <div style={{ fontSize:13, color:"#888", marginBottom:10 }}>Helps businesses recognise you</div>
            <label style={{ display:"inline-flex", alignItems:"center", gap:6, background:L, borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:700, color:P, cursor:"pointer" }}>
              📷 {preview?"Change Photo":"Upload Photo"}
              <input type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />
            </label>
          </div>
        </div>

        {/* FORM */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Full Name</label>
            <input className="inp" placeholder="Your full name" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Email Address</label>
            <input className="inp" value={user?.email||""} disabled style={{ opacity:.6, cursor:"not-allowed" }} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Phone Number</label>
            <input className="inp" placeholder="07700 000000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>
              Date of Birth <span style={{ fontSize:11, color:"#aaa", fontWeight:400 }}>(unlocks birthday rewards 🎂)</span>
            </label>
            <input className="inp" type="date" value={dob} onChange={e=>setDob(e.target.value)} />
          </div>
          <div style={{ background:G, borderRadius:12, padding:"14px 16px" }}>
            <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer" }}>
              <input type="checkbox" defaultChecked style={{ marginTop:2, accentColor:P, width:16, height:16 }} />
              <span style={{ fontSize:13, color:"#666", lineHeight:1.5 }}>
                I agree to receive booking reminders and relevant offers from businesses I subscribe to.
              </span>
            </label>
          </div>
          <button className="btn-p" onClick={handleSave} disabled={saving} style={{ alignSelf:"flex-start", padding:"12px 28px" }}>
            {saving?"Saving...":saved?"✅ Saved!":"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function ProfilePage() {
  const [user,          setUser]    = useState(null);
  const [profile,       setProfile] = useState(null);
  const [subscriptions, setSubs]    = useState([]);
  const [bookings,      setBookings]= useState([]);
  const [saved,         setSaved2]  = useState([]);
  const [points,        setPoints]  = useState(0);
  const [loading,       setLoading] = useState(true);
  const [active,        setActive]  = useState("overview");

  useEffect(()=>{ loadData(); },[]);

  const loadData = async () => {
    setLoading(true);
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { window.location.href="/auth"; return; }
    setUser(user);

    const [{ data:prof },{ data:subs },{ data:bkgs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id",user.id).single(),
      supabase.from("subscriptions").select("*, businesses(business_name,city,category,slug), services(one_off_price)").eq("customer_id",user.id).eq("status","active"),
      supabase.from("bookings").select("*").eq("customer_id",user.id).order("start_time",{ ascending:false }),
    ]);

    setProfile(prof);
    setSubs(subs||[]);
    setBookings(bkgs||[]);

    // Calculate loyalty points
    const completedVisits = (bkgs||[]).filter(b=>b.status==="completed").length;
    const subsCount       = (subs||[]).length;
    const profileBonus    = prof?.full_name&&prof?.avatar_url&&prof?.phone&&prof?.date_of_birth ? 25 : 0;
    setPoints(completedVisits*10 + subsCount*50 + profileBonus);

    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href="/";
  };

  const handleUnsave = (id) => setSaved2(prev=>prev.filter(s=>s.id!==id));

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:14 }}>
        <div style={{ width:40, height:40, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
        <div style={{ color:"#888", fontSize:14 }}>Loading your profile...</div>
      </div>
    </>
  );

  const props = { profile, user, subscriptions, bookings, saved, points, onRefresh:loadData, setActive };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:W, borderBottom:"1px solid #eee", padding:"0 5%", height:72, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:32, height:32, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", animation:"pulse 3s infinite" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:16 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:17, color:P }}>SubSeat</span>
        </a>
        <span style={{ fontSize:14, fontWeight:600, color:"#888" }}>My Profile</span>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {points>0 && <div style={{ background:L, borderRadius:100, padding:"5px 12px", fontSize:12, fontWeight:700, color:P }}>⭐ {points} pts</div>}
          <a href="/discover"><button className="btn-p" style={{ fontSize:13, padding:"9px 16px" }}>Find Professionals</button></a>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="profile-grid" style={{ maxWidth:1200, margin:"0 auto", padding:"28px 5%", display:"grid", gridTemplateColumns:"240px 1fr", gap:24 }}>
        <div className="sidebar-col">
          <Sidebar active={active} setActive={setActive} profile={profile} onSignOut={handleSignOut} />
        </div>
        <div className="fu">
          {active==="overview"      && <Overview           {...props} />}
          {active==="subscriptions" && <Subscriptions      {...props} />}
          {active==="calendar"      && <CustomerCalendar   {...props} />}
          {active==="spend"         && <SpendSavings        {...props} />}
          {active==="saved"         && <SavedProfessionals saved={saved} onUnsave={handleUnsave} />}
          {active==="rewards"       && <Rewards             {...props} />}
          {active==="notifications" && <Notifications />}
          {active==="account"       && <Account             {...props} />}
        </div>
      </div>
    </>
  );
}