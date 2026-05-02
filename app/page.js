'use client';
import { useState, useEffect } from "react";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; }
  body { font-family:'Poppins',sans-serif; background:${W}; color:${C}; overflow-x:hidden; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(86,59,231,.4)} 50%{box-shadow:0 0 0 12px rgba(86,59,231,0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes fomoIn   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fomoOut  { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-8px)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .fu  { animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both }
  .d1  { animation-delay:.1s  }
  .d2  { animation-delay:.2s  }
  .d3  { animation-delay:.3s  }
  .d4  { animation-delay:.4s  }
  .d5  { animation-delay:.5s  }

  /* NAV */
  nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    background:rgba(255,255,255,.92); backdrop-filter:blur(16px);
    border-bottom:1px solid rgba(0,0,0,.06);
    height:68px; display:flex; align-items:center;
    padding:0 6%; justify-content:space-between;
  }

  /* FOMO BAR */
  .fomo-bar {
    position:fixed; top:68px; left:0; right:0; z-index:99;
    background:${C}; height:40px;
    display:flex; align-items:center; justify-content:center; gap:10px;
  }
  .fomo-text {
    font-size:13px; font-weight:700; color:${W};
    animation:fomoIn .4s ease both;
  }
  .fomo-text.exit { animation:fomoOut .3s ease both; }

  /* HERO */
  .hero {
    padding:180px 6% 100px;
    background:linear-gradient(135deg,#f0eeff 0%,#e8e0ff 50%,#f5f0ff 100%);
    background-size:200% 200%;
    animation:gradMove 8s ease infinite;
    text-align:center; position:relative; overflow:hidden;
  }
  .hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 0%,rgba(86,59,231,.15) 0%,transparent 70%);
    pointer-events:none;
  }

  .hero-headline {
    font-size:clamp(36px,6vw,72px); font-weight:900;
    color:${C}; line-height:1.08; letter-spacing:-2px;
    margin-bottom:20px;
  }
  .hero-headline span { color:${P}; }

  .hero-sub {
    font-size:clamp(15px,2vw,20px); color:#555; font-weight:500;
    max-width:600px; margin:0 auto 36px; line-height:1.6;
  }

  /* BUTTONS */
  .btn-hero-primary {
    display:inline-flex; align-items:center; gap:8px;
    background:${P}; color:${W}; border:none;
    padding:16px 32px; border-radius:14px;
    font-family:'Poppins',sans-serif; font-weight:800; font-size:16px;
    cursor:pointer; transition:all .2s;
    box-shadow:0 8px 32px rgba(86,59,231,.35);
    text-decoration:none;
  }
  .btn-hero-primary:hover { background:#4429d4; transform:translateY(-2px); box-shadow:0 12px 40px rgba(86,59,231,.45); }

  .btn-hero-secondary {
    display:inline-flex; align-items:center; gap:8px;
    background:${W}; color:${P}; border:2px solid ${P};
    padding:15px 32px; border-radius:14px;
    font-family:'Poppins',sans-serif; font-weight:800; font-size:16px;
    cursor:pointer; transition:all .2s;
    text-decoration:none;
  }
  .btn-hero-secondary:hover { background:${L}; transform:translateY(-2px); }

  /* TRUST LINE */
  .trust-line {
    display:flex; align-items:center; justify-content:center; gap:20px;
    flex-wrap:wrap; margin-top:20px;
  }
  .trust-item { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#888; }

  /* SECTION */
  section { padding:80px 6%; }
  .section-label { font-size:12px; font-weight:800; color:${P}; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px; }
  .section-title { font-size:clamp(28px,4vw,44px); font-weight:900; color:${C}; line-height:1.15; letter-spacing:-1px; margin-bottom:16px; }
  .section-sub   { font-size:16px; color:#666; max-width:520px; line-height:1.6; margin-bottom:48px; }

  /* SPLIT PATH */
  .path-card {
    background:${W}; border-radius:24px; padding:36px;
    border:2px solid #eee; transition:all .25s; text-align:center;
  }
  .path-card:hover { border-color:${P}; transform:translateY(-4px); box-shadow:0 20px 60px rgba(86,59,231,.12); }
  .path-card .icon { font-size:48px; margin-bottom:16px; }
  .path-card h3 { font-size:22px; font-weight:800; color:${C}; margin-bottom:10px; }
  .path-card p  { font-size:14px; color:#666; line-height:1.6; margin-bottom:24px; }

  /* PROOF STRIP */
  .proof-strip {
    background:${C}; padding:48px 6%; text-align:center;
  }

  /* HOW IT WORKS */
  .step-num {
    width:40px; height:40px; border-radius:12px; background:${L};
    display:flex; align-items:center; justify-content:center;
    font-size:16px; font-weight:900; color:${P}; margin-bottom:14px;
  }

  /* VALUE SECTION */
  .value-card {
    background:${W}; border-radius:20px; padding:28px;
    border:1.5px solid #eee; transition:all .2s;
  }
  .value-card:hover { border-color:${P}; box-shadow:0 8px 32px rgba(86,59,231,.10); transform:translateY(-2px); }
  .value-icon { font-size:36px; margin-bottom:14px; }

  /* PRICING */
  .price-card {
    background:${W}; border-radius:24px; padding:32px;
    border:2px solid #eee; transition:all .2s;
  }
  .price-card.featured { border-color:${P}; box-shadow:0 16px 56px rgba(86,59,231,.16); }
  .price-card:hover { transform:translateY(-3px); }

  /* ECOSYSTEM */
  .eco-card {
    background:${W}; border-radius:20px; padding:28px;
    border:1.5px solid #eee; transition:all .2s;
  }
  .eco-card:hover { border-color:${P}; transform:translateY(-2px); }

  /* FINAL CTA */
  .cta-section {
    background:linear-gradient(135deg,${P} 0%,#7c5cff 50%,#a855f7 100%);
    background-size:200% 200%; animation:gradMove 6s ease infinite;
    padding:100px 6%; text-align:center;
  }

  /* FOOTER */
  footer { background:${C}; padding:48px 6%; }

  /* SOCIAL PROOF NUMBERS */
  .stat-bubble {
    background:${W}; border-radius:16px; padding:18px 24px;
    box-shadow:0 8px 32px rgba(0,0,0,.08); text-align:center;
    animation:float 4s ease-in-out infinite;
  }

  @media(max-width:768px) {
    .hero   { padding:160px 5% 80px; }
    section { padding:60px 5%; }
    .hero-headline { letter-spacing:-1px; }
    .two-col { grid-template-columns:1fr !important; }
    .three-col { grid-template-columns:1fr !important; }
    .four-col  { grid-template-columns:1fr 1fr !important; }
    .btn-row   { flex-direction:column; align-items:center; }
    .trust-line { gap:12px; }
  }
`;

/* ── FOMO BAR ── */
const FOMO_PHRASES = [
  { text:"🔥 Next 10 bookings get priority access",              color:"#f59e0b" },
  { text:"⚡ Limited slots available this week",                 color:"#22c55e" },
  { text:"🔒 Members are locking in their slots",               color:"#a78bfa" },
  { text:"📍 Fewer than 20 priority slots left near you",       color:"#f87171" },
  { text:"🚀 Early access now open across the UK",              color:"#34d399" },
];

function FomoBar() {
  const [idx, setIdx]   = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setExit(true);
      setTimeout(() => {
        setIdx(i => (i+1) % FOMO_PHRASES.length);
        setExit(false);
      }, 300);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const phrase = FOMO_PHRASES[idx];

  return (
    <div className="fomo-bar">
      <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", flexShrink:0,
        animation:"pulse 2s infinite", boxShadow:"0 0 0 0 rgba(34,197,94,.4)" }} />
      <span className={`fomo-text ${exit?"exit":""}`} style={{ color:phrase.color }}>
        {phrase.text}
      </span>
    </div>
  );
}

/* ── LOGO ── */
function Logo() {
  return (
    <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
      <div style={{ width:36, height:36, borderRadius:10, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", animation:"pulse 3s infinite" }}>
        <div style={{ position:"absolute", right:-5, top:"50%", transform:"translateY(-50%)", width:12, height:12, borderRadius:"50%", background:W }} />
        <span style={{ color:W, fontWeight:900, fontSize:18 }}>S</span>
      </div>
      <span style={{ fontWeight:900, fontSize:20, color:P }}>SubSeat</span>
    </a>
  );
}

/* ── HOMEPAGE ── */
export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <style>{css}</style>
      <FomoBar />

      {/* NAV */}
      <nav>
        <Logo />
        <div style={{ display:"flex", alignItems:"center", gap:24 }}>
          <a href="/discover" style={{ fontSize:14, fontWeight:600, color:C, textDecoration:"none" }}>Find Professionals</a>
          <a href="#pricing"  style={{ fontSize:14, fontWeight:600, color:C, textDecoration:"none" }}>Pricing</a>
          <a href="/auth"     style={{ fontSize:14, fontWeight:600, color:"#888", textDecoration:"none" }}>Sign In</a>
          <a href="/auth" className="btn-hero-primary" style={{ padding:"10px 22px", fontSize:14, borderRadius:10 }}>Get Started Free</a>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        {/* FLOATING BUBBLES */}
        <div style={{ position:"absolute", top:120, left:"8%", animation:"float 3s ease-in-out infinite" }}>
          <div className="stat-bubble">
            <div style={{ fontWeight:900, fontSize:24, color:P }}>✂️</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#888", marginTop:2 }}>Barbers</div>
          </div>
        </div>
        <div style={{ position:"absolute", top:180, right:"8%", animation:"float 4s ease-in-out infinite .5s" }}>
          <div className="stat-bubble">
            <div style={{ fontWeight:900, fontSize:24, color:"#22c55e" }}>💆</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#888", marginTop:2 }}>Salons</div>
          </div>
        </div>

        <div className="fu">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:L, borderRadius:100, padding:"6px 16px", marginBottom:24 }}>
            <span style={{ fontSize:12, fontWeight:800, color:P }}>🇬🇧 Now live across the UK</span>
          </div>
        </div>

        <h1 className="hero-headline fu d1">
          Your seat,<br /><span>your subscription.</span>
        </h1>

        <p className="hero-sub fu d2">
          Book barbers, salons and beauty professionals instantly — or subscribe and secure your spot every month.
        </p>

        <div className="btn-row fu d3" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="/discover" className="btn-hero-primary">Find and Book Now →</a>
          <a href="/auth" className="btn-hero-secondary">Earn Monthly with SubSeat</a>
        </div>

        <div className="trust-line fu d4">
          {["Free to join","No setup fees","Cancel anytime"].map((t,i)=>(
            <div key={i} className="trust-item">
              <span style={{ color:"#22c55e", fontSize:16 }}>✓</span>{t}
            </div>
          ))}
        </div>
      </div>

      {/* SPLIT PATH */}
      <section style={{ background:G }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div className="section-label fu">Who is SubSeat for?</div>
          <h2 className="section-title fu d1">Two journeys. One platform.</h2>
          <p style={{ fontSize:16, color:"#666", maxWidth:480, margin:"0 auto" }} className="fu d2">
            Whether you're booking your next cut or growing a loyal client base — SubSeat works for you.
          </p>
        </div>
        <div className="two-col fu d2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, maxWidth:900, margin:"0 auto" }}>
          <div className="path-card">
            <div className="icon">👤</div>
            <h3>For Customers</h3>
            <p>Book instantly or subscribe for priority access, better value and guaranteed time slots every month.</p>
            <a href="/discover" className="btn-hero-primary" style={{ fontSize:14, padding:"13px 24px", borderRadius:12 }}>Find a Professional</a>
          </div>
          <div className="path-card" style={{ borderColor:P, background:L }}>
            <div className="icon">🏪</div>
            <h3>For Businesses</h3>
            <p>Turn one-off bookings into predictable monthly income with memberships, loyal customers and no hidden fees.</p>
            <a href="/auth" className="btn-hero-primary" style={{ fontSize:14, padding:"13px 24px", borderRadius:12 }}>Start Earning Monthly</a>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div className="proof-strip">
        <p style={{ fontSize:16, fontWeight:700, color:"rgba(255,255,255,.7)", marginBottom:20 }}>
          Built for barbers, salons and self-care professionals across the UK
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap" }}>
          {[
            { icon:"⚡", label:"Priority booking"    },
            { icon:"💰", label:"Recurring income"    },
            { icon:"🚫", label:"Fewer no-shows"      },
            { icon:"🔒", label:"Secure payments"     },
            { icon:"📱", label:"Mobile optimised"    },
            { icon:"🇬🇧", label:"UK-based support"   },
          ].map((p,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, color:W }}>
              <span style={{ fontSize:18 }}>{p.icon}</span>
              <span style={{ fontSize:14, fontWeight:600 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div className="section-label fu">Simple by design</div>
          <h2 className="section-title fu d1">How SubSeat works</h2>
        </div>
        <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, maxWidth:960, margin:"0 auto" }}>
          <div className="fu d1">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>👤</div>
              <h3 style={{ fontWeight:800, fontSize:20, color:C }}>For Customers</h3>
            </div>
            {[
              { num:"1", title:"Find your professional",  desc:"Search barbers, salons and beauty pros near you"     },
              { num:"2", title:"Book or subscribe",        desc:"One-off booking or subscribe for priority access"    },
              { num:"3", title:"Keep your routine",        desc:"Your slot is secured every month — no more chasing"  },
            ].map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:16, marginBottom:24 }}>
                <div className="step-num">{s.num}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:"#888", lineHeight:1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="fu d2">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:L, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏪</div>
              <h3 style={{ fontWeight:800, fontSize:20, color:C }}>For Businesses</h3>
            </div>
            {[
              { num:"1", title:"Join for free",            desc:"Set up your profile in under 10 minutes"            },
              { num:"2", title:"Create membership plans",  desc:"Set your price, services and availability"          },
              { num:"3", title:"Earn monthly",             desc:"Predictable income, loyal clients, fewer no-shows"  },
            ].map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:16, marginBottom:24 }}>
                <div className="step-num">{s.num}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:C, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:"#888", lineHeight:1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORE THAN BOOKING — BUILT FOR GROWTH */}
      <section style={{ background:G }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div className="section-label fu">Platform features</div>
          <h2 className="section-title fu d1">More than booking.<br />Built for growth.</h2>
          <p style={{ fontSize:16, color:"#666", maxWidth:480, margin:"0 auto" }} className="fu d2">
            SubSeat gives businesses the tools to own their customer relationships and grow recurring revenue.
          </p>
        </div>
        <div className="three-col fu d2" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, maxWidth:1000, margin:"0 auto" }}>
          {[
            { icon:"💳", title:"Memberships",  desc:"Turn clients into recurring income. Set plans, prices and visit limits that work for your business."    },
            { icon:"👥", title:"CRM",          desc:"Own your customer data. Track visits, spending and birthdays. Re-book inactive clients automatically."  },
            { icon:"🔍", title:"Visibility",   desc:"Get discovered by new clients nearby. Your profile is SEO-optimised and shareable in seconds."          },
            { icon:"📱", title:"QR Capture",   desc:"Walk-in customers scan your QR code, leave their details and get captured into your CRM instantly."     },
            { icon:"🔔", title:"WhatsApp Alerts",desc:"Your subscribers get WhatsApp reminders, confirmations and updates — reducing no-shows automatically."},
            { icon:"📊", title:"Analytics",    desc:"See your busiest days, top customers, monthly revenue and conversion rates in one clear dashboard."      },
          ].map((v,i)=>(
            <div key={i} className="value-card fu" style={{ animationDelay:`${i*.06}s` }}>
              <div className="value-icon">{v.icon}</div>
              <h3 style={{ fontWeight:800, fontSize:17, color:C, marginBottom:8 }}>{v.title}</h3>
              <p style={{ fontSize:13, color:"#666", lineHeight:1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div className="section-label fu">Transparent pricing</div>
          <h2 className="section-title fu d1">Free to join.<br />We only earn when you earn.</h2>
          <p style={{ fontSize:16, color:"#666", maxWidth:480, margin:"0 auto" }} className="fu d2">
            No monthly software fee. No hidden charges. SubSeat takes a small commission only when you get paid.
          </p>
        </div>
        <div className="three-col fu d1" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, maxWidth:960, margin:"0 auto" }}>
          {[
            {
              name:"Basic",
              price:"Free",
              sub:"Forever free to list",
              featured:false,
              perks:["Unlimited services","Business profile page","QR code generator","Customer CRM","Basic analytics","5% commission on subscriptions"],
              cta:"Get Started Free",
              href:"/auth",
            },
            {
              name:"Partner Seat",
              price:"£19",
              sub:"/month after launch · £39.99 founding fee",
              featured:true,
              perks:["Everything in Basic","Priority listing","Partner badge","Advanced analytics","WhatsApp notifications","Dedicated onboarding","Lower commission rate"],
              cta:"Join as Partner",
              href:"/auth",
            },
            {
              name:"Enterprise",
              price:"Custom",
              sub:"Multi-location businesses",
              featured:false,
              perks:["Everything in Partner","Multi-location support","API access","Custom integrations","Account manager","SLA support","Custom commission"],
              cta:"Contact Us",
              href:"mailto:hello@subseat.co.uk",
            },
          ].map((p,i)=>(
            <div key={i} className={`price-card ${p.featured?"featured":""}`}>
              {p.featured && (
                <div style={{ background:P, color:W, borderRadius:8, padding:"4px 12px", fontSize:11, fontWeight:800, display:"inline-block", marginBottom:16, letterSpacing:0.5 }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:4 }}>{p.name}</h3>
              <div style={{ fontWeight:900, fontSize:36, color:p.featured?P:C, letterSpacing:"-1px", marginBottom:4 }}>{p.price}</div>
              <div style={{ fontSize:12, color:"#888", marginBottom:24 }}>{p.sub}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {p.perks.map((perk,j)=>(
                  <div key={j} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <span style={{ color:"#22c55e", fontSize:14, flexShrink:0, marginTop:1 }}>✓</span>
                    <span style={{ fontSize:13, color:"#555" }}>{perk}</span>
                  </div>
                ))}
              </div>
              <a href={p.href} className={p.featured?"btn-hero-primary":"btn-hero-secondary"}
                style={{ width:"100%", justifyContent:"center", borderRadius:12, fontSize:14 }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", fontSize:13, color:"#aaa", marginTop:24 }}>
          No hidden fees ever. Commission only applies to subscription revenue processed through SubSeat.
        </p>
      </section>

      {/* ECOSYSTEM */}
      <section style={{ background:G }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div className="section-label fu">The SubSeat ecosystem</div>
          <h2 className="section-title fu d1">Built to power your business</h2>
          <p style={{ fontSize:16, color:"#666", maxWidth:480, margin:"0 auto" }} className="fu d2">
            SubSeat is building the complete operating system for independent beauty and wellness professionals.
          </p>
        </div>
        <div className="three-col fu d1" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, maxWidth:900, margin:"0 auto" }}>
          {[
            { icon:"🛒", title:"Marketplace",  desc:"Tools, equipment and supplies for professionals. Everything you need to run your business, in one place."    },
            { icon:"💼", title:"Finance",       desc:"Funding, growth loans and financial support tailored for independent professionals and small businesses."     },
            { icon:"🛡️", title:"Insurance",    desc:"Simple, affordable business protection built for sole traders, freelancers and self-employed professionals."  },
          ].map((e,i)=>(
            <div key={i} className="eco-card">
              <div style={{ fontSize:40, marginBottom:14 }}>{e.icon}</div>
              <h3 style={{ fontWeight:800, fontSize:18, color:C, marginBottom:8 }}>{e.title}</h3>
              <p style={{ fontSize:13, color:"#666", lineHeight:1.6 }}>{e.desc}</p>
              <div style={{ marginTop:16, fontSize:12, fontWeight:700, color:P }}>Coming soon →</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="cta-section">
        <div className="section-label fu" style={{ color:"rgba(255,255,255,.7)" }}>Ready?</div>
        <h2 className="fu d1" style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:W, letterSpacing:"-1px", marginBottom:16 }}>
          Ready to take control<br />of your bookings?
        </h2>
        <p className="fu d2" style={{ fontSize:17, color:"rgba(255,255,255,.8)", marginBottom:36, maxWidth:440, margin:"0 auto 36px" }}>
          Join early. Build your routine. Secure your spot.
        </p>
        <div className="btn-row fu d3" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="/discover" style={{ display:"inline-flex", alignItems:"center", gap:8, background:W, color:P, border:"none", padding:"16px 32px", borderRadius:14, fontFamily:"Poppins", fontWeight:800, fontSize:16, cursor:"pointer", textDecoration:"none", boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            Book Now
          </a>
          <a href="/auth" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", color:W, border:"2px solid rgba(255,255,255,.4)", padding:"15px 32px", borderRadius:14, fontFamily:"Poppins", fontWeight:800, fontSize:16, cursor:"pointer", textDecoration:"none" }}>
            Grow My Business
          </a>
        </div>
        <p className="fu d4" style={{ color:"rgba(255,255,255,.6)", fontSize:13, marginTop:20 }}>
          Free to join · No setup fees · Cancel anytime
        </p>
      </div>

      {/* FOOTER */}
      <footer>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }} className="four-col">
          <div>
            <Logo />
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:13, marginTop:14, lineHeight:1.7, maxWidth:260 }}>
              The UK's subscription booking platform for barbers, salons and beauty professionals.
            </p>
            <div style={{ display:"flex", gap:12, marginTop:20 }}>
              {["Instagram","TikTok","WhatsApp"].map(s=>(
                <div key={s} style={{ background:"rgba(255,255,255,.1)", borderRadius:8, padding:"7px 12px", fontSize:11, fontWeight:700, color:"rgba(255,255,255,.6)", cursor:"pointer" }}>{s}</div>
              ))}
            </div>
          </div>
          {[
            { title:"Platform",  links:["Find Professionals","List Your Business","Pricing","How It Works"]  },
            { title:"Company",   links:["About","Blog","Careers","Press"]                                    },
            { title:"Support",   links:["Help Centre","Contact Us","Privacy Policy","Terms of Service"]      },
          ].map((col,i)=>(
            <div key={i}>
              <div style={{ fontWeight:800, fontSize:13, color:W, marginBottom:16, textTransform:"uppercase", letterSpacing:0.5 }}>{col.title}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {col.links.map(l=>(
                  <a key={l} href="#" style={{ fontSize:13, color:"rgba(255,255,255,.5)", textDecoration:"none", transition:"color .2s" }}
                    onMouseEnter={e=>e.target.style.color=W}
                    onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>© 2025 SubSeat Ltd. All rights reserved. Registered in England & Wales.</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>hello@subseat.co.uk</div>
        </div>
      </footer>
    </>
  );
}