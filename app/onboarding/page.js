'use client';
import { useState } from "react";
import { supabase } from "../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: #f0eeff; min-height: 100vh; padding: 24px; }
  
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow: 0 0 0 10px rgba(86,59,231,0); } }
  
  .card { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
  
  .input-field {
    width: 100%; padding: 14px 16px; border-radius: 12px;
    border: 1.5px solid #e0e0e0; background: ${W};
    font-family: 'Poppins', sans-serif; font-size: 15px; color: ${C};
    outline: none; transition: all .2s ease;
  }
  .input-field:focus { border-color: ${P}; box-shadow: 0 0 0 3px rgba(86,59,231,.1); }

  .btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 16px; border-radius: 12px;
    background: ${P}; color: ${W}; border: none;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 16px;
    cursor: pointer; transition: all .2s ease;
    box-shadow: 0 6px 24px rgba(86,59,231,.32);
  }
  .btn-primary:hover { background: #4429d4; transform: translateY(-2px); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .btn-secondary {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 14px; border-radius: 12px;
    background: transparent; color: ${P}; border: 2px solid ${P};
    font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 15px;
    cursor: pointer; transition: all .2s ease;
  }
  .btn-secondary:hover { background: ${L}; }

  .category-card {
    padding: 16px; border-radius: 14px; border: 2px solid #e0e0e0;
    background: ${W}; cursor: pointer; transition: all .2s;
    text-align: center;
  }
  .category-card:hover { border-color: ${P}; background: ${L}; }
  .category-card.selected { border-color: ${P}; background: ${L}; }

  .day-btn {
    padding: 10px 14px; border-radius: 10px; border: 2px solid #e0e0e0;
    background: ${W}; cursor: pointer; transition: all .2s;
    font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 13px; color: #888;
  }
  .day-btn.selected { border-color: ${P}; background: ${P}; color: ${W}; }

  .service-card {
    background: ${G}; border-radius: 14px; padding: 16px;
    border: 1.5px solid #e0e0e0; margin-bottom: 12px;
  }

  @media(max-width: 600px) {
    .step-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .days-grid { grid-template-columns: repeat(4, 1fr) !important; }
  }
`;

const CATEGORIES = [
  { id: "barbers",      label: "Barbers",      icon: "✂️" },
  { id: "hair-salons",  label: "Hair Salons",  icon: "💇" },
  { id: "nail-techs",   label: "Nail Techs",   icon: "💅" },
  { id: "lash-artists", label: "Lash Artists", icon: "👁️" },
  { id: "brow-artists", label: "Brow Artists", icon: "🪮" },
  { id: "massage",      label: "Massage",      icon: "💆" },
  { id: "skincare",     label: "Skincare",     icon: "🧴" },
  { id: "wellness",     label: "Wellness",     icon: "🧘" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function LogoMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: P, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "pulse 3s infinite", flexShrink: 0 }}>
        <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", background: W }} />
        <span style={{ color: W, fontWeight: 900, fontSize: 20, fontFamily: "Poppins" }}>S</span>
      </div>
      <span style={{ fontWeight: 800, fontSize: 20, color: P }}>SubSeat</span>
    </div>
  );
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: P }}>Step {step} of {total}</span>
        <span style={{ fontSize: 13, color: "#888" }}>{Math.round((step / total) * 100)}% complete</span>
      </div>
      <div style={{ height: 6, background: L, borderRadius: 100, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(step / total) * 100}%`, background: P, borderRadius: 100, transition: "width .4s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {["Basics", "Location", "Services", "Hours", "Go Live"].map((s, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: i + 1 <= step ? 700 : 400, color: i + 1 <= step ? P : "#ccc" }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* ── STEP 1: BUSINESS BASICS ── */
function Step1({ data, onChange, onNext }) {
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C, marginBottom: 6, letterSpacing: "-.5px" }}>Tell us about your business</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>This is what customers will see on your SubSeat profile.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>

        {/* BANNER PHOTO */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Business Banner Photo</label>
          <div style={{
            width: "100%", height: 140, borderRadius: 14,
            border: `2px dashed ${data.bannerPreview ? P : "#e0e0e0"}`,
            background: data.bannerPreview ? "transparent" : G,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", position: "relative", transition: "all .2s"
          }}
            onClick={() => document.getElementById("bannerInput").click()}
            onMouseEnter={e => e.currentTarget.style.borderColor = P}
            onMouseLeave={e => e.currentTarget.style.borderColor = data.bannerPreview ? P : "#e0e0e0"}
          >
            {data.bannerPreview
              ? <img src={data.bannerPreview} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>Click to upload banner photo</div>
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>Your shopfront, salon interior or brand image</div>
                </div>
            }
            {data.bannerPreview && (
              <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.55)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: W, fontWeight: 600, cursor: "pointer" }}
                onClick={e => { e.stopPropagation(); onChange("bannerPreview", null); onChange("bannerFile", null); }}>
                ✕ Remove
              </div>
            )}
          </div>
          <input id="bannerInput" type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              onChange("bannerFile", file);
              const reader = new FileReader();
              reader.onload = ev => onChange("bannerPreview", ev.target.result);
              reader.readAsDataURL(file);
            }} />
        </div>

        {/* PROFILE / LOGO PHOTO */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            border: `2px dashed ${data.logoPreview ? P : "#e0e0e0"}`,
            background: data.logoPreview ? "transparent" : G,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", flexShrink: 0, transition: "all .2s"
          }}
            onClick={() => document.getElementById("logoInput").click()}
          >
            {data.logoPreview
              ? <img src={data.logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>📷</div></div>
            }
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C, marginBottom: 2 }}>Profile Photo / Logo</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Your logo or professional headshot — shown on your profile</div>
            <button type="button" onClick={() => document.getElementById("logoInput").click()}
              style={{ background: L, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: P, cursor: "pointer" }}>
              {data.logoPreview ? "Change Photo" : "Upload Photo"}
            </button>
          </div>
          <input id="logoInput" type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              onChange("logoFile", file);
              const reader = new FileReader();
              reader.onload = ev => onChange("logoPreview", ev.target.result);
              reader.readAsDataURL(file);
            }} />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Business Name *</label>
          <input className="input-field" placeholder="e.g. The Cut Lab" value={data.businessName} onChange={e => onChange("businessName", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Phone Number *</label>
          <input className="input-field" placeholder="07700 000000" value={data.phone} onChange={e => onChange("phone", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Business Email *</label>
          <input className="input-field" type="email" placeholder="hello@yourbusiness.com" value={data.email} onChange={e => onChange("email", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>WhatsApp Number</label>
          <input className="input-field" placeholder="07700 000000 (for customer alerts)" value={data.whatsapp} onChange={e => onChange("whatsapp", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Short Description</label>
          <textarea className="input-field" placeholder="Tell customers what makes you special..." value={data.description} onChange={e => onChange("description", e.target.value)} rows={3} style={{ resize: "vertical" }} />
        </div>
      </div>

      {/* CATEGORY */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 12 }}>Business Type *</label>
        <div className="step-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} className={`category-card ${data.category === cat.id ? "selected" : ""}`} onClick={() => onChange("category", cat.id)}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: data.category === cat.id ? P : C }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={onNext} disabled={!data.businessName || !data.phone || !data.email || !data.category}>
        Continue →
      </button>
    </div>
  );
}

/* ── STEP 2: LOCATION ── */
function Step2({ data, onChange, onNext, onBack }) {
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C, marginBottom: 6, letterSpacing: "-.5px" }}>Where are you based?</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>Customers will use this to find you near them.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Street Address *</label>
          <input className="input-field" placeholder="14 Brick Lane" value={data.address} onChange={e => onChange("address", e.target.value)} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>City *</label>
            <input className="input-field" placeholder="London" value={data.city} onChange={e => onChange("city", e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Postcode *</label>
            <input className="input-field" placeholder="E1 6RF" value={data.postcode} onChange={e => onChange("postcode", e.target.value)} />
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      {data.address && data.city && (
        <div style={{ background: L, borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: P, marginBottom: 4 }}>📍 Your profile will show</div>
          <div style={{ fontSize: 14, color: C, fontWeight: 500 }}>{data.address}, {data.city} {data.postcode}</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={onNext} disabled={!data.address || !data.city || !data.postcode} style={{ flex: 2 }}>Continue →</button>
      </div>
    </div>
  );
}

/* ── STEP 3: SERVICES ── */
function Step3({ data, onChange, onNext, onBack }) {
  const [newService, setNewService] = useState({ name: "", price: "", duration: 45, description: "" });

  const addService = () => {
    if (!newService.name || !newService.price) return;
    onChange("services", [...data.services, { ...newService, id: Date.now() }]);
    setNewService({ name: "", price: "", duration: 45, description: "" });
  };

  const removeService = (id) => {
    onChange("services", data.services.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C, marginBottom: 6, letterSpacing: "-.5px" }}>Your services & pricing</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>Add the subscription plans customers can choose from.</p>

      {/* EXISTING SERVICES */}
      {data.services.map(s => (
        <div key={s.id} className="service-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C }}>{s.name}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{s.duration} mins · £{s.price}/month</div>
              {s.description && <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{s.description}</div>}
            </div>
            <button onClick={() => removeService(s.id)} style={{ background: "#ffe5e5", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#e53e3e", fontWeight: 700, cursor: "pointer" }}>Remove</button>
          </div>
        </div>
      ))}

      {/* ADD NEW SERVICE */}
      <div style={{ background: W, borderRadius: 16, padding: 20, border: `2px dashed ${L}`, marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C, marginBottom: 14 }}>+ Add a service</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="input-field" placeholder="Service name (e.g. Unlimited Cuts)" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 4 }}>Monthly Price (£)</label>
              <input className="input-field" type="number" placeholder="59" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 4 }}>Duration (mins)</label>
              <input className="input-field" type="number" placeholder="45" value={newService.duration} onChange={e => setNewService({ ...newService, duration: e.target.value })} />
            </div>
          </div>
          <input className="input-field" placeholder="Description (optional)" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
          <button onClick={addService} disabled={!newService.name || !newService.price} style={{ background: P, color: W, border: "none", borderRadius: 10, padding: "12px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: !newService.name || !newService.price ? .5 : 1 }}>
            Add Service
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={onNext} disabled={data.services.length === 0} style={{ flex: 2 }}>Continue →</button>
      </div>
    </div>
  );
}

/* ── STEP 4: WORKING HOURS ── */
function Step4({ data, onChange, onNext, onBack }) {
  const toggleDay = (day) => {
    const days = data.workingDays.includes(day)
      ? data.workingDays.filter(d => d !== day)
      : [...data.workingDays, day];
    onChange("workingDays", days);
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C, marginBottom: 6, letterSpacing: "-.5px" }}>Your working hours</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>This helps us calculate your capacity and available slots.</p>

      {/* DAYS */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 12 }}>Working Days *</label>
        <div className="days-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {DAYS.map(day => (
            <button key={day} className={`day-btn ${data.workingDays.includes(day) ? "selected" : ""}`} onClick={() => toggleDay(day)}>{day}</button>
          ))}
        </div>
      </div>

      {/* HOURS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Opening Time *</label>
          <input className="input-field" type="time" value={data.openTime} onChange={e => onChange("openTime", e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Closing Time *</label>
          <input className="input-field" type="time" value={data.closeTime} onChange={e => onChange("closeTime", e.target.value)} />
        </div>
      </div>

      {/* BUFFER */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Buffer Between Appointments</label>
        <select className="input-field" value={data.bufferMinutes} onChange={e => onChange("bufferMinutes", e.target.value)}>
          <option value="0">No buffer</option>
          <option value="5">5 minutes</option>
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="20">20 minutes</option>
        </select>
      </div>

      {/* LUNCH BREAK */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block" }}>Lunch Break</label>
            <span style={{ fontSize: 12, color: "#888" }}>Block out time — no bookings during break</span>
          </div>
          {/* TOGGLE */}
          <div onClick={() => onChange("lunchBreak", !data.lunchBreak)}
            style={{ width: 48, height: 26, borderRadius: 100, background: data.lunchBreak ? P : "#ddd", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: data.lunchBreak ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: W, transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
          </div>
        </div>

        {data.lunchBreak && (
          <div style={{ background: L, borderRadius: 14, padding: 16, border: `1.5px solid ${P}22` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: P, marginBottom: 12 }}>🍽️ Lunch break times</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>Break Starts</label>
                <input className="input-field" type="time" value={data.lunchStart} onChange={e => onChange("lunchStart", e.target.value)} style={{ padding: "10px 12px", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 4 }}>Break Ends</label>
                <input className="input-field" type="time" value={data.lunchEnd} onChange={e => onChange("lunchEnd", e.target.value)} style={{ padding: "10px 12px", fontSize: 14 }} />
              </div>
            </div>
            {data.lunchStart && data.lunchEnd && (
              <div style={{ fontSize: 12, color: "#666", marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✅</span>
                <span>No bookings from <strong>{data.lunchStart}</strong> to <strong>{data.lunchEnd}</strong> — customers will see next available slot after your break</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CAPACITY PREVIEW */}
      {data.workingDays.length > 0 && data.openTime && data.closeTime && data.services.length > 0 && (
        <div style={{ background: L, borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: P, marginBottom: 8 }}>📊 Estimated Monthly Capacity</div>
          <div style={{ fontSize: 14, color: C, fontWeight: 600 }}>
            {(() => {
              const [oh, om] = data.openTime.split(":").map(Number);
              const [ch, cm] = data.closeTime.split(":").map(Number);
              let totalMinsPerDay = ch * 60 + cm - (oh * 60 + om);
              if (data.lunchBreak && data.lunchStart && data.lunchEnd) {
                const [lsh, lsm] = data.lunchStart.split(":").map(Number);
                const [leh, lem] = data.lunchEnd.split(":").map(Number);
                const lunchMins = leh * 60 + lem - (lsh * 60 + lsm);
                totalMinsPerDay -= lunchMins;
              }
              const duration = data.services[0]?.duration || 45;
              const buffer = parseInt(data.bufferMinutes) || 0;
              const slotsPerDay = Math.floor(totalMinsPerDay / (parseInt(duration) + buffer));
              const totalSlots = Math.round(slotsPerDay * data.workingDays.length * 4.33);
              return `~${totalSlots} appointments/month`;
            })()}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {data.lunchBreak && data.lunchStart && data.lunchEnd
              ? `Lunch break (${data.lunchStart}–${data.lunchEnd}) deducted from capacity`
              : "Based on your hours and first service duration"}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={onNext} disabled={data.workingDays.length === 0 || !data.openTime || !data.closeTime} style={{ flex: 2 }}>Continue →</button>
      </div>
    </div>
  );
}

/* ── STEP 5: GO LIVE ── */
function Step5({ data, onSubmit, onBack, loading }) {
  const cat = CATEGORIES.find(c => c.id === data.category);
  const slug = data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 26, color: C, marginBottom: 6, letterSpacing: "-.5px" }}>You're almost live! 🚀</h2>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>Review your details before going live on SubSeat.</p>

      {/* SUMMARY */}
      <div style={{ background: W, borderRadius: 16, padding: 24, border: `1.5px solid ${L}`, marginBottom: 24 }}>
        <div style={{ display: "flex", align: "center", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${L}` }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: L, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{cat?.icon}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C }}>{data.businessName}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{cat?.label} · {data.city}</div>
          </div>
        </div>

        {[
          { label: "📍 Location", value: `${data.address}, ${data.city} ${data.postcode}` },
          { label: "📞 Phone", value: data.phone },
          { label: "📧 Email", value: data.email },
          { label: "🕐 Hours", value: `${data.openTime} - ${data.closeTime} · ${data.workingDays.join(", ")}` },
          { label: "💼 Services", value: `${data.services.length} service${data.services.length !== 1 ? "s" : ""} added` },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? `1px solid ${G}` : "none" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>{item.label}</span>
            <span style={{ fontSize: 13, color: C, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* PROFILE URL */}
      <div style={{ background: L, borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: P, marginBottom: 4 }}>🔗 Your SubSeat Profile URL</div>
        <div style={{ fontSize: 14, color: C, fontWeight: 600 }}>subseat.co.uk/{data.category}/{slug}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Share this on Instagram, TikTok and WhatsApp</div>
      </div>

      {/* TERMS */}
      <div style={{ background: G, borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
          By going live you agree to SubSeat's Terms of Service. SubSeat charges a simple <strong>5% platform fee + VAT</strong> on all subscription revenue. No hidden charges.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>← Back</button>
        <button className="btn-primary" onClick={onSubmit} disabled={loading} style={{ flex: 2 }}>
          {loading ? "Creating your profile..." : "🚀 Go Live on SubSeat"}
        </button>
      </div>
    </div>
  );
}

/* ── SUCCESS ── */
function Success({ data }) {
  const slug = data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontWeight: 900, fontSize: 28, color: C, marginBottom: 12, letterSpacing: "-.5px" }}>You're live on SubSeat!</h2>
      <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
        Your business profile is now live. Share your link and QR code to start getting subscribers.
      </p>
      <div style={{ background: L, borderRadius: 16, padding: 24, marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: P, marginBottom: 8 }}>🔗 Your Profile Link</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C, marginBottom: 16 }}>subseat.co.uk/{data.category}/{slug}</div>
        <button onClick={() => navigator.clipboard.writeText(`https://subseat.co.uk/${data.category}/${slug}`)}
          style={{ background: P, color: W, border: "none", borderRadius: 10, padding: "12px 24px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Copy Link
        </button>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/dashboard" style={{ flex: 1, display: "block", background: P, color: W, textDecoration: "none", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "Poppins", textAlign: "center", boxShadow: "0 6px 24px rgba(86,59,231,.32)" }}>
          Go to Dashboard →
        </a>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const [data, setData] = useState({
    businessName: "", category: "", phone: "", email: "",
    whatsapp: "", description: "",
    bannerFile: null, bannerPreview: null,
    logoFile: null, logoPreview: null,
    address: "", city: "", postcode: "",
    services: [],
    workingDays: [], openTime: "09:00", closeTime: "18:00", bufferMinutes: "10",
    lunchBreak: false, lunchStart: "13:00", lunchEnd: "14:00",
  });

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth"; return; }

      const slug = data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const { data: business, error: bizError } = await supabase
        .from("businesses")
        .insert({
          owner_id: user.id,
          business_name: data.businessName,
          slug,
          category: data.category,
          description: data.description,
          address: data.address,
          city: data.city,
          postcode: data.postcode,
          phone: data.phone,
          email: data.email,
          whatsapp_number: data.whatsapp,
          is_active: true,
        })
        .select()
        .single();

      if (bizError) throw bizError;

      if (data.services.length > 0) {
        await supabase.from("services").insert(
          data.services.map(s => ({
            business_id: business.id,
            name: s.name,
            description: s.description,
            monthly_price: parseFloat(s.price),
            duration_minutes: parseInt(s.duration),
            buffer_minutes: parseInt(data.bufferMinutes),
            is_active: true,
          }))
        );
      }

      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <LogoMark />

        <div className="card" style={{ background: W, borderRadius: 28, padding: "40px 36px", boxShadow: "0 32px 80px rgba(86,59,231,.14)" }}>
          {!done ? (
            <>
              <ProgressBar step={step} total={5} />
              {error && (
                <div style={{ background: "#fff5f5", border: "1.5px solid #ffcccc", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: "#e53e3e", fontWeight: 500 }}>⚠️ {error}</p>
                </div>
              )}
              {step === 1 && <Step1 data={data} onChange={update} onNext={() => setStep(2)} />}
              {step === 2 && <Step2 data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
              {step === 3 && <Step3 data={data} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
              {step === 4 && <Step4 data={data} onChange={update} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
              {step === 5 && <Step5 data={data} onSubmit={handleSubmit} onBack={() => setStep(4)} loading={loading} />}
            </>
          ) : (
            <Success data={data} />
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#aaa", marginTop: 20 }}>
          <a href="/" style={{ color: P, textDecoration: "none" }}>← Back to SubSeat</a>
        </p>
      </div>
    </>
  );
}