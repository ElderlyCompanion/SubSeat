'use client';
import { useState } from "react";
import { supabase } from "../lib/supabase";

const P   = "#563BE7";
const L   = "#E9E6FF";
const C   = "#171717";
const G   = "#F4F4F4";
const W   = "#ffffff";

const INSURANCE_PARTNER_EMAIL = "insurance@partner.com"; // ← swap when you have a partner
const ADMIN_EMAIL             = "admin@subseat.co.uk";

const COVERS = [
  {
    id:    "public_liability",
    icon:  "🛡️",
    title: "Public Liability",
    desc:  "Covers you if a client is injured or their property is damaged while in your care. Essential for anyone who works with the public.",
    from:  8,
    tag:   "Most popular",
  },
  {
    id:    "employers_liability",
    icon:  "👥",
    title: "Employers' Liability",
    desc:  "Required by UK law if you employ anyone, even part-time or casual staff. Covers injury or illness claims from employees.",
    from:  12,
    tag:   "Required by law",
  },
  {
    id:    "treatment_liability",
    icon:  "💆",
    title: "Treatment Liability",
    desc:  "Covers claims arising from beauty, hair or wellness treatments — including allergic reactions or treatment errors.",
    from:  10,
    tag:   "Beauty specific",
  },
  {
    id:    "professional_indemnity",
    icon:  "📋",
    title: "Professional Indemnity",
    desc:  "Protects you if a client claims your advice or service caused them a financial loss. Common for senior professionals.",
    from:  9,
    tag:   "Advisors & seniors",
  },
  {
    id:    "equipment_cover",
    icon:  "✂️",
    title: "Equipment Cover",
    desc:  "Covers your clippers, chairs, tools and equipment against theft, loss or accidental damage — in the shop or on the road.",
    from:  6,
    tag:   "Mobile pros too",
  },
];

const BUSINESS_TYPES = [
  "Barber","Hair Salon","Nail Technician","Lash Artist",
  "Brow Artist","Beauty Salon","Massage Therapist",
  "Skincare Specialist","Mobile Professional","Other",
];

const STAFF_OPTIONS = [
  "Just me (sole trader)",
  "1–3 staff",
  "4–10 staff",
  "11–25 staff",
  "26+ staff",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Poppins',sans-serif;background:#fafafa;color:${C};overflow-x:hidden}

  @keyframes fadeUp {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse  {0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin   {to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

  .fu  {animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both}
  .d1  {animation-delay:.1s} .d2{animation-delay:.2s} .d3{animation-delay:.3s}

  .inp{
    width:100%;padding:13px 16px;border-radius:12px;
    border:1.5px solid #e0e0e0;background:${W};
    font-family:'Poppins',sans-serif;font-size:15px;color:${C};
    outline:none;transition:border-color .2s;min-height:48px;
  }
  .inp:focus{border-color:${P};box-shadow:0 0 0 3px rgba(86,59,231,.08)}
  .inp::placeholder{color:#bbb}
  select.inp{cursor:pointer}
  select.inp option{background:${W}}

  .btn-primary{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:${P};color:${W};border:none;padding:16px 32px;border-radius:14px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:16px;
    cursor:pointer;transition:all .2s;box-shadow:0 8px 24px rgba(86,59,231,.35);
    width:100%;
  }
  .btn-primary:hover{background:#4429d4;transform:translateY(-2px);box-shadow:0 12px 32px rgba(86,59,231,.45)}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}

  .cover-card{
    background:${W};border-radius:18px;padding:24px;
    border:2px solid #eee;cursor:pointer;transition:all .2s;
    position:relative;
  }
  .cover-card:hover{border-color:${P};transform:translateY(-3px);box-shadow:0 12px 36px rgba(86,59,231,.12)}
  .cover-card.selected{border-color:${P};background:${L}}

  .check-circle{
    width:24px;height:24px;border-radius:50%;
    border:2px solid #e0e0e0;display:flex;align-items:center;
    justify-content:center;flex-shrink:0;transition:all .2s;
  }
  .check-circle.checked{background:${P};border-color:${P}}

  @media(max-width:768px){
    .covers-grid{grid-template-columns:1fr !important}
    .form-two{grid-template-columns:1fr !important}
    .stats-grid{grid-template-columns:1fr 1fr !important}
    .hero-stats{flex-direction:column !important;align-items:center !important}
    .why-grid{grid-template-columns:1fr 1fr !important}
  }
  @media(max-width:480px){
    .why-grid{grid-template-columns:1fr !important}
    .stats-grid{grid-template-columns:1fr 1fr !important}
  }
`;

/* ── PREMIUM ESTIMATOR ── */
function estimatePremium(selectedCovers, staffCount) {
  if (selectedCovers.length === 0) return null;
  const staffMultiplier =
    staffCount === "Just me (sole trader)" ? 1 :
    staffCount === "1–3 staff"             ? 1.6 :
    staffCount === "4–10 staff"            ? 2.4 :
    staffCount === "11–25 staff"           ? 3.5 : 5;

  const base = selectedCovers.reduce((a, id) => {
    const cover = COVERS.find(c => c.id === id);
    return a + (cover?.from || 8);
  }, 0);

  const monthly = Math.round(base * staffMultiplier);
  const annual  = Math.round(monthly * 10.8); // slight annual discount
  return { monthly, annual };
}

export default function InsurancePage() {
  const [selectedCovers, setSelectedCovers] = useState([]);
  const [form, setForm] = useState({
    full_name:"", business_name:"", email:"", phone:"",
    business_type:"", staff_count:"", postcode:"",
    renewal_date:"", consent:false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const toggleCover = id => {
    setSelectedCovers(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const estimate = estimatePremium(selectedCovers, form.staff_count);

  const handleSubmit = async () => {
    if (!form.full_name || !form.business_name || !form.email || !form.phone) {
      setError("Please fill in all required fields."); return;
    }
    if (selectedCovers.length === 0) {
      setError("Please select at least one type of cover."); return;
    }
    if (!form.consent) {
      setError("Please tick the consent box to continue."); return;
    }
    setError(""); setSubmitting(true);
    try {
      const coverLabel = selectedCovers.map(id => COVERS.find(c=>c.id===id)?.title).join(", ");

      const { error:dbErr } = await supabase.from("insurance_applications").insert({
        full_name:     form.full_name,
        business_name: form.business_name,
        email:         form.email,
        phone:         form.phone,
        business_type: form.business_type,
        staff_count:   form.staff_count,
        postcode:      form.postcode,
        cover_needed:  coverLabel,
        renewal_date:  form.renewal_date || null,
        status:        "pending",
      });
      if (dbErr) throw dbErr;

      await fetch("/api/insurance-apply", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          ...form,
          covers:      coverLabel,
          estimate,
          adminEmail:   ADMIN_EMAIL,
          partnerEmail: INSURANCE_PARTNER_EMAIL,
        }),
      });

      setSubmitted(true);
    } catch(err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{background:"rgba(255,255,255,.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid #eee",padding:"0 5%",height:68,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
          <div style={{width:34,height:34,borderRadius:9,background:P,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <div style={{position:"absolute",right:-4,top:"50%",transform:"translateY(-50%)",width:10,height:10,borderRadius:"50%",background:W}}/>
            <span style={{color:W,fontWeight:900,fontSize:17}}>S</span>
          </div>
          <span style={{fontWeight:800,fontSize:18,color:P}}>SubSeat</span>
        </a>
        <a href="#quote-form" style={{background:P,color:W,textDecoration:"none",padding:"10px 22px",borderRadius:10,fontWeight:700,fontSize:14,fontFamily:"Poppins"}}>
          Get a Quote
        </a>
      </nav>

      {/* HERO */}
      <section style={{background:`linear-gradient(160deg,#0f0f1a 0%,#1a1040 50%,#0f0f1a 100%)`,padding:"90px 5% 80px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(86,59,231,.25) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.02) 1px,transparent 1px)",backgroundSize:"40px 40px",pointerEvents:"none"}}/>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <div className="fu" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(86,59,231,.25)",border:"1px solid rgba(86,59,231,.4)",borderRadius:100,padding:"7px 20px",fontSize:12,fontWeight:700,color:"#a78bfa",letterSpacing:1.5,textTransform:"uppercase",marginBottom:28}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#a78bfa",animation:"pulse 2s infinite",display:"inline-block"}}/>
            SubSeat Insurance
          </div>
          <h1 className="fu d1" style={{fontWeight:900,fontSize:"clamp(32px,5.5vw,62px)",color:W,letterSpacing:"-2.5px",lineHeight:1.05,marginBottom:20}}>
            Protect your business<br/>
            <span style={{color:"#a78bfa"}}>with simple cover.</span>
          </h1>
          <p className="fu d2" style={{fontSize:"clamp(15px,1.8vw,18px)",color:"rgba(255,255,255,.6)",lineHeight:1.75,maxWidth:520,margin:"0 auto 40px"}}>
            Insurance options built for barbers, salons and beauty professionals. Get covered from as little as £6/month.
          </p>

          {/* HERO STATS */}
          <div className="fu d3 hero-stats" style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
            {[
              {val:"From £6/mo", label:"Monthly premiums"},
              {val:"5 covers",   label:"Available to combine"},
              {val:"48 hrs",     label:"Quote turnaround"},
            ].map((s,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"14px 22px",textAlign:"center"}}>
                <div style={{fontWeight:900,fontSize:20,color:W,fontFamily:"'DM Mono',monospace"}}>{s.val}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY YOU NEED IT */}
      <section style={{padding:"72px 5%",background:W}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{display:"inline-block",background:L,borderRadius:100,padding:"6px 18px",fontSize:11,fontWeight:700,color:P,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Why It Matters</div>
            <h2 style={{fontWeight:800,fontSize:"clamp(24px,3.5vw,38px)",color:C,letterSpacing:"-1.5px",marginBottom:10}}>One claim can cost thousands.</h2>
            <p style={{fontSize:15,color:"#888",maxWidth:480,margin:"0 auto"}}>Most beauty professionals are uninsured. It only takes one incident to change everything.</p>
          </div>
          <div className="why-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            {[
              {icon:"⚖️",  stat:"1 in 3",  label:"beauty businesses face a claim at some point",      color:"#e53e3e"},
              {icon:"💸",  stat:"£15,000+",label:"average cost of a public liability claim",            color:"#f59e0b"},
              {icon:"📋",  stat:"Required",label:"by law if you employ anyone in the UK",               color:P        },
              {icon:"📱",  stat:"5 mins",  label:"to request a quote through SubSeat Insurance",        color:"#22c55e"},
            ].map((s,i)=>(
              <div key={i} style={{background:G,borderRadius:18,padding:"24px 20px",textAlign:"center",border:"1.5px solid #eee"}}>
                <div style={{fontSize:32,marginBottom:10}}>{s.icon}</div>
                <div style={{fontWeight:900,fontSize:22,color:s.color,marginBottom:6,letterSpacing:"-0.5px",fontFamily:"'DM Mono',monospace"}}>{s.stat}</div>
                <div style={{fontSize:13,color:"#666",lineHeight:1.55}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVER TYPES */}
      <section style={{padding:"72px 5%",background:G}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{display:"inline-block",background:L,borderRadius:100,padding:"6px 18px",fontSize:11,fontWeight:700,color:P,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Cover Options</div>
            <h2 style={{fontWeight:800,fontSize:"clamp(24px,3.5vw,38px)",color:C,letterSpacing:"-1.5px",marginBottom:10}}>Choose your cover.</h2>
            <p style={{fontSize:15,color:"#888"}}>Select all that apply — you can combine covers for a better rate.</p>
          </div>

          <div className="covers-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:32}}>
            {COVERS.map(c=>{
              const selected = selectedCovers.includes(c.id);
              return (
                <div key={c.id} className={`cover-card ${selected?"selected":""}`} onClick={()=>toggleCover(c.id)}>
                  {/* TAG */}
                  <div style={{position:"absolute",top:16,right:16,background:selected?P:L,color:selected?W:P,borderRadius:100,padding:"3px 10px",fontSize:10,fontWeight:700,transition:"all .2s"}}>
                    {c.tag}
                  </div>
                  <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                    <div className={`check-circle ${selected?"checked":""}`}>
                      {selected && <svg width="12" height="12" viewBox="0 0 12 10" fill="none"><path d="M1 5l3 4 7-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{flex:1,paddingRight:60}}>
                      <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
                      <div style={{fontWeight:700,fontSize:16,color:C,marginBottom:6}}>{c.title}</div>
                      <div style={{fontSize:13,color:"#666",lineHeight:1.65,marginBottom:10}}>{c.desc}</div>
                      <div style={{fontWeight:800,fontSize:15,color:selected?P:"#888"}}>From £{c.from}/month</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PREMIUM ESTIMATOR */}
          {selectedCovers.length > 0 && (
            <div style={{background:`linear-gradient(135deg,${P},#7c3aed)`,borderRadius:20,padding:"28px 32px",textAlign:"center",boxShadow:"0 20px 60px rgba(86,59,231,.35)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.7)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>
                Your estimated premium
              </div>
              {estimate ? (
                <>
                  <div style={{fontSize:"clamp(44px,7vw,72px)",fontWeight:900,color:W,letterSpacing:"-3px",lineHeight:1,fontFamily:"'DM Mono',monospace",marginBottom:8}}>
                    £{estimate.monthly}/mo
                  </div>
                  <div style={{fontSize:15,color:"rgba(255,255,255,.65)",marginBottom:16}}>
                    or £{estimate.annual}/year (save ~10% paying annually)
                  </div>
                </>
              ) : (
                <div style={{fontSize:18,color:"rgba(255,255,255,.7)",marginBottom:16}}>Select your staff count below to see your estimate</div>
              )}
              <div style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>
                Estimate based on {selectedCovers.length} cover{selectedCovers.length!==1?"s":""} selected. Final premium confirmed by our insurance partner.
              </div>
              <a href="#quote-form" style={{display:"inline-block",marginTop:20,background:W,color:P,textDecoration:"none",padding:"13px 28px",borderRadius:12,fontFamily:"Poppins",fontWeight:700,fontSize:15,boxShadow:"0 4px 16px rgba(0,0,0,.15)"}}>
                Get My Quote →
              </a>
            </div>
          )}

          {selectedCovers.length === 0 && (
            <div style={{textAlign:"center",padding:"20px 0",color:"#aaa",fontSize:14}}>
              Select one or more covers above to see your estimated premium.
            </div>
          )}
        </div>
      </section>

      {/* QUOTE FORM */}
      <section id="quote-form" style={{padding:"72px 5%",background:W}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div style={{display:"inline-block",background:L,borderRadius:100,padding:"6px 18px",fontSize:11,fontWeight:700,color:P,letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Get a Quote</div>
            <h2 style={{fontWeight:800,fontSize:"clamp(24px,3.5vw,38px)",color:C,letterSpacing:"-1.5px",marginBottom:10}}>Request your quote.</h2>
            <p style={{fontSize:15,color:"#888"}}>Takes under 5 minutes. Our insurance partner will contact you within 48 hours.</p>
          </div>

          {submitted ? (
            <div style={{background:"#f0fdf4",border:"2px solid #bbf7d0",borderRadius:22,padding:"48px 40px",textAlign:"center"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 20px"}}>✅</div>
              <h3 style={{fontWeight:900,fontSize:24,color:C,marginBottom:12}}>Quote request received!</h3>
              <p style={{fontSize:15,color:"#555",lineHeight:1.7,marginBottom:20}}>
                Thanks, <strong>{form.full_name}</strong>. Your insurance request has been received. Our insurance partner will review your details and contact you at <strong>{form.email}</strong> with a personalised quote within 48 hours.
              </p>
              {estimate && (
                <div style={{background:W,borderRadius:14,padding:"16px 20px",display:"inline-block",marginBottom:24,border:`1.5px solid ${L}`}}>
                  <div style={{fontSize:13,color:"#888",marginBottom:4}}>Your estimated premium</div>
                  <div style={{fontWeight:900,fontSize:22,color:P,fontFamily:"'DM Mono',monospace"}}>From £{estimate.monthly}/month</div>
                </div>
              )}
              <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                <a href="/dashboard" style={{background:P,color:W,textDecoration:"none",padding:"13px 24px",borderRadius:12,fontFamily:"Poppins",fontWeight:700,fontSize:14}}>Back to Dashboard</a>
                <a href="/" style={{background:G,color:C,textDecoration:"none",padding:"13px 24px",borderRadius:12,fontFamily:"Poppins",fontWeight:700,fontSize:14}}>Go to Homepage</a>
              </div>
            </div>
          ) : (
            <div style={{background:W,borderRadius:22,padding:36,border:"1.5px solid #eee",boxShadow:"0 4px 24px rgba(86,59,231,.06)"}}>

              {/* SELECTED COVERS SUMMARY */}
              {selectedCovers.length > 0 && (
                <div style={{background:L,borderRadius:14,padding:"14px 18px",marginBottom:24}}>
                  <div style={{fontSize:12,fontWeight:700,color:P,marginBottom:8}}>Selected covers</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {selectedCovers.map(id=>{
                      const cover = COVERS.find(c=>c.id===id);
                      return (
                        <span key={id} style={{background:P,color:W,borderRadius:100,padding:"4px 12px",fontSize:12,fontWeight:700}}>
                          {cover?.icon} {cover?.title}
                        </span>
                      );
                    })}
                  </div>
                  {estimate && (
                    <div style={{fontSize:13,color:P,fontWeight:700,marginTop:10}}>
                      Estimated from £{estimate.monthly}/month
                    </div>
                  )}
                </div>
              )}

              {selectedCovers.length === 0 && (
                <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"12px 16px",marginBottom:20,fontSize:13,color:"#92400e"}}>
                  No covers selected yet. <a href="#covers" style={{color:P,fontWeight:700}}>Scroll up to choose →</a>
                </div>
              )}

              <div style={{display:"flex",flexDirection:"column",gap:18}}>

                <div style={{fontSize:12,fontWeight:700,color:"#aaa",letterSpacing:1.5,textTransform:"uppercase",paddingBottom:8,borderBottom:"1px solid #f0f0f0"}}>Your Details</div>

                <div className="form-two" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Full Name *</label>
                    <input className="inp" placeholder="Jordan Smith" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Business Name *</label>
                    <input className="inp" placeholder="The Cut Lab" value={form.business_name} onChange={e=>setForm({...form,business_name:e.target.value})}/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Email *</label>
                    <input className="inp" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Phone *</label>
                    <input className="inp" type="tel" placeholder="07700 000000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
                  </div>
                </div>

                <div style={{fontSize:12,fontWeight:700,color:"#aaa",letterSpacing:1.5,textTransform:"uppercase",paddingBottom:8,borderBottom:"1px solid #f0f0f0",marginTop:4}}>Business Details</div>

                <div className="form-two" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Business Type</label>
                    <select className="inp" value={form.business_type} onChange={e=>setForm({...form,business_type:e.target.value})}>
                      <option value="">Select type</option>
                      {BUSINESS_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Number of Staff</label>
                    <select className="inp" value={form.staff_count} onChange={e=>setForm({...form,staff_count:e.target.value})}>
                      <option value="">Select</option>
                      {STAFF_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>Business Postcode</label>
                    <input className="inp" placeholder="E1 6RF" value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value.toUpperCase()})}/>
                  </div>
                  <div>
                    <label style={{fontSize:13,fontWeight:600,color:C,display:"block",marginBottom:6}}>
                      Current Renewal Date <span style={{fontWeight:400,color:"#bbb"}}>(optional)</span>
                    </label>
                    <input className="inp" type="date" value={form.renewal_date} onChange={e=>setForm({...form,renewal_date:e.target.value})}/>
                  </div>
                </div>

                {/* CONSENT */}
                <label style={{display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",padding:"16px 18px",background:L,borderRadius:12,border:`1.5px solid ${form.consent?P:"transparent"}`,transition:"border-color .2s"}}>
                  <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}
                    style={{marginTop:2,accentColor:P,width:18,height:18,flexShrink:0}}/>
                  <span style={{fontSize:13,color:C,lineHeight:1.6}}>
                    I agree for SubSeat to share my details with its insurance partner for the purpose of obtaining an insurance quote. I understand my information will be handled in accordance with SubSeat's <a href="/privacy" style={{color:P}}>Privacy Policy</a>.
                  </span>
                </label>

                {error && (
                  <div style={{background:"#fff5f5",border:"1px solid #ffcccc",borderRadius:10,padding:"12px 16px",fontSize:13,color:"#e53e3e",fontWeight:600}}>
                    {error}
                  </div>
                )}

                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/> Processing...</>
                  ) : "Request My Quote →"}
                </button>

                <p style={{fontSize:12,color:"#aaa",textAlign:"center",lineHeight:1.6}}>
                  By submitting you agree to our <a href="/terms" style={{color:P}}>Terms of Service</a>. Requesting a quote does not commit you to purchasing insurance.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"72px 5%",background:G}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <h2 style={{fontWeight:800,fontSize:"clamp(22px,3.5vw,36px)",color:C,letterSpacing:"-1.5px",textAlign:"center",marginBottom:48}}>How it works</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:24}}>
            {[
              {icon:"✅", title:"Choose your cover",   body:"Select the types of insurance you need. Combine covers for better value."},
              {icon:"📋", title:"Request a quote",     body:"Fill in a short form. No lengthy questionnaires. Takes under 5 minutes."},
              {icon:"📞", title:"Partner contacts you",body:"Our insurance partner reviews your details and contacts you within 48 hours."},
              {icon:"🛡️", title:"Get covered",         body:"Accept your quote and get covered. Your certificate is sent directly to you."},
            ].map((s,i)=>(
              <div key={i} style={{background:W,borderRadius:18,padding:"24px 20px",border:"1.5px solid #eee",textAlign:"center"}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:L,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 14px"}}>
                  {s.icon}
                </div>
                <div style={{fontWeight:700,fontSize:15,color:C,marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:13,color:"#888",lineHeight:1.65}}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{padding:"60px 5%",background:W}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            {[
              {icon:"🔒", title:"FCA Regulated Partner",   body:"Our insurance partner is authorised and regulated by the Financial Conduct Authority."},
              {icon:"✅", title:"No Obligation Quote",     body:"Requesting a quote is completely free with no commitment to purchase."},
              {icon:"⚡", title:"Fast Turnaround",         body:"Receive your personalised quote within 48 working hours."},
              {icon:"🤝", title:"Specialist Cover",        body:"Insurance designed specifically for beauty and wellness professionals."},
            ].map((t,i)=>(
              <div key={i} style={{background:G,borderRadius:16,padding:"22px 20px",border:"1.5px solid #eee"}}>
                <div style={{fontSize:32,marginBottom:12}}>{t.icon}</div>
                <div style={{fontWeight:700,fontSize:15,color:C,marginBottom:8}}>{t.title}</div>
                <div style={{fontSize:13,color:"#888",lineHeight:1.6}}>{t.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"72px 5%",background:`linear-gradient(135deg,${P},#6d28d9)`,textAlign:"center"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <h2 style={{fontWeight:900,fontSize:"clamp(26px,4vw,44px)",color:W,letterSpacing:"-1.5px",marginBottom:14}}>
            Get covered today.
          </h2>
          <p style={{fontSize:16,color:"rgba(255,255,255,.75)",marginBottom:32,lineHeight:1.7}}>
            From £6/month. No lengthy forms. Our insurance partner will contact you within 48 hours.
          </p>
          <a href="#quote-form" style={{display:"inline-block",background:W,color:P,textDecoration:"none",padding:"16px 36px",borderRadius:14,fontFamily:"Poppins",fontWeight:800,fontSize:16,boxShadow:"0 8px 24px rgba(0,0,0,.2)"}}>
            Request a Free Quote →
          </a>
          <p style={{fontSize:12,color:"rgba(255,255,255,.45)",marginTop:14}}>No commitment · FCA regulated partner · 48hr response</p>
        </div>
      </section>

      {/* LEGAL FOOTER */}
      <footer style={{background:C,padding:"32px 5%",textAlign:"center"}}>
        <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
          {[["Home","/"],["Finance","/finance"],["Marketplace","/marketplace"],["Terms","/terms"],["Privacy","/privacy"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:13,color:"rgba(255,255,255,.35)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <p style={{fontSize:12,color:"rgba(255,255,255,.2)",maxWidth:600,margin:"0 auto",lineHeight:1.6}}>
          SubSeat Insurance is an introduction service. SubSeat Ltd is not an insurer and does not provide insurance advice. All insurance products are provided by our authorised and FCA regulated insurance partner. SubSeat® is a UK registered trademark.
        </p>
      </footer>
    </>
  );
}