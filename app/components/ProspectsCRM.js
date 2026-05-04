'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

/* ── STATUS CONFIG ── */
const STATUS = {
  spotted:        { label:"Spotted",       bg:"#f3e8ff", color:"#6b21a8", icon:"👀" },
  contacted:      { label:"Contacted",     bg:"#fef3c7", color:"#92400e", icon:"📞" },
  interested:     { label:"Interested",    bg:"#dbeafe", color:"#1e40af", icon:"💡" },
  demo_booked:    { label:"Demo Booked",   bg:"#e0e7ff", color:"#3730a3", icon:"📅" },
  signed_up:      { label:"Signed Up ✅",  bg:"#dcfce7", color:"#166534", icon:"🎉" },
  not_interested: { label:"Not Interested",bg:"#fee2e2", color:"#991b1b", icon:"❌" },
  follow_up:      { label:"Follow Up",     bg:"#fff7ed", color:"#92400e", icon:"🔔" },
};

const PRIORITY = {
  high:   { label:"High",   bg:"#fee2e2", color:"#991b1b" },
  medium: { label:"Medium", bg:"#fef3c7", color:"#92400e" },
  low:    { label:"Low",    bg:"#f0f0f0", color:"#888"    },
};

const PLATFORMS = ["None / Unknown","Setmore","Booksy","Fresha","Treatwell","Square","Vagaro","Other"];
const CATEGORIES = ["barbers","hair-salons","nail-techs","lash-artists","brow-artists","massage","skincare","wellness","other"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }

  .fu { animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both }

  .inp {
    width:100%; padding:10px 13px; border-radius:9px;
    border:1.5px solid #e0e0e0; background:${W};
    font-family:'Poppins',sans-serif; font-size:13px; color:${C};
    outline:none; transition:border-color .2s;
  }
  .inp:focus { border-color:${P}; box-shadow:0 0 0 3px rgba(86,59,231,.08); }
  select.inp option { background:${W}; }
  textarea.inp { resize:vertical; }

  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    background:${P}; color:${W}; border:none;
    padding:10px 18px; border-radius:9px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:all .2s;
  }
  .btn-p:hover { background:#4429d4; transform:translateY(-1px); }
  .btn-p:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  .btn-s {
    display:inline-flex; align-items:center; gap:5px;
    background:transparent; color:${P}; border:1.5px solid ${P};
    padding:8px 14px; border-radius:9px;
    font-family:'Poppins',sans-serif; font-weight:600; font-size:12px;
    cursor:pointer; transition:all .2s;
  }
  .btn-s:hover { background:${L}; }

  .prospect-card {
    background:${W}; border-radius:14px; padding:18px 20px;
    border:1.5px solid #eee; transition:all .2s;
  }
  .prospect-card:hover { border-color:${P}; box-shadow:0 6px 24px rgba(86,59,231,.08); }

  .badge { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:700; }

  .stat-mini {
    background:${W}; border-radius:12px; padding:16px 18px;
    border:1.5px solid #eee; text-align:center;
  }

  .modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,.5);
    display:flex; align-items:center; justify-content:center;
    z-index:999; backdrop-filter:blur(5px); padding:16px;
  }

  .tab-btn {
    padding:8px 16px; border-radius:8px; border:1.5px solid #eee;
    background:${W}; font-family:'Poppins',sans-serif; font-weight:600;
    font-size:12px; cursor:pointer; transition:all .18s; color:#888;
  }
  .tab-btn.active { background:${P}; color:${W}; border-color:${P}; }

  @media(max-width:768px) {
    .two-col { grid-template-columns:1fr !important; }
    .three-col { grid-template-columns:1fr 1fr !important; }
  }
`;

const fmtDate = d => d ? new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "—";

/* ── ADD/EDIT MODAL ── */
function ProspectModal({ prospect, onSave, onClose }) {
  const isEdit = !!prospect?.id;
  const [form, setForm] = useState({
    business_name:    prospect?.business_name    || "",
    owner_name:       prospect?.owner_name       || "",
    category:         prospect?.category         || "barbers",
    city:             prospect?.city             || "",
    website:          prospect?.website          || "",
    phone:            prospect?.phone            || "",
    whatsapp:         prospect?.whatsapp         || "",
    email:            prospect?.email            || "",
    instagram:        prospect?.instagram        || "",
    current_platform: prospect?.current_platform || "None / Unknown",
    status:           prospect?.status           || "spotted",
    priority:         prospect?.priority         || "medium",
    notes:            prospect?.notes            || "",
    follow_up_date:   prospect?.follow_up_date   || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.business_name) return;
    setSaving(true);
    const payload = {
      ...form,
      follow_up_date: form.follow_up_date || null,
      updated_at: new Date().toISOString(),
    };
    if (isEdit) {
      await supabase.from("prospects").update(payload).eq("id", prospect.id);
    } else {
      await supabase.from("prospects").insert(payload);
    }
    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:W, borderRadius:20, padding:28, maxWidth:600, width:"100%", maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontWeight:800, fontSize:18, color:C }}>{isEdit?"Edit Prospect":"Add Prospect"}</h3>
          <button onClick={onClose} style={{ background:G, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          {/* BUSINESS NAME */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Business Name *</label>
            <input className="inp" placeholder="e.g. TrimHub" value={form.business_name} onChange={e=>setForm(f=>({...f,business_name:e.target.value}))} />
          </div>

          {/* OWNER + CATEGORY */}
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Owner Name</label>
              <input className="inp" placeholder="Chris, Sarah..." value={form.owner_name} onChange={e=>setForm(f=>({...f,owner_name:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Category</label>
              <select className="inp" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c} value={c}>{c.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</option>)}
              </select>
            </div>
          </div>

          {/* CITY + WEBSITE */}
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>City</label>
              <input className="inp" placeholder="London" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Website</label>
              <input className="inp" placeholder="https://trimhub.co.uk" value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} />
            </div>
          </div>

          {/* CONTACT DETAILS */}
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>📞 Phone</label>
              <input className="inp" placeholder="07700 000000" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>💬 WhatsApp</label>
              <input className="inp" placeholder="07700 000000" value={form.whatsapp} onChange={e=>setForm(f=>({...f,whatsapp:e.target.value}))} />
            </div>
          </div>
          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>📧 Email</label>
              <input className="inp" type="email" placeholder="hello@business.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>📸 Instagram</label>
              <input className="inp" placeholder="@trimhub" value={form.instagram} onChange={e=>setForm(f=>({...f,instagram:e.target.value}))} />
            </div>
          </div>

          {/* PLATFORM + STATUS + PRIORITY */}
          <div className="three-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Current Platform</label>
              <select className="inp" value={form.current_platform} onChange={e=>setForm(f=>({...f,current_platform:e.target.value}))}>
                {PLATFORMS.map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Status</label>
              <select className="inp" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Priority</label>
              <select className="inp" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                {Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          {/* FOLLOW UP DATE */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>📅 Follow-Up Date</label>
            <input className="inp" type="date" value={form.follow_up_date} onChange={e=>setForm(f=>({...f,follow_up_date:e.target.value}))} />
          </div>

          {/* NOTES */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#888", display:"block", marginBottom:4 }}>Notes from visit</label>
            <textarea className="inp" rows={4} placeholder="Spoke to owner Chris. Happy with Setmore but open to subscriptions. Call back next week..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
          </div>

          {/* PITCH HELPER */}
          {form.current_platform && form.current_platform !== "None / Unknown" && (
            <div style={{ background:"#f8f7ff", borderRadius:10, padding:"12px 14px", borderLeft:`3px solid ${P}` }}>
              <div style={{ fontSize:12, fontWeight:700, color:P, marginBottom:4 }}>💡 Pitch angle for {form.current_platform} user</div>
              <div style={{ fontSize:12, color:"#555", lineHeight:1.55 }}>
                {form.current_platform === "Setmore" && "Setmore is free but purely transactional. SubSeat adds subscriptions — customers pay monthly even when they don't show up. No more gap revenue loss."}
                {form.current_platform === "Booksy" && "Booksy charges up to £50/month per seat. SubSeat is free to join — we only take 6% on subscriptions, nothing on one-off bookings."}
                {form.current_platform === "Fresha" && "Fresha is free but makes money on card processing. SubSeat adds the subscription model Fresha doesn't offer — recurring monthly income regardless of cancellations."}
                {form.current_platform === "Treatwell" && "Treatwell takes up to 35% per booking. SubSeat takes 6% on subscriptions only. On a £59/month subscription that's £3.54 vs up to £20+ per visit on Treatwell."}
                {!["Setmore","Booksy","Fresha","Treatwell"].includes(form.current_platform) && "SubSeat adds subscription memberships on top of any existing booking system. Customers pay monthly — predictable income, fewer no-shows, better retention."}
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:10, paddingTop:4 }}>
            <button className="btn-p" onClick={handleSave} disabled={saving||!form.business_name} style={{ flex:2 }}>
              {saving?"Saving...":(isEdit?"Save Changes":"Add Prospect")}
            </button>
            <button onClick={onClose} style={{ flex:1, background:G, border:"none", borderRadius:9, fontFamily:"Poppins", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── PROSPECT CARD ── */
function ProspectCard({ p, onEdit, onDelete, onStatusChange, onSendWhatsApp, onSendEmail }) {
  const st = STATUS[p.status] || STATUS.spotted;
  const pr = PRIORITY[p.priority] || PRIORITY.medium;
  const isFollowUpDue = p.follow_up_date && new Date(p.follow_up_date) <= new Date();

  return (
    <div className="prospect-card" style={{ borderLeft: p.priority==="high" ? `3px solid #e53e3e` : p.priority==="medium" ? `3px solid #f59e0b` : `3px solid #eee` }}>
      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:16, color:C, marginBottom:4 }}>{p.business_name}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <span className="badge" style={{ background:st.bg, color:st.color }}>{st.icon} {st.label}</span>
            <span className="badge" style={{ background:pr.bg, color:pr.color }}>{pr.label}</span>
            {p.current_platform && p.current_platform !== "None / Unknown" && (
              <span className="badge" style={{ background:"#f0f0f0", color:"#888" }}>📱 {p.current_platform}</span>
            )}
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={()=>onEdit(p)} style={{ background:L, border:"none", borderRadius:7, padding:"6px 12px", fontFamily:"Poppins", fontWeight:600, fontSize:11, color:P, cursor:"pointer" }}>Edit</button>
          <button onClick={()=>onDelete(p.id)} style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:7, padding:"6px 10px", fontFamily:"Poppins", fontWeight:600, fontSize:11, color:"#e53e3e", cursor:"pointer" }}>×</button>
        </div>
      </div>

      {/* INFO ROW */}
      <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:10 }}>
        {p.owner_name && <span style={{ fontSize:12, color:"#888" }}>👤 {p.owner_name}</span>}
        {p.city && <span style={{ fontSize:12, color:"#888" }}>📍 {p.city}</span>}
        {p.category && <span style={{ fontSize:12, color:"#888" }}>✂️ {p.category.replace(/-/g," ")}</span>}
        {p.website && <a href={p.website} target="_blank" style={{ fontSize:12, color:P, fontWeight:600, textDecoration:"none" }}>🌐 Website</a>}
        {p.instagram && <span style={{ fontSize:12, color:"#e1306c" }}>📸 {p.instagram}</span>}
      </div>

      {/* NOTES */}
      {p.notes && (
        <div style={{ fontSize:12, color:"#666", lineHeight:1.55, background:G, borderRadius:8, padding:"8px 12px", marginBottom:10 }}>
          {p.notes}
        </div>
      )}

      {/* FOLLOW UP */}
      {p.follow_up_date && (
        <div style={{ fontSize:12, fontWeight:600, color:isFollowUpDue?"#e53e3e":"#888", marginBottom:10 }}>
          {isFollowUpDue?"⚠️ Follow-up overdue:":"📅 Follow up:"} {fmtDate(p.follow_up_date)}
        </div>
      )}

      {/* ACTIONS */}
      <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
        {/* STATUS QUICK CHANGE */}
        <select
          value={p.status}
          onChange={e=>onStatusChange(p.id, e.target.value)}
          style={{ flex:1, minWidth:120, padding:"7px 10px", borderRadius:8, border:"1.5px solid #eee", fontFamily:"Poppins", fontSize:11, fontWeight:600, cursor:"pointer", outline:"none" }}>
          {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>

        {/* WHATSAPP */}
        {p.whatsapp && (
          <button onClick={()=>onSendWhatsApp(p)}
            style={{ background:"#22c55e", color:W, border:"none", borderRadius:8, padding:"7px 13px", fontFamily:"Poppins", fontWeight:700, fontSize:11, cursor:"pointer" }}>
            💬 WhatsApp
          </button>
        )}

        {/* EMAIL */}
        {p.email && (
          <button onClick={()=>onSendEmail(p)}
            style={{ background:P, color:W, border:"none", borderRadius:8, padding:"7px 13px", fontFamily:"Poppins", fontWeight:700, fontSize:11, cursor:"pointer" }}>
            ✉️ Email
          </button>
        )}

        {/* PHONE */}
        {p.phone && (
          <a href={`tel:${p.phone}`} style={{ textDecoration:"none" }}>
            <button style={{ background:G, border:"none", borderRadius:8, padding:"7px 13px", fontFamily:"Poppins", fontWeight:700, fontSize:11, cursor:"pointer", color:C }}>
              📞 Call
            </button>
          </a>
        )}
      </div>
    </div>
  );
}

/* ── WHATSAPP MESSAGE GENERATOR ── */
function WhatsAppModal({ prospect, onClose }) {
  const messages = [
    {
      label:"First Contact",
      text:`Hi ${prospect.owner_name||"there"} 👋 I'm Aaron from SubSeat — the UK's subscription booking platform for barbers and salons. I came across ${prospect.business_name} and thought SubSeat could be a great fit. We help businesses like yours earn predictable monthly income through memberships. Free to join, no monthly fee — we only earn when you do. Worth a quick chat? subseat.co.uk`,
    },
    {
      label:"Follow Up",
      text:`Hi ${prospect.owner_name||"there"}, just following up on SubSeat! We've had some great barbers join recently and I thought you'd love the subscription model — customers pay monthly, you earn even on cancellations. Happy to walk you through it in 10 mins? 🙂 subseat.co.uk`,
    },
    {
      label:"Value Pitch",
      text:`Hi ${prospect.owner_name||"there"} — quick question: how much revenue do you lose each month to last-minute cancellations and no-shows? SubSeat fixes that with monthly memberships. Customers pay upfront, you keep the income. No monthly software fee. We take just 6% on subscriptions. subseat.co.uk — worth 5 mins?`,
    },
  ];

  const [selected, setSelected] = useState(0);

  const openWhatsApp = () => {
    const num = prospect.whatsapp.replace(/\s|\+/g,"");
    const text = encodeURIComponent(messages[selected].text);
    window.open(`https://wa.me/${num.startsWith("0")?`44${num.slice(1)}`:num}?text=${text}`, "_blank");
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:W, borderRadius:20, padding:28, maxWidth:520, width:"100%", boxShadow:"0 24px 80px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontWeight:800, fontSize:17, color:C }}>💬 WhatsApp — {prospect.business_name}</h3>
          <button onClick={onClose} style={{ background:G, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18 }}>×</button>
        </div>
        <div style={{ display:"flex", gap:7, marginBottom:16, flexWrap:"wrap" }}>
          {messages.map((m,i)=>(
            <button key={i} onClick={()=>setSelected(i)}
              style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${selected===i?P:"#eee"}`, background:selected===i?L:W, fontFamily:"Poppins", fontWeight:600, fontSize:12, color:selected===i?P:"#888", cursor:"pointer" }}>
              {m.label}
            </button>
          ))}
        </div>
        <div style={{ background:G, borderRadius:12, padding:"14px 16px", fontSize:13, color:"#555", lineHeight:1.65, marginBottom:20 }}>
          {messages[selected].text}
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={openWhatsApp}
            style={{ flex:2, background:"#22c55e", color:W, border:"none", borderRadius:10, padding:"13px", fontFamily:"Poppins", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            Open in WhatsApp →
          </button>
          <button onClick={onClose} style={{ flex:1, background:G, border:"none", borderRadius:10, fontFamily:"Poppins", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── EMAIL MODAL ── */
function EmailModal({ prospect, onClose }) {
  const templates = [
    {
      label:"Introduction",
      subject:`SubSeat — subscription bookings for ${prospect.business_name}`,
      body:`Hi ${prospect.owner_name||"there"},\n\nI hope you're well. I came across ${prospect.business_name} and wanted to reach out about SubSeat — the UK's subscription booking platform built specifically for barbers, salons and beauty professionals.\n\nSubSeat lets your customers subscribe to monthly membership plans — meaning you earn predictable income every month, even when people cancel or reschedule.\n\nKey benefits:\n• Recurring monthly revenue — not just one-off bookings\n• Only 6% platform fee — no monthly software charges\n• WhatsApp + email reminders to reduce no-shows\n• Free to join and set up in under 10 minutes\n• QR code walk-in capture for cash customers\n\nI'd love to show you how it works — happy to jump on a quick call or meet in person.\n\nBest,\nAaron\nSubSeat\nhello@subseat.co.uk\nsubseat.co.uk`,
    },
    {
      label:"Follow Up",
      subject:`Following up — SubSeat for ${prospect.business_name}`,
      body:`Hi ${prospect.owner_name||"there"},\n\nJust following up on my previous message about SubSeat.\n\nI know things get busy — I just wanted to make sure you had a chance to take a look. Several barbers and salons have already joined and are seeing great results with monthly subscriptions.\n\nIf you'd like a quick 10-minute demo, I'm happy to work around your schedule.\n\nBest,\nAaron\nSubSeat — subseat.co.uk`,
    },
  ];

  const [sel, setSel] = useState(0);

  const openEmail = () => {
    window.open(`mailto:${prospect.email}?subject=${encodeURIComponent(templates[sel].subject)}&body=${encodeURIComponent(templates[sel].body)}`);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:W, borderRadius:20, padding:28, maxWidth:560, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontWeight:800, fontSize:17, color:C }}>✉️ Email — {prospect.business_name}</h3>
          <button onClick={onClose} style={{ background:G, border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:18 }}>×</button>
        </div>
        <div style={{ display:"flex", gap:7, marginBottom:16 }}>
          {templates.map((t,i)=>(
            <button key={i} onClick={()=>setSel(i)}
              style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${sel===i?P:"#eee"}`, background:sel===i?L:W, fontFamily:"Poppins", fontWeight:600, fontSize:12, color:sel===i?P:"#888", cursor:"pointer" }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ fontSize:12, fontWeight:600, color:"#888", marginBottom:4 }}>Subject</div>
        <div style={{ background:G, borderRadius:8, padding:"10px 14px", fontSize:13, color:C, marginBottom:12, fontWeight:600 }}>{templates[sel].subject}</div>
        <div style={{ fontSize:12, fontWeight:600, color:"#888", marginBottom:4 }}>Message</div>
        <div style={{ background:G, borderRadius:10, padding:"14px 16px", fontSize:13, color:"#555", lineHeight:1.7, marginBottom:20, whiteSpace:"pre-wrap" }}>{templates[sel].body}</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={openEmail}
            style={{ flex:2, background:P, color:W, border:"none", borderRadius:10, padding:"13px", fontFamily:"Poppins", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            Open in Email App →
          </button>
          <button onClick={onClose} style={{ flex:1, background:G, border:"none", borderRadius:10, fontFamily:"Poppins", fontWeight:600, fontSize:13, cursor:"pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT PROSPECTS COMPONENT ── */
export default function ProspectsCRM() {
  const [prospects,  setProspects]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);  // null | "add" | prospect
  const [waModal,    setWaModal]    = useState(null);
  const [emailModal, setEmailModal] = useState(null);
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("prospects").select("*").order("created_at",{ ascending:false });
    setProspects(data||[]);
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    const updates = { status, updated_at: new Date().toISOString() };
    if (status === "contacted") updates.contacted_at = new Date().toISOString();
    if (status === "signed_up") updates.signed_up_at = new Date().toISOString();
    await supabase.from("prospects").update(updates).eq("id", id);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prospect?")) return;
    await supabase.from("prospects").delete().eq("id", id);
    load();
  };

  // Pipeline stats
  const stats = Object.entries(STATUS).map(([k,v]) => ({
    status: k,
    label:  v.label,
    icon:   v.icon,
    count:  prospects.filter(p=>p.status===k).length,
    bg:     v.bg,
    color:  v.color,
  }));

  const followUpDue = prospects.filter(p => p.follow_up_date && new Date(p.follow_up_date) <= new Date() && p.status !== "signed_up" && p.status !== "not_interested");

  const filtered = prospects.filter(p => {
    const matchFilter = filter === "all" ? true : p.status === filter;
    const matchSearch = !search || p.business_name?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase()) || p.owner_name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ textAlign:"center", padding:"40px 0" }}>
        <div style={{ width:32, height:32, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto" }} />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {modal && <ProspectModal prospect={modal==="add"?null:modal} onSave={load} onClose={()=>setModal(null)} />}
      {waModal && <WhatsAppModal prospect={waModal} onClose={()=>setWaModal(null)} />}
      {emailModal && <EmailModal prospect={emailModal} onClose={()=>setEmailModal(null)} />}

      {/* HEADER */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:20, color:C }}>🎯 Sales Pipeline</h2>
          <p style={{ fontSize:13, color:"#888", marginTop:2 }}>Track prospects and manage your business development outreach.</p>
        </div>
        <button className="btn-p" onClick={()=>setModal("add")}>+ Add Prospect</button>
      </div>

      {/* FOLLOW UP ALERT */}
      {followUpDue.length > 0 && (
        <div style={{ background:"#fff7ed", border:"1.5px solid #fed7aa", borderRadius:14, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:"#92400e" }}>{followUpDue.length} follow-up{followUpDue.length>1?"s":""} overdue</div>
            <div style={{ fontSize:12, color:"#b45309" }}>{followUpDue.map(p=>p.business_name).join(", ")}</div>
          </div>
          <button onClick={()=>setFilter("follow_up")} style={{ marginLeft:"auto", background:"#f59e0b", color:W, border:"none", borderRadius:8, padding:"7px 14px", fontFamily:"Poppins", fontWeight:700, fontSize:12, cursor:"pointer" }}>
            View
          </button>
        </div>
      )}

      {/* PIPELINE STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8, marginBottom:20, overflowX:"auto" }}>
        {stats.map(s=>(
          <div key={s.status} className="stat-mini" onClick={()=>setFilter(filter===s.status?"all":s.status)}
            style={{ cursor:"pointer", border:`1.5px solid ${filter===s.status?P:"#eee"}`, background:filter===s.status?L:W }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontWeight:900, fontSize:22, color:s.count>0?P:"#ccc" }}>{s.count}</div>
            <div style={{ fontSize:10, color:"#888", fontWeight:600, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <input
          placeholder="Search by name, city, owner..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, minWidth:200, padding:"10px 14px", borderRadius:9, border:"1.5px solid #eee", fontFamily:"Poppins", fontSize:13, outline:"none" }}
        />
        <button onClick={()=>{setFilter("all");setSearch("");}}
          style={{ background:G, border:"none", borderRadius:9, padding:"10px 16px", fontFamily:"Poppins", fontWeight:600, fontSize:12, cursor:"pointer", color:"#888" }}>
          Clear
        </button>
      </div>

      {/* PROSPECT LIST */}
      {filtered.length===0 ? (
        <div style={{ background:W, borderRadius:16, padding:"48px 24px", border:"1.5px solid #eee", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎯</div>
          <h3 style={{ fontWeight:800, fontSize:18, color:C, marginBottom:8 }}>No prospects yet</h3>
          <p style={{ color:"#888", marginBottom:20 }}>Start adding businesses you've spotted during your business development rounds.</p>
          <button className="btn-p" onClick={()=>setModal("add")}>Add Your First Prospect</button>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(p=>(
            <ProspectCard
              key={p.id}
              p={p}
              onEdit={setModal}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onSendWhatsApp={setWaModal}
              onSendEmail={setEmailModal}
            />
          ))}
          <div style={{ fontSize:12, color:"#aaa", textAlign:"center", paddingTop:8 }}>
            Showing {filtered.length} of {prospects.length} prospects
          </div>
        </div>
      )}
    </>
  );
}