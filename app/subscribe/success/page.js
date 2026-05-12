'use client';
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const P = "#563BE7";
const C = "#171717";
const W = "#ffffff";
const G = "#F4F4F4";

export default function SubscribeSuccessPage() {
  const params   = useSearchParams();
  const business = params.get("business");
  const category = params.get("category");
  const [ready,  setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0f1a,#1a1040)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", fontFamily:"Poppins,sans-serif" }}>
      <div style={{ maxWidth:520, width:"100%", textAlign:"center" }}>

        {/* LOGO */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:40 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-5, top:"50%", transform:"translateY(-50%)", width:11, height:11, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:19 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:22, color:W }}>SubSeat</span>
        </div>

        {/* SUCCESS CARD */}
        <div style={{ background:W, borderRadius:24, padding:"48px 36px", boxShadow:"0 24px 80px rgba(86,59,231,.4)" }}>

          {/* ANIMATED TICK */}
          <div style={{ width:80, height:80, borderRadius:"50%", background:"#f0fdf4", border:"3px solid #22c55e", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:36 }}>
            ✅
          </div>

          <h1 style={{ fontWeight:900, fontSize:28, color:C, letterSpacing:"-1px", marginBottom:10 }}>
            You're subscribed!
          </h1>
          <p style={{ fontSize:15, color:"#666", lineHeight:1.75, marginBottom:28, maxWidth:380, margin:"0 auto 28px" }}>
            Your subscription is confirmed and payment has been taken securely. You'll receive a confirmation email shortly.
          </p>

          {/* WHAT NEXT */}
          <div style={{ background:G, borderRadius:16, padding:"20px 24px", marginBottom:28, textAlign:"left" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#888", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>What happens next</div>
            {[
              ["🔒", "Your slot is locked in",       "Priority booking every month — your seat is always guaranteed."],
              ["📧", "Check your email",             "A confirmation has been sent with your subscription details."],
              ["📱", "You'll get reminders",         "WhatsApp and email reminders before every appointment."],
              ["💳", "Renews automatically",         "Your subscription renews monthly — cancel anytime from your dashboard."],
            ].map(([icon, title, body], i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom: i<3 ? 14 : 0 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:W, border:"1.5px solid #eee", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:C, marginBottom:2 }}>{title}</div>
                  <div style={{ fontSize:12, color:"#888", lineHeight:1.55 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {business && category && (
              <a href={`/${category}/${business}`} style={{ textDecoration:"none" }}>
                <button style={{ width:"100%", background:`linear-gradient(135deg,${P},#7c3aed)`, color:W, border:"none", borderRadius:12, padding:"15px", fontFamily:"Poppins", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:"0 6px 20px rgba(86,59,231,.35)" }}>
                  Back to Profile →
                </button>
              </a>
            )}
            <a href="/discover" style={{ textDecoration:"none" }}>
              <button style={{ width:"100%", background:G, color:C, border:"none", borderRadius:12, padding:"14px", fontFamily:"Poppins", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                Discover More Professionals
              </button>
            </a>
          </div>

        </div>

        <p style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginTop:24 }}>
          Questions? <a href="mailto:hello@subseat.co.uk" style={{ color:"rgba(255,255,255,.5)" }}>hello@subseat.co.uk</a> · <a href="/help" style={{ color:"rgba(255,255,255,.5)" }}>Help Centre</a>
        </p>

      </div>
    </div>
  );
}