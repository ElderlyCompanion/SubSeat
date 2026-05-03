'use client';
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Poppins',sans-serif;background:${G};color:${C}}

  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

  .fu{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both}
  .d1{animation-delay:.06s}.d2{animation-delay:.12s}

  .inp{
    width:100%;padding:11px 14px;border-radius:10px;
    border:1.5px solid #e0e0e0;background:${W};
    font-family:'Poppins',sans-serif;font-size:14px;color:${C};
    outline:none;transition:border-color .2s;
  }
  .inp:focus{border-color:${P};box-shadow:0 0 0 3px rgba(86,59,231,.08)}
  select.inp option{background:${W}}
  textarea.inp{resize:vertical}

  .btn-p{
    display:inline-flex;align-items:center;justify-content:center;gap:7px;
    background:${P};color:${W};border:none;
    padding:11px 20px;border-radius:10px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:13px;
    cursor:pointer;transition:all .2s;
  }
  .btn-p:hover{background:#4429d4;transform:translateY(-1px)}
  .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}

  .btn-s{
    display:inline-flex;align-items:center;gap:6px;
    background:transparent;color:${P};border:1.5px solid ${P};
    padding:9px 16px;border-radius:10px;
    font-family:'Poppins',sans-serif;font-weight:600;font-size:13px;
    cursor:pointer;transition:all .2s;
  }
  .btn-s:hover{background:${L}}

  .tab-btn{
    padding:9px 18px;border-radius:9px;border:1.5px solid #eee;
    background:${W};font-family:'Poppins',sans-serif;font-weight:600;
    font-size:13px;cursor:pointer;transition:all .18s;color:#888;
  }
  .tab-btn.active{background:${P};color:${W};border-color:${P}}
  .tab-btn:hover{border-color:${P};color:${P}}
  .tab-btn.active:hover{color:${W}}

  .staff-card{
    background:${W};border-radius:18px;padding:22px;
    border:1.5px solid #eee;transition:all .2s;
  }
  .staff-card:hover{border-color:${P};box-shadow:0 8px 28px rgba(86,59,231,.08)}

  .badge{display:inline-block;padding:3px 11px;border-radius:100px;font-size:11px;font-weight:700}

  .day-btn{
    width:36px;height:36px;border-radius:9px;border:1.5px solid #eee;
    display:flex;align-items:center;justify-content:center;
    font-size:11px;font-weight:700;cursor:pointer;transition:all .18s;
    font-family:'Poppins',sans-serif;background:${W};color:#888;
  }
  .day-btn.on{background:${P};color:${W};border-color:${P}}
  .day-btn:hover{border-color:${P}}

  .toggle-sw{
    width:44px;height:24px;border-radius:100px;cursor:pointer;
    position:relative;transition:background .2s;border:none;flex-shrink:0;
  }
  .toggle-knob{
    position:absolute;top:3px;width:18px;height:18px;
    border-radius:50%;background:${W};transition:left .2s;
  }

  .holiday-row{
    display:flex;justify-content:space-between;align-items:center;
    padding:14px 0;border-bottom:1px solid #f0f0f0;flex-wrap:wrap;gap:10px;
  }
  .holiday-row:last-child{border-bottom:none}

  .cal-col{
    background:${W};border-radius:14px;padding:16px;
    border:1.5px solid #eee;min-width:150px;
  }

  .modal-bg{
    position:fixed;inset:0;background:rgba(0,0,0,.55);
    display:flex;align-items:center;justify-content:center;
    z-index:999;backdrop-filter:blur(5px);padding:16px;
  }

  @media(max-width:768px){
    .staff-grid{grid-template-columns:1fr!important}
    .two-col{grid-template-columns:1fr!important}
    .cal-cols{grid-template-columns:1fr 1fr!important}
  }
`;

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ── HELPERS ── */
const roleMeta = {
  owner:        { label:"Owner",        bg:"#fef3c7", color:"#92400e" },
  manager:      { label:"Manager",      bg:"#e0e7ff", color:"#3730a3" },
  staff:        { label:"Staff",        bg:"#dcfce7", color:"#166534" },
  receptionist: { label:"Receptionist", bg:"#f3e8ff", color:"#6b21a8" },
};
const empMeta = {
  employed:                { label:"Employed",          bg:"#f0fdf4", color:"#166534" },
  commission:              { label:"Commission",         bg:"#fff7ed", color:"#92400e" },
  self_employed_own:       { label:"Self-Employed",      bg:"#eff6ff", color:"#1e40af" },
  self_employed_through_us:{ label:"SE via Business",    bg:"#f5f3ff", color:"#5b21b6" },
};

const Badge = ({ type, map }) => {
  const m = map[type] || map.staff || map.employed;
  return <span className="badge" style={{ background:m.bg, color:m.color }}>{m.label}</span>;
};

const fmtDate = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtT    = d => new Date(d).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

/* ── PHOTO UPLOAD ── */
function AvatarUpload({ current, staffId, onUploaded }) {
  const [preview,   setPreview]   = useState(current || null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `staff/${staffId || Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("staff-avatars").upload(path, file, { upsert:true });
    if (!error) {
      const { data } = supabase.storage.from("staff-avatars").getPublicUrl(path);
      onUploaded(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16 }}>
      <div style={{ position:"relative", flexShrink:0 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:L, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, border:`3px solid ${W}`, boxShadow:`0 4px 16px rgba(86,59,231,.18)` }}>
          {preview ? <img src={preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
        </div>
        {uploading && (
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(86,59,231,.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:22, height:22, border:"2px solid rgba(255,255,255,.4)", borderTop:`2px solid ${W}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontWeight:600, fontSize:13, color:C, marginBottom:4 }}>Staff Photo</div>
        <div style={{ fontSize:12, color:"#888", marginBottom:8 }}>Shows on business profile and booking page</div>
        <label style={{ display:"inline-flex", alignItems:"center", gap:6, background:L, borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, color:P, cursor:"pointer" }}>
          📷 {preview ? "Change" : "Upload Photo"}
          <input ref={inputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handle} />
        </label>
      </div>
    </div>
  );
}

/* ── ADD / EDIT MODAL ── */
function StaffModal({ member, businessId, onSave, onClose }) {
  const isEdit = !!member?.id;
  const [form, setForm] = useState({
    full_name:        member?.full_name        || "",
    email:            member?.email            || "",
    phone:            member?.phone            || "",
    role:             member?.role             || "staff",
    employment_type:  member?.employment_type  || "employed",
    commission_rate:  member?.commission_rate  || "",
    bio:              member?.bio              || "",
    specialities:     member?.specialities?.join(", ") || "",
    instagram_handle: member?.instagram_handle || "",
    accepts_bookings: member?.accepts_bookings ?? true,
    avatar_url:       member?.avatar_url       || "",
  });
  const [avail, setAvail] = useState(
    DAYS.map((_,i) => ({ day:i, working:i!==0, start:"09:00", end:"18:00" }))
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (member?.id) {
      supabase.from("staff_availability").select("*").eq("staff_id", member.id).then(({ data }) => {
        if (data?.length) {
          setAvail(DAYS.map((_,i) => {
            const a = data.find(d => d.day_of_week === i);
            return a ? { day:i, working:a.is_working, start:a.start_time.slice(0,5), end:a.end_time.slice(0,5) } : { day:i, working:false, start:"09:00", end:"18:00" };
          }));
        }
      });
    }
  }, [member?.id]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      business_id:     businessId,
      full_name:       form.full_name,
      email:           form.email || null,
      phone:           form.phone || null,
      role:            form.role,
      employment_type: form.employment_type,
      commission_rate: form.commission_rate ? parseFloat(form.commission_rate) : 0,
      bio:             form.bio || null,
      specialities:    form.specialities ? form.specialities.split(",").map(s=>s.trim()).filter(Boolean) : [],
      instagram_handle:form.instagram_handle || null,
      accepts_bookings:form.accepts_bookings,
      avatar_url:      form.avatar_url || null,
      is_active:       true,
    };

    let staffId = member?.id;
    if (isEdit) {
      await supabase.from("staff").update(payload).eq("id", member.id);
    } else {
      const { data } = await supabase.from("staff").insert(payload).select().single();
      staffId = data?.id;
    }

    if (staffId) {
      await supabase.from("staff_availability").delete().eq("staff_id", staffId);
      const rows = avail.map(a => ({ staff_id:staffId, day_of_week:a.day, start_time:a.start, end_time:a.end, is_working:a.working }));
      await supabase.from("staff_availability").insert(rows);
    }

    setSaving(false);
    onSave();
    onClose();
  };

  const empInfo = {
    employed:                 "All subscription revenue goes to the business. Owner manages payroll separately.",
    commission:               `Staff receives ${form.commission_rate||"?"}% of their subscription revenue. Owner keeps the rest. Paid outside SubSeat.`,
    self_employed_own:        "Barber has their own SubSeat account and their own Stripe. They keep 100% minus SubSeat's 6% fee. Chair rent sorted outside SubSeat.",
    self_employed_through_us: "Payments go through the business Stripe. Owner can see earnings and pays the barber their share. Chair rent handled outside SubSeat.",
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:W, borderRadius:24, padding:28, maxWidth:620, width:"100%", maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.22)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ fontWeight:800, fontSize:19, color:C }}>{isEdit?"Edit Staff Member":"Add Staff Member"}</h3>
          <button onClick={onClose} style={{ background:G, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* PHOTO */}
          <AvatarUpload current={form.avatar_url} staffId={member?.id}
            onUploaded={url => setForm(f=>({...f, avatar_url:url}))} />

          {/* NAME + EMAIL */}
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Full Name *</label>
              <input className="inp" placeholder="Ed Johnson" value={form.full_name} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Email (for login invite)</label>
              <input className="inp" type="email" placeholder="ed@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
          </div>

          {/* PHONE + INSTAGRAM */}
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Phone</label>
              <input className="inp" placeholder="07700 000000" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Instagram Handle</label>
              <input className="inp" placeholder="@eddycuts" value={form.instagram_handle} onChange={e=>setForm(f=>({...f,instagram_handle:e.target.value}))} />
            </div>
          </div>

          {/* ROLE + EMPLOYMENT */}
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Role</label>
              <select className="inp" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff / Barber</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Payment Model</label>
              <select className="inp" value={form.employment_type} onChange={e=>setForm(f=>({...f,employment_type:e.target.value}))}>
                <option value="employed">Employed / Salaried</option>
                <option value="commission">Commission Split</option>
                <option value="self_employed_own">Self-Employed (own account)</option>
                <option value="self_employed_through_us">Self-Employed (via business)</option>
              </select>
            </div>
          </div>

          {/* PAYMENT MODEL EXPLANATION */}
          <div style={{ background:"#f8f7ff", borderRadius:10, padding:"11px 14px", fontSize:12, color:"#555", lineHeight:1.55, borderLeft:`3px solid ${P}` }}>
            💡 {empInfo[form.employment_type]}
          </div>

          {/* COMMISSION RATE */}
          {form.employment_type === "commission" && (
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Commission Rate (%)</label>
              <input className="inp" type="number" min="0" max="100" placeholder="60" value={form.commission_rate} onChange={e=>setForm(f=>({...f,commission_rate:e.target.value}))} />
              <div style={{ fontSize:11, color:"#aaa", marginTop:4 }}>Staff earns this % of subscription revenue. Paid outside SubSeat.</div>
            </div>
          )}

          {/* BIO */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Bio (shown on profile)</label>
            <textarea className="inp" rows={3} placeholder="Specialist in skin fades, tapers and modern cuts. 8 years experience..." value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} />
          </div>

          {/* SPECIALITIES */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Specialities <span style={{ fontWeight:400 }}>(comma separated)</span></label>
            <input className="inp" placeholder="Skin fades, Tapers, Beard trims, Line ups" value={form.specialities} onChange={e=>setForm(f=>({...f,specialities:e.target.value}))} />
          </div>

          {/* ACCEPTS BOOKINGS */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:G, borderRadius:10, padding:"12px 14px" }}>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:C }}>Show on Booking Page</div>
              <div style={{ fontSize:11, color:"#888" }}>Customers can select this person when booking</div>
            </div>
            <button className="toggle-sw" style={{ background:form.accepts_bookings?P:"#e0e0e0" }}
              onClick={()=>setForm(f=>({...f,accepts_bookings:!f.accepts_bookings}))}>
              <div className="toggle-knob" style={{ left:form.accepts_bookings?23:3 }} />
            </button>
          </div>

          {/* AVAILABILITY */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:10 }}>Working Days & Hours</label>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {DAYS.map((d,i) => (
                <button key={i} className={`day-btn ${avail[i].working?"on":""}`}
                  onClick={()=>setAvail(prev=>prev.map(a=>a.day===i?{...a,working:!a.working}:a))}>
                  {d.slice(0,2)}
                </button>
              ))}
            </div>
            {avail.filter(a=>a.working).map(a=>(
              <div key={a.day} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ width:36, fontSize:12, fontWeight:600, color:"#888" }}>{DAYS[a.day]}</span>
                <input type="time" value={a.start}
                  onChange={e=>setAvail(prev=>prev.map(av=>av.day===a.day?{...av,start:e.target.value}:av))}
                  style={{ flex:1, padding:"8px 10px", borderRadius:8, border:"1.5px solid #eee", fontFamily:"Poppins", fontSize:13, outline:"none" }} />
                <span style={{ fontSize:12, color:"#aaa" }}>to</span>
                <input type="time" value={a.end}
                  onChange={e=>setAvail(prev=>prev.map(av=>av.day===a.day?{...av,end:e.target.value}:av))}
                  style={{ flex:1, padding:"8px 10px", borderRadius:8, border:"1.5px solid #eee", fontFamily:"Poppins", fontSize:13, outline:"none" }} />
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display:"flex", gap:10, paddingTop:8 }}>
            <button className="btn-p" style={{ flex:2 }} onClick={handleSave} disabled={saving||!form.full_name}>
              {saving?"Saving...":(isEdit?"Save Changes":"Add Staff Member")}
            </button>
            <button onClick={onClose} style={{ flex:1, background:G, border:"none", borderRadius:10, fontFamily:"Poppins", fontWeight:600, fontSize:14, cursor:"pointer" }}>Cancel</button>
          </div>

          {/* INVITE NOTE */}
          {!isEdit && form.email && (
            <div style={{ background:"#f0fdf4", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#166534" }}>
              ✉️ An invite will be sent to <strong>{form.email}</strong> so they can set up their own login.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── STAFF CARD ── */
function StaffCard({ member, onEdit, onToggle, bookings, subscriptions }) {
  const mySubs    = subscriptions.filter(s => s.staff_id === member.id);
  const myRevenue = mySubs.reduce((a,s) => a+parseFloat(s.monthly_price||0), 0);
  const myEarnings = member.employment_type === "self_employed_own" || member.employment_type === "self_employed_through_us"
    ? myRevenue * 0.94
    : member.employment_type === "commission"
    ? myRevenue * (parseFloat(member.commission_rate)||0) / 100
    : null;

  const todayBkgs = bookings.filter(b =>
    b.staff_id === member.id &&
    new Date(b.start_time).toDateString() === new Date().toDateString()
  );

  return (
    <div className="staff-card fu">
      {/* TOP ROW */}
      <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:16 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:L, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, border:`2px solid ${W}`, boxShadow:`0 4px 12px rgba(86,59,231,.14)` }}>
          {member.avatar_url
            ? <img src={member.avatar_url} alt={member.full_name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : "👤"}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C, marginBottom:5 }}>{member.full_name}</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            <Badge type={member.role} map={roleMeta} />
            <Badge type={member.employment_type} map={empMeta} />
            {!member.is_active && <span className="badge" style={{ background:"#fee2e2", color:"#991b1b" }}>Inactive</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          <button onClick={()=>onEdit(member)} style={{ background:L, border:"none", borderRadius:8, padding:"7px 13px", fontFamily:"Poppins", fontWeight:600, fontSize:12, color:P, cursor:"pointer" }}>Edit</button>
          <button onClick={()=>onToggle(member)} style={{ background:member.is_active?"#fff5f5":"#f0fdf4", border:`1px solid ${member.is_active?"#ffcccc":"#bbf7d0"}`, borderRadius:8, padding:"7px 13px", fontFamily:"Poppins", fontWeight:600, fontSize:12, color:member.is_active?"#e53e3e":"#166534", cursor:"pointer" }}>
            {member.is_active?"Suspend":"Activate"}
          </button>
        </div>
      </div>

      {/* BIO */}
      {member.bio && <p style={{ fontSize:13, color:"#666", lineHeight:1.55, marginBottom:12 }}>{member.bio}</p>}

      {/* SPECIALITIES */}
      {member.specialities?.length > 0 && (
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
          {member.specialities.map((s,i) => (
            <span key={i} style={{ background:G, borderRadius:7, padding:"3px 9px", fontSize:11, fontWeight:600, color:"#555" }}>{s}</span>
          ))}
        </div>
      )}

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, padding:"12px 0", borderTop:"1px solid #f0f0f0", borderBottom:"1px solid #f0f0f0", marginBottom:12 }}>
        {[
          { label:"Today",   val:todayBkgs.length,             color:P         },
          { label:"Subs",    val:mySubs.length,                color:"#22c55e" },
          { label:"Revenue", val:`£${myRevenue.toFixed(0)}`,   color:"#f59e0b" },
          { label:"Earns",   val:myEarnings!=null?`£${myEarnings.toFixed(0)}`:"—", color:"#8b5cf6" },
        ].map((s,i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <div style={{ fontWeight:800, fontSize:16, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:"#aaa", marginTop:1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
        {member.employment_type === "commission" && (
          <span style={{ fontSize:12, color:"#888" }}>💰 {member.commission_rate}% commission</span>
        )}
        {(member.employment_type === "self_employed_own" || member.employment_type === "self_employed_through_us") && (
          <span style={{ fontSize:12, color:"#888" }}>💼 Self-employed · chair rent handled privately</span>
        )}
        {member.email && (
          <a href={`mailto:${member.email}`} style={{ fontSize:12, color:P, fontWeight:600, textDecoration:"none" }}>✉️ {member.email}</a>
        )}
        {member.instagram_handle && (
          <span style={{ fontSize:12, color:"#888" }}>📸 {member.instagram_handle}</span>
        )}
      </div>
    </div>
  );
}

/* ── TEAM CALENDAR ── */
function TeamCalendar({ staff, bookings }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const dateStr = new Date(date).toDateString();
  const active  = staff.filter(s => s.is_active && s.accepts_bookings);
  const COLORS  = [P,"#22c55e","#f59e0b","#e53e3e","#8b5cf6","#06b6d4","#ec4899"];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <h3 style={{ fontWeight:700, fontSize:17, color:C }}>Team Calendar</h3>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)}
          style={{ padding:"9px 14px", borderRadius:10, border:"1.5px solid #eee", fontFamily:"Poppins", fontSize:13, outline:"none", cursor:"pointer" }} />
      </div>

      {/* LEGEND */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:16 }}>
        {active.map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:COLORS[i%COLORS.length], flexShrink:0 }} />
            <span style={{ fontSize:12, fontWeight:600, color:"#555" }}>{s.full_name}</span>
          </div>
        ))}
      </div>

      {/* COLUMNS */}
      {active.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#aaa" }}>No active staff accepting bookings</div>
      ) : (
        <div className="cal-cols" style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(active.length,4)},1fr)`, gap:14, overflowX:"auto" }}>
          {active.map((member,mi) => {
            const color    = COLORS[mi%COLORS.length];
            const dayBkgs  = bookings.filter(b => b.staff_id===member.id && new Date(b.start_time).toDateString()===dateStr)
              .sort((a,b) => new Date(a.start_time)-new Date(b.start_time));
            return (
              <div key={member.id} className="cal-col" style={{ borderTop:`3px solid ${color}` }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:L, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
                    {member.avatar_url ? <img src={member.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
                  </div>
                  <div style={{ fontWeight:700, fontSize:13, color:C }}>{member.full_name}</div>
                </div>
                {dayBkgs.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"20px 0", color:"#aaa", fontSize:12 }}>Free all day</div>
                ) : dayBkgs.map((b,i) => (
                  <div key={i} style={{ background:`${color}14`, borderLeft:`3px solid ${color}`, borderRadius:"0 8px 8px 0", padding:"9px 12px", marginBottom:7 }}>
                    <div style={{ fontWeight:700, fontSize:12, color:C }}>{fmtT(b.start_time)}</div>
                    <div style={{ fontSize:11, color:"#666", marginTop:1 }}>{b.notes||"Appointment"}</div>
                    <span style={{ fontSize:10, fontWeight:700, background:b.status==="confirmed"?"#dcfce7":"#fef3c7", color:b.status==="confirmed"?"#166534":"#92400e", borderRadius:4, padding:"1px 6px", marginTop:4, display:"inline-block" }}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── HOLIDAY MANAGER ── */
function HolidayManager({ staff, businessId, isOwner }) {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ staff_id:"", start_date:"", end_date:"", reason:"" });
  const [saving,   setSaving]   = useState(false);

  useEffect(() => { loadRequests(); }, [businessId]);

  const loadRequests = async () => {
    const { data } = await supabase
      .from("holiday_requests")
      .select("*, staff(full_name, avatar_url)")
      .eq("business_id", businessId)
      .order("created_at", { ascending:false });
    setRequests(data || []);
  };

  const submitRequest = async () => {
    if (!form.staff_id || !form.start_date || !form.end_date) return;
    setSaving(true);
    await supabase.from("holiday_requests").insert({
      staff_id:    form.staff_id,
      business_id: businessId,
      start_date:  form.start_date,
      end_date:    form.end_date,
      reason:      form.reason,
      status:      "pending",
    });

    // Queue notification to owner
    await supabase.from("notification_queue").insert({
      business_id:       businessId,
      notification_type: "holiday_request",
      recipient:         "owner",
      subject:           "New holiday request",
      message:           `A staff member has submitted a holiday request from ${form.start_date} to ${form.end_date}.`,
      status:            "pending",
      scheduled_for:     new Date().toISOString(),
      channel:           "email",
    });

    setForm({ staff_id:"", start_date:"", end_date:"", reason:"" });
    setShowForm(false);
    setSaving(false);
    loadRequests();
  };

  const handleDecision = async (id, staffName, status, note="") => {
    await supabase.from("holiday_requests").update({
      status,
      response_note: note,
      reviewed_at:   new Date().toISOString(),
    }).eq("id", id);

    // Notify staff member
    await supabase.from("notification_queue").insert({
      business_id:       businessId,
      notification_type: "holiday_decision",
      recipient:         staffName,
      subject:           `Holiday request ${status}`,
      message:           `Your holiday request has been ${status}. ${note}`,
      status:            "pending",
      scheduled_for:     new Date().toISOString(),
      channel:           "email",
    });

    loadRequests();
  };

  const statusBadge = (s) => {
    const map = { pending:{bg:"#fef3c7",color:"#92400e"}, approved:{bg:"#dcfce7",color:"#166534"}, rejected:{bg:"#fee2e2",color:"#991b1b"} };
    const m = map[s];
    return <span className="badge" style={{ background:m.bg, color:m.color }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>;
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <h3 style={{ fontWeight:700, fontSize:17, color:C }}>Holiday & Leave Requests</h3>
        <button className="btn-p" onClick={()=>setShowForm(!showForm)}>+ New Request</button>
      </div>

      {/* NEW REQUEST FORM */}
      {showForm && (
        <div style={{ background:"#f8f7ff", borderRadius:14, padding:20, marginBottom:20, border:`1.5px dashed ${P}` }}>
          <h4 style={{ fontWeight:700, fontSize:14, color:C, marginBottom:14 }}>Submit Holiday Request</h4>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Staff Member</label>
              <select className="inp" value={form.staff_id} onChange={e=>setForm(f=>({...f,staff_id:e.target.value}))}>
                <option value="">Select staff member...</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
            </div>
            <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>From</label>
                <input className="inp" type="date" value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>To</label>
                <input className="inp" type="date" value={form.end_date} onChange={e=>setForm(f=>({...f,end_date:e.target.value}))} />
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:5 }}>Reason (optional)</label>
              <input className="inp" placeholder="Annual leave, family event..." value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-p" onClick={submitRequest} disabled={saving||!form.staff_id||!form.start_date||!form.end_date}>
                {saving?"Submitting...":"Submit Request"}
              </button>
              <button onClick={()=>setShowForm(false)} style={{ background:G, border:"none", borderRadius:10, padding:"11px 20px", fontFamily:"Poppins", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST LIST */}
      <div style={{ background:W, borderRadius:14, padding:20, border:"1.5px solid #eee" }}>
        {requests.length === 0 ? (
          <div style={{ textAlign:"center", padding:"32px 0", color:"#aaa" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🏖️</div>
            <div style={{ fontSize:14 }}>No holiday requests yet</div>
          </div>
        ) : requests.map((r,i) => (
          <div key={r.id} className="holiday-row">
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:L, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                {r.staff?.avatar_url ? <img src={r.staff.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:13, color:C }}>{r.staff?.full_name}</div>
                <div style={{ fontSize:12, color:"#888" }}>{fmtDate(r.start_date)} → {fmtDate(r.end_date)}</div>
                {r.reason && <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{r.reason}</div>}
              </div>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {statusBadge(r.status)}
              {isOwner && r.status === "pending" && (
                <>
                  <button onClick={()=>handleDecision(r.id, r.staff?.full_name, "approved")} className="btn-p" style={{ fontSize:12, padding:"6px 14px", background:"#22c55e" }}>
                    ✓ Approve
                  </button>
                  <button onClick={()=>handleDecision(r.id, r.staff?.full_name, "rejected")}
                    style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:8, padding:"6px 14px", fontFamily:"Poppins", fontWeight:600, fontSize:12, color:"#e53e3e", cursor:"pointer" }}>
                    ✕ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── REVENUE REPORT ── */
function RevenueReport({ staff, subscriptions }) {
  const total    = subscriptions.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
  const subSeat  = total * 0.06;
  const subSeatVAT = subSeat * 1.2;

  return (
    <div>
      <h3 style={{ fontWeight:700, fontSize:17, color:C, marginBottom:20 }}>Revenue & Commission Report</h3>

      {/* SUMMARY */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
        {[
          { label:"Total Subscription Revenue", val:`£${total.toFixed(2)}`,       color:P         },
          { label:"SubSeat Fee (6% + VAT)",      val:`£${subSeatVAT.toFixed(2)}`,  color:"#f59e0b" },
          { label:"Net to Business & Staff",     val:`£${(total-subSeatVAT).toFixed(2)}`, color:"#22c55e" },
        ].map((s,i) => (
          <div key={i} style={{ background:W, borderRadius:13, padding:18, border:"1.5px solid #eee", textAlign:"center" }}>
            <div style={{ fontSize:11, color:"#888", marginBottom:5 }}>{s.label}</div>
            <div style={{ fontWeight:900, fontSize:22, color:s.color, letterSpacing:"-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* PER STAFF */}
      <div style={{ background:W, borderRadius:14, border:"1.5px solid #eee", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"12px 20px", background:G }}>
          {["Staff Member","Type","Subs","Revenue","Their Earnings"].map(h => (
            <div key={h} style={{ fontSize:10, fontWeight:700, color:"#aaa", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
          ))}
        </div>
        {staff.filter(s=>s.is_active).length === 0 && (
          <div style={{ textAlign:"center", padding:"24px 0", color:"#aaa", fontSize:13 }}>No active staff</div>
        )}
        {staff.filter(s=>s.is_active).map((member,i) => {
          const mySubs    = subscriptions.filter(s => s.staff_id === member.id);
          const myRevenue = mySubs.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
          const myNet = member.employment_type === "self_employed_own" || member.employment_type === "self_employed_through_us"
            ? myRevenue * 0.94
            : member.employment_type === "commission"
            ? myRevenue * (parseFloat(member.commission_rate)||0) / 100
            : null;
          return (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", padding:"13px 20px", borderBottom:"1px solid #f8f8f8", alignItems:"center" }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:L, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                  {member.avatar_url ? <img src={member.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
                </div>
                <span style={{ fontWeight:700, fontSize:13, color:C }}>{member.full_name}</span>
              </div>
              <Badge type={member.employment_type} map={empMeta} />
              <div style={{ fontSize:13, color:"#666" }}>{mySubs.length}</div>
              <div style={{ fontSize:13, color:"#666" }}>£{myRevenue.toFixed(0)}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#22c55e" }}>
                {myNet != null ? `£${myNet.toFixed(0)}/mo` : "—"}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize:11, color:"#aaa", marginTop:10 }}>
        Chair rent and salary payments are managed between owner and staff privately. SubSeat shows earnings for reference only.
      </p>
    </div>
  );
}

/* ── ROOT ── */
export default function StaffSystem({ business, bookings=[], subscriptions=[], isOwner=true }) {
  const [staff,     setStaff]   = useState([]);
  const [loading,   setLoading] = useState(true);
  const [modal,     setModal]   = useState(null);
  const [tab,       setTab]     = useState("team");

  useEffect(() => { if(business?.id) load(); }, [business?.id]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("staff").select("*").eq("business_id", business.id).order("created_at");
    setStaff(data || []);
    setLoading(false);
  };

  const handleToggle = async (member) => {
    await supabase.from("staff").update({ is_active:!member.is_active }).eq("id", member.id);
    load();
  };

  const TABS = [
    { id:"team",     label:"👥 Team"           },
    { id:"calendar", label:"📅 Team Calendar"  },
    { id:"holidays", label:"🏖️ Holidays"       },
    ...(isOwner ? [{ id:"revenue", label:"💰 Revenue" }] : []),
  ];

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ textAlign:"center", padding:"48px 0" }}>
        <div style={{ width:36, height:36, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto" }} />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {modal && (
        <StaffModal
          member={modal==="add"?null:modal}
          businessId={business.id}
          onSave={load}
          onClose={()=>setModal(null)}
        />
      )}

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontWeight:800, fontSize:22, color:C }}>Staff & Team ({staff.length})</h2>
        {isOwner && <button className="btn-p" onClick={()=>setModal("add")}>+ Add Staff Member</button>}
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* TEAM */}
      {tab === "team" && (
        staff.length === 0 ? (
          <div style={{ background:W, borderRadius:18, padding:"56px 24px", border:"1.5px solid #eee", textAlign:"center" }}>
            <div style={{ fontSize:56, marginBottom:16 }}>👥</div>
            <h3 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:8 }}>No staff yet</h3>
            <p style={{ color:"#888", marginBottom:24 }}>Add your team — barbers, stylists, receptionists. Each gets their own profile card on your booking page.</p>
            {isOwner && <button className="btn-p" onClick={()=>setModal("add")}>Add First Staff Member</button>}
          </div>
        ) : (
          <div className="staff-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            {staff.map(m => (
              <StaffCard key={m.id} member={m} onEdit={setModal} onToggle={handleToggle} bookings={bookings} subscriptions={subscriptions} />
            ))}
          </div>
        )
      )}

      {/* TEAM CALENDAR */}
      {tab === "calendar" && (
        <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
          <TeamCalendar staff={staff} bookings={bookings} />
        </div>
      )}

      {/* HOLIDAYS */}
      {tab === "holidays" && (
        <HolidayManager staff={staff} businessId={business.id} isOwner={isOwner} />
      )}

      {/* REVENUE */}
      {tab === "revenue" && isOwner && (
        <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee" }}>
          <RevenueReport staff={staff} subscriptions={subscriptions} />
        </div>
      )}
    </>
  );
}