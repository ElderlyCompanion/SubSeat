'use client';
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import ProspectsCRM from "../components/ProspectsCRM";

const P     = "#563BE7";
const W     = "#ffffff";
const RED   = "#e53e3e";
const GREEN = "#22c55e";
const ADMIN_EMAIL = "mrnicholson@hotmail.com";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { font-size:16px; -webkit-text-size-adjust:100%; }
  body { font-family:'Poppins',sans-serif; background:#0f0f1a; color:${W}; overflow-x:hidden; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes popIn   { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

  .fu { animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both }
  .d1 { animation-delay:.05s } .d2 { animation-delay:.1s }

  .nav-item {
    display:flex; align-items:center; gap:10px; padding:11px 14px;
    border-radius:10px; cursor:pointer; font-size:13px; font-weight:600;
    color:rgba(255,255,255,.5); transition:all .18s; border:none;
    background:transparent; font-family:'Poppins',sans-serif;
    width:100%; text-align:left; white-space:nowrap; min-height:44px;
  }
  .nav-item:hover  { background:rgba(255,255,255,.08); color:${W}; }
  .nav-item.active { background:${P}; color:${W}; }

  .card {
    background:#1a1a2e; border-radius:16px; padding:20px;
    border:1px solid rgba(255,255,255,.08); transition:border-color .2s;
  }
  .stat-card {
    background:#1a1a2e; border-radius:14px; padding:18px;
    border:1px solid rgba(255,255,255,.08); transition:all .2s; cursor:pointer;
  }
  .stat-card:hover { border-color:${P}; transform:translateY(-2px); }

  .badge { display:inline-block; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:700; white-space:nowrap; }
  .bg  { background:rgba(34,197,94,.15);  color:#4ade80; }
  .br  { background:rgba(239,68,68,.15);  color:#f87171; }
  .bp  { background:rgba(86,59,231,.3);   color:#a78bfa; }
  .bo  { background:rgba(245,158,11,.15); color:#fbbf24; }

  .btn {
    border:none; border-radius:9px; padding:10px 16px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:all .18s; min-height:44px;
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
  }
  .btn-p  { background:${P}; color:${W}; }
  .btn-p:hover { background:#4429d4; }
  .btn-g  { background:rgba(34,197,94,.15); color:#4ade80; border:1px solid rgba(34,197,94,.3); }
  .btn-r  { background:rgba(239,68,68,.15); color:#f87171; border:1px solid rgba(239,68,68,.3); }
  .btn-w  { background:rgba(255,255,255,.08); color:${W}; }
  .btn-w:hover { background:rgba(255,255,255,.14); }
  .btn-pu { background:rgba(86,59,231,.25); color:#a78bfa; }
  button:disabled { opacity:.4; cursor:not-allowed; }

  .inp {
    background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
    border-radius:10px; padding:12px 14px; color:${W};
    font-family:'Poppins',sans-serif; font-size:16px; outline:none; width:100%;
    transition:border-color .2s; min-height:44px;
  }
  .inp:focus { border-color:${P}; }
  .inp::placeholder { color:rgba(255,255,255,.3); }
  select.inp option { background:#1a1a2e; }
  textarea.inp { min-height:100px; resize:vertical; }

  .live-dot { width:8px; height:8px; border-radius:50%; background:${GREEN}; animation:pulse 2s infinite; flex-shrink:0; }

  .sheet-bg { position:fixed; inset:0; background:rgba(0,0,0,.8); z-index:9998; backdrop-filter:blur(4px); }
  .sheet {
    position:fixed; bottom:0; left:0; right:0; z-index:9999;
    background:#1a1a2e; border-radius:24px 24px 0 0;
    padding:24px 20px calc(env(safe-area-inset-bottom,0px) + 24px);
    animation:slideUp .3s cubic-bezier(.22,1,.36,1); max-height:90vh; overflow-y:auto;
  }
  .sheet-handle { width:40px; height:4px; border-radius:4px; background:rgba(255,255,255,.15); margin:0 auto 20px; }

  .modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,.85);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; backdrop-filter:blur(6px); padding:16px;
  }
  .modal-box {
    background:#1a1a2e; border-radius:20px; padding:28px; max-width:460px; width:100%;
    border:1px solid rgba(255,255,255,.12); animation:popIn .25s cubic-bezier(.22,1,.36,1);
  }

  .mobile-nav {
    display:none; position:fixed; bottom:0; left:0; right:0;
    background:#13131f; border-top:1px solid rgba(255,255,255,.08);
    padding:4px 2px env(safe-area-inset-bottom,8px);
    z-index:200; overflow-x:auto; -webkit-overflow-scrolling:touch;
  }
  .mobile-nav-inner { display:flex; gap:1px; min-width:max-content; padding:0 4px; }
  .mob-btn {
    display:flex; flex-direction:column; align-items:center; gap:2px;
    padding:6px 10px; border-radius:10px; border:none; background:transparent;
    font-family:'Poppins',sans-serif; font-size:9px; font-weight:700;
    color:rgba(255,255,255,.4); cursor:pointer; transition:all .18s;
    white-space:nowrap; min-height:52px; min-width:52px;
  }
  .mob-btn.active { background:${P}; color:${W}; }
  .mob-btn .icon  { font-size:19px; line-height:1; }

  .fab {
    position:fixed; bottom:80px; right:16px; z-index:150;
    width:56px; height:56px; border-radius:50%; background:${P};
    border:none; cursor:pointer; font-size:22px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 24px rgba(86,59,231,.5); transition:all .2s;
  }
  .fab:hover { transform:scale(1.1); }

  .search-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.9);
    z-index:500; backdrop-filter:blur(8px);
    display:flex; align-items:flex-start; justify-content:center; padding-top:80px; padding:80px 16px 16px;
  }
  .search-box { background:#1a1a2e; border-radius:20px; padding:20px; width:100%; max-width:600px; border:1px solid rgba(255,255,255,.15); }

  .trow { display:grid; padding:12px 14px; border-bottom:1px solid rgba(255,255,255,.05); align-items:center; transition:background .15s; }
  .trow:hover { background:rgba(255,255,255,.03); }
  .trow:last-child { border-bottom:none; }

  .biz-card { background:#1a1a2e; border-radius:14px; padding:16px; border:1px solid rgba(255,255,255,.08); margin-bottom:10px; }

  .admin-layout { display:grid; grid-template-columns:220px 1fr; min-height:calc(100vh - 60px); }
  .sidebar-inner { background:#13131f; border-right:1px solid rgba(255,255,255,.06); padding:16px; position:sticky; top:60px; height:calc(100vh - 60px); overflow-y:auto; }
  .main-content  { padding:24px; overflow-x:hidden; }

  @media(min-width:901px) { .mobile-nav{display:none!important} .fab{display:none!important} .mob-only{display:none!important} .main-content{padding-bottom:28px!important} }
  @media(max-width:900px)  { .admin-layout{grid-template-columns:1fr!important} .sidebar-inner{display:none!important} .mobile-nav{display:flex!important} .main-content{padding:16px 14px 120px!important} .stats-4{grid-template-columns:1fr 1fr!important} .stats-3{grid-template-columns:1fr 1fr!important} .two-col{grid-template-columns:1fr!important} .hide-mob{display:none!important} }
  @media(max-width:480px)  { .stats-4{grid-template-columns:1fr 1fr!important} .stats-3{grid-template-columns:1fr!important} .card{padding:14px} .stat-card{padding:14px} .main-content{padding:12px 10px 120px!important} }
`;

const isRemoved = b => b.slug?.startsWith("removed-");
const fmtDate   = d => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtGBP    = n => `£${Math.round(n).toLocaleString("en-GB")}`;

function useIsMobile() {
  const [mob, setMob] = useState(false);
  useEffect(()=>{ const c=()=>setMob(window.innerWidth<=900); c(); window.addEventListener("resize",c); return()=>window.removeEventListener("resize",c); },[]);
  return mob;
}

function ConfirmModal({ title, message, sub, confirmLabel="Confirm", danger=false, onConfirm, onCancel }) {
  const isMob = useIsMobile();
  const body = (
    <>
      {isMob && <div className="sheet-handle"/>}
      <div style={{fontSize:32,textAlign:"center",marginBottom:12}}>{danger?"⚠️":"❓"}</div>
      <h3 style={{fontWeight:800,fontSize:18,color:W,marginBottom:8,textAlign:"center"}}>{title}</h3>
      <p style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:sub?6:20,textAlign:"center",lineHeight:1.6}}>{message}</p>
      {sub&&<p style={{fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:20,textAlign:"center"}}>{sub}</p>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button className={`btn ${danger?"btn-r":"btn-p"}`} onClick={onConfirm} style={{padding:"14px",width:"100%",fontSize:15}}>{confirmLabel}</button>
        <button className="btn btn-w" onClick={onCancel} style={{padding:"14px",width:"100%",fontSize:15}}>Cancel</button>
      </div>
    </>
  );
  if(isMob) return <><div className="sheet-bg" onClick={onCancel}/><div className="sheet">{body}</div></>;
  return <div className="modal-bg"><div className="modal-box">{body}</div></div>;
}

const NAV = [
  {id:"overview",   icon:"📊",label:"Overview"},
  {id:"prospects",  icon:"🎯",label:"Pipeline"},
  {id:"businesses", icon:"🏪",label:"Businesses"},
  {id:"customers",  icon:"👥",label:"Customers"},
  {id:"finance",    icon:"💰",label:"Finance"},
  {id:"leaderboard",icon:"🏆",label:"Leaderboard"},
  {id:"cities",     icon:"🗺️",label:"Cities"},
  {id:"reviews",    icon:"⭐",label:"Reviews"},
  {id:"disputes",   icon:"⚠️", label:"Disputes"},
  {id:"messages",   icon:"💬",label:"Messages"},
  {id:"blast",      icon:"📧",label:"Email Blast"},
  {id:"promos",     icon:"🏷️",label:"Promos"},
  {id:"alerts",     icon:"🔔",label:"Alerts"},
  {id:"audit",      icon:"📋",label:"Audit Log"},
  {id:"settings",   icon:"⚙️", label:"Settings"},
  {id:"analytics",  icon:"📈",label:"Analytics"},
];

function Sidebar({ active, setActive }) {
  return (
    <div className="sidebar-inner">
      <div style={{fontWeight:800,fontSize:14,color:W,marginBottom:18,paddingBottom:14,borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:26,height:26,borderRadius:7,background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900}}>S</div>
        Super Admin
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        {NAV.map(n=>(
          <button key={n.id} className={`nav-item ${active===n.id?"active":""}`} onClick={()=>setActive(n.id)}>
            <span>{n.icon}</span><span>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GlobalSearch({ businesses, profiles, onClose }) {
  const [q,setQ]=useState("");
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  const biz=businesses.filter(b=>b.business_name?.toLowerCase().includes(q.toLowerCase())||b.city?.toLowerCase().includes(q.toLowerCase())).slice(0,5);
  const ppl=profiles.filter(p=>p.full_name?.toLowerCase().includes(q.toLowerCase())||p.email?.toLowerCase().includes(q.toLowerCase())).slice(0,5);
  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={e=>e.stopPropagation()}>
        <input ref={ref} className="inp" placeholder="🔍  Search businesses, customers..." value={q} onChange={e=>setQ(e.target.value)} style={{fontSize:16,marginBottom:14}}/>
        {q.length>1&&(
          <>
            {biz.length>0&&<><div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:1.5,marginBottom:8}}>BUSINESSES</div>{biz.map(b=><div key={b.id} style={{padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,.05)",marginBottom:6,cursor:"pointer"}} onClick={()=>window.open(`/${b.category}/${b.slug}`,"_blank")}><div style={{fontWeight:700,fontSize:14,color:W}}>{b.business_name}</div><div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{b.city} · {b.category}</div></div>)}</>}
            {ppl.length>0&&<><div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:1.5,marginBottom:8,marginTop:12}}>CUSTOMERS</div>{ppl.map(p=><div key={p.id} style={{padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,.05)",marginBottom:6}}><div style={{fontWeight:700,fontSize:14,color:W}}>{p.full_name||"—"}</div><div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{p.email}</div></div>)}</>}
            {biz.length===0&&ppl.length===0&&<div style={{textAlign:"center",padding:"24px 0",color:"rgba(255,255,255,.3)",fontSize:14}}>No results for "{q}"</div>}
          </>
        )}
        {q.length<=1&&<div style={{textAlign:"center",padding:"16px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>Start typing to search</div>}
      </div>
    </div>
  );
}

function Overview({ businesses, profiles, subscriptions, alerts, setActive }) {
  const active     = businesses.filter(b=>b.is_active&&!isRemoved(b));
  const activeSubs = subscriptions.filter(s=>s.status==="active");
  const mrr        = activeSubs.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
  const fee        = mrr*0.06;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontWeight:800,fontSize:22,color:W}}>Platform Overview</h2>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><div className="live-dot"/><span style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>Live</span></div>
        </div>
      </div>
      <div className="stats-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Active Businesses",val:active.length,icon:"🏪",color:"#a78bfa",tab:"businesses"},
          {label:"Total Customers",val:profiles.length,icon:"👥",color:"#34d399",tab:"customers"},
          {label:"Platform MRR",val:fmtGBP(mrr),icon:"💰",color:"#fbbf24",tab:"finance"},
          {label:"SubSeat Fees",val:fmtGBP(fee),icon:"📈",color:P,tab:"finance"},
        ].map((s,i)=>(
          <div key={i} className="stat-card" onClick={()=>setActive(s.tab)}>
            <div style={{fontSize:22,marginBottom:8}}>{s.icon}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:4}}>{s.label}</div>
            <div style={{fontWeight:900,fontSize:20,color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="stats-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Partner Businesses",val:businesses.filter(b=>b.tier==="partner").length,icon:"🤝",color:"#a78bfa",tab:"businesses"},
          {label:"Active Subscribers",val:activeSubs.length,icon:"👤",color:"#34d399",tab:"customers"},
          {label:"Annual Run Rate",val:fmtGBP(mrr*12),icon:"🚀",color:"#fbbf24",tab:"finance"},
        ].map((s,i)=>(
          <div key={i} className="stat-card" onClick={()=>setActive(s.tab)}>
            <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:4}}>{s.label}</div>
            <div style={{fontWeight:900,fontSize:20,color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>
      {alerts.length>0&&(
        <div className="card" style={{marginBottom:16,borderColor:"rgba(239,68,68,.3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{fontWeight:700,fontSize:14,color:W}}>🔔 Active Alerts ({alerts.length})</h3>
            <button className="btn btn-w" style={{fontSize:11,padding:"6px 12px",minHeight:36}} onClick={()=>setActive("alerts")}>View All</button>
          </div>
          {alerts.slice(0,2).map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:i<1?"1px solid rgba(255,255,255,.05)":"none"}}>
              <span style={{fontSize:18}}>{a.icon}</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,.7)",flex:1}}>{a.message}</span>
              <span className={`badge ${a.priority==="high"?"br":"bo"}`}>{a.priority}</span>
            </div>
          ))}
        </div>
      )}
      <div className="card">
        <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Quick Actions</h3>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{label:"🎯 New Prospect",tab:"prospects"},{label:"🏪 Businesses",tab:"businesses"},{label:"💬 Message",tab:"messages"},{label:"📧 Email Blast",tab:"blast"},{label:"⚠️ Disputes",tab:"disputes"},{label:"📈 Analytics",tab:"analytics"}].map((a,i)=>(
            <button key={i} className="btn btn-w" onClick={()=>setActive(a.tab)} style={{fontSize:13,flex:"1 1 auto",minWidth:130}}>{a.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Businesses({ businesses, onRefresh, addAudit }) {
  const [search,setSearch]=useState("");
  const [confirm,setConfirm]=useState(null);
  const [busy,setBusy]=useState(null);
  const [showRemoved,setShowRemoved]=useState(false);
  const list=businesses.filter(b=>showRemoved?true:!isRemoved(b)).filter(b=>b.business_name?.toLowerCase().includes(search.toLowerCase())||b.city?.toLowerCase().includes(search.toLowerCase())||b.category?.toLowerCase().includes(search.toLowerCase()));
  const adminAction = async (action, businessId, data={}) => {
    const { data:{ user } } = await supabase.auth.getUser();
    const res = await fetch("/api/admin-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, businessId, data, adminEmail: user?.email }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
  };

  const softRemove = async () => {
    setBusy(confirm.id);
    try {
      await adminAction("soft_remove", confirm.id);
      addAudit(`Removed: ${confirm.name}`);
    } catch(e) { console.error(e); }
    setConfirm(null); setBusy(null); onRefresh();
  };

  const restore = async b => {
    setBusy(b.id);
    const slug = b.business_name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
    try {
      await adminAction("restore", b.id, { slug });
      addAudit(`Restored: ${b.business_name}`);
    } catch(e) { console.error(e); }
    setBusy(null); onRefresh();
  };

  const toggleActive = async b => {
    setBusy(b.id);
    try {
      await adminAction("toggle_active", b.id, { is_active: !b.is_active });
      addAudit(`${b.is_active?"Suspended":"Activated"}: ${b.business_name}`);
    } catch(e) { console.error(e); }
    setBusy(null); onRefresh();
  };

  const toggleVerified = async b => {
    setBusy(b.id);
    try {
      await adminAction("toggle_verified", b.id, { is_verified: !b.is_verified });
      addAudit(`${b.is_verified?"Unverified":"Verified"}: ${b.business_name}`);
    } catch(e) { console.error(e); }
    setBusy(null); onRefresh();
  };

  const setTier = async (id, tier, name) => {
    try {
      await adminAction("set_tier", id, { tier });
      addAudit(`Tier → ${tier}: ${name}`);
    } catch(e) { console.error(e); }
    onRefresh();
  };
  return (
    <div>
      {confirm&&<ConfirmModal title="Remove Business?" message={`"${confirm.name}" will be hidden from SubSeat.`} sub="All data stays in the database and can be restored." confirmLabel="Yes, Remove" danger onConfirm={softRemove} onCancel={()=>setConfirm(null)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontWeight:800,fontSize:20,color:W}}>Businesses ({businesses.length})</h2>
        <button className="btn btn-w" style={{fontSize:12}} onClick={()=>setShowRemoved(!showRemoved)}>{showRemoved?"Hide Removed":"Show Removed"}</button>
      </div>
      <input className="inp" placeholder="🔍  Search name, city, category..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:14}}/>
      {list.length===0&&<div className="card" style={{textAlign:"center",padding:"32px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No businesses found</div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {list.map(b=>(
          <div key={b.id} className="biz-card" style={{opacity:isRemoved(b)?.6:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,color:W,marginBottom:4}}>{b.business_name}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,.45)",textTransform:"capitalize"}}>{b.category?.replace(/-/g," ")}</span>
                  {b.city&&<span style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>· {b.city}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",flexShrink:0}}>
                {isRemoved(b)?<span className="badge br">Removed</span>:<span className={`badge ${b.is_active?"bg":"br"}`}>{b.is_active?"Active":"Suspended"}</span>}
                {b.is_verified&&!isRemoved(b)&&<span className="badge bp">✓</span>}
                {b.tier==="founding"&&<span className="badge bo">🌟 Founding</span>}
                {b.tier==="partner"&&<span className="badge bp">Partner</span>}
              </div>
            </div>
            {!isRemoved(b)&&(
              <select value={b.tier||"basic"} onChange={e=>setTier(b.id,e.target.value,b.business_name)}
                style={{width:"100%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:8,padding:"10px 12px",color:W,fontFamily:"Poppins",fontSize:14,cursor:"pointer",outline:"none",marginBottom:10,minHeight:44}}>
                <option value="basic">Basic Tier</option>
                <option value="founding">Founding Business</option>
                <option value="partner">Partner Tier</option>
                <option value="enterprise">Enterprise Tier</option>
              </select>
            )}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {isRemoved(b)?(
                <button className="btn btn-g" onClick={()=>restore(b)} disabled={busy===b.id} style={{flex:1}}>Restore</button>
              ):(
                <>
                  <button className="btn btn-w" onClick={()=>toggleActive(b)} disabled={busy===b.id} style={{flex:1}}>{b.is_active?"Suspend":"Activate"}</button>
                  <button className="btn btn-pu" onClick={()=>toggleVerified(b)} disabled={busy===b.id} style={{flex:1}}>{b.is_verified?"Unverify":"Verify ✓"}</button>
                  <a href={`/${b.category}/${b.slug}`} target="_blank" style={{textDecoration:"none",flex:1}}><button className="btn btn-w" style={{width:"100%"}}>View →</button></a>
                  <button className="btn btn-r" onClick={()=>setConfirm({id:b.id,name:b.business_name})} disabled={busy===b.id} style={{flex:1}}>Remove</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Customers({ profiles }) {
  const [search,setSearch]=useState("");
  const list=profiles.filter(p=>p.full_name?.toLowerCase().includes(search.toLowerCase())||p.email?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:14}}>Customers ({profiles.length})</h2>
      <input className="inp" placeholder="🔍  Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:14}}/>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        {list.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No customers found</div>}
        {list.map((p,i)=>(
          <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:i<list.length-1?"1px solid rgba(255,255,255,.05)":"none"}}>
            <div>
              <div style={{fontWeight:600,fontSize:13,color:W}}>{p.full_name||"—"}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{p.email}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span className={`badge ${p.role==="business"?"bp":"bg"}`}>{p.role||"customer"}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,.25)"}}>{fmtDate(p.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Finance({ businesses, subscriptions }) {
  const activeSubs=subscriptions.filter(s=>s.status==="active");
  const mrr=activeSubs.reduce((a,s)=>a+parseFloat(s.monthly_price||0),0);
  const fee=mrr*0.06;
  const byBiz=businesses.map(b=>({...b,subs:subscriptions.filter(s=>s.business_id===b.id),rev:subscriptions.filter(s=>s.business_id===b.id).reduce((a,s)=>a+parseFloat(s.monthly_price||0),0)})).filter(b=>b.subs.length>0).sort((a,b)=>b.rev-a.rev);
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Finance</h2>
      <div className="stats-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Platform MRR",val:fmtGBP(mrr),icon:"💰",color:"#fbbf24"},
          {label:"Fees/mo (6%)",val:fmtGBP(fee),icon:"📈",color:P},
          {label:"Annual Revenue",val:fmtGBP(mrr*12),icon:"🚀",color:"#34d399"},
          {label:"Annual Fees",val:fmtGBP(fee*12),icon:"🏦",color:"#a78bfa"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:4}}>{s.label}</div>
            <div style={{fontWeight:900,fontSize:20,color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Revenue by Business</h3>
        {byBiz.length===0?<div style={{textAlign:"center",padding:"24px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No subscription revenue yet</div>:byBiz.map((b,i)=>(
          <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<byBiz.length-1?"1px solid rgba(255,255,255,.05)":"none"}}>
            <div><div style={{fontWeight:600,fontSize:13,color:W}}>{b.business_name}</div><div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{b.subs.length} subscriber{b.subs.length!==1?"s":""}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontWeight:800,fontSize:15,color:"#fbbf24"}}>{fmtGBP(b.rev)}/mo</div><div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>Fee: {fmtGBP(b.rev*.06)}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Leaderboard({ businesses, subscriptions }) {
  const [tab,setTab]=useState("subscribers");
  const ranked=businesses.filter(b=>b.is_active&&!isRemoved(b)).map(b=>({...b,subCount:subscriptions.filter(s=>s.business_id===b.id).length,revenue:subscriptions.filter(s=>s.business_id===b.id).reduce((a,s)=>a+parseFloat(s.monthly_price||0),0)})).sort((a,b)=>tab==="subscribers"?b.subCount-a.subCount:b.revenue-a.revenue).slice(0,10);
  const medals=["🥇","🥈","🥉"];
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>🏆 Leaderboard</h2>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{val:"subscribers",label:"By Subscribers"},{val:"revenue",label:"By Revenue"}].map(t=>(
          <button key={t.val} className={`btn ${tab===t.val?"btn-p":"btn-w"}`} onClick={()=>setTab(t.val)} style={{flex:1}}>{t.label}</button>
        ))}
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        {ranked.length===0?<div style={{textAlign:"center",padding:"32px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No data yet</div>:ranked.map((b,i)=>(
          <div key={b.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderBottom:i<ranked.length-1?"1px solid rgba(255,255,255,.06)":"none",background:i===0?"rgba(86,59,231,.12)":i===1?"rgba(86,59,231,.06)":i===2?"rgba(86,59,231,.03)":"transparent"}}>
            <div style={{fontSize:22,width:32,textAlign:"center",flexShrink:0}}>{medals[i]||`#${i+1}`}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:W,marginBottom:2}}>{b.business_name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)",textTransform:"capitalize"}}>{b.category?.replace(/-/g," ")} · {b.city}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:900,fontSize:17,color:tab==="revenue"?"#fbbf24":"#34d399"}}>{tab==="revenue"?fmtGBP(b.revenue)+"/mo":b.subCount+" subs"}</div>
              {tab==="revenue"&&<div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>Fee: {fmtGBP(b.revenue*.06)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cities({ businesses }) {
  const cityMap={};
  businesses.filter(b=>b.is_active&&!isRemoved(b)).forEach(b=>{const city=b.city||"Unknown";cityMap[city]=(cityMap[city]||0)+1;});
  const sorted=Object.entries(cityMap).sort((a,b)=>b[1]-a[1]);
  const max=sorted[0]?.[1]||1;
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:8}}>🗺️ Business Cities</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:20}}>Where your businesses are across the UK</p>
      <div className="card">
        {sorted.length===0?<div style={{textAlign:"center",padding:"32px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No location data yet</div>:sorted.map(([city,count],i)=>(
          <div key={city} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:14,fontWeight:600,color:W}}>{city}</span>
              <span style={{fontSize:13,fontWeight:800,color:P}}>{count} business{count!==1?"es":""}</span>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,.06)",borderRadius:100,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(count/max)*100}%`,background:`linear-gradient(90deg,${P},#7c3aed)`,borderRadius:100,transition:"width .5s"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reviews({ reviews, onRefresh, addAudit }) {
  const [busy,setBusy]=useState(null);
  const toggle=async r=>{setBusy(r.id);await supabase.from("reviews").update({is_visible:!r.is_visible}).eq("id",r.id);addAudit(`${r.is_visible?"Hidden":"Shown"} review`);setBusy(null);onRefresh();};
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Reviews ({reviews.length})</h2>
      {reviews.length===0?<div className="card" style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No reviews yet</div>:reviews.map(r=>(
        <div key={r.id} className="card" style={{marginBottom:10,opacity:r.is_visible?1:.5}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:3,marginBottom:6}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:s<=r.rating?"#fbbf24":"rgba(255,255,255,.15)",fontSize:14}}>★</span>)}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>{r.comment||"No comment"}</div>
            </div>
            <button className="btn btn-w" onClick={()=>toggle(r)} disabled={busy===r.id} style={{flexShrink:0,fontSize:12,minHeight:44,padding:"8px 14px"}}>{r.is_visible?"Hide":"Show"}</button>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{fmtDate(r.created_at)}</div>
        </div>
      ))}
    </div>
  );
}

function Disputes({ disputes, onRefresh, addAudit }) {
  const [busy,setBusy]=useState(null);
  const resolve=async d=>{setBusy(d.id);await supabase.from("disputes").update({status:"resolved",resolved_at:new Date().toISOString()}).eq("id",d.id);addAudit(`Resolved dispute`);setBusy(null);onRefresh();};
  const open=disputes.filter(d=>d.status!=="resolved");
  const done=disputes.filter(d=>d.status==="resolved");
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Disputes ({open.length} open)</h2>
      {open.length===0&&<div className="card" style={{textAlign:"center",padding:"40px 0",marginBottom:16}}><div style={{fontSize:36,marginBottom:10}}>✅</div><div style={{color:"rgba(255,255,255,.4)",fontSize:13}}>No open disputes</div></div>}
      {open.map(d=>(
        <div key={d.id} className="card" style={{marginBottom:10,borderColor:"rgba(239,68,68,.25)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,gap:10}}>
            <div style={{flex:1}}><span className="badge br" style={{marginBottom:8,display:"inline-block"}}>{d.status}</span><div style={{fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>{d.description||"No description"}</div></div>
            <button className="btn btn-g" onClick={()=>resolve(d)} disabled={busy===d.id} style={{flexShrink:0,minHeight:44}}>Resolve</button>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{fmtDate(d.created_at)}</div>
        </div>
      ))}
      {done.length>0&&<div style={{marginTop:20}}><div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:1.5,marginBottom:10}}>RESOLVED ({done.length})</div>{done.slice(0,5).map(d=><div key={d.id} className="card" style={{marginBottom:8,opacity:.5}}><div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{d.description||"No description"}</div><div style={{fontSize:11,color:"rgba(255,255,255,.25)",marginTop:4}}>Resolved {fmtDate(d.resolved_at||d.created_at)}</div></div>)}</div>}
    </div>
  );
}

function Messages({ profiles }) {
  const [to,setTo]=useState("all");
  const [channel,setChannel]=useState("email");
  const [subject,setSubject]=useState("");
  const [body,setBody]=useState("");
  const [sent,setSent]=useState(false);
  const templates={welcome:{subject:"Welcome to SubSeat! 🎉",body:"Hi there,\n\nWelcome to SubSeat.\n\nBest,\nThe SubSeat Team"},update:{subject:"Important update from SubSeat",body:"Hi there,\n\nImportant platform update.\n\nBest,\nThe SubSeat Team"},warning:{subject:"Action required — SubSeat account",body:"Hi there,\n\nAction needed on your account.\n\nBest,\nThe SubSeat Team"}};
  const count=to==="all"?profiles.length:to==="businesses"?profiles.filter(p=>p.role==="business").length:profiles.filter(p=>p.role!=="business").length;
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Message Centre</h2>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Compose</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <select className="inp" onChange={e=>{if(e.target.value){setSubject(templates[e.target.value].subject);setBody(templates[e.target.value].body);}}}>
              <option value="">— Load template —</option>
              <option value="welcome">Welcome</option>
              <option value="update">Platform update</option>
              <option value="warning">Account warning</option>
            </select>
            <select className="inp" value={to} onChange={e=>setTo(e.target.value)}>
              <option value="all">All users ({profiles.length})</option>
              <option value="businesses">All businesses</option>
              <option value="customers">All customers</option>
            </select>
            <div style={{display:"flex",gap:8}}>
              {["email","whatsapp"].map(c=><button key={c} className={`btn ${channel===c?"btn-p":"btn-w"}`} onClick={()=>setChannel(c)} style={{flex:1,textTransform:"capitalize"}}>{c}</button>)}
            </div>
            <input className="inp" placeholder="Subject..." value={subject} onChange={e=>setSubject(e.target.value)}/>
            <textarea className="inp" rows={5} placeholder="Message..." value={body} onChange={e=>setBody(e.target.value)}></textarea>
            <button className="btn btn-p" onClick={()=>{setSent(true);setTimeout(()=>setSent(false),3000);}} disabled={!subject||!body} style={{padding:"14px",fontSize:15}}>
              {sent?`✅ Queued for ${count} recipients!`:`Send to ${count} ${to==="all"?"users":to}`}
            </button>
          </div>
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Recipients ({count})</h3>
          <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:320,overflowY:"auto"}}>
            {profiles.filter(p=>to==="all"?true:to==="businesses"?p.role==="business":p.role!=="business").slice(0,15).map(p=>(
              <div key={p.id} style={{fontSize:12,color:"rgba(255,255,255,.5)",padding:"8px 12px",background:"rgba(255,255,255,.04)",borderRadius:8}}>{p.full_name||"—"} · {p.email}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailBlast({ businesses, profiles }) {
  const [audience,setAudience]=useState("businesses");
  const [subject,setSubject]=useState("");
  const [headline,setHeadline]=useState("");
  const [body,setBody]=useState("");
  const [cta,setCta]=useState("");
  const [ctaUrl,setCtaUrl]=useState("https://subseat.co.uk");
  const [sent,setSent]=useState(false);
  const count=audience==="businesses"?businesses.filter(b=>b.is_active&&!isRemoved(b)).length:profiles.filter(p=>p.role!=="business").length;
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:8}}>📧 Email Blast</h2>
      <p style={{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:20}}>Send a branded email to businesses or customers</p>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Setup</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <select className="inp" value={audience} onChange={e=>setAudience(e.target.value)}>
              <option value="businesses">Active Businesses ({businesses.filter(b=>b.is_active&&!isRemoved(b)).length})</option>
              <option value="customers">All Customers ({profiles.filter(p=>p.role!=="business").length})</option>
            </select>
            <input className="inp" placeholder="Email subject..." value={subject} onChange={e=>setSubject(e.target.value)}/>
            <input className="inp" placeholder="Big headline..." value={headline} onChange={e=>setHeadline(e.target.value)}/>
            <textarea className="inp" rows={4} placeholder="Message body..." value={body} onChange={e=>setBody(e.target.value)}></textarea>
            <input className="inp" placeholder="CTA button text..." value={cta} onChange={e=>setCta(e.target.value)}/>
            <input className="inp" placeholder="CTA URL" value={ctaUrl} onChange={e=>setCtaUrl(e.target.value)}/>
            <button className="btn btn-p" onClick={()=>{setSent(true);setTimeout(()=>setSent(false),3000);}} disabled={!subject||!body} style={{padding:"14px",fontSize:15}}>
              {sent?`✅ Blast sent to ${count}!`:`Send to ${count} ${audience}`}
            </button>
          </div>
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Preview</h3>
          <div style={{background:W,borderRadius:12,overflow:"hidden",fontSize:13,color:"#333"}}>
            <div style={{background:P,padding:"16px",textAlign:"center"}}><div style={{fontWeight:900,fontSize:16,color:W}}>SubSeat</div></div>
            <div style={{padding:"20px"}}>
              {headline&&<div style={{fontWeight:800,fontSize:16,color:"#171717",marginBottom:10,lineHeight:1.3}}>{headline}</div>}
              {body&&<div style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:14,whiteSpace:"pre-wrap"}}>{body}</div>}
              {cta&&<div style={{textAlign:"center"}}><div style={{display:"inline-block",background:P,color:W,padding:"10px 20px",borderRadius:10,fontWeight:700,fontSize:13}}>{cta}</div></div>}
              {!headline&&!body&&!cta&&<div style={{textAlign:"center",padding:"16px 0",color:"#aaa",fontSize:12}}>Fill in fields to preview</div>}
            </div>
            <div style={{background:"#f9f9f9",padding:"12px",textAlign:"center",fontSize:11,color:"#aaa"}}>SubSeat · subseat.co.uk</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Promos() {
  const [promos,setPromos]=useState([]);
  const [form,setForm]=useState({code:"",type:"percent",value:"",expires:"",limit:""});
  const [saved,setSaved]=useState(false);
  const addPromo=()=>{if(!form.code||!form.value)return;setPromos(prev=>[...prev,{...form,id:Date.now(),uses:0}]);setForm({code:"",type:"percent",value:"",expires:"",limit:""});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Promo Codes</h2>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Create Code</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input className="inp" placeholder="e.g. LAUNCH50" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <select className="inp" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="percent">% Off</option><option value="flat">£ Off</option></select>
              <input className="inp" type="number" placeholder="Value" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <input className="inp" type="date" value={form.expires} onChange={e=>setForm({...form,expires:e.target.value})}/>
              <input className="inp" type="number" placeholder="Usage limit" value={form.limit} onChange={e=>setForm({...form,limit:e.target.value})}/>
            </div>
            <button className="btn btn-p" onClick={addPromo} style={{padding:"14px",fontSize:15}}>{saved?"✅ Created!":"Create Promo Code"}</button>
          </div>
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Active Codes ({promos.length})</h3>
          {promos.length===0?<div style={{textAlign:"center",padding:"32px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No codes yet</div>:promos.map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
              <div><div style={{fontWeight:800,fontSize:14,color:P}}>{p.code}</div><div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{p.type==="percent"?`${p.value}% off`:`£${p.value} off`}</div></div>
              <button className="btn btn-r" onClick={()=>setPromos(prev=>prev.filter(x=>x.id!==p.id))} style={{padding:"8px 14px",minHeight:40,fontSize:12}}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Alerts({ alerts }) {
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Alerts</h2>
      {alerts.length===0?(
        <div className="card" style={{textAlign:"center",padding:"48px 0"}}>
          <div style={{fontSize:44,marginBottom:10}}>✅</div>
          <div style={{fontWeight:700,fontSize:16,color:W,marginBottom:6}}>All clear!</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>No alerts right now.</div>
        </div>
      ):alerts.map((a,i)=>(
        <div key={i} className="card" style={{marginBottom:10,borderColor:a.priority==="high"?"rgba(239,68,68,.4)":"rgba(245,158,11,.25)"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{fontSize:24,flexShrink:0}}>{a.icon}</div>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:W,marginBottom:3}}>{a.message}</div><div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{a.time}</div></div>
            <span className={`badge ${a.priority==="high"?"br":"bo"}`}>{a.priority}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuditLog({ log }) {
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Audit Log</h2>
      <div className="card">
        {log.length===0?<div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No actions logged yet this session.</div>:[...log].reverse().map((entry,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<log.length-1?"1px solid rgba(255,255,255,.05)":"none",alignItems:"flex-start"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:P,marginTop:5,flexShrink:0}}/>
            <div style={{flex:1}}><div style={{fontSize:13,color:W}}>{entry.action}</div><div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>{entry.time}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings({ addAudit }) {
  const [settings,setSettings]=useState({commission:"6",marketplace:"1",maintenance:false,banner:"",bannerActive:false,signupsOpen:true});
  const [saved,setSaved]=useState(false);
  const save=()=>{addAudit("Updated platform settings");setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>Platform Settings</h2>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Commission Rates</h3>
          {[{label:"Platform Commission (%)",key:"commission",hint:"6% + VAT on subscriptions"},{label:"Marketplace Fee (%)",key:"marketplace",hint:"1% on marketplace transactions"}].map(f=>(
            <div key={f.key} style={{marginBottom:16}}>
              <label style={{fontSize:12,color:"rgba(255,255,255,.5)",display:"block",marginBottom:5}}>{f.label}</label>
              <input className="inp" type="number" value={settings[f.key]} onChange={e=>setSettings({...settings,[f.key]:e.target.value})}/>
              <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:4}}>{f.hint}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>Platform Controls</h3>
          {[{label:"Allow New Sign Ups",key:"signupsOpen",desc:"Toggle to close registrations"},{label:"Maintenance Mode",key:"maintenance",desc:"Shows maintenance page"},{label:"Announcement Banner",key:"bannerActive",desc:"Shows banner at top of site"}].map(s=>(
            <div key={s.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:W}}>{s.label}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>{s.desc}</div>
              </div>
              <button
                onClick={()=>setSettings(prev=>({...prev,[s.key]:!prev[s.key]}))}
                style={{width:48,height:26,borderRadius:100,background:settings[s.key]?P:"rgba(255,255,255,.15)",border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0,minHeight:44,minWidth:48}}>
                <div style={{position:"absolute",top:3,left:settings[s.key]?25:3,width:20,height:20,borderRadius:"50%",background:W,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
              </button>
            </div>
          ))}
        </div>
        <div className="card" style={{gridColumn:"1 / -1"}}>
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:10}}>Announcement Banner</h3>
          <input className="inp" placeholder="e.g. 🎉 SubSeat is now live!" value={settings.banner} onChange={e=>setSettings({...settings,banner:e.target.value})} style={{marginBottom:14}}/>
          <button className="btn btn-p" onClick={save} style={{padding:"14px 28px",fontSize:15}}>{saved?"✅ Saved!":"Save All Settings"}</button>
        </div>
      </div>
    </div>
  );
}

function Analytics({ businesses }) {
  const active=businesses.filter(b=>b.is_active&&!isRemoved(b));
  const byMonth={};
  active.forEach(b=>{const m=new Date(b.created_at).toLocaleDateString("en-GB",{month:"short",year:"numeric"});byMonth[m]=(byMonth[m]||0)+1;});
  const months=Object.entries(byMonth).slice(-6);
  const max=Math.max(...months.map(m=>m[1]),1);
  const byCat={};
  active.forEach(b=>{byCat[b.category||"other"]=(byCat[b.category||"other"]||0)+1;});
  const cats=Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  return (
    <div>
      <h2 style={{fontWeight:800,fontSize:20,color:W,marginBottom:16}}>📈 Analytics</h2>
      <div className="stats-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Active Businesses",val:active.length},{label:"Categories",val:Object.keys(byCat).length},{label:"Avg/Month",val:Math.round(active.length/Math.max(months.length,1))}].map((s,i)=>(
          <div key={i} className="stat-card"><div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:6}}>{s.label}</div><div style={{fontWeight:900,fontSize:24,color:P}}>{s.val}</div></div>
        ))}
      </div>
      <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:16}}>Sign-ups (last 6 months)</h3>
          {months.length===0?<div style={{textAlign:"center",padding:"24px 0",color:"rgba(255,255,255,.3)",fontSize:13}}>No data yet</div>:(
            <div style={{display:"flex",gap:8,alignItems:"flex-end",height:120}}>
              {months.map(([m,n])=>(
                <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <div style={{fontSize:10,fontWeight:700,color:P}}>{n}</div>
                  <div style={{width:"100%",background:`linear-gradient(to top,${P},#7c3aed)`,borderRadius:"4px 4px 0 0",height:`${(n/max)*90}px`,minHeight:4,transition:"height .5s"}}/>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.35)",textAlign:"center"}}>{m}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <h3 style={{fontWeight:700,fontSize:14,color:W,marginBottom:14}}>By Category</h3>
          {cats.map(([cat,n])=>(
            <div key={cat} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:W,textTransform:"capitalize"}}>{cat.replace(/-/g," ")}</span>
                <span style={{fontSize:12,fontWeight:700,color:P}}>{n}</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,.06)",borderRadius:100,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(n/active.length)*100}%`,background:P,borderRadius:100}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [active,      setActive]     = useState("overview");
  const [businesses,  setBiz]        = useState([]);
  const [profiles,    setProfiles]   = useState([]);
  const [subs,        setSubs]       = useState([]);
  const [disputes,    setDisputes]   = useState([]);
  const [reviews,     setReviews]    = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [auditLog,    setAuditLog]   = useState([]);
  const [showSearch,  setShowSearch] = useState(false);
  const [showFab,     setShowFab]    = useState(false);
  const isMob = useIsMobile();

  const alerts = [
    ...(disputes.filter(d=>d.status!=="resolved").length>0?[{icon:"⚠️",message:`${disputes.filter(d=>d.status!=="resolved").length} open dispute(s)`,priority:"high",time:"Now"}]:[]),
  ];

  useEffect(()=>{loadData();},[]);

  const loadData = async () => {
    setLoading(true);
    const {data:{user}} = await supabase.auth.getUser();
    if (!user||user.email!==ADMIN_EMAIL) { window.location.href="/"; return; }
    const [{data:biz},{data:prof},{data:sub},{data:disp},{data:rev}] = await Promise.all([
      supabase.from("businesses").select("*").order("created_at",{ascending:false}),
      supabase.from("profiles").select("*").order("created_at",{ascending:false}),
      supabase.from("subscriptions").select("*").order("created_at",{ascending:false}),
      supabase.from("disputes").select("*").order("created_at",{ascending:false}),
      supabase.from("reviews").select("*").order("created_at",{ascending:false}),
    ]);
    setBiz(biz||[]); setProfiles(prof||[]); setSubs(sub||[]); setDisputes(disp||[]); setReviews(rev||[]);
    setLoading(false);
  };

  const addAudit = action => setAuditLog(prev=>[...prev,{action,time:new Date().toLocaleTimeString("en-GB")}]);

  const section = () => {
    const props={businesses,profiles,subscriptions:subs,disputes,reviews,onRefresh:loadData,addAudit,setActive,alerts};
    switch(active) {
      case "overview":    return <Overview    {...props}/>;
      case "prospects":   return <ProspectsCRM/>;
      case "businesses":  return <Businesses  {...props}/>;
      case "customers":   return <Customers   {...props}/>;
      case "finance":     return <Finance     {...props}/>;
      case "leaderboard": return <Leaderboard {...props}/>;
      case "cities":      return <Cities      {...props}/>;
      case "reviews":     return <Reviews     {...props}/>;
      case "disputes":    return <Disputes    {...props}/>;
      case "messages":    return <Messages    {...props}/>;
      case "blast":       return <EmailBlast  {...props}/>;
      case "promos":      return <Promos      {...props}/>;
      case "alerts":      return <Alerts      alerts={alerts}/>;
      case "audit":       return <AuditLog    log={auditLog}/>;
      case "settings":    return <Settings    {...props}/>;
      case "analytics":   return <Analytics   {...props}/>;
      default:            return <Overview    {...props}/>;
    }
  };

  if (loading) return (
    <><style>{css}</style>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:14}}>
      <div style={{width:36,height:36,border:`3px solid rgba(86,59,231,.3)`,borderTop:`3px solid ${P}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <div style={{color:"rgba(255,255,255,.5)",fontSize:14}}>Loading admin...</div>
    </div></>
  );

  return (
    <>
      <style>{css}</style>
      {showSearch&&<GlobalSearch businesses={businesses} profiles={profiles} onClose={()=>setShowSearch(false)}/>}

      {/* FAB MENU */}
      {isMob&&showFab&&(
        <>
          <div onClick={()=>setShowFab(false)} style={{position:"fixed",inset:0,zIndex:148}}/>
          <div style={{position:"fixed",bottom:140,right:16,zIndex:149,display:"flex",flexDirection:"column",gap:10,alignItems:"flex-end"}}>
            {[{label:"New Prospect",icon:"🎯",tab:"prospects"},{label:"Send Message",icon:"💬",tab:"messages"},{label:"Email Blast",icon:"📧",tab:"blast"},{label:"View Disputes",icon:"⚠️",tab:"disputes"}].map(a=>(
              <button key={a.tab} onClick={()=>{setActive(a.tab);setShowFab(false);}}
                style={{display:"flex",alignItems:"center",gap:10,background:"#1a1a2e",border:"1px solid rgba(255,255,255,.12)",borderRadius:100,padding:"10px 18px 10px 14px",color:W,fontFamily:"Poppins",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:"0 4px 16px rgba(0,0,0,.4)",whiteSpace:"nowrap"}}>
                <span style={{fontSize:18}}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* TOP NAV */}
      <nav style={{background:"#13131f",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"0 16px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:8,background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:W}}>S</div>
          <span style={{fontWeight:800,fontSize:15,color:W}}>Super Admin</span>
          {alerts.length>0&&<div onClick={()=>setActive("alerts")} style={{width:20,height:20,borderRadius:"50%",background:RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:W,cursor:"pointer"}}>{alerts.length}</div>}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowSearch(true)} className="btn btn-w" style={{padding:"8px 14px",minHeight:40,fontSize:13}}>🔍</button>
          <a href="/" style={{textDecoration:"none"}}><button className="btn btn-w" style={{padding:"8px 14px",minHeight:40,fontSize:13}}>← Site</button></a>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="admin-layout">
        <Sidebar active={active} setActive={setActive}/>
        <div className="main-content fu">{section()}</div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {NAV.map(n=>(
            <button key={n.id} className={`mob-btn ${active===n.id?"active":""}`} onClick={()=>setActive(n.id)}>
              <span className="icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE FAB */}
      <button className="fab" onClick={()=>setShowFab(!showFab)} style={{display:isMob?"flex":"none"}}>
        {showFab?"✕":"⚡"}
      </button>
    </>
  );
}