'use client';
import { useState, useEffect } from "react";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
  body{font-family:'Poppins',sans-serif;background:#fff;color:${C};overflow-x:hidden}

  :root{
    --p:${P};--l:${L};--c:${C};--g:${G};
    --shadow-sm:0 2px 12px rgba(86,59,231,.10);
    --shadow-md:0 8px 32px rgba(86,59,231,.16);
    --shadow-lg:0 24px 80px rgba(86,59,231,.22);
  }

  @keyframes fadeUp  {from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
  @keyframes ticker  {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes pulse   {0%,100%{box-shadow:0 0 0 0 rgba(86,59,231,.5)}50%{box-shadow:0 0 0 14px rgba(86,59,231,0)}}
  @keyframes blink   {0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes fomoIn  {from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fomoOut {from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-6px)}}

  .fu {animation:fadeUp .7s cubic-bezier(.22,1,.36,1) both}
  .fi {animation:fadeIn .6s ease both}
  .d0{animation-delay:0s}.d1{animation-delay:.1s}.d2{animation-delay:.2s}
  .d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}

  .reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
  .reveal.visible{opacity:1;transform:translateY(0)}

  .lift{transition:transform .22s ease,box-shadow .22s ease;cursor:pointer}
  .lift:hover{transform:translateY(-4px);box-shadow:0 24px 80px rgba(86,59,231,.20)}
  .lift-sm{transition:transform .18s ease,box-shadow .18s ease;cursor:pointer}
  .lift-sm:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(86,59,231,.16)}

  .btn-primary{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:var(--p);color:#fff;border:none;
    padding:15px 28px;border-radius:12px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;
    cursor:pointer;transition:all .2s ease;
    box-shadow:0 6px 24px rgba(86,59,231,.32);white-space:nowrap;
  }
  .btn-primary:hover{background:#4429d4;transform:translateY(-2px);box-shadow:0 12px 40px rgba(86,59,231,.42)}
  .btn-secondary{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:transparent;color:var(--p);border:2px solid var(--p);
    padding:13px 26px;border-radius:12px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;
    cursor:pointer;transition:all .2s ease;white-space:nowrap;
  }
  .btn-secondary:hover{background:var(--l);transform:translateY(-2px)}
  .btn-ghost{
    display:inline-flex;align-items:center;justify-content:center;
    background:transparent;color:var(--c);border:none;
    font-family:'Poppins',sans-serif;font-weight:600;font-size:14px;
    cursor:pointer;transition:color .18s;padding:10px 18px;border-radius:10px;
  }
  .btn-ghost:hover{color:var(--p)}
  .btn-white{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:#fff;color:var(--p);border:none;
    padding:15px 28px;border-radius:12px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;
    cursor:pointer;transition:all .2s ease;box-shadow:0 4px 20px rgba(0,0,0,.12);
  }
  .btn-white:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.18)}
  .btn-white-outline{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    background:transparent;color:#fff;border:2px solid rgba(255,255,255,.5);
    padding:13px 26px;border-radius:12px;
    font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;
    cursor:pointer;transition:all .2s ease;
  }
  .btn-white-outline:hover{border-color:#fff;background:rgba(255,255,255,.1)}

  .nav-a{
    font-size:14px;font-weight:500;color:${C};text-decoration:none;
    opacity:.75;transition:all .18s;padding:6px 2px;position:relative;
  }
  .nav-a::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:var(--p);border-radius:2px;transition:width .22s ease}
  .nav-a:hover{opacity:1;color:var(--p)}
  .nav-a:hover::after{width:100%}

  .section-label{
    display:inline-block;font-size:11px;font-weight:700;letter-spacing:2.5px;
    text-transform:uppercase;color:var(--p);background:var(--l);
    padding:6px 16px;border-radius:100px;margin-bottom:18px;
  }

  /* FOMO BAR */
  .fomo-bar{
    position:fixed;top:0;left:0;right:0;z-index:600;
    background:${C};height:38px;
    display:flex;align-items:center;justify-content:center;gap:10px;
  }
  .fomo-text{
    font-size:12px;font-weight:700;color:${W};
    animation:fomoIn .35s ease both;
  }
  .fomo-text.exit{animation:fomoOut .25s ease both;}

  .phone-wrap{
    width:280px;height:560px;border-radius:44px;background:#fff;
    box-shadow:0 40px 120px rgba(86,59,231,.28),0 0 0 1px rgba(86,59,231,.12);
    overflow:hidden;position:relative;flex-shrink:0;
    animation:float 6s ease-in-out infinite;
  }
  .phone-notch{
    position:absolute;top:0;left:50%;transform:translateX(-50%);
    width:120px;height:34px;background:${C};border-radius:0 0 20px 20px;z-index:10;
  }
  .dash-card{
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);
    border-radius:16px;padding:20px;backdrop-filter:blur(8px);
  }
  .search-input{
    flex:1;border:none;outline:none;background:transparent;
    font-family:'Poppins',sans-serif;font-size:15px;color:${C};
  }
  .search-input::placeholder{color:#aaa}

  /* ── TABLET ── */
  @media(max-width:1024px){
    .hero-grid{grid-template-columns:1fr!important;text-align:center}
    .hero-phone{display:none!important}
    .hero-benefits{justify-content:center!important}
    .path-grid{grid-template-columns:1fr!important}
    .pri-grid{grid-template-columns:1fr 1fr!important;gap:16px!important}
  }
  /* ── MOBILE ── */
  @media(max-width:900px){
    .nav-center{display:none!important}
    .cat-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}
    .hiw-grid{grid-template-columns:1fr!important;gap:48px!important}
    .stats-grid{grid-template-columns:repeat(2,1fr)!important;gap:24px!important}
    .pri-grid{grid-template-columns:1fr!important;gap:20px!important}
    .eco-grid{grid-template-columns:1fr!important;gap:16px!important}
    .about-grid{grid-template-columns:1fr!important;gap:16px!important}
    .footer-grid{grid-template-columns:1fr 1fr!important;gap:32px!important}
    .compare-col3{display:none!important}
    .dash-grid{grid-template-columns:1fr 1fr!important}
    .growth-flex{flex-direction:column!important;align-items:center!important}
    .pri-featured{transform:scale(1)!important}
  }
  /* ── SMALL MOBILE ── */
  @media(max-width:600px){
    .hero-grid{padding:100px 5% 60px!important}
    .hero-btns{flex-direction:column!important;width:100%!important}
    .hero-btns .btn-primary,
    .hero-btns .btn-secondary{width:100%!important;justify-content:center!important}
    .hero-benefits{flex-direction:column!important;align-items:flex-start!important;gap:10px!important}
    .cat-grid{grid-template-columns:1fr 1fr!important;gap:10px!important}
    .cat-img{height:150px!important}
    .final-btns{flex-direction:column!important;align-items:center!important;width:100%!important}
    .final-btns .btn-white,
    .final-btns .btn-white-outline{width:100%!important;max-width:300px!important;justify-content:center!important}
    .dash-grid{grid-template-columns:1fr 1fr!important;gap:10px!important}
    .dash-card{padding:14px!important}
    .growth-dash{padding:18px!important;max-width:100%!important}
    .about-grid{grid-template-columns:1fr!important}
    .eco-grid{grid-template-columns:1fr!important}
    .pri-grid{grid-template-columns:1fr!important}
    .path-grid{grid-template-columns:1fr!important}
    .stats-grid{grid-template-columns:1fr 1fr!important;gap:20px!important}
    .footer-grid{grid-template-columns:1fr 1fr!important;gap:20px!important}
    .section-inner{padding:64px 5%!important}
    .compare-row{padding:12px 16px!important;font-size:13px!important}
    .compare-head{padding:12px 16px!important}
    .search-wrap{padding:5px 5px 5px 14px!important}
    .search-input{font-size:13px!important}
    .hiw-step{gap:14px!important}
    .hiw-num{min-width:44px!important;height:44px!important}
  }
`;

/* ─── SCROLL REVEAL HOOK ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── FOMO BAR ─── */
const FOMO_PHRASES = [
  { text: "🔥 Next 10 bookings get priority access",             color: "#f59e0b" },
  { text: "⚡ Limited slots available this week",                color: "#34d399" },
  { text: "🔒 Members are locking in their slots",              color: "#a78bfa" },
  { text: "📍 Fewer than 20 priority slots left near you",      color: "#f87171" },
  { text: "🚀 Early access now open across the UK",             color: "#34d399" },
];

function FomoBar() {
  const [idx,  setIdx]  = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setExit(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % FOMO_PHRASES.length);
        setExit(false);
      }, 280);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const phrase = FOMO_PHRASES[idx];

  return (
    <div className="fomo-bar">
      <div style={{
        width: 7, height: 7, borderRadius: "50%", background: "#22c55e", flexShrink: 0,
        boxShadow: "0 0 0 0 rgba(34,197,94,.4)",
        animation: "pulse 2s infinite",
      }} />
      <span className={`fomo-text ${exit ? "exit" : ""}`} style={{ color: phrase.color }}>
        {phrase.text}
      </span>
    </div>
  );
}

/* ─── LOGO ─── */
function Logo({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * .27, background: P, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "pulse 3.5s infinite", flexShrink: 0 }}>
      <div style={{ position: "absolute", right: -size * .15, top: "50%", transform: "translateY(-50%)", width: size * .3, height: size * .3, borderRadius: "50%", background: W }} />
      <span style={{ color: W, fontWeight: 900, fontSize: size * .54, fontFamily: "Poppins", zIndex: 1 }}>S</span>
    </div>
  );
}

/* ─── NAV ─── */
function Nav({ scrolled }) {
  return (
    <header style={{ position: "fixed", top: 38, left: 0, right: 0, zIndex: 500, background: scrolled ? "rgba(255,255,255,.97)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? `1px solid ${L}` : "none", transition: "all .3s ease" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 5%", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo size={36} />
          <span style={{ fontWeight: 800, fontSize: 20, color: P, letterSpacing: "-.5px" }}>SubSeat</span>
        </a>
        <nav className="nav-center" style={{ display: "flex", gap: 32 }}>
          {[
            ["Find Professionals", "#categories"],
            ["For Businesses",     "#pricing"],
            ["Marketplace",        "/marketplace"],
            ["Finance",            "/finance"],
            ["Insurance",          "/insurance"],
            ["About",              "#about"],
          ].map(([l, h]) => (
            <a key={l} href={h} className="nav-a">{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href="mailto:hello@subseat.co.uk?subject=SubSeat Demo Request" style={{ textDecoration: "none" }}><button className="btn-ghost">Book a Demo</button></a>
          <a href="/auth" style={{ textDecoration: "none" }}><button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>Get Started</button></a>
        </div>
      </div>
    </header>
  );
}

/* ─── TICKER ─── */
function Ticker({ dark = false }) {
  const items = Array(2).fill([
    "Priority booking for members", "Recurring income for businesses",
    "Stripe-secured payments", "Lower cancellations",
    "Built for self-care professionals", "Your seat, your subscription",
    "WhatsApp alerts included", "No hidden monthly charges",
  ]).flat();
  return (
    <div style={{ background: dark ? C : P, padding: "14px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", animation: "ticker 32s linear infinite", width: "max-content", whiteSpace: "nowrap" }}>
        {items.map((t, i) => (
          <span key={i} style={{ fontWeight: 600, fontSize: 13, color: W, marginRight: 56, opacity: .9 }}>
            <span style={{ color: L, marginRight: 10 }}>✦</span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── PHONE MOCKUP ─── */
function PhoneMockup() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <div className="phone-wrap">
        <div className="phone-notch" />
        <div style={{ paddingTop: 46, background: W }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${G}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: C }}>SubSeat</span>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: L, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>👤</span>
              </div>
            </div>
            <div style={{ background: G, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <span style={{ fontSize: 13, color: "#aaa" }}>Search near you...</span>
            </div>
          </div>
          <div style={{ margin: "14px 16px", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.10)" }}>
            <div style={{ height: 100, background: `linear-gradient(135deg, ${P} 0%, #7c5cff 100%)`, position: "relative", display: "flex", alignItems: "flex-end", padding: "12px 16px" }}>
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,.2)", borderRadius: 100, padding: "3px 10px" }}>
                <span style={{ fontSize: 11, color: W, fontWeight: 600 }}>⭐ 4.9</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: W }}>Marcus, The Cut Lab</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)" }}>Barber · Shoreditch, London</div>
              </div>
            </div>
            <div style={{ background: W, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>Monthly Membership</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C, letterSpacing: "-1px" }}>£59<span style={{ fontSize: 13, fontWeight: 500, color: "#888" }}>/mo</span></div>
                </div>
                <div style={{ background: L, borderRadius: 10, padding: "6px 12px" }}>
                  <div style={{ fontSize: 11, color: P, fontWeight: 700 }}>Priority member</div>
                </div>
              </div>
              <div style={{ background: G, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#888", fontWeight: 500, marginBottom: 2 }}>Next available</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C }}>Friday 14 Feb · 2:00 PM</div>
              </div>
              <button style={{ width: "100%", background: P, color: W, border: "none", borderRadius: 12, padding: "12px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Subscribe & Book Now
              </button>
            </div>
          </div>
          <div style={{ padding: "0 16px", display: "flex", gap: 10 }}>
            {[{ label: "Nail Tech", price: "£45" }, { label: "Lash Artist", price: "£65" }].map((c, i) => (
              <div key={i} style={{ flex: 1, background: G, borderRadius: 14, padding: "12px", border: `1.5px solid ${L}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: P }}>{c.price}<span style={{ fontSize: 10, color: "#888", fontWeight: 500 }}>/mo</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LIVE COUNTER ─── */
const HERO_PHRASES = [
  { text: "Early access. Founding businesses join free today.", color: P },
  { text: "Finance. Insurance. Marketplace. All in one place.", color: P },
  { text: "Now onboarding founding businesses across the UK",   color: P },
  { text: "Founding Partner pricing. Limited availability.",    color: P },
];

function LiveCounter() {
  const [idx,  setIdx]  = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setExit(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % HERO_PHRASES.length);
        setExit(false);
      }, 280);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const phrase = HERO_PHRASES[idx];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: L, borderRadius: 100, padding: "7px 18px", marginBottom: 28 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "blink 1.8s infinite", flexShrink: 0 }} />
      <span className={`fomo-text ${exit ? "exit" : ""}`} style={{ fontSize: 13, fontWeight: 600, color: phrase.color }}>
        {phrase.text}
      </span>
    </div>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section id="hero" style={{ minHeight: "100vh", padding: "168px 5% 80px", background: `linear-gradient(145deg, ${L} 0%, #f8f7ff 30%, ${W} 65%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${L} 0%, transparent 65%)`, opacity: .5 }} />
      <div style={{ position: "absolute", bottom: -120, left: -120, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${L} 0%, transparent 65%)`, opacity: .35 }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative", zIndex: 1 }} className="hero-grid section-inner">
        <div>
          <div className="fu d0"><LiveCounter /></div>
          <h1 className="fu d1" style={{ fontWeight: 900, fontSize: "clamp(40px,5.5vw,72px)", lineHeight: 1.06, letterSpacing: "-2.5px", color: C, marginBottom: 24 }}>
            Your seat,{" "}
            <span style={{ color: P, position: "relative", display: "inline-block" }}>
              your subscription.
              <svg style={{ position: "absolute", bottom: -8, left: 0, width: "100%", height: 10 }} viewBox="0 0 500 10" preserveAspectRatio="none">
                <path d="M0,8 Q125,0 250,8 Q375,16 500,8" stroke={P} strokeWidth="2.5" fill="none" opacity=".3" />
              </svg>
            </span>
          </h1>
          <p className="fu d2" style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "#555", lineHeight: 1.75, maxWidth: 500, marginBottom: 40 }}>
            The smarter way to book barbers, salons and beauty professionals. Businesses earn predictable monthly income through memberships.
          </p>
          <div className="fu d3 hero-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
            <a href="/discover" style={{ textDecoration: "none" }}><button className="btn-primary">Find a Professional</button></a>
            <a href="/onboarding" style={{ textDecoration: "none" }}><button className="btn-secondary">Grow My Business</button></a>
          </div>
          <div className="fu d4">
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Trusted by professionals across London, Birmingham, Manchester and beyond.</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }} className="hero-benefits">
              {["Priority booking", "Fewer no-shows", "Recurring revenue", "Secure payments"].map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: L, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3 4 7-8" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-phone fu d5"><PhoneMockup /></div>
      </div>
      <div className="fu d6" style={{ maxWidth: 700, margin: "56px auto 0" }}>
        <div className="search-wrap" style={{ background: W, borderRadius: 18, padding: "6px 6px 6px 22px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 16px 60px rgba(86,59,231,.14)", border: `1.5px solid ${L}` }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke={P} strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input className="search-input" placeholder="Search barbers, salons, nail techs near you..." onKeyDown={e => e.key === "Enter" && (window.location.href = "/discover")} />
          <a href="/discover" style={{ textDecoration: "none" }}><button className="btn-primary" style={{ padding: "13px 24px", fontSize: 14, borderRadius: 12 }}>Search</button></a>
        </div>
        <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#aaa", fontWeight: 500 }}>Free to join. No setup fee.</p>
      </div>
    </section>
  );
}

/* ─── PATH CARDS ─── */
function PathSection() {
  return (
    <section style={{ padding: "100px 5%", background: G }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="section-label">Get Started</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px" }}>Built for both sides of the chair.</h2>
        </div>
        <div className="path-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[
            { tag: "For Customers", title: "Discover. Subscribe. Enjoy.", body: "Discover trusted professionals near you. Book instantly, subscribe for savings, and keep your favourite time slot.", cta: "Find a Professional", href: "/discover", dark: false },
            { tag: "For Businesses", title: "Turn bookings into income.", body: "Turn one-off bookings into predictable monthly revenue. Build loyalty, reduce gaps, and grow faster.", cta: "Join SubSeat", href: "/onboarding", dark: true },
          ].map((c, i) => (
            <div key={i} className="lift" style={{ background: c.dark ? P : W, border: c.dark ? "none" : `2px solid ${L}`, borderRadius: 28, padding: "48px 44px", position: "relative", overflow: "hidden" }}>
              {c.dark && <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />}
              <div style={{ display: "inline-block", background: c.dark ? "rgba(255,255,255,.15)" : L, borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.dark ? W : P }}>{c.tag}</span>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 26, color: c.dark ? W : C, marginBottom: 14, letterSpacing: "-.5px" }}>{c.title}</h3>
              <p style={{ fontSize: 15, color: c.dark ? "rgba(255,255,255,.75)" : "#666", lineHeight: 1.7, marginBottom: 32 }}>{c.body}</p>
              <a href={c.href} style={{ textDecoration: "none" }}>
                <button className={c.dark ? "btn-white" : "btn-primary"}>{c.cta}</button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SIMPLE CALCULATOR ─── */
function SimpleCalculator() {
  const [servicePrice,  setServicePrice]  = useState(30);
  const [regulars,      setRegulars]      = useState(20);
  const [monthlyPrice,  setMonthlyPrice]  = useState(49);

  const FEE       = 0.06;
  const gross     = regulars * monthlyPrice;
  const subSeatFee = gross * FEE;
  const net       = gross - subSeatFee;
  const yearly    = net * 12;

  const pct = (val, min, max) => ((val - min) / (max - min)) * 100;

  const SliderInput = ({ label, value, min, max, step=1, onChange, format }) => (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
        <span style={{ fontSize:15, fontWeight:600, color:"rgba(255,255,255,.85)" }}>{label}</span>
        <span style={{ fontSize:22, fontWeight:900, color:W, fontFamily:"monospace" }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))}
        style={{
          width:"100%", height:6, borderRadius:100, outline:"none",
          cursor:"pointer", appearance:"none", WebkitAppearance:"none",
          background:`linear-gradient(to right,${W} ${pct(value,min,max)}%,rgba(255,255,255,.2) ${pct(value,min,max)}%)`,
        }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
        <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{format(min)}</span>
        <span style={{ fontSize:11, color:"rgba(255,255,255,.35)" }}>{format(max)}</span>
      </div>
    </div>
  );

  return (
    <section style={{ padding:"100px 5%", background:`linear-gradient(160deg,#0f0f1a 0%,#1a1040 50%,#0f0f1a 100%)`, position:"relative", overflow:"hidden" }}>
      {/* BG glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,rgba(86,59,231,.2) 0%,transparent 65%)`, pointerEvents:"none" }} />

      <div style={{ maxWidth:1000, margin:"0 auto", position:"relative", zIndex:1 }}>
        {/* HEADING */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <span style={{ display:"inline-block", background:"rgba(86,59,231,.3)", borderRadius:100, padding:"6px 18px", fontSize:11, fontWeight:700, color:"#a78bfa", letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>
            For Businesses
          </span>
          <h2 style={{ fontWeight:900, fontSize:"clamp(28px,4.5vw,52px)", color:W, letterSpacing:"-2px", lineHeight:1.08, marginBottom:14 }}>
            See what you could earn.
          </h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.5)", maxWidth:480, margin:"0 auto" }}>
            Drag the sliders and watch your monthly income update live.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"center" }} className="cal-simple-grid">

          {/* SLIDERS */}
          <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:24, padding:36, backdropFilter:"blur(12px)" }}>
            <SliderInput
              label="Average service price"
              value={servicePrice}
              min={10} max={100} step={5}
              onChange={setServicePrice}
              format={v=>`£${v}`}
            />
            <SliderInput
              label="Number of regular customers"
              value={regulars}
              min={1} max={100}
              onChange={setRegulars}
              format={v=>`${v}`}
            />
            <SliderInput
              label="Monthly subscription price"
              value={monthlyPrice}
              min={19} max={149} step={5}
              onChange={setMonthlyPrice}
              format={v=>`£${v}/mo`}
            />
            <div style={{ background:"rgba(255,255,255,.06)", borderRadius:12, padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,.45)", lineHeight:1.55 }}>
              💡 Industry average: barbers charge £40 to £65/mo for unlimited cuts. Start lower to get subscribers, then increase over time.
            </div>
          </div>

          {/* RESULTS */}
          <div>
            {/* BIG NUMBER */}
            <div style={{ background:`linear-gradient(135deg,${P},#7c3aed)`, borderRadius:22, padding:"32px 28px", marginBottom:16, textAlign:"center", boxShadow:"0 20px 60px rgba(86,59,231,.4)" }}>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.7)", marginBottom:8, letterSpacing:1 }}>YOUR EXTRA MONTHLY INCOME</div>
              <div style={{ fontSize:"clamp(48px,7vw,80px)", fontWeight:900, color:W, letterSpacing:"-3px", lineHeight:1, fontFamily:"monospace" }}>
                £{Math.round(net).toLocaleString("en-GB")}
              </div>
              <div style={{ fontSize:15, color:"rgba(255,255,255,.6)", marginTop:8 }}>per month, recurring</div>
            </div>

            {/* BREAKDOWN */}
            <div style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:18, padding:24, backdropFilter:"blur(12px)" }}>
              {[
                { label:"📅 Per year",          val:`£${Math.round(yearly).toLocaleString("en-GB")}`,        color:"#4ade80" },
                { label:"💰 Gross subscriptions", val:`£${Math.round(gross).toLocaleString("en-GB")}/mo`,     color:W        },
                { label:"SubSeat takes (6%)",    val:`£${Math.round(subSeatFee).toLocaleString("en-GB")}/mo`, color:"#a78bfa"},
                { label:"✅ You keep",            val:`£${Math.round(net).toLocaleString("en-GB")}/mo`,        color:"#4ade80"},
              ].map((r,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:i<3?"1px solid rgba(255,255,255,.08)":"none" }}>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,.55)", fontWeight:500 }}>{r.label}</span>
                  <span style={{ fontSize:15, fontWeight:800, color:r.color, fontFamily:"monospace" }}>{r.val}</span>
                </div>
              ))}
            </div>

            <a href="/onboarding" style={{ display:"block", textDecoration:"none", marginTop:16 }}>
              <button style={{ width:"100%", background:W, color:P, border:"none", borderRadius:14, padding:"16px", fontFamily:"Poppins", fontWeight:800, fontSize:16, cursor:"pointer", transition:"all .2s", boxShadow:"0 8px 24px rgba(0,0,0,.3)" }}>
                Start Earning This →
              </button>
            </a>
            <p style={{ fontSize:12, color:"rgba(255,255,255,.3)", textAlign:"center", marginTop:10 }}>Free to join · No monthly fee · 6% only on subscriptions</p>
          </div>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none; width:22px; height:22px; border-radius:50%;
          background:#fff; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.3);
        }
        .cal-simple-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; }
        @media(max-width:768px) { .cal-simple-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── CATEGORIES ─── */
function Categories() {
  const cats = [
    { label: "Barbers",      img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80" },
    { label: "Hair Salons",  img: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500&q=80" },
    { label: "Nail Techs",   img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80" },
    { label: "Brow Artists", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80" },
    { label: "Lash Artists", img: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=500&q=80" },
    { label: "Massage",      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80" },
    { label: "Skincare",     img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80" },
    { label: "Wellness",     img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80" },
  ];
  return (
    <section id="categories" style={{ padding: "100px 5%", background: W }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="section-label">Discover</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px", marginBottom: 8 }}>Find your perfect professional.</h2>
        </div>
        <div className="cat-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {cats.map((c, i) => (
            <a key={i} href={`/discover?category=${c.label.toLowerCase().replace(/\s+/g, "-")}`} style={{ textDecoration: "none" }}>
              <div className="lift-sm" style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 210 }}>
                <img src={c.img} alt={c.label} className="cat-img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(23,23,23,.85) 0%, rgba(23,23,23,.05) 55%, transparent 100%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: W }}>{c.label}</div>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12, background: P, borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: W }}>View</div>
              </div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="/discover" style={{ textDecoration: "none" }}><button className="btn-secondary">Explore All Categories</button></a>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const cols = [
    { side: "For Customers", dark: false, steps: [
      { n: "01", title: "Find your professional",  body: "Search by location, category and availability. Browse real profiles and reviews." },
      { n: "02", title: "Book or subscribe",        body: "Choose a one-off booking or a monthly membership plan that suits your routine." },
      { n: "03", title: "Keep your routine",        body: "Priority slots, WhatsApp reminders and seamless repeat bookings every time." },
    ]},
    { side: "For Businesses", dark: true, steps: [
      { n: "01", title: "Join for free",            body: "Create your profile and list services in under 10 minutes. Your QR code is ready instantly." },
      { n: "02", title: "Launch memberships",       body: "Offer monthly plans your customers love. Set your own prices and policies." },
      { n: "03", title: "Earn monthly",             body: "Build predictable recurring income. Better retention, fewer gaps, more growth." },
    ]},
  ];
  return (
    <section id="how-it-works" style={{ padding: "100px 5%", background: G }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <span className="section-label">How It Works</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px" }}>Simple for everyone.</h2>
        </div>
        <div className="hiw-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          {cols.map((col, ci) => (
            <div key={ci}>
              <div style={{ display: "inline-block", background: col.dark ? C : L, borderRadius: 100, padding: "7px 22px", marginBottom: 40 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: col.dark ? W : P }}>{col.side}</span>
              </div>
              {col.steps.map((s, i) => (
                <div key={i} className="hiw-step" style={{ display: "flex", gap: 20, marginBottom: 36, alignItems: "flex-start" }}>
                  <div className="hiw-num" style={{ minWidth: 56, height: 56, borderRadius: 16, background: col.dark ? C : P, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: col.dark ? "none" : "0 4px 16px rgba(86,59,231,.28)" }}>
                    <span style={{ fontWeight: 900, fontSize: 15, color: W }}>{s.n}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: C, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BUSINESS GROWTH (DARK) ─── */
function BusinessGrowth() {
  return (
    <section style={{ padding: "100px 5%", background: C, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -150, right: -150, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${P}22 0%, transparent 65%)` }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "center", flexWrap: "wrap" }} className="growth-flex">
        <div style={{ flex: 1, minWidth: 280 }}>
          <span className="section-label" style={{ background: "rgba(86,59,231,.25)", color: L }}>For Businesses</span>
          <h2 style={{ fontWeight: 900, fontSize: "clamp(28px,4vw,52px)", color: W, letterSpacing: "-2px", marginBottom: 20, lineHeight: 1.08 }}>Turn bookings into predictable income.</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", lineHeight: 1.75, marginBottom: 36, maxWidth: 440 }}>
            SubSeat helps barbers, salons and beauty professionals create monthly recurring revenue through memberships, not just one-off appointments.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
            {["Increase repeat visits", "Reduce no-show gaps", "Build customer loyalty", "Grow with confidence"].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${P}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3 4 7-8" stroke={L} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{s}</span>
              </div>
            ))}
          </div>
          <a href="/onboarding" style={{ textDecoration: "none" }}><button className="btn-white">Grow My Business</button></a>
        </div>
        <div style={{ flex: 1, minWidth: 300, display: "flex", justifyContent: "center" }}>
          <div className="growth-dash" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, padding: 28, backdropFilter: "blur(12px)", maxWidth: 520, width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>Good morning, Marcus</div>
                <div style={{ fontWeight: 800, fontSize: 20, color: W }}>Your Dashboard</div>
              </div>
              <div style={{ background: "#22c55e", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: W }}>Live</div>
            </div>
            <div className="dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Active Subscribers", val: "127", delta: "+12 this month" },
                { label: "Monthly Revenue",    val: "£7,493", delta: "+18% vs last month" },
                { label: "Upcoming Today",     val: "14",    delta: "Next: 10:00 AM" },
                { label: "Retention Rate",     val: "91%",   delta: "↑ Excellent" },
              ].map((s, i) => (
                <div key={i} className="dash-card">
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: W, letterSpacing: "-1px", marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>{s.delta}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)", marginBottom: 12, letterSpacing: 1 }}>TODAY'S APPOINTMENTS</div>
              {[{ name: "Jordan M.", time: "10:00 AM", svc: "Fade & Line Up" }, { name: "Alex T.", time: "11:30 AM", svc: "Cut & Beard Trim" }, { name: "Ryan K.", time: "1:00 PM", svc: "Monthly Trim" }].map((a, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: W }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{a.svc}</div>
                  </div>
                  <div style={{ background: "rgba(86,59,231,.3)", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: L }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── WHY SUBSEAT ─── */
function WhySubSeat() {
  const rows = [
    { f: "Revenue model",         us: "Membership-based, predictable",   ind: "Per-appointment, volatile" },
    { f: "Cancellation impact",   us: "Subscription already paid",         ind: "Revenue lost per no-show" },
    { f: "Platform fee",          us: "Simple 6% platform fee",            ind: "Up to 35% on some platforms" },
    { f: "Hidden charges",        us: "No hidden monthly charges",         ind: "Fees can change anytime" },
    { f: "Visibility",            us: "Equal for all businesses",          ind: "Pay-to-boost common" },
    { f: "Notifications",         us: "WhatsApp + email",                  ind: "Email only" },
    { f: "Ecosystem tools",       us: "Marketplace, finance, insurance",   ind: "Booking only" },
  ];
  return (
    <section id="why" style={{ padding: "100px 5%", background: W }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: 56 }}>
          <span className="section-label">Why SubSeat</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px", marginBottom: 16 }}>Built differently. On purpose.</h2>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7 }}>Traditional booking platforms were built for transactions. SubSeat was built for relationships, loyalty and recurring revenue.</p>
        </div>
        <div className="reveal" style={{ border: `1.5px solid ${L}`, borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 32px rgba(86,59,231,.08)" }}>
          <div className="compare-head" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: P, padding: "16px 28px" }}>
            {["Feature", "SubSeat", "Industry Standard"].map((h, i) => (
              <span key={i} className={i === 2 ? "compare-col3" : ""} style={{ fontWeight: 700, fontSize: 13, color: W, opacity: i === 0 ? .65 : 1 }}>{h}</span>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={i} className="compare-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "16px 28px", background: i % 2 === 0 ? W : G, borderTop: `1px solid ${L}`, alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C }}>{r.f}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: P }}>{r.us}</span>
              <span className="compare-col3" style={{ fontSize: 13, color: "#999" }}>{r.ind}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#ccc", marginTop: 14, textAlign: "center" }}>Industry comparisons based on publicly available platform data as of 2025. SubSeat is independently operated.</p>
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
function Pricing() {
  const tiers = [
    {
      name: "Basic Seat", price: "Free", sub: "No monthly fee, ever", hi: false, badge: null,
      features: ["Up to 3 services listed", "Full booking calendar", "Email & WhatsApp alerts", "QR code for walk-in conversion", "Your own SubSeat profile page", "Stripe-secured payouts"],
      note: "Free to join. Simple 6% platform fee + VAT with no hidden monthly charges.",
      cta: "Start Free",
    },
    {
      name: "Partner Seat", price: "£39.99", sub: "One-time founding price", hi: true, badge: "Pre-Launch Price",
      features: ["Everything in Basic", "Partner badge on profile", "Advanced revenue analytics", "Priority WhatsApp support", "Early access to new features", "Staff & commission tracking", "Unlimited service listings"],
      note: "Free to join. Simple 6% platform fee + VAT with no hidden monthly charges.",
      cta: "Claim Founding Access",
    },
    {
      name: "Enterprise", price: "Custom", sub: "Multi-site & growing brands", hi: false, badge: null,
      features: ["Everything in Partner", "Multi-location dashboard", "Dedicated account manager", "Custom API integrations", "SLA support guarantee", "Bespoke onboarding"],
      note: "Get in touch and we'll build the right plan for your business.",
      cta: "Contact Us",
    },
  ];
  return (
    <section id="pricing" style={{ padding: "100px 5%", background: G }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 70 }}>
          <span className="section-label">For Businesses</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px", marginBottom: 10 }}>Honest pricing. No surprises.</h2>
          <p style={{ fontSize: 16, color: "#666" }}>Free to join. We only earn when you earn. 6% platform fee + VAT applies.</p>
        </div>
        <div className="pri-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, alignItems: "start" }}>
          {tiers.map((t, i) => (
            <div key={i} className={`lift ${t.hi ? "pri-featured" : ""}`} style={{ background: t.hi ? P : W, border: t.hi ? "none" : `2px solid ${L}`, borderRadius: 24, padding: "40px 32px", position: "relative", boxShadow: t.hi ? "0 32px 80px rgba(86,59,231,.38)" : "0 2px 16px rgba(86,59,231,.06)", transform: t.hi ? "scale(1.04)" : "scale(1)" }}>
              {t.badge && <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,.2)", borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 700, color: W }}>{t.badge}</div>}
              <div style={{ fontWeight: 700, fontSize: 13, color: t.hi ? "rgba(255,255,255,.6)" : "#888", marginBottom: 14 }}>{t.name}</div>
              <div style={{ fontWeight: 900, fontSize: 48, color: t.hi ? W : C, letterSpacing: "-2.5px", marginBottom: 4 }}>{t.price}</div>
              <div style={{ fontSize: 13, color: t.hi ? "rgba(255,255,255,.5)" : "#bbb", marginBottom: 32 }}>{t.sub}</div>
              <div style={{ borderTop: `1px solid ${t.hi ? "rgba(255,255,255,.16)" : L}`, paddingTop: 28, marginBottom: 20 }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 13 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}><circle cx="8" cy="8" r="8" fill={t.hi ? "rgba(255,255,255,.2)" : L} /><path d="M5 8l2 2 4-4" stroke={t.hi ? W : P} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span style={{ fontSize: 14, color: t.hi ? "rgba(255,255,255,.82)" : "#555", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: t.hi ? "rgba(255,255,255,.4)" : "#ccc", marginBottom: 24, lineHeight: 1.55 }}>{t.note}</p>
              <a href="/auth" style={{ textDecoration: "none" }}>
                <button style={{ width: "100%", padding: 16, borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "Poppins", background: t.hi ? W : P, color: t.hi ? P : W, border: "none", cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >{t.cta}</button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT SUBSEAT ─── */
function About() {
  const cards = [
    { icon: "👤", title: "Customers",  body: "Book trusted professionals faster. Subscribe to your favourites and never lose your slot." },
    { icon: "📈", title: "Businesses", body: "Build recurring monthly revenue through memberships. Predictable income, better retention." },
    { icon: "🏙️", title: "Industry",   body: "Reduce no-shows across the board. Increase loyalty and grow the self-care economy." },
  ];
  return (
    <section id="about" style={{ padding: "100px 5%", background: W }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <span className="section-label">About</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px", marginBottom: 20 }}>Built for the new self-care economy.</h2>
          <p style={{ fontSize: 17, color: "#555", lineHeight: 1.8 }}>
            SubSeat helps customers book smarter and helps professionals earn predictable monthly income through subscriptions and memberships.
          </p>
        </div>
        <div className="about-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {cards.map((c, i) => (
            <div key={i} className="lift" style={{ background: i === 1 ? P : G, border: i === 1 ? "none" : `1.5px solid ${L}`, borderRadius: 24, padding: "44px 36px", position: "relative", overflow: "hidden" }}>
              {i === 1 && <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.07)" }} />}
              <div style={{ fontSize: 44, marginBottom: 20 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: 22, color: i === 1 ? W : C, marginBottom: 12, letterSpacing: "-.5px" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: i === 1 ? "rgba(255,255,255,.75)" : "#666", lineHeight: 1.7 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ECOSYSTEM ─── */
function Ecosystem() {
  const cards = [
    {
      id: "marketplace",
      icon: "🛍️",
      title: "Marketplace",
      body: "Buy and sell chairs, clippers, furniture and equipment. Trusted by professionals across the UK. Only 1% platform fee.",
      live: true,
      cta: "Browse Marketplace",
      href: "/marketplace",
    },
    {
      id: "finance",
      icon: "💰",
      title: "Finance",
      body: "Funding and growth support built for barbers and beauty businesses. Apply in minutes, hear back in 48 hours.",
      live: true,
      cta: "Apply for Funding",
      href: "/finance",
    },
    {
      id: "insurance",
      icon: "🛡️",
      title: "Insurance",
      body: "Simple cover for barbers, salons and beauty professionals. Public liability, equipment cover and more from £6/month.",
      live: true,
      cta: "Get a Quote",
      href: "/insurance",
    },
  ];
  return (
    <section id="ecosystem" style={{ padding: "100px 5%", background: G }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="section-label">The SubSeat Ecosystem</span>
          <h2 style={{ fontWeight: 800, fontSize: "clamp(26px,3.5vw,46px)", color: C, letterSpacing: "-1.5px", marginBottom: 10 }}>More than bookings.</h2>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 520, margin: "0 auto" }}>SubSeat is building the full operating system for self-care professionals.</p>
        </div>
        <div className="eco-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {cards.map((c, i) => (
            <div key={i} id={c.id} className="lift" style={{ background: c.live ? `linear-gradient(135deg,${P} 0%,#7c3aed 100%)` : W, borderRadius: 24, padding: "44px 36px", border: c.live ? "none" : `1.5px solid ${L}`, position: "relative", boxShadow: c.live ? "0 20px 60px rgba(86,59,231,.35)" : "0 2px 16px rgba(86,59,231,.06)" }}>
              {/* BADGE */}
              <div style={{ position: "absolute", top: 20, right: 20, background: c.live ? "rgba(255,255,255,.2)" : L, borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 700, color: c.live ? W : P }}>
                {c.live ? "Live Now" : "Coming Soon"}
              </div>
              <div style={{ fontSize: 44, marginBottom: 20 }}>{c.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: 22, color: c.live ? W : C, marginBottom: 12, letterSpacing: "-.5px" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: c.live ? "rgba(255,255,255,.8)" : "#666", lineHeight: 1.7, marginBottom: c.live ? 28 : 0 }}>{c.body}</p>
              {c.live && (
                <a href={c.href} style={{ textDecoration: "none", display: "inline-block" }}>
                  <button style={{ background: W, color: P, border: "none", borderRadius: 12, padding: "13px 24px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .2s", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.15)"; }}>
                    {c.cta} →
                  </button>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ─── */
function FinalCTA() {
  return (
    <section style={{ padding: "120px 5%", background: `linear-gradient(135deg, ${P} 0%, #7c5cff 50%, #4429d4 100%)`, position: "relative", overflow: "hidden", textAlign: "center" }}>
      <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,.15)", borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 700, color: W, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Join the Future</span>
        <h2 style={{ fontWeight: 900, fontSize: "clamp(32px,5vw,64px)", color: W, letterSpacing: "-2.5px", lineHeight: 1.06, marginBottom: 20 }}>Ready to join the future of self-care?</h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.72)", marginBottom: 48, lineHeight: 1.7 }}>
          Whether you're booking your next appointment or growing your business, SubSeat is where recurring self-care begins.
        </p>
        <div className="final-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/discover" style={{ textDecoration: "none" }}><button className="btn-white">Find a Professional</button></a>
          <a href="/onboarding" style={{ textDecoration: "none" }}><button className="btn-white-outline">Grow My Business</button></a>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 24 }}>Free to join. No setup fee.</p>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  const cols = [
    { h: "Platform", links: [["Find Professionals","#categories"],["For Businesses","#pricing"],["Marketplace","/marketplace"]] },
    { h: "Business",  links: [["Pricing","#pricing"],["Revenue Calculator","/business/revenue-calculator"],["Finance","/finance"]] },
    { h: "Company",   links: [["About","/about"],["Contact","/contact"],["Press","/contact"]] },
    { h: "Legal",     links: [["Privacy Policy","/privacy"],["Terms of Service","/terms"]] },
  ];
  return (
    <footer id="footer" style={{ background: C, padding: "72px 5% 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Logo size={34} />
              <span style={{ fontWeight: 800, fontSize: 20, color: W }}>SubSeat</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.4)", lineHeight: 1.75, maxWidth: 260, marginBottom: 20 }}>
              The subscription booking ecosystem for beauty and wellness professionals.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                {
                  href: "https://x.com/subseatuk",
                  label: "X (Twitter)",
                  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                },
                {
                  href: "https://uk.linkedin.com/company/subseat",
                  label: "LinkedIn",
                  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                },
                {
                  href: "https://www.instagram.com/subseatuk",
                  label: "Instagram",
                  svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.5)", textDecoration: "none", transition: "all .18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = P; e.currentTarget.style.color = W; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}>
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, fontWeight: 700, color: W, marginBottom: 20, letterSpacing: 1.5, textTransform: "uppercase" }}>{col.h}</div>
              {col.links.map(([l, h]) => (
                <div key={l} style={{ marginBottom: 12 }}>
                  <a href={h} style={{ fontSize: 14, color: "rgba(255,255,255,.4)", textDecoration: "none", transition: "color .18s" }}
                    onMouseEnter={e => e.target.style.color = W}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.4)"}
                  >{l}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.28)" }}>© 2026 SubSeat Ltd. All rights reserved.</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.28)", fontStyle: "italic" }}>SubSeat® is a UK registered trademark.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ─── */
export default function SubSeatHome() {
  const [scrolled, setScrolled] = useState(false);
  useReveal();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <style>{css}</style>
      <FomoBar />
      <Nav scrolled={scrolled} />
      <Hero />
      <Ticker />
      <Categories />
      <HowItWorks />
      <PathSection />
      <SimpleCalculator />
      <BusinessGrowth />
      <WhySubSeat />
      <Pricing />
      <About />
      <Ecosystem />
      <FinalCTA />
      <Ticker dark />
      <Footer />
    </>
  );
}