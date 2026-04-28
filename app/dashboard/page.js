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
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: ${G}; color: ${C}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse  { 0%,100% { box-shadow: 0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow: 0 0 0 10px rgba(86,59,231,0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }

  .fu { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
  .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}

  .stat-card {
    background: ${W}; border-radius: 18px; padding: 24px;
    border: 1.5px solid #eee; transition: all .2s;
  }
  .stat-card:hover { border-color: ${P}; box-shadow: 0 8px 32px rgba(86,59,231,.10); }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 12px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #888;
    transition: all .18s; border: none; background: transparent;
    font-family: 'Poppins', sans-serif; width: 100%; text-align: left;
  }
  .nav-item:hover { background: ${L}; color: ${P}; }
  .nav-item.active { background: ${P}; color: ${W}; }

  .tab { padding: 10px 20px; border: none; background: transparent; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; border-bottom: 2px solid transparent; transition: all .18s; color: #888; }
  .tab.active { color: ${P}; border-bottom-color: ${P}; }

  .input-field {
    width: 100%; padding: 12px 14px; border-radius: 10px;
    border: 1.5px solid #e0e0e0; background: ${W};
    font-family: 'Poppins', sans-serif; font-size: 14px; color: ${C};
    outline: none; transition: border-color .2s;
  }
  .input-field:focus { border-color: ${P}; box-shadow: 0 0 0 3px rgba(86,59,231,.08); }

  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: ${P}; color: ${W}; border: none;
    padding: 12px 22px; border-radius: 10px;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14px;
    cursor: pointer; transition: all .2s;
  }
  .btn-primary:hover { background: #4429d4; transform: translateY(-1px); }

  .subscriber-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid #f0f0f0;
  }
  .subscriber-row:last-child { border-bottom: none; }

  .cal-day {
    aspect-ratio: 1; border-radius: 10px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; cursor: pointer;
    transition: all .18s; font-family: 'Poppins', sans-serif; border: 1.5px solid transparent;
    font-size: 14px; font-weight: 600; color: ${C};
  }
  .cal-day:hover { background: ${L}; border-color: ${P}; }
  .cal-day.today { background: ${P}; color: ${W}; }
  .cal-day.has-booking { border-color: ${P}; color: ${P}; }
  .cal-day.other-month { color: #ccc; }

  @media(max-width: 900px) {
    .dash-layout { grid-template-columns: 1fr !important; }
    .sidebar { display: none !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media(max-width: 500px) {
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
`;

/* ── SIDEBAR ── */
function Sidebar({ active, setActive, business, onSignOut }) {
  const items = [
    { id: "overview",     icon: "📊", label: "Overview" },
    { id: "calendar",     icon: "📅", label: "Calendar" },
    { id: "subscribers",  icon: "👥", label: "Subscribers" },
    { id: "services",     icon: "💼", label: "Services" },
    { id: "profile",      icon: "🏪", label: "My Profile" },
    { id: "settings",     icon: "⚙️", label: "Settings" },
  ];
  return (
    <div style={{ background: W, borderRadius: 20, padding: 20, border: `1.5px solid #eee`, height: "fit-content", position: "sticky", top: 88 }}>
      {/* BUSINESS INFO */}
      <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid #f0f0f0` }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: L, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
          {business?.logo_url ? <img src={business.logo_url} alt="" style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }} /> : "✂️"}
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: C, marginBottom: 2 }}>{business?.business_name || "Your Business"}</div>
        <div style={{ fontSize: 12, color: "#888" }}>{business?.city || ""}</div>
        {business?.tier === "partner" && (
          <div style={{ display: "inline-block", background: P, borderRadius: 100, padding: "2px 10px", fontSize: 10, fontWeight: 700, color: W, marginTop: 6 }}>Partner</div>
        )}
      </div>
      {/* NAV */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ borderTop: `1px solid #f0f0f0`, marginTop: 12, paddingTop: 12 }}>
          <a href={`/${business?.category}/${business?.slug}`} target="_blank" style={{ textDecoration: "none" }}>
            <button className="nav-item">
              <span>🔗</span>View My Profile
            </button>
          </a>
          <button className="nav-item" onClick={onSignOut} style={{ color: "#e53e3e" }}>
            <span>🚪</span>Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── OVERVIEW ── */
function Overview({ business, subscribers, bookings }) {
  const stats = [
    { label: "Active Subscribers", val: subscribers.length, delta: "+0 this month", icon: "👥", color: P },
    { label: "Monthly Revenue", val: `£${subscribers.reduce((a, s) => a + parseFloat(s.monthly_price || 0), 0).toFixed(0)}`, delta: "Estimated", icon: "💰", color: "#22c55e" },
    { label: "Today's Appointments", val: bookings.filter(b => new Date(b.start_time).toDateString() === new Date().toDateString()).length, delta: "Scheduled", icon: "📅", color: "#f59e0b" },
    { label: "Profile Views", val: "—", delta: "Coming soon", icon: "👁️", color: "#8b5cf6" },
  ];

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>Overview</h2>

      {/* STATS */}
      <div className="stats-grid fu" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 900, fontSize: 26, color: s.color, letterSpacing: "-1px", marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="fu d2" style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee`, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Share Profile Link", icon: "🔗", action: () => navigator.clipboard.writeText(`https://subseat.co.uk/${business?.category}/${business?.slug}`) },
            { label: "View Live Profile", icon: "👁️", action: () => window.open(`/${business?.category}/${business?.slug}`, "_blank") },
            { label: "Download QR Code", icon: "📱", action: () => alert("QR Code download — coming soon!") },
          ].map((a, i) => (
            <button key={i} onClick={a.action} style={{ display: "flex", alignItems: "center", gap: 8, background: L, border: "none", borderRadius: 10, padding: "10px 16px", fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: P, cursor: "pointer", transition: "all .18s" }}
              onMouseEnter={e => e.currentTarget.style.background = P + "22"}
              onMouseLeave={e => e.currentTarget.style.background = L}
            >
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>
      </div>

      {/* RECENT SUBSCRIBERS */}
      <div className="fu d3" style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee` }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 16 }}>Recent Subscribers</h3>
        {subscribers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#888" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>👥</div>
            <div style={{ fontSize: 14 }}>No subscribers yet — share your profile to get started!</div>
          </div>
        ) : (
          subscribers.slice(0, 5).map((s, i) => (
            <div key={i} className="subscriber-row">
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: L, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C }}>Subscriber #{i + 1}</div>
                <div style={{ fontSize: 12, color: "#888" }}>Active member</div>
              </div>
              <div style={{ background: "#dcfce7", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#166534" }}>Active</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── CALENDAR ── */
function CalendarView({ bookings }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getDayBookings = (day) => bookings.filter(b => {
    const d = new Date(b.start_time);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  });

  const selectedBookings = selectedDay ? getDayBookings(selectedDay) : [];

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>Calendar</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* CALENDAR */}
        <div style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee` }}>
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ background: G, border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>‹</button>
            <span style={{ fontWeight: 800, fontSize: 18, color: C }}>{monthNames[month]} {year}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ background: G, border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>›</button>
          </div>
          {/* DAY NAMES */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
            {dayNames.map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#aaa", padding: "4px 0" }}>{d}</div>)}
          </div>
          {/* DAYS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array(firstDay === 0 ? 6 : firstDay - 1).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayBookings = getDayBookings(day);
              const isSelected = selectedDay === day;
              return (
                <div key={day} className={`cal-day ${isToday ? "today" : ""} ${dayBookings.length > 0 && !isToday ? "has-booking" : ""}`}
                  style={{ background: isSelected && !isToday ? L : undefined }}
                  onClick={() => setSelectedDay(day)}>
                  {day}
                  {dayBookings.length > 0 && (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: isToday ? W : P, marginTop: 2 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY DETAIL */}
        <div style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee` }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 16 }}>
            {selectedDay ? `${monthNames[month]} ${selectedDay}` : "Select a day"}
          </h3>
          {!selectedDay && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 13 }}>Click a day to see appointments</div>
            </div>
          )}
          {selectedDay && selectedBookings.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#aaa" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 13 }}>No appointments on this day</div>
            </div>
          )}
          {selectedBookings.map((b, i) => (
            <div key={i} style={{ background: G, borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C, marginBottom: 4 }}>Appointment #{i + 1}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{new Date(b.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} — {new Date(b.end_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <div style={{ background: L, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: P }}>{b.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SUBSCRIBERS ── */
function Subscribers({ subscribers }) {
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>Subscribers</h2>
      <div style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee` }}>
        {subscribers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#888" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: C, marginBottom: 8 }}>No subscribers yet</h3>
            <p style={{ fontSize: 14, maxWidth: 320, margin: "0 auto" }}>Share your SubSeat profile link to start getting subscribers.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, padding: "0 0 12px", borderBottom: `1px solid #f0f0f0`, marginBottom: 8 }}>
              {["Customer", "Plan", "Since", "Status"].map(h => (
                <div key={h} style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
              ))}
            </div>
            {subscribers.map((s, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, padding: "14px 0", borderBottom: `1px solid #f8f8f8`, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: L, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C }}>Subscriber #{i + 1}</div>
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>£{parseFloat(s.monthly_price || 0).toFixed(0)}/mo</div>
                <div style={{ fontSize: 13, color: "#666" }}>{new Date(s.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</div>
                <div style={{ background: "#dcfce7", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: "#166534", width: "fit-content" }}>Active</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── SERVICES ── */
function Services({ services, businessId, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: "", monthly_price: "", duration_minutes: 45, description: "" });
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newService.name || !newService.monthly_price) return;
    setSaving(true);
    await supabase.from("services").insert({ ...newService, business_id: businessId, is_active: true });
    setNewService({ name: "", monthly_price: "", duration_minutes: 45, description: "" });
    setShowAdd(false);
    onRefresh();
    setSaving(false);
  };

  const toggleService = async (id, current) => {
    await supabase.from("services").update({ is_active: !current }).eq("id", id);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: C }}>Services</h2>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>+ Add Service</button>
      </div>

      {showAdd && (
        <div style={{ background: W, borderRadius: 18, padding: 24, border: `2px dashed ${P}`, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 16 }}>New Service</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="input-field" placeholder="Service name" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input className="input-field" type="number" placeholder="Monthly price (£)" value={newService.monthly_price} onChange={e => setNewService({ ...newService, monthly_price: e.target.value })} />
              <input className="input-field" type="number" placeholder="Duration (mins)" value={newService.duration_minutes} onChange={e => setNewService({ ...newService, duration_minutes: e.target.value })} />
            </div>
            <input className="input-field" placeholder="Description (optional)" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={handleAdd} disabled={saving}>{saving ? "Saving..." : "Add Service"}</button>
              <button onClick={() => setShowAdd(false)} style={{ background: G, border: "none", borderRadius: 10, padding: "12px 20px", fontFamily: "Poppins", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {services.length === 0 && !showAdd && (
          <div style={{ textAlign: "center", padding: "48px 0", background: W, borderRadius: 18, border: `1.5px solid #eee` }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💼</div>
            <p style={{ color: "#888" }}>No services yet. Add your first service above.</p>
          </div>
        )}
        {services.map(s => (
          <div key={s.id} style={{ background: W, borderRadius: 16, padding: "20px 24px", border: `1.5px solid ${s.is_active ? "#eee" : "#f0f0f0"}`, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: s.is_active ? 1 : 0.6 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: "#888" }}>£{parseFloat(s.monthly_price).toFixed(0)}/month · {s.duration_minutes} mins</div>
              {s.description && <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{s.description}</div>}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ background: s.is_active ? "#dcfce7" : G, borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: s.is_active ? "#166534" : "#888" }}>
                {s.is_active ? "Active" : "Inactive"}
              </div>
              <button onClick={() => toggleService(s.id, s.is_active)} style={{ background: G, border: "none", borderRadius: 8, padding: "8px 14px", fontFamily: "Poppins", fontWeight: 600, fontSize: 12, cursor: "pointer", color: C }}>
                {s.is_active ? "Pause" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PROFILE EDITOR ── */
function ProfileEditor({ business, onRefresh }) {
  const [form, setForm] = useState({ business_name: business?.business_name || "", description: business?.description || "", phone: business?.phone || "", email: business?.email || "", address: business?.address || "", city: business?.city || "", postcode: business?.postcode || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("businesses").update(form).eq("id", business.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onRefresh();
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>Edit Profile</h2>
      <div style={{ background: W, borderRadius: 18, padding: 28, border: `1.5px solid #eee` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Business Name", key: "business_name", placeholder: "Your business name" },
            { label: "Phone", key: "phone", placeholder: "07700 000000" },
            { label: "Email", key: "email", placeholder: "hello@yourbusiness.com" },
            { label: "Address", key: "address", placeholder: "Street address" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>{f.label}</label>
              <input className="input-field" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>City</label>
              <input className="input-field" placeholder="London" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Postcode</label>
              <input className="input-field" placeholder="E1 6RF" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Description</label>
            <textarea className="input-field" placeholder="Tell customers about your business..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} style={{ resize: "vertical" }} />
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ alignSelf: "flex-start" }}>
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/auth"; return; }
    setUser(user);

    const { data: biz } = await supabase.from("businesses").select("*").eq("owner_id", user.id).single();
    if (!biz) { window.location.href = "/onboarding"; return; }
    setBusiness(biz);

    const [{ data: svcs }, { data: subs }, { data: bkgs }] = await Promise.all([
      supabase.from("services").select("*").eq("business_id", biz.id),
      supabase.from("subscriptions").select("*").eq("business_id", biz.id).eq("status", "active"),
      supabase.from("bookings").select("*").eq("business_id", biz.id).order("start_time", { ascending: true }),
    ]);

    setServices(svcs || []);
    setSubscribers(subs || []);
    setBookings(bkgs || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${L}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {/* TOP NAV */}
      <nav style={{ background: W, borderBottom: `1px solid #eee`, padding: "0 5%", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: P, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "pulse 3s infinite" }}>
            <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: W }} />
            <span style={{ color: W, fontWeight: 900, fontSize: 16 }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: P }}>SubSeat</span>
        </a>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#888" }}>Business Dashboard</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: L, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
        </div>
      </nav>

      {/* LAYOUT */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 5%", display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }} className="dash-layout">
        <div className="sidebar">
          <Sidebar active={activeSection} setActive={setActiveSection} business={business} onSignOut={handleSignOut} />
        </div>
        <div>
          {activeSection === "overview"    && <Overview business={business} subscribers={subscribers} bookings={bookings} />}
          {activeSection === "calendar"    && <CalendarView bookings={bookings} />}
          {activeSection === "subscribers" && <Subscribers subscribers={subscribers} />}
          {activeSection === "services"    && <Services services={services} businessId={business?.id} onRefresh={loadData} />}
          {activeSection === "profile"     && <ProfileEditor business={business} onRefresh={loadData} />}
          {activeSection === "settings"    && (
            <div style={{ background: W, borderRadius: 18, padding: 28, border: `1.5px solid #eee` }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 8 }}>Settings</h2>
              <p style={{ color: "#888" }}>Account settings and preferences — coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}