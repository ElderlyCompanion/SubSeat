'use client';
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const P = "#563BE7";
const C = "#171717";
const W = "#ffffff";
const G = "#F4F4F4";

function HolidayResponseContent() {
  const params   = useSearchParams();
  const action   = params.get("action");
  const business = params.get("business") || "your professional";

  const isCarryOver   = action === "carry_over";
  const isCancelVisit = action === "cancel_visit";

  const config = isCarryOver ? {
    icon:    "🔄",
    title:   "Visit carried over!",
    color:   "#22c55e",
    bg:      "#f0fdf4",
    border:  "#bbf7d0",
    message: `Your visit has been carried over to next month's allowance. You'll get an extra visit when ${business} is back.`,
    sub:     "Your subscription continues as normal. Your priority slot is still guaranteed.",
  } : isCancelVisit ? {
    icon:    "✅",
    title:   "Visit cancelled",
    color:   "#563BE7",
    bg:      "#f8f6ff",
    border:  "#ede9ff",
    message: `Your visit on the affected date has been cancelled. Your subscription continues as normal.`,
    sub:     "You'll still have your regular visits each month as part of your subscription.",
  } : {
    icon:    "👍",
    title:   "Got it!",
    color:   "#563BE7",
    bg:      "#f8f6ff",
    border:  "#ede9ff",
    message: "Your preference has been recorded.",
    sub:     "Your subscription continues as normal.",
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#f0eeff,#fff)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", fontFamily:"Poppins,sans-serif" }}>
      <div style={{ maxWidth:480, width:"100%", textAlign:"center" }}>

        {/* LOGO */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:40 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:20, color:P }}>SubSeat</span>
        </div>

        <div style={{ background:W, borderRadius:24, padding:"44px 36px", boxShadow:"0 16px 60px rgba(86,59,231,.15)" }}>

          {/* ICON */}
          <div style={{ width:80, height:80, borderRadius:"50%", background:config.bg, border:`2px solid ${config.border}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:36 }}>
            {config.icon}
          </div>

          <h1 style={{ fontWeight:900, fontSize:26, color:C, letterSpacing:"-1px", marginBottom:12 }}>
            {config.title}
          </h1>

          <p style={{ fontSize:15, color:"#555", lineHeight:1.75, marginBottom:16, maxWidth:360, margin:"0 auto 16px" }}>
            {config.message}
          </p>

          {/* SUBSCRIPTION GUARANTEE */}
          <div style={{ background:config.bg, border:`1.5px solid ${config.border}`, borderRadius:14, padding:"14px 18px", marginBottom:28 }}>
            <p style={{ fontSize:13, color:config.color, margin:0, fontWeight:600, lineHeight:1.6 }}>
              {config.sub}
            </p>
          </div>

          {/* BUTTONS */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <a href="/discover" style={{ textDecoration:"none" }}>
              <button style={{ width:"100%", background:`linear-gradient(135deg,${P},#7c3aed)`, color:W, border:"none", borderRadius:12, padding:"14px", fontFamily:"Poppins", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:"0 6px 20px rgba(86,59,231,.3)" }}>
                Discover More Professionals
              </button>
            </a>
            <a href="/" style={{ textDecoration:"none" }}>
              <button style={{ width:"100%", background:G, color:C, border:"none", borderRadius:12, padding:"13px", fontFamily:"Poppins", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                Back to SubSeat
              </button>
            </a>
          </div>

        </div>

        <p style={{ fontSize:12, color:"#aaa", marginTop:20 }}>
          Questions? <a href="mailto:hello@subseat.co.uk" style={{ color:P }}>hello@subseat.co.uk</a>
        </p>

      </div>
    </div>
  );
}

export default function HolidayResponsePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:32, height:32, border:"3px solid #e9e6ff", borderTop:"3px solid #563BE7", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    }>
      <HolidayResponseContent />
    </Suspense>
  );
}