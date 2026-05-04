'use client';
import { useState, useEffect, useRef } from "react";

const P  = "#563BE7";
const L  = "#E9E6FF";
const C  = "#0f0f1a";
const W  = "#ffffff";
const G  = "#f5f4ff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { font-family:'Poppins',sans-serif; background:#fafafa; color:${C}; overflow-x:hidden; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes countUp   { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes glow      { 0%,100%{box-shadow:0 0 24px rgba(86,59,231,.3)} 50%{box-shadow:0 0 48px rgba(86,59,231,.6)} }
  @keyframes slideIn   { from{transform:translateX(-10px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes tick      { 0%{transform:translateY(0)} 50%{transform:translateY(-3px)} 100%{transform:translateY(0)} }

  .fu  { animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both }
  .d1  { animation-delay:.1s } .d2  { animation-delay:.2s }
  .d3  { animation-delay:.3s } .d4  { animation-delay:.4s }

  /* SLIDER */
  input[type=range] {
    -webkit-appearance:none; width:100%; height:6px;
    border-radius:100px; outline:none; cursor:pointer;
    background:linear-gradient(to right, ${P} var(--val,50%), #e0deff var(--val,50%));
    transition:background .1s;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance:none; width:22px; height:22px;
    border-radius:50%; background:${W};
    box-shadow:0 2px 12px rgba(86,59,231,.4), 0 0 0 3px ${P};
    transition:transform .15s, box-shadow .15s; cursor:grab;
  }
  input[type=range]::-webkit-slider-thumb:active {
    transform:scale(1.2); cursor:grabbing;
    box-shadow:0 4px 20px rgba(86,59,231,.6), 0 0 0 4px ${P};
  }
  input[type=range]:focus { outline:none; }

  /* RESULT CARD */
  .res-card {
    background:${W}; border-radius:18px; padding:22px 24px;
    border:1.5px solid #ede9ff; transition:all .2s;
    position:relative; overflow:hidden;
  }
  .res-card:hover { border-color:${P}; transform:translateY(-2px); box-shadow:0 12px 40px rgba(86,59,231,.12); }
  .res-card.hero-card {
    background:linear-gradient(135deg,${P} 0%,#7c3aed 100%);
    border:none; animation:glow 3s ease-in-out infinite;
  }
  .res-card.hero-card .label { color:rgba(255,255,255,.7); }
  .res-card.hero-card .value { color:${W}; }

  /* PROGRESS BAR */
  .progress-track {
    height:10px; background:#eee; border-radius:100px; overflow:hidden; margin-top:8px;
  }
  .progress-fill {
    height:100%; border-radius:100px;
    background:linear-gradient(90deg,${P},#a78bfa);
    transition:width .5s cubic-bezier(.22,1,.36,1);
  }

  /* COMPARISON */
  .comp-card {
    flex:1; border-radius:20px; padding:32px 28px; min-width:240px;
  }
  .comp-before { background:#f8f8f8; border:1.5px solid #eee; }
  .comp-after  { background:linear-gradient(135deg,${P},#6d28d9); color:${W}; }

  /* CTA BTN */
  .btn-cta {
    display:inline-flex; align-items:center; gap:10px;
    background:${P}; color:${W}; border:none;
    padding:17px 36px; border-radius:14px;
    font-family:'Poppins',sans-serif; font-weight:800; font-size:16px;
    cursor:pointer; transition:all .2s;
    box-shadow:0 8px 28px rgba(86,59,231,.4);
    text-decoration:none; white-space:nowrap;
  }
  .btn-cta:hover { background:#4429d4; transform:translateY(-3px); box-shadow:0 16px 40px rgba(86,59,231,.5); }
  .btn-outline {
    display:inline-flex; align-items:center; gap:10px;
    background:transparent; color:${P}; border:2px solid ${P};
    padding:15px 32px; border-radius:14px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:15px;
    cursor:pointer; transition:all .2s; text-decoration:none; white-space:nowrap;
  }
  .btn-outline:hover { background:${L}; transform:translateY(-2px); }

  /* MOBILE */
  @media(max-width:768px) {
    .calc-grid   { grid-template-columns:1fr !important; }
    .results-grid{ grid-template-columns:1fr 1fr !important; }
    .comp-wrap   { flex-direction:column !important; }
    .hero-title  { font-size:clamp(28px,8vw,52px) !important; }
    .cta-btns    { flex-direction:column !important; align-items:stretch !important; }
  }
  @media(max-width:480px) {
    .results-grid{ grid-template-columns:1fr !important; }
  }
`;

/* ── CURRENCY FORMAT ── */
const fmt = (n) => n < 0 ? `-£${Math.abs(Math.round(n)).toLocaleString("en-GB")}` : `£${Math.round(n).toLocaleString("en-GB")}`;

/* ── ANIMATED NUMBER ── */
function AnimNum({ value, prefix="£", suffix="" }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const diff = value - prev.current;
    if (diff === 0) return;
    const steps = 20;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplay(Math.round(prev.current + (diff * i / steps)));
      if (i >= steps) { clearInterval(iv); prev.current = value; }
    }, 16);
    return () => clearInterval(iv);
  }, [value]);
  return <>{prefix}{Math.round(display).toLocaleString("en-GB")}{suffix}</>;
}

/* ── SLIDER ROW ── */
function SliderRow({ label, value, min, max, step=1, onChange, format, note }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
        <div>
          <span style={{ fontSize:14, fontWeight:600, color:"#333" }}>{label}</span>
          {note && <span style={{ fontSize:11, color:"#999", marginLeft:6 }}>{note}</span>}
        </div>
        <span style={{ fontSize:18, fontWeight:800, color:P, fontFamily:"'DM Mono',monospace", minWidth:80, textAlign:"right" }}>
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        style={{ "--val":`${pct}%` }}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ fontSize:11, color:"#bbb" }}>{format ? format(min) : min}</span>
        <span style={{ fontSize:11, color:"#bbb" }}>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

/* ── RESULT CARD ── */
function ResCard({ label, value, sub, highlight, icon, color }) {
  return (
    <div className={`res-card ${highlight?"hero-card":""}`}>
      <div className="label" style={{ fontSize:11, fontWeight:600, color:highlight?"rgba(255,255,255,.65)":"#999", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
        {icon && <span style={{ marginRight:5 }}>{icon}</span>}{label}
      </div>
      <div className="value" style={{ fontSize:26, fontWeight:900, color:highlight?W:(color||P), letterSpacing:"-0.5px", fontFamily:"'DM Mono',monospace" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize:12, color:highlight?"rgba(255,255,255,.55)":"#aaa", marginTop:4 }}>{sub}</div>}
    </div>
  );
}

export default function RevenueCalculator() {
  const [haircutPrice,     setHaircutPrice]     = useState(30);
  const [customersPerDay,  setCustomersPerDay]  = useState(10);
  const [workingDays,      setWorkingDays]       = useState(5);
  const [noShowRate,       setNoShowRate]        = useState(15);
  const [subscriptionPrice,setSubscriptionPrice] = useState(49);
  const [subscriberCount,  setSubscriberCount]  = useState(20);
  const [slotsPerDay,      setSlotsPerDay]       = useState(12);

  const FEE = 0.06;

  /* ── CALCULATIONS ── */
  const weeklyCustomers         = customersPerDay * workingDays;
  const monthlyCustomers        = weeklyCustomers * 4.33;
  const grossMonthlyRevenue     = monthlyCustomers * haircutPrice;
  const lostMonthlyRevenue      = grossMonthlyRevenue * (noShowRate / 100);
  const currentMonthlyRevenue   = grossMonthlyRevenue - lostMonthlyRevenue;
  const grossSubRevenue         = subscriberCount * subscriptionPrice;
  const subSeatFee              = grossSubRevenue * FEE;
  const netSubRevenue           = grossSubRevenue - subSeatFee;
  const projectedMonthly        = currentMonthlyRevenue + netSubRevenue;
  const monthlyIncrease         = projectedMonthly - currentMonthlyRevenue;
  const yearlyIncrease          = monthlyIncrease * 12;
  const oneSubAnnual            = subscriptionPrice * 12 * (1 - FEE);
  const monthlyCapacity         = slotsPerDay * workingDays * 4.33;
  const capacityPct             = Math.min(100, (monthlyCustomers / monthlyCapacity) * 100);
  const breakEven               = Math.ceil(lostMonthlyRevenue / (subscriptionPrice * (1 - FEE)));

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:"rgba(255,255,255,.95)", backdropFilter:"blur(16px)", borderBottom:"1px solid #eee", padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:P }}>SubSeat</span>
        </a>
        <div style={{ display:"flex", gap:10 }}>
          <a href="/onboarding" className="btn-cta" style={{ padding:"10px 20px", fontSize:13 }}>Go Live with SubSeat →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background:`linear-gradient(160deg,#0f0f1a 0%,#1e1040 50%,#0f0f1a 100%)`, padding:"90px 5% 80px", position:"relative", overflow:"hidden" }}>
        {/* BG GLOW */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, borderRadius:"50%", background:`radial-gradient(circle,rgba(86,59,231,.25) 0%,transparent 65%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, backgroundImage:"radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />

        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div className="fu" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(86,59,231,.25)", border:"1px solid rgba(86,59,231,.4)", borderRadius:100, padding:"7px 20px", fontSize:12, fontWeight:700, color:"#a78bfa", letterSpacing:1.5, textTransform:"uppercase", marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", animation:"pulse 2s infinite", display:"inline-block" }} />
            Free Revenue Calculator
          </div>
          <h1 className="fu d1 hero-title" style={{ fontWeight:900, fontSize:"clamp(32px,5.5vw,64px)", color:W, letterSpacing:"-2.5px", lineHeight:1.05, marginBottom:20 }}>
            See what your shop could
            <span style={{ color:"#a78bfa" }}> earn with SubSeat</span>
          </h1>
          <p className="fu d2" style={{ fontSize:"clamp(15px,1.8vw,18px)", color:"rgba(255,255,255,.6)", lineHeight:1.75, maxWidth:560, margin:"0 auto 40px" }}>
            Turn empty slots, no-shows and unpredictable bookings into recurring monthly revenue. Drag the sliders and watch your numbers change live.
          </p>
          <div className="fu d3" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="#calculator" className="btn-cta">Start Calculating →</a>
            <a href="/onboarding" className="btn-outline" style={{ color:W, borderColor:"rgba(255,255,255,.3)" }}>Create My Account</a>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" style={{ padding:"80px 5%", background:"#fafafa" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3.5vw,40px)", color:C, letterSpacing:"-1.5px", marginBottom:10 }}>Build your revenue model</h2>
            <p style={{ fontSize:15, color:"#888" }}>Adjust the sliders below — your results update in real time.</p>
          </div>

          <div className="calc-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>

            {/* LEFT — INPUTS */}
            <div>
              {/* CURRENT BUSINESS */}
              <div style={{ background:W, borderRadius:22, padding:32, border:"1.5px solid #eee", marginBottom:24, boxShadow:"0 4px 20px rgba(0,0,0,.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💈</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16, color:C }}>Your Current Business</div>
                    <div style={{ fontSize:12, color:"#999" }}>Tell us about your shop today</div>
                  </div>
                </div>

                <SliderRow label="Service price" value={haircutPrice} min={10} max={100} step={5} onChange={setHaircutPrice} format={v=>`£${v}`} note="avg per visit" />
                <SliderRow label="Customers per day" value={customersPerDay} min={1} max={30} onChange={setCustomersPerDay} note="on average" />
                <SliderRow label="Working days per week" value={workingDays} min={1} max={7} onChange={setWorkingDays} />
                <SliderRow label="No-show / cancellation rate" value={noShowRate} min={0} max={50} onChange={setNoShowRate} format={v=>`${v}%`} note="industry avg ~15%" />
                <SliderRow label="Available slots per day" value={slotsPerDay} min={customersPerDay} max={30} onChange={setSlotsPerDay} note="total capacity" />

                {/* CAPACITY BAR */}
                <div style={{ background:G, borderRadius:12, padding:"14px 16px", marginTop:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"#888" }}>Current capacity utilisation</span>
                    <span style={{ fontSize:14, fontWeight:800, color:capacityPct>85?"#e53e3e":capacityPct>60?P:"#22c55e" }}>{Math.round(capacityPct)}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${capacityPct}%`, background:capacityPct>85?"linear-gradient(90deg,#f59e0b,#e53e3e)":undefined }} />
                  </div>
                  <div style={{ fontSize:11, color:"#bbb", marginTop:6 }}>
                    {capacityPct > 85 ? "⚠️ Near capacity — subscriptions help you predict demand" : capacityPct > 60 ? "Good utilisation — subscriptions lock in this revenue" : "Room to grow — subscribers fill those empty slots"}
                  </div>
                </div>
              </div>

              {/* SUBSCRIPTION MODEL */}
              <div style={{ background:W, borderRadius:22, padding:32, border:"1.5px solid #eee", boxShadow:"0 4px 20px rgba(0,0,0,.04)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📅</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16, color:C }}>Your SubSeat Subscription</div>
                    <div style={{ fontSize:12, color:"#999" }}>Set your membership model</div>
                  </div>
                </div>

                <SliderRow label="Monthly subscription price" value={subscriptionPrice} min={19} max={199} step={5} onChange={setSubscriptionPrice} format={v=>`£${v}/mo`} />
                <SliderRow label="Number of subscribers" value={subscriberCount} min={1} max={200} onChange={setSubscriberCount} note="your target" />

                {/* ONE SUBSCRIBER CALLOUT */}
                <div style={{ background:`linear-gradient(135deg,${P}12,${P}06)`, border:`1.5px solid ${P}30`, borderRadius:14, padding:"16px 18px", marginTop:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:P, marginBottom:4 }}>💡 One subscriber is worth</div>
                  <div style={{ fontSize:28, fontWeight:900, color:P, fontFamily:"'DM Mono',monospace", letterSpacing:"-0.5px" }}>
                    {fmt(oneSubAnnual)} per year
                  </div>
                  <div style={{ fontSize:12, color:"#888", marginTop:4 }}>after SubSeat's 6% fee</div>
                </div>
              </div>
            </div>

            {/* RIGHT — RESULTS */}
            <div style={{ position:"sticky", top:88 }}>
              <div style={{ background:W, borderRadius:22, padding:32, border:"1.5px solid #eee", boxShadow:"0 4px 24px rgba(86,59,231,.08)" }}>
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#999", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Live Results</div>
                  <div style={{ fontWeight:800, fontSize:18, color:C }}>Your revenue breakdown</div>
                </div>

                {/* MAIN RESULT */}
                <div className="res-card hero-card" style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>📈 Projected Monthly Revenue</div>
                  <div style={{ fontSize:48, fontWeight:900, color:W, letterSpacing:"-2px", fontFamily:"'DM Mono',monospace", lineHeight:1 }}>
                    {fmt(projectedMonthly)}
                  </div>
                  <div style={{ fontSize:14, color:"rgba(255,255,255,.65)", marginTop:8 }}>
                    +{fmt(monthlyIncrease)}/mo more than today
                  </div>
                </div>

                {/* RESULTS GRID */}
                <div className="results-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                  <ResCard label="Current monthly" value={fmt(currentMonthlyRevenue)} sub="before SubSeat" />
                  <ResCard label="Lost to no-shows" value={fmt(lostMonthlyRevenue)} sub="per month" color="#e53e3e" />
                  <ResCard label="Gross subscription" value={fmt(grossSubRevenue)} sub={`${subscriberCount} × £${subscriptionPrice}`} />
                  <ResCard label="SubSeat fee (6%)" value={fmt(subSeatFee)} sub="only on subscriptions" color="#888" />
                  <ResCard label="Net subscription" value={fmt(netSubRevenue)} sub="you keep this" color="#22c55e" />
                  <ResCard label="Yearly increase" value={fmt(yearlyIncrease)} sub="additional per year" icon="🚀" />
                </div>

                {/* BREAK EVEN */}
                <div style={{ background:G, borderRadius:14, padding:"16px 18px", marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:"#888" }}>Break-even subscribers</div>
                      <div style={{ fontSize:11, color:"#bbb", marginTop:2 }}>to cover all no-show losses</div>
                    </div>
                    <div style={{ fontSize:32, fontWeight:900, color:P, fontFamily:"'DM Mono',monospace" }}>{breakEven}</div>
                  </div>
                  <div className="progress-track" style={{ marginTop:12 }}>
                    <div className="progress-fill" style={{ width:`${Math.min(100,(subscriberCount/Math.max(breakEven,1))*100)}%` }} />
                  </div>
                  <div style={{ fontSize:11, color:"#aaa", marginTop:6 }}>
                    {subscriberCount >= breakEven
                      ? `✅ You've already passed break-even with ${subscriberCount} subscribers`
                      : `${breakEven - subscriberCount} more subscribers to fully cover no-show losses`}
                  </div>
                </div>

                {/* YEARLY CARD */}
                <div style={{ background:`linear-gradient(135deg,#0f0f1a,#1e1040)`, borderRadius:14, padding:"20px 22px", textAlign:"center" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>Yearly subscription value</div>
                  <div style={{ fontSize:40, fontWeight:900, color:W, letterSpacing:"-1.5px", fontFamily:"'DM Mono',monospace" }}>
                    {fmt(yearlyIncrease)}
                  </div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.5)", marginTop:6 }}>additional annual revenue with {subscriberCount} subscribers</div>
                </div>

                <a href="/onboarding" className="btn-cta" style={{ width:"100%", justifyContent:"center", marginTop:16, fontSize:15 }}>
                  Go Live with SubSeat →
                </a>
                <p style={{ fontSize:12, color:"#bbb", textAlign:"center", marginTop:10 }}>Free to join · No setup fee · 6% only on subscriptions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE VS AFTER */}
      <section style={{ padding:"80px 5%", background:`linear-gradient(160deg,#0f0f1a,#1e1040)`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }} />
        <div style={{ maxWidth:900, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3.5vw,40px)", color:W, letterSpacing:"-1.5px", marginBottom:10 }}>The SubSeat difference</h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,.5)" }}>Same business. Same skills. Completely different income.</p>
          </div>

          <div className="comp-wrap" style={{ display:"flex", gap:20, alignItems:"stretch" }}>
            {/* BEFORE */}
            <div className="comp-card comp-before">
              <div style={{ fontSize:13, fontWeight:700, color:"#999", textTransform:"uppercase", letterSpacing:2, marginBottom:20 }}>❌ Without SubSeat</div>
              {[
                { label:"Monthly revenue",    val:fmt(currentMonthlyRevenue), note:"unpredictable" },
                { label:"Lost to no-shows",   val:fmt(lostMonthlyRevenue),    note:"every month" },
                { label:"Income predictability", val:"Low",                  note:"varies week to week" },
                { label:"Customer retention", val:"Transactional",          note:"no loyalty lock-in" },
                { label:"Yearly projection",  val:fmt(currentMonthlyRevenue*12), note:"best estimate" },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<4?"1px solid #eee":"none" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"#555" }}>{r.label}</div>
                    <div style={{ fontSize:11, color:"#bbb" }}>{r.note}</div>
                  </div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#333", fontFamily:"'DM Mono',monospace" }}>{r.val}</div>
                </div>
              ))}
            </div>

            {/* VS */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:P, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:W, boxShadow:"0 4px 20px rgba(86,59,231,.5)" }}>VS</div>
            </div>

            {/* AFTER */}
            <div className="comp-card comp-after">
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.6)", textTransform:"uppercase", letterSpacing:2, marginBottom:20 }}>✅ With SubSeat</div>
              {[
                { label:"Monthly revenue",       val:fmt(projectedMonthly),    note:"recurring + reliable" },
                { label:"No-show impact",         val:"Minimal",              note:"subscribers prepay" },
                { label:"Income predictability",  val:"High",                 note:"monthly recurring" },
                { label:"Customer retention",     val:"Membership model",     note:"loyal subscribers" },
                { label:"Yearly projection",      val:fmt(projectedMonthly*12), note:"with subscriptions" },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<4?"1px solid rgba(255,255,255,.12)":"none" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,.85)" }}>{r.label}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.4)" }}>{r.note}</div>
                  </div>
                  <div style={{ fontSize:16, fontWeight:800, color:W, fontFamily:"'DM Mono',monospace" }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:"100px 5%", background:G, textAlign:"center" }}>
        <div style={{ maxWidth:620, margin:"0 auto" }}>
          <div style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 18px", fontSize:11, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:24 }}>Ready when you are</div>
          <h2 style={{ fontWeight:900, fontSize:"clamp(28px,4.5vw,52px)", color:C, letterSpacing:"-2px", lineHeight:1.08, marginBottom:16 }}>
            Your subscription model is ready.
          </h2>
          <p style={{ fontSize:16, color:"#666", lineHeight:1.75, marginBottom:16 }}>
            Create your business account and start taking subscribers through SubSeat. Free to join, set up in under 10 minutes.
          </p>

          {/* LIVE STATS */}
          <div style={{ background:W, borderRadius:16, padding:"18px 24px", display:"inline-flex", gap:32, marginBottom:40, flexWrap:"wrap", justifyContent:"center", boxShadow:"0 4px 20px rgba(86,59,231,.08)", border:`1.5px solid ${L}` }}>
            {[
              { label:"Your monthly boost", val:fmt(monthlyIncrease) },
              { label:"Your yearly boost",  val:fmt(yearlyIncrease)  },
              { label:"Subscribers needed", val:`${breakEven} to break even` },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:900, color:P, fontFamily:"'DM Mono',monospace", letterSpacing:"-0.5px" }}>{s.val}</div>
                <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="cta-btns" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/onboarding" className="btn-cta" style={{ fontSize:16 }}>Go Live with SubSeat →</a>
            <a href="/auth" className="btn-outline">Create My Business Account</a>
          </div>
          <p style={{ fontSize:12, color:"#bbb", marginTop:16 }}>Free to join · No monthly fee · 6% only on subscriptions</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"32px 5%", textAlign:"center" }}>
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:16 }}>
          {[["Home","/"],["About","/about"],["Contact","/contact"],["Terms","/terms"],["Privacy","/privacy"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,.35)", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.25)" }}>© 2026 SubSeat Ltd. All rights reserved. SubSeat® is a UK registered trademark.</p>
      </footer>
    </>
  );
}