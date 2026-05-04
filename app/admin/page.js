'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ProspectsCRM from "../components/ProspectsCRM";

const P = "#563BE7";
const W = "#ffffff";
const RED = "#e53e3e";
const GREEN = "#22c55e";

const ADMIN_EMAIL = "mrnicholson@hotmail.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { font-size: 16px; }
  body { font-family: 'Poppins', sans-serif; background: #0f0f1a; color: ${W}; overflow-x: hidden; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform:rotate(360deg); } }
  @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }

  .fu  { animation: fadeUp .4s cubic-bezier(.22,1,.36,1) both; }
  .d1  { animation-delay:.05s; }
  .d2  { animation-delay:.1s;  }
  .d3  { animation-delay:.15s; }

  /* NAV ITEMS */
  .nav-item {
    display:flex; align-items:center; gap:10px;
    padding:10px 14px; border-radius:10px; cursor:pointer;
    font-size:13px; font-weight:600; color:rgba(255,255,255,.5);
    transition:all .18s; border:none; background:transparent;
    font-family:'Poppins',sans-serif; width:100%; text-align:left;
    white-space:nowrap;
  }
  .nav-item:hover  { background:rgba(255,255,255,.08); color:${W}; }
  .nav-item.active { background:${P}; color:${W}; }

  /* CARDS */
  .card {
    background:#1a1a2e; border-radius:16px; padding:24px;
    border:1px solid rgba(255,255,255,.08); transition:border-color .2s;
  }
  .card:hover { border-color:rgba(86,59,231,.35); }

  .stat-card {
    background:#1a1a2e; border-radius:16px; padding:20px;
    border:1px solid rgba(255,255,255,.08); transition:all .2s;
  }
  .stat-card:hover { border-color:${P}; transform:translateY(-2px); }

  /* TABLE */
  .trow {
    display:grid; padding:12px 16px;
    border-bottom:1px solid rgba(255,255,255,.05);
    align-items:center; transition:background .15s;
  }
  .trow:hover       { background:rgba(255,255,255,.04); }
  .trow:last-child  { border-bottom:none; }

  /* BADGES */
  .badge { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:700; }
  .bg    { background:rgba(34,197,94,.15);  color:#4ade80; }
  .br    { background:rgba(239,68,68,.15);  color:#f87171; }
  .bp    { background:rgba(86,59,231,.3);   color:#a78bfa; }
  .bo    { background:rgba(245,158,11,.15); color:#fbbf24; }
  .bw    { background:rgba(255,255,255,.08); color:rgba(255,255,255,.4); }

  /* BUTTONS */
  .btn  { border:none; border-radius:8px; padding:7px 14px; font-family:'Poppins',sans-serif; font-weight:700; font-size:12px; cursor:pointer; transition:all .18s; }
  .btn-p { background:${P}; color:${W}; }
  .btn-p:hover { background:#4429d4; }
  .btn-g { background:rgba(34,197,94,.15); color:#4ade80; border:1px solid rgba(34,197,94,.3); }
  .btn-g:hover { background:rgba(34,197,94,.3); }
  .btn-r { background:rgba(239,68,68,.15); color:#f87171; border:1px solid rgba(239,68,68,.3); }
  .btn-r:hover { background:rgba(239,68,68,.3); }
  .btn-w { background:rgba(255,255,255,.08); color:${W}; }
  .btn-w:hover { background:rgba(255,255,255,.14); }
  .btn-pu { background:rgba(86,59,231,.25); color:#a78bfa; }
  .btn-pu:hover { background:rgba(86,59,231,.4); }
  button:disabled { opacity:.4; cursor:not-allowed; }

  /* INPUTS */
  .inp {
    background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
    border-radius:10px; padding:10px 14px; color:${W};
    font-family:'Poppins',sans-serif; font-size:14px; outline:none; width:100%;
    transition:border-color .2s;
  }
  .inp:focus { border-color:${P}; }
  .inp::placeholder { color:rgba(255,255,255,.3); }
  select.inp option { background:#1a1a2e; }

  .live-dot { width:8px; height:8px; border-radius:50%; background:${GREEN}; animation:pulse 2s infinite; flex-shrink:0; }

  /* MODAL */
  .modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,.85);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; backdrop-filter:blur(6px); padding:16px;
  }

  /* MOBILE BOTTOM NAV */
  .mobile-nav {
    display:none; position:fixed; bottom:0; left:0; right:0;
    background:#13131f; border-top:1px solid rgba(255,255,255,.08);
    padding:6px 4px env(safe-area-inset-bottom,12px); z-index:100; overflow-x:auto;
    -webkit-overflow-scrolling:touch;
  }
  .mobile-nav-inner { display:flex; gap:2px; min-width:max-content; margin:0 auto; padding:0 4px; }
  .mob-btn {
    display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:8px 12px; border-radius:10px; border:none; background:transparent;
    font-family:'Poppins',sans-serif; font-size:9px; font-weight:600;
    color:rgba(255,255,255,.45); cursor:pointer; transition:all .18s; white-space:nowrap;
    min-height:44px; min-width:44px;
  }
  .mob-btn.active { background:${P}; color:${W}; }
  .mob-btn .icon  { font-size:20px; }

  /* MOBILE BUSINESS CARD */
  .biz-card-mob {
    background:#1a1a2e; border-radius:14px; padding:16px;
    border:1px solid rgba(255,255,255,.08); margin-bottom:10px;
  }

  /* LAYOUT */
  @media(min-width:901px) {
    .sidebar-wrap  { display:block !important; }
    .mobile-nav    { display:none !important; }
    .main-wrap     { padding-bottom:28px !important; }
    .mob-only      { display:none !important; }
  }
  @media(max-width:900px) {
    .admin-grid    { grid-template-columns:1fr !important; }
    .sidebar-wrap  { display:none !important; }
    .mobile-nav    { display:flex !important; }
    .main-wrap     { padding-bottom:100px !important; }
    .stats-4       { grid-template-columns:1fr 1fr !important; }
    .stats-3       { grid-template-columns:1fr 1fr !important; }
    .two-col       { grid-template-columns:1fr !important; }
    .trow          { padding:10px 12px; }
    .hide-mob      { display:none !important; }
    .desk-only     { display:none !important; }
    .btn           { min-height:40px; padding:9px 14px; }
    .inp           { min-height:44px; font-size:16px !important; }
    select.inp     { min-height:44px; }
  }
  @media(max-width:480px) {
    .stats-4   { grid-template-columns:1fr 1fr !important; }
    .card      { padding:14px; }
    .stat-card { padding:14px; }
  }
`;

/* ── HELPERS ── */
const isRemoved = b => b.slug?.startsWith("removed-");
const fmtDate   = d => new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
const fmtTime   = d => new Date(d).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });

/* ── CONFIRM MODAL ── */
function Modal({ title, message, sub, confirmLabel="Confirm", danger=false, onConfirm, onCancel, children }) {
  return (
    <div className="modal-bg" onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#1a1a2e", borderRadius:20, padding:28, maxWidth:440, width:"100%", border:"1px solid rgba(255,255,255,.12)" }}>
        <div style={{ fontSize:40, textAlign:"center", marginBottom:12 }}>⚠️</div>
        <h3 style={{ fontWeight:800, fontSize:17, color:W, textAlign:"center", marginBottom:10 }}>{title}</h3>
        {message && <p style={{ fontSize:13, color:"rgba(255,255,255,.6)", textAlign:"center", marginBottom:6, lineHeight:1.65 }}>{message}</p>}
        {sub     && <p style={{ fontSize:11, color:"rgba(255,255,255,.3)", textAlign:"center", marginBottom:20 }}>{sub}</p>}
        {children}
        {!children && (
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button className="btn btn-w" style={{ flex:1, padding:"12px" }} onClick={onCancel}>Cancel</button>
            <button className="btn" style={{ flex:1, padding:"12px", background: danger ? RED : P, color:W }} onClick={onConfirm}>{confirmLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── SIDEBAR ── */
const NAV = [
  { id:"overview",   icon:"📊", label:"Overview"    },
  { id:"prospects",  icon:"🎯", label:"Pipeline"    },
  { id:"businesses", icon:"🏪", label:"Businesses"  },
  { id:"customers",  icon:"👥", label:"Customers"   },
  { id:"finance",    icon:"💰", label:"Finance"     },
  { id:"reviews",    icon:"⭐", label:"Reviews"     },
  { id:"disputes",   icon:"⚠️",  label:"Disputes"    },
  { id:"waitlist",   icon:"📝", label:"Waitlist"    },
  { id:"messages",   icon:"💬", label:"Messages"    },
  { id:"promos",     icon:"🏷️", label:"Promos"      },
  { id:"partners",   icon:"🤝", label:"Partners"    },
  { id:"alerts",     icon:"🔔", label:"Alerts"      },
  { id:"audit",      icon:"📋", label:"Audit Log"   },
  { id:"settings",   icon:"⚙️", label:"Settings"    },
];

function Sidebar({ active, setActive }) {
  return (
    <div style={{ background:"#13131f", borderRadius:20, padding:16, border:"1px solid rgba(255,255,255,.06)", position:"sticky", top:80, maxHeight:"calc(100vh - 100px)", overflowY:"auto" }}>
      <div style={{ textAlign:"center", marginBottom:20, paddingBottom:16, borderBottom:"1px solid rgba(255,255,255,.08)" }}>
        <div style={{ width:44, height:44, borderRadius:12, background:P, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px", position:"relative" }}>
          <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:9, height:9, borderRadius:"50%", background:W }} />
          <span style={{ color:W, fontWeight:900, fontSize:20 }}>S</span>
        </div>
        <div style={{ fontWeight:800, fontSize:13, color:W }}>Super Admin</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginTop:4 }}>
          <div className="live-dot" style={{ width:6, height:6 }} />
          <span style={{ fontSize:10, color:"#4ade80" }}>Live</span>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(n => (
          <button key={n.id} className={`nav-item ${active===n.id?"active":""}`} onClick={() => setActive(n.id)}>
            <span style={{ fontSize:15 }}>{n.icon}</span>{n.label}
          </button>
        ))}
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", marginTop:8, paddingTop:8 }}>
          <a href="/" style={{ textDecoration:"none" }}><button className="nav-item"><span>🌐</span>View Site</button></a>
          <button className="nav-item" style={{ color:"#f87171" }} onClick={async()=>{ await supabase.auth.signOut(); window.location.href="/"; }}>
            <span>🚪</span>Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── OVERVIEW ── */
function Overview({ businesses, profiles, subscriptions, alerts, setActive }) {
  const revenue = subscriptions.reduce((a,s)=>a+parseFloat(s.monthly_price||0)*0.05,0);
  const stats = [
    { label:"Businesses",     val:businesses.length,                              icon:"🏪", color:P          },
    { label:"Customers",      val:profiles.filter(p=>p.role==="customer").length, icon:"👥", color:"#22c55e"  },
    { label:"Subscriptions",  val:subscriptions.length,                           icon:"💳", color:"#f59e0b"  },
    { label:"Revenue (5%)",   val:`£${revenue.toFixed(2)}`,                       icon:"💰", color:"#8b5cf6"  },
  ];
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:20, color:W }}>Platform Overview</h2>
        <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(34,197,94,.12)", borderRadius:100, padding:"3px 10px" }}>
          <div className="live-dot" style={{ width:6, height:6 }} />
          <span style={{ fontSize:11, color:"#4ade80", fontWeight:700 }}>Live</span>
        </div>
      </div>

      <div className="stats-4 fu" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {stats.map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", marginBottom:3 }}>{s.label}</div>
            <div style={{ fontWeight:900, fontSize:24, color:s.color, letterSpacing:"-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* ALERTS PREVIEW */}
      {alerts.length > 0 && (
        <div className="card fu d1" style={{ marginBottom:16, borderColor:"rgba(245,158,11,.3)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <h3 style={{ fontWeight:700, fontSize:14, color:"#fbbf24" }}>🔔 {alerts.length} Alert{alerts.length>1?"s":""} Need Attention</h3>
            <button className="btn btn-w" style={{ fontSize:11 }} onClick={()=>setActive("alerts")}>View All</button>
          </div>
          {alerts.slice(0,3).map((a,i)=>(
            <div key={i} style={{ padding:"8px 0", borderBottom: i<2?"1px solid rgba(255,255,255,.05)":"none", fontSize:13, color:"rgba(255,255,255,.7)" }}>
              {a.icon} {a.message}
            </div>
          ))}
        </div>
      )}

      {/* RECENT */}
      <div className="card fu d2" style={{ marginBottom:16 }}>
        <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Recently Joined Businesses</h3>
        {businesses.slice(0,5).map((b,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<4?"1px solid rgba(255,255,255,.05)":"none" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:W }}>{b.business_name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{b.category} · {b.city}</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <span className={`badge ${b.is_active?"bg":"br"}`}>{b.is_active?"Active":"Hidden"}</span>
              {b.tier==="partner" && <span className="badge bp">Partner</span>}
            </div>
          </div>
        ))}
        {businesses.length===0 && <div style={{ color:"rgba(255,255,255,.3)", fontSize:13 }}>No businesses yet</div>}
      </div>

      <div className="card fu d3">
        <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Platform Summary</h3>
        <div className="stats-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { label:"Partner Tier", val:businesses.filter(b=>b.tier==="partner").length },
            { label:"Verified",     val:businesses.filter(b=>b.is_verified).length      },
            { label:"Active",       val:businesses.filter(b=>b.is_active).length        },
          ].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:10, padding:14, textAlign:"center" }}>
              <div style={{ fontWeight:900, fontSize:22, color:P }}>{s.val}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── BUSINESSES ── */
function Businesses({ businesses, onRefresh, addAudit }) {
  const [search, setSearch]   = useState("");
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy]       = useState(null);
  const [showRemoved, setShowRemoved] = useState(false);

  const list = businesses
    .filter(b => showRemoved ? true : !isRemoved(b))
    .filter(b =>
      b.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.city?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
    );

  const softRemove = async () => {
    setBusy(confirm.id);
    await supabase.from("businesses").update({ is_active:false, slug:`removed-${confirm.id.slice(0,8)}` }).eq("id",confirm.id);
    addAudit(`Removed business: ${confirm.name}`);
    setConfirm(null); setBusy(null); onRefresh();
  };

  const restore = async b => {
    setBusy(b.id);
    const slug = b.business_name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
    await supabase.from("businesses").update({ is_active:true, slug }).eq("id",b.id);
    addAudit(`Restored business: ${b.business_name}`);
    setBusy(null); onRefresh();
  };

  const toggleActive = async (b) => {
    setBusy(b.id);
    await supabase.from("businesses").update({ is_active:!b.is_active }).eq("id",b.id);
    addAudit(`${b.is_active?"Suspended":"Activated"} business: ${b.business_name}`);
    setBusy(null); onRefresh();
  };

  const toggleVerified = async (b) => {
    setBusy(b.id);
    await supabase.from("businesses").update({ is_verified:!b.is_verified }).eq("id",b.id);
    addAudit(`${b.is_verified?"Unverified":"Verified"} business: ${b.business_name}`);
    setBusy(null); onRefresh();
  };

  const setTier = async (id, tier, name) => {
    await supabase.from("businesses").update({ tier }).eq("id",id);
    addAudit(`Changed tier for ${name} → ${tier}`);
    onRefresh();
  };

  return (
    <div>
      {confirm && (
        <Modal title="Remove from Platform?"
          message={`"${confirm.name}" will be hidden from SubSeat and their profile URL deactivated.`}
          sub="All data — services, staff, subscribers and history — stays safely in the database and can be restored anytime."
          confirmLabel="Yes, Remove" danger
          onConfirm={softRemove} onCancel={()=>setConfirm(null)} />
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontWeight:800, fontSize:20, color:W }}>Businesses ({businesses.length})</h2>
        <button className="btn btn-w" style={{ fontSize:11 }} onClick={()=>setShowRemoved(!showRemoved)}>
          {showRemoved?"Hide Removed":"Show Removed"}
        </button>
      </div>

      <input className="inp" placeholder="Search by name, city or category..." value={search} onChange={e=>setSearch(e.target.value)} style={{ marginBottom:16 }} />

      {list.length===0 && <div className="card" style={{ textAlign:"center", padding:"32px 0", color:"rgba(255,255,255,.3)", fontSize:13 }}>No businesses found</div>}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {list.map(b=>(
          <div key={b.id} className="biz-card-mob" style={{ opacity:isRemoved(b)?.6:1 }}>
            {/* TOP ROW */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:W, marginBottom:3 }}>{b.business_name}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,.45)", textTransform:"capitalize" }}>{b.category?.replace(/-/g," ")}</span>
                  {b.city && <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>· {b.city}</span>}
                </div>
              </div>
              <div style={{ display:"flex", gap:5, flexShrink:0, flexWrap:"wrap" }}>
                {isRemoved(b)
                  ? <span className="badge br">Removed</span>
                  : <span className={`badge ${b.is_active?"bg":"br"}`}>{b.is_active?"Active":"Suspended"}</span>
                }
                {b.is_verified && !isRemoved(b) && <span className="badge bp">✓</span>}
                {b.tier==="partner" && <span className="badge bp">Partner</span>}
              </div>
            </div>

            {/* TIER SELECTOR */}
            {!isRemoved(b) && (
              <div style={{ marginBottom:10 }}>
                <select value={b.tier||"basic"} onChange={e=>setTier(b.id,e.target.value,b.business_name)}
                  style={{ width:"100%", background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", borderRadius:8, padding:"9px 12px", color:W, fontFamily:"Poppins", fontSize:13, cursor:"pointer", outline:"none" }}>
                  <option value="basic">Basic Tier</option>
                  <option value="partner">Partner Tier</option>
                  <option value="enterprise">Enterprise Tier</option>
                </select>
              </div>
            )}

            {/* ACTIONS */}
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              {isRemoved(b) ? (
                <button className="btn btn-g" onClick={()=>restore(b)} disabled={busy===b.id} style={{ flex:1, padding:"10px" }}>Restore</button>
              ) : (
                <>
                  <button className="btn btn-w" onClick={()=>toggleActive(b)} disabled={busy===b.id} style={{ flex:1, padding:"10px" }}>
                    {b.is_active?"Suspend":"Activate"}
                  </button>
                  <button className="btn btn-pu" onClick={()=>toggleVerified(b)} disabled={busy===b.id} style={{ flex:1, padding:"10px" }}>
                    {b.is_verified?"Unverify":"Verify ✓"}
                  </button>
                  <a href={`/${b.category}/${b.slug}`} target="_blank" style={{ textDecoration:"none", flex:1 }}>
                    <button className="btn btn-w" style={{ width:"100%", padding:"10px" }}>View</button>
                  </a>
                  <button className="btn btn-r" onClick={()=>setConfirm({id:b.id,name:b.business_name})} disabled={busy===b.id} style={{ flex:1, padding:"10px" }}>Remove</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CUSTOMERS ── */
function Customers({ profiles }) {
  const [search, setSearch] = useState("");
  const list = profiles.filter(p=>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>All Users ({profiles.length})</h2>
      <input className="inp" placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} style={{ marginBottom:16 }} />
      <div style={{ background:"#1a1a2e", borderRadius:14, border:"1px solid rgba(255,255,255,.08)", overflow:"hidden" }}>
        <div className="trow" style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr", background:"rgba(255,255,255,.04)" }}>
          {["Name","Email","Role","Joined"].map(h=>(
            <div key={h} style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
          ))}
        </div>
        {list.length===0 && <div style={{ textAlign:"center", padding:"32px 0", color:"rgba(255,255,255,.3)", fontSize:13 }}>No users found</div>}
        {list.map(p=>(
          <div key={p.id} className="trow" style={{ gridTemplateColumns:"2fr 2fr 1fr 1fr" }}>
            <div style={{ fontWeight:600, fontSize:13, color:W }}>{p.full_name||"—"}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", wordBreak:"break-all" }}>{p.email}</div>
            <div><span className={`badge ${p.role==="business"?"bp":"bg"}`}>{p.role||"customer"}</span></div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{fmtDate(p.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FINANCE ── */
function Finance({ businesses, subscriptions }) {
  const gross = subscriptions.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
  const fee   = gross * 0.05;
  const vat   = fee   * 0.20;
  const net   = fee   - vat;

  const exportCSV = () => {
    const rows = [["Business","Subscribers","Revenue","SubSeat Fee (5%)","VAT (20%)"]];
    businesses.forEach(b => {
      const bizSubs = subscriptions.filter(s=>s.business_id===b.id);
      const rev     = bizSubs.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
      rows.push([b.business_name, bizSubs.length, `£${rev.toFixed(2)}`, `£${(rev*.05).toFixed(2)}`, `£${(rev*.05*.2).toFixed(2)}`]);
    });
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a   = document.createElement("a");
    a.href    = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    a.download= `subseat-finance-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontWeight:800, fontSize:20, color:W }}>Finance & Commission</h2>
        <button className="btn btn-p" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      <div className="stats-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Gross Volume",    val:`£${gross.toFixed(2)}`, sub:"All subscription revenue", color:"#22c55e" },
          { label:"Platform Fee 5%", val:`£${fee.toFixed(2)}`,   sub:"SubSeat commission",       color:P         },
          { label:"VAT 20%",         val:`£${vat.toFixed(2)}`,   sub:"Payable to HMRC",          color:"#f59e0b" },
          { label:"Net Revenue",     val:`£${net.toFixed(2)}`,   sub:"After VAT",                color:"#8b5cf6" },
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</div>
            <div style={{ fontWeight:900, fontSize:22, color:s.color, letterSpacing:"-0.5px", marginBottom:2 }}>{s.val}</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Per Business Breakdown</h3>
        <div className="trow" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr", background:"rgba(255,255,255,.04)", borderRadius:"8px 8px 0 0" }}>
          {["Business","Subs","Revenue","Fee"].map(h=>(
            <div key={h} style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
          ))}
        </div>
        {businesses.length===0 && <div style={{ textAlign:"center", padding:"24px 0", color:"rgba(255,255,255,.3)", fontSize:13 }}>No businesses yet</div>}
        {businesses.map(b=>{
          const bizSubs = subscriptions.filter(s=>s.business_id===b.id);
          const rev     = bizSubs.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
          return (
            <div key={b.id} className="trow" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr" }}>
              <div style={{ fontWeight:600, fontSize:13, color:W }}>{b.business_name}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>{bizSubs.length}</div>
              <div style={{ fontSize:12, color:"#4ade80" }}>£{rev.toFixed(2)}</div>
              <div style={{ fontSize:12, color:P }}>£{(rev*.05).toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── REVIEWS ── */
function Reviews({ reviews, onRefresh, addAudit }) {
  const [busy, setBusy] = useState(null);
  const toggle = async (r) => {
    setBusy(r.id);
    await supabase.from("reviews").update({ is_visible:!r.is_visible }).eq("id",r.id);
    addAudit(`${r.is_visible?"Hidden":"Showed"} review #${r.id.slice(0,6)}`);
    setBusy(null); onRefresh();
  };
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Review Moderation ({reviews.length})</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {reviews.length===0 && <div className="card" style={{ textAlign:"center", padding:"40px 0", color:"rgba(255,255,255,.3)" }}>No reviews yet</div>}
        {reviews.map(r=>(
          <div key={r.id} className="card" style={{ opacity:r.is_visible?1:.5 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, gap:10 }}>
              <div>
                <div style={{ display:"flex", gap:2, marginBottom:4 }}>
                  {[1,2,3,4,5].map(i=><span key={i} style={{ color:i<=r.rating?"#f59e0b":"rgba(255,255,255,.2)", fontSize:14 }}>★</span>)}
                  <span style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginLeft:6 }}>{fmtDate(r.created_at)}</span>
                </div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", lineHeight:1.5 }}>{r.comment||"No comment"}</div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <span className={`badge ${r.is_visible?"bg":"br"}`}>{r.is_visible?"Visible":"Hidden"}</span>
                <button className={`btn ${r.is_visible?"btn-r":"btn-g"}`} onClick={()=>toggle(r)} disabled={busy===r.id} style={{ fontSize:11 }}>
                  {r.is_visible?"Hide":"Show"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── DISPUTES ── */
function Disputes({ disputes, onRefresh, addAudit }) {
  const resolve = async (id) => {
    await supabase.from("disputes").update({ status:"resolved" }).eq("id",id);
    addAudit(`Resolved dispute #${id.slice(0,6)}`);
    onRefresh();
  };
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Disputes & Support ({disputes.length})</h2>
      {disputes.length===0 ? (
        <div className="card" style={{ textAlign:"center", padding:"48px 0" }}>
          <div style={{ fontSize:44, marginBottom:10 }}>✅</div>
          <div style={{ fontWeight:700, fontSize:16, color:W, marginBottom:6 }}>No open disputes</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.4)" }}>All clear — platform is running smoothly.</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {disputes.map(d=>(
            <div key={d.id} className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <span className={`badge ${d.status==="open"?"br":d.status==="resolved"?"bg":"bo"}`}>{d.status}</span>
                    <span style={{ fontWeight:700, fontSize:13, color:W, textTransform:"capitalize" }}>{d.category?.replace(/_/g," ")}</span>
                    <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{fmtDate(d.created_at)}</span>
                  </div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", lineHeight:1.5 }}>{d.description}</div>
                </div>
                {d.status==="open" && (
                  <button className="btn btn-g" style={{ fontSize:11 }} onClick={()=>resolve(d.id)}>Mark Resolved</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── WAITLIST ── */
function Waitlist({ waitlist, onRefresh, addAudit }) {
  const [busy, setBusy] = useState(null);
  const approve = async (w) => {
    setBusy(w.id);
    await supabase.from("waitlist").update({ status:"converted" }).eq("id",w.id);
    addAudit(`Approved waitlist entry: ${w.id.slice(0,6)}`);
    setBusy(null); onRefresh();
  };
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Waitlist Manager ({waitlist.length})</h2>
      {waitlist.length===0 ? (
        <div className="card" style={{ textAlign:"center", padding:"48px 0" }}>
          <div style={{ fontSize:44, marginBottom:10 }}>📝</div>
          <div style={{ fontWeight:700, fontSize:16, color:W, marginBottom:6 }}>No waitlist entries</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.4)" }}>Businesses who request early access will appear here.</div>
        </div>
      ) : (
        <div style={{ background:"#1a1a2e", borderRadius:14, border:"1px solid rgba(255,255,255,.08)", overflow:"hidden" }}>
          <div className="trow" style={{ gridTemplateColumns:"2fr 1fr 1fr auto", background:"rgba(255,255,255,.04)" }}>
            {["Entry","Date","Status","Action"].map(h=>(
              <div key={h} style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
            ))}
          </div>
          {waitlist.map(w=>(
            <div key={w.id} className="trow" style={{ gridTemplateColumns:"2fr 1fr 1fr auto" }}>
              <div style={{ fontWeight:600, fontSize:13, color:W }}>#{w.id.slice(0,8)}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>{fmtDate(w.created_at)}</div>
              <span className={`badge ${w.status==="waiting"?"bo":w.status==="converted"?"bg":"bw"}`}>{w.status}</span>
              {w.status==="waiting" && (
                <button className="btn btn-g" style={{ fontSize:11 }} onClick={()=>approve(w)} disabled={busy===w.id}>Approve</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── MESSAGES ── */
function Messages({ profiles }) {
  const [to, setTo]       = useState("all");
  const [channel, setChannel] = useState("email");
  const [template, setTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody]   = useState("");
  const [sent, setSent]   = useState(false);

  const templates = {
    welcome: { subject:"Welcome to SubSeat! 🎉", body:"Hi there,\n\nWelcome to SubSeat — the UK's subscription booking platform for beauty and wellness professionals.\n\nYour profile is live and ready to share.\n\nBest,\nThe SubSeat Team" },
    update:  { subject:"Important update from SubSeat", body:"Hi there,\n\nWe wanted to let you know about some important updates to the platform.\n\nBest,\nThe SubSeat Team" },
    warning: { subject:"Action required — SubSeat account", body:"Hi there,\n\nWe've noticed an issue with your SubSeat account that requires your attention.\n\nPlease log in and review your profile.\n\nBest,\nThe SubSeat Team" },
  };

  const loadTemplate = (key) => {
    if (!key) return;
    setTemplate(key);
    setSubject(templates[key].subject);
    setBody(templates[key].body);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(()=>setSent(false), 3000);
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Message Centre</h2>
      <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Compose Message</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Load Template</label>
              <select className="inp" value={template} onChange={e=>loadTemplate(e.target.value)}>
                <option value="">— Select template —</option>
                <option value="welcome">Welcome message</option>
                <option value="update">Platform update</option>
                <option value="warning">Account warning</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Send To</label>
              <select className="inp" value={to} onChange={e=>setTo(e.target.value)}>
                <option value="all">All users</option>
                <option value="businesses">All businesses</option>
                <option value="customers">All customers</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Channel</label>
              <div style={{ display:"flex", gap:8 }}>
                {["email","whatsapp"].map(c=>(
                  <button key={c} className={`btn ${channel===c?"btn-p":"btn-w"}`} onClick={()=>setChannel(c)} style={{ textTransform:"capitalize" }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Subject</label>
              <input className="inp" placeholder="Message subject..." value={subject} onChange={e=>setSubject(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Message</label>
              <textarea className="inp" rows={5} placeholder="Type your message..." value={body} onChange={e=>setBody(e.target.value)} style={{ resize:"vertical" }} />
            </div>
            <button className="btn btn-p" onClick={handleSend} disabled={!subject||!body} style={{ padding:"12px" }}>
              {sent ? "✅ Message Queued!" : `Send via ${channel}`}
            </button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Recipients Preview</h3>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginBottom:12 }}>
            Sending to: <strong style={{ color:W }}>{to==="all"?profiles.length:to==="businesses"?profiles.filter(p=>p.role==="business").length:profiles.filter(p=>p.role!=="business").length}</strong> users
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:300, overflowY:"auto" }}>
            {profiles.filter(p=>to==="all"?true:to==="businesses"?p.role==="business":p.role!=="business").slice(0,10).map(p=>(
              <div key={p.id} style={{ fontSize:12, color:"rgba(255,255,255,.5)", padding:"6px 10px", background:"rgba(255,255,255,.04)", borderRadius:8 }}>
                {p.full_name||"—"} · {p.email}
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:10 }}>Note: Actual sending requires WhatsApp/email integration (Resend + Twilio)</div>
        </div>
      </div>
    </div>
  );
}

/* ── PROMO CODES ── */
function Promos() {
  const [promos, setPromos] = useState([]);
  const [form, setForm]     = useState({ code:"", type:"percent", value:"", expires:"", limit:"" });
  const [saved, setSaved]   = useState(false);

  const addPromo = () => {
    if (!form.code||!form.value) return;
    setPromos(prev=>[...prev, { ...form, id:Date.now(), uses:0, created:new Date().toISOString() }]);
    setForm({ code:"", type:"percent", value:"", expires:"", limit:"" });
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  const removePromo = id => setPromos(prev=>prev.filter(p=>p.id!==id));

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Promo Codes & Offers</h2>
      <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Create Promo Code</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Code</label>
              <input className="inp" placeholder="e.g. LAUNCH50" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Type</label>
                <select className="inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option value="percent">% Off</option>
                  <option value="flat">£ Off</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Value</label>
                <input className="inp" type="number" placeholder={form.type==="percent"?"20":""} value={form.value} onChange={e=>setForm({...form,value:e.target.value})} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Expiry Date</label>
                <input className="inp" type="date" value={form.expires} onChange={e=>setForm({...form,expires:e.target.value})} />
              </div>
              <div>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>Usage Limit</label>
                <input className="inp" type="number" placeholder="100" value={form.limit} onChange={e=>setForm({...form,limit:e.target.value})} />
              </div>
            </div>
            <button className="btn btn-p" onClick={addPromo} style={{ padding:"12px" }}>
              {saved?"✅ Code Created!":"Create Promo Code"}
            </button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Active Codes ({promos.length})</h3>
          {promos.length===0 ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:"rgba(255,255,255,.3)", fontSize:13 }}>No promo codes yet</div>
          ) : promos.map(p=>(
            <div key={p.id} style={{ padding:"12px", background:"rgba(255,255,255,.04)", borderRadius:10, marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:15, color:P, letterSpacing:1 }}>{p.code}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>
                    {p.type==="percent"?`${p.value}% off`:`£${p.value} off`}
                    {p.expires && ` · Expires ${fmtDate(p.expires)}`}
                    {p.limit && ` · Limit: ${p.limit}`}
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:2 }}>Used: {p.uses} times</div>
                </div>
                <button className="btn btn-r" style={{ fontSize:11 }} onClick={()=>removePromo(p.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PARTNERS ── */
function Partners({ businesses }) {
  const partners = businesses.filter(b=>b.tier==="partner");
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:8 }}>Partner Seat Management</h2>
      <p style={{ fontSize:13, color:"rgba(255,255,255,.4)", marginBottom:16 }}>Businesses on the founding Partner Seat plan (£39.99 one-time fee)</p>

      <div className="stats-3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Partners",     val:partners.length,                                       color:P         },
          { label:"Founding Revenue",   val:`£${(partners.length*39.99).toFixed(2)}`,              color:"#22c55e" },
          { label:"Monthly (post-launch)",val:`£${(partners.length*19).toFixed(2)}/mo projected`,  color:"#f59e0b" },
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{ fontWeight:900, fontSize:22, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#1a1a2e", borderRadius:14, border:"1px solid rgba(255,255,255,.08)", overflow:"hidden" }}>
        <div className="trow" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr", background:"rgba(255,255,255,.04)" }}>
          {["Business","City","Joined","Status"].map(h=>(
            <div key={h} style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.35)", textTransform:"uppercase", letterSpacing:0.5 }}>{h}</div>
          ))}
        </div>
        {partners.length===0 && <div style={{ textAlign:"center", padding:"32px 0", color:"rgba(255,255,255,.3)", fontSize:13 }}>No Partner businesses yet</div>}
        {partners.map(b=>(
          <div key={b.id} className="trow" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr" }}>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:W }}>{b.business_name}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>{b.category}</div>
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.6)" }}>{b.city||"—"}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>{fmtDate(b.created_at)}</div>
            <span className={`badge ${b.is_active?"bg":"br"}`}>{b.is_active?"Active":"Inactive"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ALERTS ── */
function Alerts({ alerts }) {
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Notifications & Alerts</h2>
      {alerts.length===0 ? (
        <div className="card" style={{ textAlign:"center", padding:"48px 0" }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🔔</div>
          <div style={{ fontWeight:700, fontSize:16, color:W, marginBottom:6 }}>All clear!</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.4)" }}>No alerts right now. The platform is running smoothly.</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {alerts.map((a,i)=>(
            <div key={i} className="card" style={{ borderColor: a.priority==="high"?"rgba(239,68,68,.4)":"rgba(245,158,11,.25)" }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ fontSize:24, flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:W, marginBottom:3 }}>{a.message}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,.4)" }}>{a.time}</div>
                </div>
                <span className={`badge ${a.priority==="high"?"br":"bo"}`}>{a.priority}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AUDIT LOG ── */
function AuditLog({ log }) {
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Audit Log</h2>
      <div className="card">
        {log.length===0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(255,255,255,.3)", fontSize:13 }}>No admin actions logged yet in this session.</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {[...log].reverse().map((entry,i)=>(
              <div key={i} style={{ display:"flex", gap:14, padding:"10px 0", borderBottom:i<log.length-1?"1px solid rgba(255,255,255,.05)":"none", alignItems:"flex-start" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:P, marginTop:5, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:W }}>{entry.action}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginTop:2 }}>{entry.time} · Admin</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ fontSize:11, color:"rgba(255,255,255,.25)", marginTop:12 }}>Note: Log persists for this session. Permanent audit logging requires a database table.</div>
      </div>
    </div>
  );
}

/* ── SETTINGS ── */
function Settings({ addAudit }) {
  const [settings, setSettings] = useState({
    commission: "5", marketplace: "1", maintenance: false,
    banner: "", bannerActive: false, signupsOpen: true,
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    addAudit("Updated platform settings");
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };

  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Platform Settings</h2>
      <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Commission Rates</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { label:"Platform Commission (%)", key:"commission", hint:"Currently 5% + VAT on subscriptions" },
              { label:"Marketplace Fee (%)",     key:"marketplace",hint:"Currently 1% on marketplace transactions" },
            ].map(f=>(
              <div key={f.key}>
                <label style={{ fontSize:12, color:"rgba(255,255,255,.5)", display:"block", marginBottom:5 }}>{f.label}</label>
                <input className="inp" type="number" value={settings[f.key]} onChange={e=>setSettings({...settings,[f.key]:e.target.value})} />
                <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:4 }}>{f.hint}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Platform Controls</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { label:"Allow New Sign Ups",  key:"signupsOpen",   desc:"Toggle to close registrations" },
              { label:"Maintenance Mode",    key:"maintenance",   desc:"Hides site and shows maintenance page" },
              { label:"Banner Announcement", key:"bannerActive",  desc:"Shows a banner at top of site" },
            ].map(s=>(
              <div key={s.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:W }}>{s.label}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{s.desc}</div>
                </div>
                <div onClick={()=>setSettings({...settings,[s.key]:!settings[s.key]})}
                  style={{ width:44, height:24, borderRadius:100, background:settings[s.key]?P:"rgba(255,255,255,.15)", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                  <div style={{ position:"absolute", top:3, left:settings[s.key]?23:3, width:18, height:18, borderRadius:"50%", background:W, transition:"left .2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ gridColumn:"1 / -1" }}>
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:10 }}>Announcement Banner</h3>
          <input className="inp" placeholder="e.g. 🎉 SubSeat is now live — sign up for free!" value={settings.banner} onChange={e=>setSettings({...settings,banner:e.target.value})} style={{ marginBottom:14 }} />
          <button className="btn btn-p" onClick={save} style={{ padding:"12px 24px" }}>
            {saved?"✅ Settings Saved!":"Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── ANALYTICS ── */
function Analytics({ businesses }) {
  const catCount  = businesses.reduce((a,b)=>{ a[b.category]=(a[b.category]||0)+1; return a; },{});
  const cityCount = businesses.reduce((a,b)=>{ if(b.city) a[b.city]=(a[b.city]||0)+1; return a; },{});
  return (
    <div>
      <h2 style={{ fontWeight:800, fontSize:20, color:W, marginBottom:16 }}>Platform Analytics</h2>
      <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>By Category</h3>
          {Object.entries(catCount).sort((a,b)=>b[1]-a[1]).map(([cat,count],i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:12, color:"rgba(255,255,255,.7)", textTransform:"capitalize" }}>{cat.replace(/-/g," ")}</span>
                <span style={{ fontSize:12, fontWeight:700, color:W }}>{count}</span>
              </div>
              <div style={{ height:5, background:"rgba(255,255,255,.08)", borderRadius:100, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(count/businesses.length)*100}%`, background:P, borderRadius:100 }} />
              </div>
            </div>
          ))}
          {Object.keys(catCount).length===0 && <div style={{ color:"rgba(255,255,255,.3)", fontSize:13 }}>No data yet</div>}
        </div>
        <div className="card">
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>By City</h3>
          {Object.entries(cityCount).sort((a,b)=>b[1]-a[1]).map(([city,count],i)=>(
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontSize:12, color:"rgba(255,255,255,.7)" }}>{city}</span>
                <span style={{ fontSize:12, fontWeight:700, color:W }}>{count}</span>
              </div>
              <div style={{ height:5, background:"rgba(255,255,255,.08)", borderRadius:100, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(count/businesses.length)*100}%`, background:"#22c55e", borderRadius:100 }} />
              </div>
            </div>
          ))}
          {Object.keys(cityCount).length===0 && <div style={{ color:"rgba(255,255,255,.3)", fontSize:13 }}>No data yet</div>}
        </div>
        <div className="card" style={{ gridColumn:"1 / -1" }}>
          <h3 style={{ fontWeight:700, fontSize:14, color:W, marginBottom:14 }}>Platform Health</h3>
          <div className="stats-4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {[
              { label:"Active Rate",  val:`${businesses.length>0?Math.round(businesses.filter(b=>b.is_active).length/businesses.length*100):0}%`, color:"#22c55e" },
              { label:"Verified Rate",val:`${businesses.length>0?Math.round(businesses.filter(b=>b.is_verified).length/businesses.length*100):0}%`, color:P         },
              { label:"Partner Rate", val:`${businesses.length>0?Math.round(businesses.filter(b=>b.tier==="partner").length/businesses.length*100):0}%`, color:"#f59e0b" },
              { label:"Avg Rating",   val:businesses.length>0?(businesses.reduce((a,b)=>a+parseFloat(b.rating||0),0)/businesses.length).toFixed(1):"—", color:"#f59e0b" },
            ].map((s,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:10, padding:14, textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:24, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function AdminPage() {
  const [loading, setLoading]         = useState(true);
  const [unauthorized, setUnauth]     = useState(false);
  const [active, setActive]           = useState("overview");
  const [businesses, setBusinesses]   = useState([]);
  const [profiles, setProfiles]       = useState([]);
  const [subscriptions, setSubs]      = useState([]);
  const [disputes, setDisputes]       = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [waitlist, setWaitlist]       = useState([]);
  const [auditLog, setAuditLog]       = useState([]);

  // Generate smart alerts based on live data
  const alerts = [
    businesses.filter(b=>!b.is_active&&!isRemoved(b)).length > 0 && {
      icon:"🏪", message:`${businesses.filter(b=>!b.is_active&&!isRemoved(b)).length} business(es) are inactive — review them`, priority:"medium", time:"Now"
    },
    disputes.filter(d=>d.status==="open").length > 0 && {
      icon:"⚠️", message:`${disputes.filter(d=>d.status==="open").length} open dispute(s) need attention`, priority:"high", time:"Now"
    },
    waitlist.filter(w=>w.status==="waiting").length > 0 && {
      icon:"📝", message:`${waitlist.filter(w=>w.status==="waiting").length} waitlist entries need approval`, priority:"medium", time:"Now"
    },
  ].filter(Boolean);

  const addAudit = (action) => {
    setAuditLog(prev=>[...prev, { action, time:`${new Date().toLocaleTimeString("en-GB")} ${new Date().toLocaleDateString("en-GB")}` }]);
  };

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) { setUnauth(true); setLoading(false); return; }
    await loadData();
  };

  const loadData = async () => {
    setLoading(true);
    const [{ data:bizs },{ data:profs },{ data:subs },{ data:disps },{ data:revs },{ data:wl }] = await Promise.all([
      supabase.from("businesses").select("*").order("created_at",{ ascending:false }),
      supabase.from("profiles").select("*").order("created_at",{ ascending:false }),
      supabase.from("subscriptions").select("*").eq("status","active"),
      supabase.from("disputes").select("*").order("created_at",{ ascending:false }),
      supabase.from("reviews").select("*").order("created_at",{ ascending:false }),
      supabase.from("waitlist").select("*").order("created_at",{ ascending:false }),
    ]);
    setBusinesses(bizs||[]); setProfiles(profs||[]); setSubs(subs||[]);
    setDisputes(disps||[]); setReviews(revs||[]); setWaitlist(wl||[]);
    setLoading(false);
  };

  const spinner = (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:14 }}>
        <div style={{ width:36, height:36, border:`3px solid rgba(86,59,231,.3)`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
        <div style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>Loading SubSeat Admin...</div>
      </div>
    </>
  );

  if (loading) return spinner;

  if (unauthorized) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:14, textAlign:"center", padding:20 }}>
        <div style={{ fontSize:56 }}>🔒</div>
        <h1 style={{ fontWeight:900, fontSize:26, color:W }}>Access Denied</h1>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, maxWidth:300 }}>This area is restricted to SubSeat administrators only.</p>
        <a href="/" style={{ background:P, color:W, textDecoration:"none", padding:"12px 24px", borderRadius:12, fontWeight:700, fontSize:14, fontFamily:"Poppins" }}>Back to SubSeat</a>
      </div>
    </>
  );

  const section = () => {
    const props = { businesses, profiles, subscriptions, disputes, reviews, waitlist, onRefresh:loadData, addAudit, setActive, alerts };
    switch(active) {
      case "overview":   return <Overview    {...props} />;
      case "prospects":  return <ProspectsCRM />;
      case "businesses": return <Businesses  {...props} />;
      case "customers":  return <Customers   {...props} />;
      case "finance":    return <Finance     {...props} />;
      case "reviews":    return <Reviews     {...props} />;
      case "disputes":   return <Disputes    {...props} />;
      case "waitlist":   return <Waitlist    {...props} />;
      case "messages":   return <Messages    {...props} />;
      case "promos":     return <Promos      {...props} />;
      case "partners":   return <Partners    {...props} />;
      case "alerts":     return <Alerts      alerts={alerts} />;
      case "audit":      return <AuditLog    log={auditLog} />;
      case "settings":   return <Settings    {...props} />;
      case "analytics":  return <Analytics   {...props} />;
      default:           return <Overview    {...props} />;
    }
  };

  return (
    <>
      <style>{css}</style>

      {/* TOP NAV */}
      <nav style={{ background:"#13131f", borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 16px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
            <div style={{ position:"absolute", right:-3, top:"50%", transform:"translateY(-50%)", width:8, height:8, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:15 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:14, color:W }}>SubSeat</span>
          <div style={{ background:"rgba(86,59,231,.3)", borderRadius:5, padding:"2px 6px", fontSize:9, fontWeight:700, color:"#a78bfa", letterSpacing:1 }}>ADMIN</div>
          {alerts.length>0 && (
            <button onClick={()=>setActive("alerts")} style={{ background:"#e53e3e", border:"none", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:W, cursor:"pointer" }}>
              {alerts.length}
            </button>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <div className="live-dot" style={{ width:6, height:6 }} />
            <span style={{ fontSize:11, color:"#4ade80", fontWeight:600 }}>Live</span>
          </div>
          <button className="btn btn-w" style={{ fontSize:11, padding:"8px 14px", minHeight:36 }} onClick={loadData}>↻</button>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="admin-grid" style={{ maxWidth:1400, margin:"0 auto", padding:"20px 16px", display:"grid", gridTemplateColumns:"200px 1fr", gap:20 }}>
        <div className="sidebar-wrap"><Sidebar active={active} setActive={setActive} /></div>
        <div className="main-wrap fu">{section()}</div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {NAV.map(n=>(
            <button key={n.id} className={`mob-btn ${active===n.id?"active":""}`} onClick={()=>setActive(n.id)}>
              <span className="icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}