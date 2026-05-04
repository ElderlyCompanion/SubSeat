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
  .inp {
    width:100%; padding:13px 16px; border-radius:10px;
    border:1.5px solid #e0e0e0; background:${W};
    font-family:'Poppins',sans-serif; font-size:14px; color:${C};
    outline:none; transition:border-color .2s;
  }
  .inp:focus { border-color:${P}; box-shadow:0 0 0 3px rgba(86,59,231,.08); }
  textarea.inp { resize:vertical; }
`;

export default function ContactPage() {
  const [form, setForm]   = useState({ name:"", email:"", subject:"", message:"", type:"general" });
  const [sent, setSent]   = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // In production this would send via Resend
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setSending(false);
  };

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
      <section style={{ background:`linear-gradient(145deg,${L} 0%,#f8f7ff 40%,${W} 100%)`, padding:"70px 5%" }}>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 18px", fontSize:12, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:20 }}>Get In Touch</div>
          <h1 style={{ fontWeight:900, fontSize:"clamp(30px,5vw,52px)", color:C, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:16 }}>We'd love to hear from you.</h1>
          <p style={{ fontSize:16, color:"#555", lineHeight:1.75 }}>Whether you're a business, a customer, a journalist or just curious — we're here.</p>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section style={{ padding:"60px 5%", background:W }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20, marginBottom:60 }}>
            {[
              { icon:"📧", title:"Email Us",       body:"hello@subseat.co.uk",           sub:"We reply within 24 hours",           href:"mailto:hello@subseat.co.uk" },
              { icon:"💬", title:"WhatsApp",        body:"Message us directly",            sub:"Quickest way to reach us",           href:"https://wa.me/447700000000" },
              { icon:"🏢", title:"Business Hours",  body:"Mon–Fri, 9am–6pm GMT",          sub:"We aim to reply same day",           href:null },
              { icon:"🐛", title:"Report an Issue", body:"support@subseat.co.uk",         sub:"For technical problems",             href:"mailto:support@subseat.co.uk" },
            ].map((c,i) => (
              <div key={i} style={{ background:G, borderRadius:16, padding:"24px 20px", border:"1.5px solid #eee" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>{c.icon}</div>
                <div style={{ fontWeight:700, fontSize:16, color:C, marginBottom:6 }}>{c.title}</div>
                {c.href
                  ? <a href={c.href} style={{ fontSize:14, color:P, fontWeight:600, textDecoration:"none", display:"block", marginBottom:4 }}>{c.body}</a>
                  : <div style={{ fontSize:14, color:C, fontWeight:600, marginBottom:4 }}>{c.body}</div>
                }
                <div style={{ fontSize:12, color:"#888" }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* CONTACT FORM */}
          <div style={{ maxWidth:640, margin:"0 auto" }}>
            <h2 style={{ fontWeight:800, fontSize:28, color:C, letterSpacing:"-0.5px", marginBottom:8 }}>Send us a message</h2>
            <p style={{ fontSize:14, color:"#888", marginBottom:32 }}>Fill in the form below and we'll get back to you within one business day.</p>

            {sent ? (
              <div style={{ background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:16, padding:"40px 32px", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <h3 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:8 }}>Message sent!</h3>
                <p style={{ fontSize:14, color:"#555" }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Enquiry Type</label>
                  <select className="inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                    <option value="general">General Enquiry</option>
                    <option value="business">I'm a Business Owner</option>
                    <option value="customer">I'm a Customer</option>
                    <option value="press">Press / Media</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Your Name *</label>
                    <input className="inp" placeholder="Jordan Smith" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
                  </div>
                  <div>
                    <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Email Address *</label>
                    <input className="inp" type="email" placeholder="jordan@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Subject</label>
                  <input className="inp" placeholder="What's this about?" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} />
                </div>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Message *</label>
                  <textarea className="inp" rows={6} placeholder="Tell us how we can help..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !form.name || !form.email || !form.message}
                  style={{ background:P, color:W, border:"none", borderRadius:12, padding:"15px", fontFamily:"Poppins", fontWeight:700, fontSize:16, cursor:"pointer", opacity:(!form.name||!form.email||!form.message)?".5":"1", transition:"all .2s" }}>
                  {sending ? "Sending..." : "Send Message →"}
                </button>
                <p style={{ fontSize:12, color:"#aaa", textAlign:"center" }}>We never share your information with third parties.</p>
              </div>
            )}
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