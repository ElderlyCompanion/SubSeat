'use client';
import { useState } from "react";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; background:${W}; color:${C}; }

  @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  .faq-item {
    border-bottom: 1px solid #f0f0f0;
  }
  .faq-q {
    display:flex; justify-content:space-between; align-items:center;
    padding: 18px 0; cursor:pointer; gap:16px;
    font-weight:600; font-size:15px; color:${C};
    background:none; border:none; width:100%;
    font-family:'Poppins',sans-serif; text-align:left;
    transition:color .18s;
  }
  .faq-q:hover { color:${P}; }
  .faq-a {
    font-size:14px; color:#555; line-height:1.8;
    padding-bottom:18px; animation:fadeDown .25s ease;
  }
  .faq-a a { color:${P}; }
  .faq-chevron {
    font-size:18px; flex-shrink:0; transition:transform .25s;
  }
  .tab-btn {
    padding:10px 22px; border-radius:100px;
    border:2px solid #eee; background:${W};
    font-family:'Poppins',sans-serif; font-weight:700;
    font-size:13px; cursor:pointer; transition:all .18s;
    color:#888;
  }
  .tab-btn.active { background:${P}; color:${W}; border-color:${P}; }

  @media(max-width:600px){
    .hero-pad { padding:48px 5% !important; }
    .content-pad { padding:40px 5% !important; }
    .contact-grid { grid-template-columns:1fr !important; }
  }
`;

const BUSINESS_FAQS = [
  {
    q: "How much does SubSeat cost for businesses?",
    a: "SubSeat is completely free to join. We charge a simple 6% platform fee plus VAT on subscription revenue only. There are no monthly charges, no setup fees and no hidden costs. You only pay when you earn.",
  },
  {
    q: "How do subscription payments work?",
    a: "Customers pay monthly via Stripe. The payment is collected on the date they subscribed each month. SubSeat takes 6% plus VAT and the remaining 94% is paid out to your connected bank account weekly every Monday.",
  },
  {
    q: "What happens if a customer doesn't show up?",
    a: "Because subscribers have already paid monthly, a no-show doesn't affect your revenue. The payment has already been collected. You can set your own policy on whether missed visits carry over — this is configurable in your business settings.",
  },
  {
    q: "Can I set how many visits a subscriber gets per month?",
    a: "Yes. When you create a subscription plan you can set a monthly visit limit. For example, 2 cuts per month at £49. Customers are shown this limit clearly before subscribing.",
  },
  {
    q: "How do I get my first subscribers?",
    a: "Share your unique SubSeat profile link directly with your regulars on WhatsApp, Instagram and TikTok. Most businesses get their first subscribers within 24 hours of going live simply by messaging their existing clients.",
  },
  {
    q: "Can I offer one-off bookings as well as subscriptions?",
    a: "Yes. SubSeat supports both subscription plans and one-off bookings. There is no SubSeat fee on one-off bookings — you keep 100% of that revenue.",
  },
  {
    q: "What if I want to take a holiday or annual leave?",
    a: "You can block dates in your dashboard calendar. When you mark dates as holiday, SubSeat automatically emails all customers who have bookings during that period to let them know and ask them to rebook.",
  },
  {
    q: "Can I add staff to my SubSeat profile?",
    a: "Yes. You can add employed staff, self-employed professionals and commission-based team members. Each staff member gets their own calendar and booking availability. You can track commission automatically.",
  },
  {
    q: "How do customers cancel their subscriptions?",
    a: "Customers can cancel at any time from their SubSeat dashboard. Their access continues until the end of the billing period. You will be notified by email and dashboard notification when a subscription is cancelled.",
  },
  {
    q: "What is the QR code for?",
    a: "Your QR code is for capturing walk-in customers. When a walk-in scans your QR code they can enter their details, which are saved to your customer database. You can then follow up and convert them to a subscriber.",
  },
  {
    q: "Do I need to be a limited company to join?",
    a: "No. SubSeat is open to sole traders, self-employed professionals and limited companies. However, our finance partner iWoca only lends to limited companies — this does not affect your SubSeat account.",
  },
  {
    q: "How do I remove my business from SubSeat?",
    a: "Contact us at hello@subseat.co.uk and we will deactivate your profile within 24 hours. All your data remains in our system for 30 days in case you change your mind, then is permanently deleted on request.",
  },
];

const CUSTOMER_FAQS = [
  {
    q: "What is SubSeat?",
    a: "SubSeat is a subscription booking platform for barbers, salons and beauty professionals. You can discover professionals near you, book one-off appointments or subscribe to secure your regular slot every month.",
  },
  {
    q: "How do subscriptions work for customers?",
    a: "When you subscribe to a business on SubSeat, you pay a monthly fee set by that business. In return you get a guaranteed priority slot, a set number of visits per month and automatic reminders before each appointment.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes. You can cancel your subscription at any time from your SubSeat dashboard. Your access and booking priority continues until the end of the current billing period. No partial refunds are issued for the remaining time in a billing period.",
  },
  {
    q: "What if my barber or salon cancels on me?",
    a: "If a business cancels your confirmed booking without reasonable notice, you are entitled to a full refund for that booking. Contact us at hello@subseat.co.uk within 14 days and we will investigate within 5 business days.",
  },
  {
    q: "Are my payments secure?",
    a: "Yes. All payments on SubSeat are processed securely via Stripe, one of the world's leading payment providers. SubSeat never stores your card details — they are held securely by Stripe.",
  },
  {
    q: "How do I find professionals near me?",
    a: <>Visit <a href="/discover">subseat.co.uk/discover</a> and search by location or category. You can filter by barbers, nail techs, lash artists, hair salons, massage therapists and more.</>,
  },
  {
    q: "Can I book without subscribing?",
    a: "Yes. Many businesses on SubSeat offer one-off bookings as well as subscription plans. You can book a single appointment without committing to a monthly subscription.",
  },
  {
    q: "How do I delete my account?",
    a: <>Email <a href="mailto:privacy@subseat.co.uk">privacy@subseat.co.uk</a> with the subject "Account Deletion Request". We will confirm within 48 hours and complete deletion within 30 days. You must cancel any active subscriptions first.</>,
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-chevron" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
      </button>
      {open && (
        <div className="faq-a">
          {typeof a === "string" ? a : a}
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [tab, setTab] = useState("businesses");

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
        <a href="/auth" style={{ background:P, color:W, textDecoration:"none", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"Poppins" }}>Get Started</a>
      </nav>

      {/* HERO */}
      <section className="hero-pad" style={{ background:`linear-gradient(135deg,#0f0f1a,#1a1040)`, padding:"72px 5%", textAlign:"center" }}>
        <div style={{ display:"inline-block", background:"rgba(86,59,231,.25)", border:"1px solid rgba(86,59,231,.4)", borderRadius:100, padding:"6px 18px", fontSize:11, fontWeight:700, color:"#a78bfa", letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>Help Centre</div>
        <h1 style={{ fontWeight:900, fontSize:"clamp(28px,4.5vw,52px)", color:W, letterSpacing:"-2px", marginBottom:14 }}>How can we help?</h1>
        <p style={{ fontSize:16, color:"rgba(255,255,255,.6)", maxWidth:480, margin:"0 auto 32px", lineHeight:1.7 }}>
          Find answers to the most common questions about SubSeat. Can't find what you need? Email us at <a href="mailto:hello@subseat.co.uk" style={{ color:"#a78bfa" }}>hello@subseat.co.uk</a>
        </p>

        {/* TAB TOGGLE */}
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          {[{val:"businesses",label:"For Businesses"},{val:"customers",label:"For Customers"}].map(t=>(
            <button key={t.val} className={`tab-btn ${tab===t.val?"active":""}`} onClick={()=>setTab(t.val)}>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ CONTENT */}
      <section className="content-pad" style={{ padding:"64px 5%", background:W }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>

          <div style={{ marginBottom:48 }}>
            {(tab==="businesses" ? BUSINESS_FAQS : CUSTOMER_FAQS).map((f,i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>

          {/* STILL NEED HELP */}
          <div style={{ background:G, borderRadius:20, padding:"36px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:14 }}>💬</div>
            <h3 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:10 }}>Still need help?</h3>
            <p style={{ fontSize:14, color:"#666", lineHeight:1.7, marginBottom:24, maxWidth:420, margin:"0 auto 24px" }}>
              Our team reads every email. We aim to respond within one working day.
            </p>
            <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, maxWidth:440, margin:"0 auto" }}>
              <a href="mailto:hello@subseat.co.uk" style={{ display:"block", background:P, color:W, textDecoration:"none", padding:"13px 20px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:14, textAlign:"center" }}>
                Email Us
              </a>
              <a href="mailto:hello@subseat.co.uk?subject=SubSeat Demo Request" style={{ display:"block", background:W, color:P, textDecoration:"none", padding:"13px 20px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:14, textAlign:"center", border:`2px solid ${L}` }}>
                Book a Demo
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"32px 5%", textAlign:"center" }}>
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:14 }}>
          {[["Home","/"],["About","/about"],["Contact","/contact"],["Terms","/terms"],["Privacy","/privacy"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,.35)", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.2)" }}>SubSeat Ltd · United Kingdom · SubSeat® is a registered trademark.</p>
      </footer>
    </>
  );
}