'use client';

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; background:${W}; color:${C}; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .fu { animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both }
  .d1 { animation-delay:.1s } .d2 { animation-delay:.2s } .d3 { animation-delay:.3s }
`;

export default function AboutPage() {
  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:W, borderBottom:`1px solid ${G}`, padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:P }}>SubSeat</span>
        </a>
        <a href="/auth" style={{ background:P, color:W, textDecoration:"none", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"Poppins" }}>Get Started</a>
      </nav>

      {/* HERO */}
      <section style={{ background:`linear-gradient(145deg,${L} 0%,#f8f7ff 40%,${W} 100%)`, padding:"80px 5% 80px" }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <div className="fu" style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 18px", fontSize:12, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>About SubSeat</div>
          <h1 className="fu d1" style={{ fontWeight:900, fontSize:"clamp(32px,5vw,56px)", color:C, letterSpacing:"-2px", lineHeight:1.08, marginBottom:20 }}>
            Built for the people behind the chair.
          </h1>
          <p className="fu d2" style={{ fontSize:"clamp(15px,1.8vw,18px)", color:"#555", lineHeight:1.8, maxWidth:620, margin:"0 auto" }}>
            SubSeat was founded with one simple belief — barbers, stylists and beauty professionals deserve predictable income, not unpredictable bookings.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section style={{ padding:"80px 5%", background:W }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3vw,36px)", color:C, letterSpacing:"-1px", marginBottom:24 }}>Our story</h2>
          <p style={{ fontSize:16, color:"#555", lineHeight:1.85, marginBottom:20 }}>
            SubSeat started from a frustration that every barber and salon owner knows too well — a full appointment book that somehow still leaves gaps. Last-minute cancellations, no-shows, slow weeks. Revenue that should be predictable but never quite is.
          </p>
          <p style={{ fontSize:16, color:"#555", lineHeight:1.85, marginBottom:20 }}>
            We looked at how other industries had solved this — gyms with monthly memberships, streaming services with subscriptions — and asked: why can't barbers and salons do the same?
          </p>
          <p style={{ fontSize:16, color:"#555", lineHeight:1.85, marginBottom:20 }}>
            SubSeat is the answer. A platform where customers subscribe monthly for priority access to their favourite professionals, and businesses earn recurring revenue they can actually plan around.
          </p>
          <p style={{ fontSize:16, color:"#555", lineHeight:1.85 }}>
            We're building the full operating system for the self-care industry — starting with subscriptions, and expanding into marketplace, finance and insurance tools built specifically for beauty and wellness professionals across the UK.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding:"80px 5%", background:G }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <h2 style={{ fontWeight:800, fontSize:"clamp(24px,3vw,36px)", color:C, letterSpacing:"-1px", marginBottom:48, textAlign:"center" }}>What we stand for</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
            {[
              { icon:"🤝", title:"Fairness", body:"We take 6% on subscriptions only. No monthly fees, no hidden charges, no pay-to-boost. Every business gets equal visibility." },
              { icon:"💡", title:"Transparency", body:"No hidden fees. Ever. What you see is what you pay. We built SubSeat on trust because that's what the industry deserves." },
              { icon:"📈", title:"Growth", body:"We succeed when you succeed. Our business model only works if yours does — that alignment drives every decision we make." },
              { icon:"🛡️", title:"Security", body:"Every payment is Stripe-secured. Every subscription is protected. Customer data is handled with care and never sold." },
              { icon:"🔔", title:"Communication", body:"WhatsApp and email alerts as standard. No-shows drop when customers are reminded. We keep everyone in the loop." },
              { icon:"🇬🇧", title:"Built for the UK", body:"SubSeat is proudly UK-built, UK-focused and UK-registered. We understand the market because we're part of it." },
            ].map((v,i) => (
              <div key={i} style={{ background:W, borderRadius:18, padding:"28px 24px", border:`1.5px solid #eee` }}>
                <div style={{ fontSize:36, marginBottom:14 }}>{v.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:18, color:C, marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:14, color:"#666", lineHeight:1.65 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 5%", background:`linear-gradient(135deg,${P},#7c5cff)`, textAlign:"center" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontWeight:900, fontSize:"clamp(26px,4vw,44px)", color:W, letterSpacing:"-1.5px", marginBottom:16 }}>Ready to join SubSeat?</h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,.75)", marginBottom:36, lineHeight:1.7 }}>Whether you're a customer looking to book smarter or a professional ready to earn predictably — SubSeat is for you.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/discover" style={{ background:W, color:P, textDecoration:"none", padding:"15px 28px", borderRadius:12, fontWeight:700, fontSize:15, fontFamily:"Poppins" }}>Find a Professional</a>
            <a href="/onboarding" style={{ background:"rgba(255,255,255,.15)", color:W, textDecoration:"none", padding:"15px 28px", borderRadius:12, fontWeight:700, fontSize:15, fontFamily:"Poppins", border:"2px solid rgba(255,255,255,.4)" }}>Grow My Business</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"32px 5%", textAlign:"center" }}>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.3)" }}>© 2026 SubSeat Ltd. All rights reserved. SubSeat® is a UK registered trademark.</p>
      </footer>
    </>
  );
}