'use client';
import { useState } from "react";
import { supabase } from "../lib/supabase";

const P  = "#563BE7";
const L  = "#E9E6FF";
const C  = "#171717";
const G  = "#F4F4F4";
const W  = "#ffffff";

const FINANCE_PARTNER_EMAIL = "finance@partner.com"; // ← swap when you have a partner
const ADMIN_EMAIL           = "admin@subseat.co.uk";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { font-family:'Poppins',sans-serif; background:#fafafa; color:${C}; overflow-x:hidden; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes countUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  .fu  { animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both }
  .d1  { animation-delay:.1s }
  .d2  { animation-delay:.2s }
  .d3  { animation-delay:.3s }

  /* SLIDER */
  input[type=range] {
    -webkit-appearance:none; width:100%; height:6px;
    border-radius:100px; outline:none; cursor:pointer;
    background:linear-gradient(to right,${P} var(--val,50%),#e0deff var(--val,50%));
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance:none; width:24px; height:24px; border-radius:50%;
    background:${W}; box-shadow:0 2px 12px rgba(86,59,231,.4),0 0 0 3px ${P};
    cursor:grab; transition:transform .15s;
  }
  input[type=range]::-webkit-slider-thumb:active { transform:scale(1.2); cursor:grabbing; }

  /* INPUTS */
  .inp {
    width:100%; padding:14px 16px; border-radius:12px;
    border:1.5px solid #e0e0e0; background:${W};
    font-family:'Poppins',sans-serif; font-size:15px; color:${C};
    outline:none; transition:border-color .2s; min-height:48px;
  }
  .inp:focus { border-color:${P}; box-shadow:0 0 0 3px rgba(86,59,231,.08); }
  .inp::placeholder { color:#bbb; }
  select.inp { cursor:pointer; }
  select.inp option { background:${W}; }

  /* BUTTONS */
  .btn-primary {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:${P}; color:${W}; border:none; padding:16px 32px; border-radius:14px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:16px;
    cursor:pointer; transition:all .2s; box-shadow:0 8px 24px rgba(86,59,231,.35);
    width:100%;
  }
  .btn-primary:hover { background:#4429d4; transform:translateY(-2px); box-shadow:0 12px 32px rgba(86,59,231,.45); }
  .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  /* RESULT CARD */
  .result-card {
    border-radius:16px; padding:22px 24px;
    transition:all .3s;
  }

  /* STEP */
  .step-num {
    width:44px; height:44px; border-radius:50%;
    background:${P}; color:${W};
    display:flex; align-items:center; justify-content:center;
    font-weight:800; font-size:16px; flex-shrink:0;
    box-shadow:0 4px 14px rgba(86,59,231,.35);
  }

  /* MOBILE */
  @media(max-width:768px) {
    .calc-grid  { grid-template-columns:1fr !important; }
    .steps-grid { grid-template-columns:1fr !important; gap:20px !important; }
    .form-two   { grid-template-columns:1fr !important; }
    .trust-grid { grid-template-columns:1fr 1fr !important; }
  }
`;

/* ── LOAN CALCULATOR ── */
function calcLoan(amount, termMonths, aprPercent) {
  const r = aprPercent / 100 / 12;
  const monthly = amount * r / (1 - Math.pow(1 + r, -termMonths));
  const total   = monthly * termMonths;
  return {
    monthly: Math.round(monthly * 100) / 100,
    total:   Math.round(total   * 100) / 100,
    interest: Math.round((total - amount) * 100) / 100,
  };
}

const fmt = n => `£${Math.round(n).toLocaleString("en-GB")}`;
const fmtD = n => `£${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`;

export default function FinancePage() {
  /* CALCULATOR STATE */
  const [amount,    setAmount]   = useState(10000);
  const [term,      setTerm]     = useState(12);
  const [apr,       setApr]      = useState(12);

  /* FORM STATE */
  const [form,      setForm]     = useState({
    full_name:"", business_name:"", email:"", phone:"",
    business_type:"", monthly_revenue:"", time_trading:"", consent:false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const pct = ((amount - 1000) / (50000 - 1000)) * 100;
  const loan = calcLoan(amount, term, apr);

  const handleSubmit = async () => {
    if (!form.full_name || !form.business_name || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.consent) {
      setError("Please tick the consent box to continue.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      /* SAVE TO SUPABASE */
      const { error: dbError } = await supabase.from("finance_applications").insert({
        full_name:                   form.full_name,
        business_name:               form.business_name,
        email:                       form.email,
        phone:                       form.phone,
        business_type:               form.business_type,
        monthly_revenue:             form.monthly_revenue,
        time_trading:                form.time_trading,
        amount_requested:            amount,
        term_months:                 term,
        estimated_total_repayment:   loan.total,
        estimated_monthly_repayment: loan.monthly,
        status:                      "pending",
      });

      if (dbError) throw dbError;

      /* SEND NOTIFICATION EMAIL via API route */
      await fetch("/api/finance-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount, term, apr,
          monthly: loan.monthly,
          total:   loan.total,
          adminEmail:   ADMIN_EMAIL,
          partnerEmail: FINANCE_PARTNER_EMAIL,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:"rgba(255,255,255,.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid #eee", padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:P }}>SubSeat</span>
        </a>
        <a href="/onboarding" style={{ background:P, color:W, textDecoration:"none", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"Poppins" }}>
          Get Started
        </a>
      </nav>

      {/* HERO */}
      <section style={{ background:`linear-gradient(160deg,#0f0f1a 0%,#1a1040 50%,#0f0f1a 100%)`, padding:"90px 5% 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(86,59,231,.25) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />

        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div className="fu" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(86,59,231,.25)", border:"1px solid rgba(86,59,231,.4)", borderRadius:100, padding:"7px 20px", fontSize:12, fontWeight:700, color:"#a78bfa", letterSpacing:1.5, textTransform:"uppercase", marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", animation:"pulse 2s infinite", display:"inline-block" }} />
            SubSeat Finance
          </div>
          <h1 className="fu d1" style={{ fontWeight:900, fontSize:"clamp(32px,5.5vw,62px)", color:W, letterSpacing:"-2.5px", lineHeight:1.05, marginBottom:20 }}>
            Get funding to grow<br/>
            <span style={{ color:"#a78bfa" }}>your business.</span>
          </h1>
          <p className="fu d2" style={{ fontSize:"clamp(15px,1.8vw,18px)", color:"rgba(255,255,255,.6)", lineHeight:1.75, maxWidth:520, margin:"0 auto 40px" }}>
            Fast, simple funding options for barbers and beauty businesses. Check your estimate in seconds — no credit check required.
          </p>
          <div className="fu d3" style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
            {[
              { val:"£1k–£50k", label:"Funding available" },
              { val:"3–24 mo",  label:"Flexible terms"    },
              { val:"48 hrs",   label:"Decision time"     },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", borderRadius:14, padding:"14px 22px", textAlign:"center" }}>
                <div style={{ fontWeight:900, fontSize:22, color:W, letterSpacing:"-0.5px", fontFamily:"'DM Mono',monospace" }}>{s.val}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", marginTop:3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"72px 5%", background:W }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 18px", fontSize:11, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>How It Works</div>
            <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3.5vw,38px)", color:C, letterSpacing:"-1.5px" }}>Three steps to funding.</h2>
          </div>
          <div className="steps-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32 }}>
            {[
              { num:"01", title:"Check your estimate",  body:"Use our loan calculator to see your monthly repayment before you apply. No credit check, no commitment.",           icon:"🧮" },
              { num:"02", title:"Apply in minutes",     body:"Fill in a short form about your business. Takes under 5 minutes. Our finance partner reviews your application.",    icon:"📋" },
              { num:"03", title:"Hear back in 48 hrs",  body:"Our finance partner will contact you directly with a decision and your final rate within two working days.",        icon:"✅" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:16 }}>
                <div className="step-num">{s.num}</div>
                <div>
                  <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
                  <div style={{ fontWeight:700, fontSize:17, color:C, marginBottom:8 }}>{s.title}</div>
                  <div style={{ fontSize:14, color:"#666", lineHeight:1.7 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR + FORM */}
      <section id="apply" style={{ padding:"72px 5%", background:G }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 18px", fontSize:11, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>Loan Calculator</div>
            <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3.5vw,38px)", color:C, letterSpacing:"-1.5px", marginBottom:10 }}>See your estimate.</h2>
            <p style={{ fontSize:15, color:"#888" }}>Adjust the sliders to see your monthly repayment instantly.</p>
          </div>

          <div className="calc-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:28, alignItems:"start" }}>

            {/* LEFT — SLIDERS */}
            <div style={{ background:W, borderRadius:22, padding:32, border:"1.5px solid #eee", boxShadow:"0 4px 20px rgba(0,0,0,.04)" }}>
              <h3 style={{ fontWeight:700, fontSize:17, color:C, marginBottom:28 }}>Customise your loan</h3>

              {/* AMOUNT SLIDER */}
              <div style={{ marginBottom:28 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
                  <label style={{ fontSize:14, fontWeight:600, color:C }}>How much do you need?</label>
                  <span style={{ fontSize:24, fontWeight:900, color:P, fontFamily:"'DM Mono',monospace" }}>{fmt(amount)}</span>
                </div>
                <input type="range" min={1000} max={50000} step={500} value={amount}
                  style={{ "--val":`${pct}%` }}
                  onChange={e => setAmount(Number(e.target.value))} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                  <span style={{ fontSize:11, color:"#bbb" }}>£1,000</span>
                  <span style={{ fontSize:11, color:"#bbb" }}>£50,000</span>
                </div>
              </div>

              {/* TERM */}
              <div style={{ marginBottom:28 }}>
                <label style={{ fontSize:14, fontWeight:600, color:C, display:"block", marginBottom:10 }}>Repayment term</label>
                <div style={{ display:"flex", gap:10 }}>
                  {[3,6,12,24].map(t => (
                    <button key={t} onClick={() => setTerm(t)}
                      style={{ flex:1, padding:"12px 8px", borderRadius:10, border:`2px solid ${term===t?P:"#eee"}`, background:term===t?P:W, color:term===t?W:C, fontFamily:"Poppins", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .18s" }}>
                      {t} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* APR */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
                  <label style={{ fontSize:14, fontWeight:600, color:C }}>Representative APR</label>
                  <span style={{ fontSize:20, fontWeight:900, color:P, fontFamily:"'DM Mono',monospace" }}>{apr}%</span>
                </div>
                <input type="range" min={6} max={30} step={0.5} value={apr}
                  style={{ "--val":`${((apr-6)/(30-6))*100}%` }}
                  onChange={e => setApr(Number(e.target.value))} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                  <span style={{ fontSize:11, color:"#bbb" }}>6% APR</span>
                  <span style={{ fontSize:11, color:"#bbb" }}>30% APR</span>
                </div>
                <div style={{ fontSize:12, color:"#aaa", marginTop:8 }}>
                  Typical rate: 12% APR. Final rate determined by finance partner after review.
                </div>
              </div>

              {/* DISCLAIMER */}
              <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"11px 14px", fontSize:12, color:"#92400e", lineHeight:1.55 }}>
                This is an estimate only. Final rates and approval are provided by our finance partner and may differ based on your credit profile and business history.
              </div>
            </div>

            {/* RIGHT — RESULTS */}
            <div style={{ position:"sticky", top:88 }}>
              {/* MAIN RESULT */}
              <div style={{ background:`linear-gradient(135deg,${P} 0%,#7c3aed 100%)`, borderRadius:22, padding:32, marginBottom:16, boxShadow:"0 20px 60px rgba(86,59,231,.35)" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.65)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Monthly repayment</div>
                <div style={{ fontSize:"clamp(44px,6vw,68px)", fontWeight:900, color:W, letterSpacing:"-2px", lineHeight:1, fontFamily:"'DM Mono',monospace", marginBottom:6 }}>
                  {fmtD(loan.monthly)}
                </div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,.6)" }}>per month for {term} months</div>
              </div>

              {/* BREAKDOWN */}
              <div style={{ background:W, borderRadius:18, padding:24, border:"1.5px solid #eee", marginBottom:16, boxShadow:"0 4px 20px rgba(0,0,0,.04)" }}>
                {[
                  { label:"Amount borrowed",  val:fmtD(amount),       color:C          },
                  { label:"Total interest",   val:fmtD(loan.interest), color:"#e53e3e"  },
                  { label:"Total repayment",  val:fmtD(loan.total),    color:P          },
                  { label:"APR",              val:`${apr}% APR`,       color:"#888"     },
                ].map((r,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:i<3?"1px solid #f0f0f0":"none" }}>
                    <span style={{ fontSize:14, color:"#888", fontWeight:500 }}>{r.label}</span>
                    <span style={{ fontSize:16, fontWeight:800, color:r.color, fontFamily:"'DM Mono',monospace" }}>{r.val}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="btn-primary" onClick={() => document.getElementById("application-form").scrollIntoView({ behavior:"smooth" })}>
                Apply Now — Free & No Obligation
              </button>
              <p style={{ fontSize:12, color:"#aaa", textAlign:"center", marginTop:10 }}>No credit check to apply · Decision within 48 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="application-form" style={{ padding:"72px 5%", background:W }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 18px", fontSize:11, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>Apply Now</div>
            <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3.5vw,38px)", color:C, letterSpacing:"-1.5px", marginBottom:10 }}>Your application.</h2>
            <p style={{ fontSize:15, color:"#888" }}>Takes under 5 minutes. No credit check required to apply.</p>
          </div>

          {submitted ? (
            /* SUCCESS */
            <div style={{ background:"#f0fdf4", border:"2px solid #bbf7d0", borderRadius:22, padding:"48px 40px", textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>✅</div>
              <h3 style={{ fontWeight:900, fontSize:24, color:C, marginBottom:12 }}>Application received!</h3>
              <p style={{ fontSize:15, color:"#555", lineHeight:1.7, marginBottom:20 }}>
                Thanks, <strong>{form.full_name}</strong>. Your finance request has been received. Our finance partner will review your application and contact you at <strong>{form.email}</strong> with next steps within 48 hours.
              </p>
              <div style={{ background:W, borderRadius:14, padding:"16px 20px", display:"inline-block", marginBottom:28 }}>
                <div style={{ fontSize:13, color:"#888", marginBottom:4 }}>Your application summary</div>
                <div style={{ fontWeight:800, fontSize:20, color:P }}>{fmt(amount)} over {term} months</div>
                <div style={{ fontSize:13, color:"#888", marginTop:2 }}>{fmtD(loan.monthly)}/mo estimated repayment</div>
              </div>
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                <a href="/dashboard" style={{ background:P, color:W, textDecoration:"none", padding:"13px 24px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:14 }}>Back to Dashboard</a>
                <a href="/" style={{ background:G, color:C, textDecoration:"none", padding:"13px 24px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:14 }}>Go to Homepage</a>
              </div>
            </div>
          ) : (
            /* FORM */
            <div style={{ background:W, borderRadius:22, padding:36, border:"1.5px solid #eee", boxShadow:"0 4px 24px rgba(86,59,231,.06)" }}>

              {/* LOAN SUMMARY */}
              <div style={{ background:L, borderRadius:14, padding:"16px 20px", marginBottom:28, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#888" }}>You are applying for</div>
                  <div style={{ fontWeight:900, fontSize:22, color:P, letterSpacing:"-0.5px", fontFamily:"'DM Mono',monospace" }}>{fmt(amount)} over {term} months</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#888" }}>Estimated monthly</div>
                  <div style={{ fontWeight:900, fontSize:22, color:C, fontFamily:"'DM Mono',monospace" }}>{fmtD(loan.monthly)}/mo</div>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

                {/* PERSONAL */}
                <div style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:1.5, textTransform:"uppercase", paddingBottom:8, borderBottom:"1px solid #f0f0f0" }}>Personal Details</div>

                <div className="form-two" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Full Name *</label>
                    <input className="inp" placeholder="Jordan Smith" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Business Name *</label>
                    <input className="inp" placeholder="The Cut Lab" value={form.business_name} onChange={e=>setForm({...form,business_name:e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Email Address *</label>
                    <input className="inp" type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Phone *</label>
                    <input className="inp" type="tel" placeholder="07700 000000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                  </div>
                </div>

                {/* BUSINESS */}
                <div style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:1.5, textTransform:"uppercase", paddingBottom:8, borderBottom:"1px solid #f0f0f0", marginTop:8 }}>Business Details</div>

                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Business Type</label>
                  <select className="inp" value={form.business_type} onChange={e=>setForm({...form,business_type:e.target.value})}>
                    <option value="">Select your business type</option>
                    {["Barber","Hair Salon","Nail Technician","Lash Artist","Brow Artist","Beauty Salon","Massage Therapist","Skincare Specialist","Mobile Professional","Other"].map(t=>(
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-two" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Monthly Revenue</label>
                    <select className="inp" value={form.monthly_revenue} onChange={e=>setForm({...form,monthly_revenue:e.target.value})}>
                      <option value="">Select range</option>
                      {["Under £1,000","£1,000–£2,500","£2,500–£5,000","£5,000–£10,000","£10,000–£25,000","Over £25,000"].map(r=>(
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Time Trading</label>
                    <select className="inp" value={form.time_trading} onChange={e=>setForm({...form,time_trading:e.target.value})}>
                      <option value="">Select</option>
                      {["Less than 6 months","6–12 months","1–2 years","2–5 years","5+ years"].map(t=>(
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* LOAN DETAILS */}
                <div style={{ fontSize:12, fontWeight:700, color:"#aaa", letterSpacing:1.5, textTransform:"uppercase", paddingBottom:8, borderBottom:"1px solid #f0f0f0", marginTop:8 }}>Loan Details</div>

                <div style={{ background:G, borderRadius:14, padding:"18px 20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                    <div><div style={{ fontSize:12, color:"#888" }}>Amount requested</div><div style={{ fontWeight:800, fontSize:18, color:C, fontFamily:"'DM Mono',monospace" }}>{fmt(amount)}</div></div>
                    <div><div style={{ fontSize:12, color:"#888" }}>Term</div><div style={{ fontWeight:800, fontSize:18, color:C }}>{term} months</div></div>
                    <div><div style={{ fontSize:12, color:"#888" }}>Est. monthly</div><div style={{ fontWeight:800, fontSize:18, color:P, fontFamily:"'DM Mono',monospace" }}>{fmtD(loan.monthly)}</div></div>
                    <div><div style={{ fontSize:12, color:"#888" }}>Est. total</div><div style={{ fontWeight:800, fontSize:18, color:C, fontFamily:"'DM Mono',monospace" }}>{fmtD(loan.total)}</div></div>
                  </div>
                  <p style={{ fontSize:12, color:"#aaa" }}>
                    Want to adjust? <button onClick={()=>document.getElementById("apply").scrollIntoView({behavior:"smooth"})} style={{ background:"none", border:"none", color:P, fontFamily:"Poppins", fontWeight:600, fontSize:12, cursor:"pointer", textDecoration:"underline" }}>Go back to calculator</button>
                  </p>
                </div>

                {/* CONSENT */}
                <label style={{ display:"flex", alignItems:"flex-start", gap:12, cursor:"pointer", padding:"16px 18px", background:L, borderRadius:12, border:`1.5px solid ${form.consent?P:"transparent"}`, transition:"border-color .2s" }}>
                  <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}
                    style={{ marginTop:2, accentColor:P, width:18, height:18, flexShrink:0 }} />
                  <span style={{ fontSize:13, color:C, lineHeight:1.6 }}>
                    I agree for SubSeat to share my details with its finance partner for the purpose of processing this funding application. I understand my information will be handled in accordance with SubSeat's <a href="/privacy" style={{ color:P }}>Privacy Policy</a>.
                  </span>
                </label>

                {/* ERROR */}
                {error && (
                  <div style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:10, padding:"12px 16px", fontSize:13, color:"#e53e3e", fontWeight:600 }}>
                    {error}
                  </div>
                )}

                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <><div style={{ width:18, height:18, border:`2px solid rgba(255,255,255,.3)`, borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 1s linear infinite" }} /> Processing...</>
                  ) : "Submit Application"}
                </button>

                <p style={{ fontSize:12, color:"#aaa", textAlign:"center", lineHeight:1.6 }}>
                  By submitting you agree to our <a href="/terms" style={{ color:P }}>Terms of Service</a>. Applying does not affect your credit score.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section style={{ padding:"60px 5%", background:G }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div className="trust-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {[
              { icon:"🔒", title:"Secure & Private",   body:"Your data is encrypted and only shared with our authorised finance partner." },
              { icon:"✅", title:"No Credit Check",    body:"Applying will not affect your credit score." },
              { icon:"⚡", title:"Fast Decision",      body:"Hear back from our finance partner within 48 working hours." },
              { icon:"🤝", title:"No Obligation",      body:"Getting an estimate or applying is completely free with no obligation." },
            ].map((t,i) => (
              <div key={i} style={{ background:W, borderRadius:16, padding:"22px 20px", border:"1.5px solid #eee" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>{t.icon}</div>
                <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:8 }}>{t.title}</div>
                <div style={{ fontSize:13, color:"#888", lineHeight:1.6 }}>{t.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"32px 5%", textAlign:"center" }}>
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:16 }}>
          {[["Home","/"],["About","/about"],["Contact","/contact"],["Terms","/terms"],["Privacy","/privacy"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,.35)", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.2)", lineHeight:1.6, maxWidth:600, margin:"0 auto" }}>
          SubSeat Finance is an introduction service. SubSeat Ltd is not a lender and does not provide financial advice. All lending decisions are made by our authorised finance partner. SubSeat® is a UK registered trademark.
        </p>
      </footer>
    </>
  );
}