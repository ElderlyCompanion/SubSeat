'use client';
import { useState, useEffect, use } from "react";
import { supabase } from "../../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: ${G}; color: ${C}; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse  { 0%,100% { box-shadow:0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow:0 0 0 12px rgba(86,59,231,0); } }
  @keyframes spin   { to { transform:rotate(360deg); } }

  .fu { animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
  .d1 { animation-delay:.1s; } .d2 { animation-delay:.2s; } .d3 { animation-delay:.3s; }

  .service-card {
    background:${W}; border-radius:18px; padding:24px;
    border:1.5px solid #eee; transition:all .22s;
  }
  .service-card:hover { border-color:${P}; box-shadow:0 8px 32px rgba(86,59,231,.12); transform:translateY(-2px); }

  .staff-card {
    background:${W}; border-radius:18px; padding:22px;
    border:1.5px solid #eee; transition:all .2s; cursor:pointer;
  }
  .staff-card:hover { border-color:${P}; box-shadow:0 8px 28px rgba(86,59,231,.10); transform:translateY(-2px); }
  .staff-card.selected { border-color:${P}; background:${L}; }

  .review-card {
    background:${W}; border-radius:16px; padding:20px; border:1.5px solid #eee;
  }

  .btn-subscribe {
    width:100%; padding:14px; border-radius:12px;
    background:${P}; color:${W}; border:none;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:15px;
    cursor:pointer; transition:all .2s;
    box-shadow:0 6px 20px rgba(86,59,231,.3);
  }
  .btn-subscribe:hover { background:#4429d4; transform:translateY(-1px); box-shadow:0 10px 28px rgba(86,59,231,.4); }
  .btn-subscribe:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  .btn-book {
    flex:1; padding:11px; border-radius:10px;
    background:${P}; color:${W}; border:none;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:all .2s;
  }
  .btn-book:hover { background:#4429d4; }

  .btn-outline {
    flex:1; padding:11px; border-radius:10px;
    background:transparent; color:${P}; border:1.5px solid ${P};
    font-family:'Poppins',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:all .2s;
  }
  .btn-outline:hover { background:${L}; }

  .tab {
    padding:10px 20px; border:none; background:transparent;
    font-family:'Poppins',sans-serif; font-weight:600; font-size:14px;
    cursor:pointer; border-bottom:2px solid transparent; transition:all .18s; color:#888;
  }
  .tab.active { color:${P}; border-bottom-color:${P}; }
  .tab:hover  { color:${P}; }

  .share-btn {
    display:flex; align-items:center; gap:8px;
    padding:10px 18px; border-radius:10px; border:1.5px solid #eee;
    background:${W}; font-family:'Poppins',sans-serif; font-weight:600; font-size:13px;
    color:${C}; cursor:pointer; transition:all .18s;
  }
  .share-btn:hover { border-color:${P}; color:${P}; background:${L}; }

  .emp-badge {
    display:inline-block; padding:3px 10px; border-radius:100px;
    font-size:10px; font-weight:700;
  }

  @media(max-width:768px) {
    .profile-grid   { grid-template-columns:1fr !important; }
    .services-grid  { grid-template-columns:1fr !important; }
    .staff-grid     { grid-template-columns:1fr 1fr !important; }
    .stats-row      { grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:480px) {
    .staff-grid { grid-template-columns:1fr !important; }
    .stats-row  { grid-template-columns:1fr 1fr !important; }
  }
`;

function ReviewForm({ businessId, businessName, onSubmitted }) {
  const [rating,    setRating]   = useState(0);
  const [hover,     setHover]    = useState(0);
  const [comment,   setComment]  = useState("");
  const [name,      setName]     = useState("");
  const [email,     setEmail]    = useState("");
  const [submitting,setSubmit]   = useState(false);
  const [done,      setDone]     = useState(false);
  const [error,     setError]    = useState("");

  const handleSubmit = async () => {
    if (!rating) { setError("Please select a star rating"); return; }
    setSubmit(true); setError("");
    const res  = await fetch("/api/reviews", {
      method:  "POST",
      headers: { "Content-Type":"application/json" },
      body:    JSON.stringify({ businessId, customerName:name, customerEmail:email, rating, comment }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setSubmit(false); }
    else            { setDone(true); setTimeout(()=>onSubmitted?.(), 1500); }
  };

  if (done) return (
    <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:16, padding:"20px 24px", marginBottom:20, textAlign:"center" }}>
      <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
      <div style={{ fontWeight:700, fontSize:15, color:"#166534" }}>Thank you for your review!</div>
    </div>
  );

  return (
    <div style={{ background:"#f8f6ff", border:"1.5px solid #ede9ff", borderRadius:16, padding:"20px 24px", marginBottom:24 }}>
      <h3 style={{ fontWeight:700, fontSize:15, color:C, marginBottom:16 }}>Leave a review for {businessName}</h3>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[1,2,3,4,5].map(i=>(
          <button key={i} onClick={()=>setRating(i)} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(0)}
            style={{ fontSize:28, background:"none", border:"none", cursor:"pointer", padding:2, transform:(hover||rating)>=i?"scale(1.2)":"scale(1)", transition:"transform .15s" }}>
            {(hover||rating)>=i?"⭐":"☆"}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <input className="inp" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="inp" placeholder="Your email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <textarea className="inp" placeholder="Tell others about your experience..." value={comment} onChange={e=>setComment(e.target.value)} rows={3} style={{ width:"100%", resize:"vertical", marginBottom:10 }} />
      {error && <div style={{ fontSize:13, color:"#e53e3e", marginBottom:10 }}>⚠️ {error}</div>}
      <button onClick={handleSubmit} disabled={submitting||!rating} className="btn-subscribe" style={{ width:"100%", opacity:(!rating||submitting)?0.6:1 }}>
        {submitting?"Submitting...":"Submit Review"}
      </button>
    </div>
  );
}

function StarRating({ rating, size=16 }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i=>(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<=Math.round(rating)?"#f59e0b":"#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

const empLabel = {
  employed:                 null,
  commission:               null,
  self_employed_own:        { label:"Self-Employed", bg:"#eff6ff", color:"#1e40af" },
  self_employed_through_us: { label:"Independent",   bg:"#f5f3ff", color:"#5b21b6" },
};

export default function BusinessProfilePage({ params }) {
  const { category, slug } = use(params);

  const [business,           setBusiness]           = useState(null);
  const [services,           setServices]           = useState([]);
  const [staff,              setStaff]              = useState([]);
  const [reviews,            setReviews]            = useState([]);
  const [portfolio,          setPortfolio]          = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [notFound,           setNotFound]           = useState(false);
  const [activeTab,          setActiveTab]          = useState("services");
  const [copied,             setCopied]             = useState(false);
  const [selectedService,    setSelectedService]    = useState(null);
  const [selectedStaff,      setSelectedStaff]      = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showBookModal,      setShowBookModal]      = useState(false);
  const [modalStaff,         setModalStaff]         = useState(null);

  useEffect(() => { fetchData(); }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    const { data:biz, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !biz) { setNotFound(true); setLoading(false); return; }
    setBusiness(biz);

    const [{ data:svcs },{ data:stf },{ data:revs },{ data:port }] = await Promise.all([
      supabase.from("services").select("*").eq("business_id", biz.id).eq("is_active", true),
      supabase.from("staff").select("*, staff_availability(*)").eq("business_id", biz.id).eq("is_active", true).eq("accepts_bookings", true),
      supabase.from("reviews").select("*, profiles(full_name, avatar_url)").eq("business_id", biz.id).eq("is_visible", true).order("created_at", { ascending:false }).limit(10),
      supabase.from("business_portfolio").select("*").eq("business_id", biz.id).eq("is_active", true).order("created_at", { ascending:false }),
    ]);

    setServices(svcs||[]);
    setStaff(stf||[]);
    setReviews(revs||[]);
    setPortfolio(port||[]);
    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const [subLoading, setSubLoading] = useState(false);
  const [user,       setUser]       = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data:{ user } }) => setUser(user));
  }, []);

  const handleSubscribe = async (service, staffMember=null) => {
    if (!service || !business) return;
    setSubLoading(true);
    try {
      const res  = await fetch("/api/stripe-checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          businessId:       business.id,
          businessName:     business.business_name,
          businessSlug:     business.slug,
          businessCategory: business.category,
          planName:         service.name,
          price:            parseFloat(service.monthly_price),
          customerEmail:    user?.email || null,
          customerName:     user?.user_metadata?.full_name || null,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch(err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }
    setSubLoading(false);
  };

  const handleBookStaff = (staffMember) => {
    setModalStaff(staffMember);
    setShowBookModal(true);
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
        <div style={{ width:40, height:40, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    </>
  );

  if (notFound) return (
    <>
      <style>{css}</style>
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>😕</div>
        <h2 style={{ fontWeight:800, fontSize:24, color:C, marginBottom:8 }}>Business not found</h2>
        <p style={{ color:"#888", marginBottom:24 }}>This profile doesn't exist or may have been removed.</p>
        <a href="/discover" style={{ color:P, fontWeight:700, textDecoration:"none" }}>← Browse all professionals</a>
      </div>
    </>
  );

  const categoryLabel = category.replace(/-/g," ").replace(/\b\w/g, l=>l.toUpperCase());
  const avgRating = reviews.length > 0
    ? (reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1)
    : null;
  const lowestPrice = services.length > 0
    ? Math.min(...services.filter(s=>s.monthly_price>0).map(s=>parseFloat(s.monthly_price)))
    : null;

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:W, borderBottom:"1px solid #eee", padding:"0 5%", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none" }}>
          <div style={{ width:32, height:32, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", animation:"pulse 3s infinite" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:16 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:17, color:P }}>SubSeat</span>
        </a>
        <div style={{ display:"flex", gap:10 }}>
          <button className="share-btn" onClick={handleCopyLink}>
            <span>{copied?"✅":"🔗"}</span>{copied?"Copied!":"Share"}
          </button>
          <a href="/auth" style={{ background:P, color:W, textDecoration:"none", padding:"9px 18px", borderRadius:10, fontWeight:700, fontSize:13, fontFamily:"Poppins" }}>Sign In</a>
        </div>
      </nav>

      {/* BANNER */}
      <div style={{ position:"relative", height:240, background:`linear-gradient(135deg,${P} 0%,#7c5cff 100%)`, overflow:"hidden" }}>
        {business.banner_url && <img src={business.banner_url} alt="Banner" style={{ width:"100%", height:"100%", objectFit:"cover" }} />}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 60%)" }} />
      </div>

      {/* PROFILE HEADER */}
      <div style={{ background:W, borderBottom:"1px solid #eee" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 5%" }}>
          <div style={{ display:"flex", gap:24, alignItems:"flex-end", transform:"translateY(-40px)", marginBottom:"-16px", flexWrap:"wrap" }}>
            <div style={{ width:96, height:96, borderRadius:22, border:`4px solid ${W}`, background:business.logo_url?"transparent":L, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0, boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
              {business.logo_url
                ? <img src={business.logo_url} alt="Logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <span style={{ fontSize:36 }}>✂️</span>}
            </div>
            <div style={{ flex:1, paddingBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
                <h1 style={{ fontWeight:900, fontSize:"clamp(20px,3vw,28px)", color:C, letterSpacing:"-.5px" }}>{business.business_name}</h1>
                {business.is_verified && <div style={{ background:L, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700, color:P }}>✓ Verified</div>}
                {business.tier==="partner" && <div style={{ background:P, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700, color:W }}>Partner</div>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <span style={{ fontSize:14, color:"#888" }}>📍 {business.city}</span>
                <span style={{ fontSize:14, color:"#888" }}>✂️ {categoryLabel}</span>
                {staff.length > 0 && <span style={{ fontSize:14, color:"#888" }}>👥 {staff.length} professional{staff.length>1?"s":""}</span>}
                {avgRating && (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <StarRating rating={avgRating} size={14} />
                    <span style={{ fontSize:14, fontWeight:700, color:C }}>{avgRating}</span>
                    <span style={{ fontSize:13, color:"#888" }}>({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", borderTop:"1px solid #eee", marginTop:8 }}>
            {["services","staff","portfolio","reviews","about"].map(tab=>(
              <button key={tab} className={`tab ${activeTab===tab?"active":""}`} onClick={()=>setActiveTab(tab)}>
                {tab==="staff" ? `Team (${staff.length})` : tab.charAt(0).toUpperCase()+tab.slice(1)}
                {tab==="reviews" && reviews.length>0 && ` (${reviews.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 5%" }}>
        <div className="profile-grid" style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:28 }}>

          {/* LEFT COLUMN */}
          <div>

            {/* ── SERVICES TAB ── */}
            {activeTab==="services" && (
              <div className="fu">

                {/* SUBSCRIPTION PLANS */}
                {services.filter(s=>s.monthly_price>0).length > 0 && (
                  <div style={{ marginBottom:32 }}>
                    <h2 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:6 }}>Subscription Plans</h2>

                    {/* BENEFITS STRIP */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
                      {[
                        ["🔒", "Priority booking. Your slot is always secured."],
                        ["🔔", "Automatic reminders before every visit."],
                        ["💰", "Discounted member pricing every month."],
                        ["📅", "Guaranteed recurring appointments. Weekly, bi-weekly or monthly."],
                        ["⚡", "Skip the wait. No queues or last minute scrambling."],
                        ["🎁", "Loyalty rewards. Earn exclusive rewards and upgrades."],
                        ["⭐", "Exclusive member perks. Special offers, events and giveaways."],
                        ["🎂", "Birthday rewards. A special treat on your birthday."],
                      ].map(([icon, text]) => (
                        <div key={text} style={{ display:"flex", alignItems:"center", gap:6, background:L, borderRadius:100, padding:"5px 12px", fontSize:12, fontWeight:600, color:P }}>
                          <span>{icon}</span><span>{text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginBottom:16 }}>
                      {services.filter(s=>s.monthly_price>0).map(s=>{
                        const oneOff = parseFloat(s.one_off_price||0);
                        const monthly = parseFloat(s.monthly_price||0);
                        const saving = oneOff > 0 ? Math.max(0, (oneOff * (s.visits_per_month||2)) - monthly) : 0;
                        return (
                          <div key={s.id} className="service-card" style={{ position:"relative", overflow:"hidden" }}>
                            {saving > 0 && (
                              <div style={{ position:"absolute", top:12, right:12, background:"#22c55e", color:W, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
                                Save £{saving.toFixed(0)}/mo
                              </div>
                            )}
                            <div style={{ fontWeight:800, fontSize:17, color:C, marginBottom:6 }}>{s.name}</div>
                            {s.description && <div style={{ fontSize:13, color:"#888", marginBottom:12, lineHeight:1.55 }}>{s.description}</div>}

                            {/* WHAT'S INCLUDED */}
                            <div style={{ marginBottom:14 }}>
                              {[
                                `${s.visits_per_month || "Unlimited"} visit${(s.visits_per_month||0)!==1?"s":""} per month`,
                                "Priority booking. Guaranteed slot.",
                                "WhatsApp and email reminders",
                                "Cancel anytime, no lock-in",
                              ].map(item => (
                                <div key={item} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#555", marginBottom:5 }}>
                                  <span style={{ color:"#22c55e", fontWeight:700 }}>✓</span>{item}
                                </div>
                              ))}
                            </div>

                            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:16 }}>
                              <div>
                                <span style={{ fontWeight:900, fontSize:32, color:C, letterSpacing:"-1.5px" }}>£{monthly.toFixed(0)}</span>
                                <span style={{ fontSize:13, color:"#888", fontWeight:500 }}>/month</span>
                              </div>
                              {oneOff > 0 && (
                                <div style={{ fontSize:12, color:"#aaa", textDecoration:"line-through" }}>
                                  £{(oneOff*(s.visits_per_month||2)).toFixed(0)} one-off
                                </div>
                              )}
                            </div>
                            <button className="btn-subscribe" onClick={()=>handleSubscribe(s)} disabled={subLoading}>
                              {subLoading ? "Processing..." : "Subscribe Now →"}
                            </button>
                            <div style={{ textAlign:"center", marginTop:8, fontSize:11, color:"#bbb" }}>
                              🔒 Stripe-secured payments · Cancel anytime
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {services.filter(s=>s.monthly_price>0).length===0 && (
                  <div style={{ textAlign:"center", padding:40, color:"#888", marginBottom:28 }}>No subscription plans listed yet.</div>
                )}

                {/* ONE-OFF SERVICES */}
                {services.filter(s=>s.one_off_price>0).length > 0 && (
                  <div>
                    <h2 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:6 }}>One-Off Services</h2>
                    <p style={{ fontSize:14, color:"#888", marginBottom:20 }}>Book a single appointment. No commitment needed.</p>
                    <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
                      {services.filter(s=>s.one_off_price>0).map(s=>(
                        <div key={s.id} className="service-card">
                          <div style={{ fontWeight:800, fontSize:17, color:C, marginBottom:6 }}>{s.name}</div>
                          {s.description && <div style={{ fontSize:13, color:"#888", marginBottom:12, lineHeight:1.5 }}>{s.description}</div>}
                          <div style={{ background:G, borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:600, color:"#666", display:"inline-block", marginBottom:16 }}>⏱ {s.duration_minutes} mins</div>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                            <div>
                              <span style={{ fontWeight:900, fontSize:28, color:C, letterSpacing:"-1px" }}>£{parseFloat(s.one_off_price).toFixed(0)}</span>
                              <span style={{ fontSize:13, color:"#888", fontWeight:500 }}> one-off</span>
                            </div>
                          </div>
                          <a href={`/${business?.category}/${slug}/book`} style={{ display:"block", textDecoration:"none" }}>
                            <button className="btn-subscribe" style={{ background:C }}>Book Now</button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STAFF TAB ── */}
            {activeTab==="staff" && (
              <div className="fu">
                <h2 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:6 }}>Meet the Team</h2>
                <p style={{ fontSize:14, color:"#888", marginBottom:24 }}>Choose your preferred professional and book or subscribe directly with them.</p>
                {staff.length===0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"#888" }}>No staff profiles added yet.</div>
                ) : (
                  <div className="staff-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18 }}>
                    {staff.map(s=>{
                      const emp = empLabel[s.employment_type];
                      const workingDays = s.staff_availability?.filter(a=>a.is_working).map(a=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][a.day_of_week]) || [];
                      return (
                        <div key={s.id} className="staff-card">
                          {/* PHOTO */}
                          <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:16 }}>
                            <div style={{ width:72, height:72, borderRadius:"50%", background:L, overflow:"hidden", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, border:`3px solid ${W}`, boxShadow:`0 4px 16px rgba(86,59,231,.15)` }}>
                              {s.avatar_url
                                ? <img src={s.avatar_url} alt={s.full_name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                : "👤"}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontWeight:800, fontSize:17, color:C, marginBottom:4 }}>{s.full_name}</div>
                              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                                <span style={{ background:G, borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:700, color:"#555", textTransform:"capitalize" }}>
                                  {s.role==="staff"?"Barber/Stylist":s.role}
                                </span>
                                {emp && <span className="emp-badge" style={{ background:emp.bg, color:emp.color }}>{emp.label}</span>}
                              </div>
                            </div>
                          </div>

                          {/* BIO */}
                          {s.bio && <p style={{ fontSize:13, color:"#666", lineHeight:1.55, marginBottom:12 }}>{s.bio}</p>}

                          {/* SPECIALITIES */}
                          {s.specialities?.length > 0 && (
                            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:12 }}>
                              {s.specialities.map((sp,i)=>(
                                <span key={i} style={{ background:L, borderRadius:7, padding:"3px 9px", fontSize:11, fontWeight:600, color:P }}>{sp}</span>
                              ))}
                            </div>
                          )}

                          {/* WORKING DAYS */}
                          {workingDays.length > 0 && (
                            <div style={{ marginBottom:14 }}>
                              <div style={{ fontSize:11, fontWeight:600, color:"#aaa", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>Available</div>
                              <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                                {workingDays.map((d,i)=>(
                                  <span key={i} style={{ background:G, borderRadius:6, padding:"3px 7px", fontSize:10, fontWeight:700, color:"#555" }}>{d}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* INSTAGRAM */}
                          {s.instagram_handle && (
                            <div style={{ fontSize:12, color:"#888", marginBottom:14 }}>📸 {s.instagram_handle}</div>
                          )}

                          {/* ACTIONS */}
                          <div style={{ display:"flex", gap:8 }}>
                            <a href={`/${business?.category}/${slug}/book?staff=${s.id}`} style={{ flex:1, textDecoration:"none" }}>
                              <button className="btn-book" style={{ width:"100%" }}>Book Now</button>
                            </a>
                            {services.filter(sv=>sv.monthly_price>0).length > 0 && (
                              <button className="btn-outline" onClick={()=>handleSubscribe(services.find(sv=>sv.monthly_price>0), s)}>
                                Subscribe
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── PORTFOLIO TAB ── */}
            {activeTab==="portfolio" && (
              <div className="fu">
                <h2 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:20 }}>Portfolio</h2>
                {portfolio.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"48px 24px", background:"#f9f9f9", borderRadius:16 }}>
                    <div style={{ fontSize:48, marginBottom:14 }}>📸</div>
                    <p style={{ fontSize:14, color:"#888" }}>No portfolio photos yet.</p>
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
                    {portfolio.map(photo=>(
                      <div key={photo.id} style={{ borderRadius:12, overflow:"hidden", background:"#f0f0f0" }}>
                        <img src={photo.image_url} alt={photo.caption||""} style={{ width:"100%", height:160, objectFit:"cover", display:"block" }} />
                        {photo.caption && <div style={{ padding:"8px 10px", fontSize:12, color:"#666" }}>{photo.caption}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── REVIEWS TAB ── */}
            {activeTab==="reviews" && (
              <div className="fu">
                <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
                  <h2 style={{ fontWeight:800, fontSize:20, color:C }}>Reviews</h2>
                  {avgRating && (
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:L, borderRadius:100, padding:"6px 16px" }}>
                      <StarRating rating={avgRating} size={16} />
                      <span style={{ fontWeight:800, fontSize:16, color:P }}>{avgRating}</span>
                    </div>
                  )}
                </div>

                {/* LEAVE A REVIEW FORM */}
                <ReviewForm businessId={business?.id} businessName={business?.business_name} onSubmitted={()=>window.location.reload()} />

                {reviews.length===0 ? (
                  <div style={{ textAlign:"center", padding:40, color:"#888" }}>No reviews yet. Be the first!</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {reviews.map(r=>(
                      <div key={r.id} className="review-card">
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:38, height:38, borderRadius:"50%", background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, overflow:"hidden" }}>
                              {r.profiles?.avatar_url
                                ? <img src={r.profiles.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                                : "👤"}
                            </div>
                            <div>
                              <div style={{ fontWeight:600, fontSize:14, color:C }}>{r.profiles?.full_name||"Customer"}</div>
                              <div style={{ fontSize:11, color:"#bbb" }}>{new Date(r.created_at).toLocaleDateString("en-GB",{month:"short",year:"numeric"})}</div>
                            </div>
                          </div>
                          <StarRating rating={r.rating} size={14} />
                        </div>
                        {r.comment && <p style={{ fontSize:14, color:"#555", lineHeight:1.6 }}>{r.comment}</p>}
                        {r.business_response && (
                          <div style={{ background:G, borderRadius:10, padding:"12px 14px", marginTop:12 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:P, marginBottom:4 }}>Response from {business.business_name}</div>
                            <div style={{ fontSize:13, color:"#666" }}>{r.business_response}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ABOUT TAB ── */}
            {activeTab==="about" && (
              <div className="fu">
                <h2 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:20 }}>About</h2>
                <div style={{ background:W, borderRadius:16, padding:24, border:"1.5px solid #eee" }}>
                  {business.description && <p style={{ fontSize:15, color:"#555", lineHeight:1.75, marginBottom:20 }}>{business.description}</p>}
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {[
                      { icon:"📍", label:"Address", val:[business.address, business.city, business.postcode].filter(Boolean).join(", ") },
                      { icon:"📞", label:"Phone",   val:business.phone   },
                      { icon:"📧", label:"Email",   val:business.email   },
                    ].filter(i=>i.val).map((item,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                        <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize:11, fontWeight:700, color:"#aaa", letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{item.label}</div>
                          <div style={{ fontSize:14, color:C, fontWeight:500 }}>{item.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            {/* PRICE / SUBSCRIBE */}
            <div className="fu d1" style={{ background:W, borderRadius:20, padding:24, border:"1.5px solid #eee", marginBottom:20, boxShadow:"0 4px 20px rgba(86,59,231,.08)" }}>
              {lowestPrice ? (
                <>
                  <div style={{ fontSize:14, fontWeight:700, color:C, marginBottom:4 }}>Subscribe from</div>
                  <div style={{ fontWeight:900, fontSize:36, color:P, letterSpacing:"-1.5px", marginBottom:4 }}>
                    £{lowestPrice.toFixed(0)}<span style={{ fontSize:14, fontWeight:500, color:"#888" }}>/mo</span>
                  </div>
                  <div style={{ fontSize:13, color:"#888", marginBottom:20 }}>Priority booking · Cancel anytime</div>
                  <button className="btn-subscribe" onClick={()=>services.length>0&&handleSubscribe(services.find(s=>s.monthly_price>0))}>
                    Subscribe Now
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize:14, fontWeight:700, color:C, marginBottom:16 }}>Book an appointment</div>
                  <a href={`/${business?.category}/${slug}/book`} style={{ textDecoration:"none", display:"block" }}>
                    <button className="btn-subscribe">Book Now</button>
                  </a>
                </>
              )}
              <div style={{ textAlign:"center", marginTop:12, fontSize:12, color:"#bbb" }}>🔒 Stripe-secured payments</div>
            </div>

            {/* STATS */}
            <div className="fu d2" style={{ background:W, borderRadius:20, padding:24, border:"1.5px solid #eee", marginBottom:20 }}>
              <div className="stats-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {[
                  { val:services.filter(s=>s.monthly_price>0).length, label:"Plans"    },
                  { val:staff.length||"N/A",                             label:"Team"     },
                  { val:reviews.length,                                label:"Reviews"  },
                  { val:avgRating||"New",                              label:"Rating"   },
                ].map((s,i)=>(
                  <div key={i} style={{ textAlign:"center", background:G, borderRadius:14, padding:"16px 10px" }}>
                    <div style={{ fontWeight:900, fontSize:22, color:P, letterSpacing:"-0.5px" }}>{s.val}</div>
                    <div style={{ fontSize:12, color:"#888", marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TEAM PREVIEW IN SIDEBAR */}
            {staff.length > 0 && (
              <div className="fu d2" style={{ background:W, borderRadius:20, padding:24, border:"1.5px solid #eee", marginBottom:20 }}>
                <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:16 }}>👥 Our Team</div>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {staff.slice(0,4).map(s=>(
                    <div key={s.id} style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ width:40, height:40, borderRadius:"50%", background:L, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                        {s.avatar_url
                          ? <img src={s.avatar_url} alt={s.full_name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : "👤"}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13, color:C }}>{s.full_name}</div>
                        <div style={{ fontSize:11, color:"#888", textTransform:"capitalize" }}>{s.role==="staff"?"Barber/Stylist":s.role}</div>
                      </div>
                      <a href={`/${business?.category}/${slug}/book?staff=${s.id}`} style={{ textDecoration:"none" }}>
                        <button style={{ background:L, border:"none", borderRadius:8, padding:"6px 12px", fontFamily:"Poppins", fontWeight:700, fontSize:11, color:P, cursor:"pointer" }}>Book</button>
                      </a>
                    </div>
                  ))}
                  {staff.length > 4 && (
                    <button onClick={()=>setActiveTab("staff")} style={{ background:"none", border:"none", fontSize:13, color:P, fontWeight:600, fontFamily:"Poppins", cursor:"pointer", textAlign:"left" }}>
                      View all {staff.length} team members →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* SHARE */}
            <div className="fu d3" style={{ background:W, borderRadius:20, padding:24, border:"1.5px solid #eee" }}>
              <div style={{ fontSize:14, fontWeight:700, color:C, marginBottom:16 }}>Share this profile</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <button className="share-btn" onClick={handleCopyLink} style={{ justifyContent:"center" }}>
                  {copied?"✅ Link copied!":"🔗 Copy link"}
                </button>
                <button className="share-btn" onClick={()=>window.open(`https://wa.me/?text=Check out ${business.business_name} on SubSeat: ${window.location.href}`,"_blank")} style={{ justifyContent:"center" }}>
                  💬 Share on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && selectedService && (
        <>
          <div onClick={()=>setShowSubscribeModal(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:998, backdropFilter:"blur(4px)" }} />
          <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:999, background:W, borderRadius:"24px 24px 0 0", padding:"28px 24px 40px", maxWidth:520, margin:"0 auto", boxShadow:"0 -8px 60px rgba(0,0,0,.2)" }}>
            <div style={{ width:40, height:4, borderRadius:4, background:"#e0e0e0", margin:"0 auto 24px" }} />
            <h3 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:6 }}>Subscribe to {selectedService.name}</h3>
            <p style={{ fontSize:14, color:"#888", marginBottom:selectedStaff?8:24 }}>at {business.business_name}</p>
            {selectedStaff && (
              <div style={{ display:"flex", alignItems:"center", gap:10, background:L, borderRadius:12, padding:"10px 14px", marginBottom:20 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:P, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                  {selectedStaff.avatar_url ? <img src={selectedStaff.avatar_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "👤"}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:P }}>Subscribing with</div>
                  <div style={{ fontSize:14, fontWeight:800, color:C }}>{selectedStaff.full_name}</div>
                </div>
              </div>
            )}
            <div style={{ background:G, borderRadius:14, padding:20, marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <span style={{ fontSize:14, color:"#666" }}>Monthly subscription</span>
                <span style={{ fontSize:16, fontWeight:800, color:C }}>£{parseFloat(selectedService.monthly_price).toFixed(2)}/mo</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:14, color:"#666" }}>Appointment duration</span>
                <span style={{ fontSize:14, fontWeight:600, color:C }}>{selectedService.duration_minutes} mins</span>
              </div>
            </div>
            <a href="/auth" style={{ display:"block", background:P, color:W, textDecoration:"none", padding:"16px", borderRadius:12, fontWeight:700, fontSize:16, fontFamily:"Poppins", textAlign:"center", boxShadow:"0 6px 24px rgba(86,59,231,.32)", marginBottom:12 }}>
              {subLoading ? "Processing..." : "Sign Up & Subscribe"}
            </a>
            <button onClick={()=>setShowSubscribeModal(false)} style={{ width:"100%", padding:"14px", borderRadius:12, background:"transparent", border:"2px solid #eee", fontFamily:"Poppins", fontWeight:600, fontSize:15, cursor:"pointer", color:"#888" }}>
              Maybe later
            </button>
          </div>
        </>
      )}
    </>
  );
}