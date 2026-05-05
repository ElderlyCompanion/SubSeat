'use client';
// ─────────────────────────────────────────────────────────
// MOBILE BARBER ADDRESS STEP
// Add this component to app/booking/[slug]/page.js
// Show it as an extra step when business.is_mobile === true
// Insert between step 1 (service) and step 2 (time selection)
// ─────────────────────────────────────────────────────────

import { useState } from "react";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

export default function MobileAddressStep({ form, setForm, onNext, onBack, businessName }) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!form.customer_address?.trim()) {
      setError("Please enter your street address.");
      return;
    }
    if (!form.customer_postcode?.trim()) {
      setError("Please enter your postcode.");
      return;
    }
    setError("");
    onNext();
  };

  const previewMap = () => {
    const addr = `${form.customer_address} ${form.customer_postcode}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, "_blank");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* MOBILE HEADER BANNER */}
      <div style={{
        background:`linear-gradient(135deg,${P},#7c3aed)`,
        borderRadius:16, padding:"20px 22px",
        display:"flex", alignItems:"center", gap:14,
      }}>
        <div style={{ fontSize:40, flexShrink:0 }}>🚐</div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:W, marginBottom:4 }}>Mobile Appointment</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", lineHeight:1.5 }}>
            {businessName} will travel to you. Enter your address below so they can plan their journey.
          </div>
        </div>
      </div>

      {/* STREET ADDRESS */}
      <div>
        <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>
          Street Address *
        </label>
        <input
          type="text"
          placeholder="14 Brick Lane"
          value={form.customer_address || ""}
          onChange={e => setForm(f => ({ ...f, customer_address:e.target.value }))}
          autoComplete="street-address"
          style={{
            width:"100%", padding:"14px 16px", borderRadius:12,
            border:`1.5px solid ${error && !form.customer_address ? "#e53e3e" : "#e0e0e0"}`,
            fontFamily:"Poppins,sans-serif", fontSize:15, color:C,
            outline:"none", transition:"border .2s",
          }}
          onFocus={e => e.target.style.borderColor = P}
          onBlur={e => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* POSTCODE */}
      <div>
        <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>
          Postcode *
        </label>
        <input
          type="text"
          placeholder="E1 6RF"
          value={form.customer_postcode || ""}
          onChange={e => setForm(f => ({ ...f, customer_postcode:e.target.value.toUpperCase() }))}
          autoComplete="postal-code"
          style={{
            width:"100%", padding:"14px 16px", borderRadius:12,
            border:`1.5px solid ${error && !form.customer_postcode ? "#e53e3e" : "#e0e0e0"}`,
            fontFamily:"Poppins,sans-serif", fontSize:15, color:C,
            outline:"none", transition:"border .2s", textTransform:"uppercase",
          }}
          onFocus={e => e.target.style.borderColor = P}
          onBlur={e => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* ACCESS NOTES */}
      <div>
        <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>
          Access notes <span style={{ fontWeight:400, color:"#aaa" }}>(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Ring doorbell, flat 3, gate code 1234..."
          value={form.customer_notes || ""}
          onChange={e => setForm(f => ({ ...f, customer_notes:e.target.value }))}
          style={{
            width:"100%", padding:"14px 16px", borderRadius:12,
            border:"1.5px solid #e0e0e0",
            fontFamily:"Poppins,sans-serif", fontSize:14, color:C, outline:"none",
          }}
        />
      </div>

      {/* MAP PREVIEW — shows once both fields filled */}
      {form.customer_address && form.customer_postcode && (
        <button
          onClick={previewMap}
          style={{
            background:"#f0fdf4", border:"1.5px solid #bbf7d0",
            borderRadius:12, padding:"12px 16px",
            fontFamily:"Poppins,sans-serif", fontWeight:600, fontSize:13,
            color:"#166534", cursor:"pointer",
            display:"flex", alignItems:"center", gap:8,
            transition:"all .18s",
          }}
        >
          <span>📍</span>
          Preview: {form.customer_address}, {form.customer_postcode}
          <span style={{ marginLeft:"auto", fontSize:12, color:"#16a34a" }}>Open Maps →</span>
        </button>
      )}

      {/* ERROR */}
      {error && (
        <div style={{
          background:"#fff5f5", border:"1px solid #ffcccc",
          borderRadius:10, padding:"11px 14px",
          fontSize:13, color:"#e53e3e", fontWeight:600,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* PRIVACY NOTE */}
      <div style={{
        background:G, borderRadius:10, padding:"11px 14px",
        fontSize:12, color:"#888", lineHeight:1.6,
      }}>
        🔒 Your address is only shared with <strong>{businessName}</strong> for this appointment. It is stored securely by SubSeat and never shared with third parties.
      </div>

      {/* BUTTONS */}
      <div style={{ display:"flex", gap:10, paddingTop:4 }}>
        <button
          onClick={onBack}
          style={{
            flex:1, background:G, border:"none", borderRadius:12,
            fontFamily:"Poppins,sans-serif", fontWeight:600, fontSize:14,
            color:"#555", cursor:"pointer", padding:14,
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          style={{
            flex:2, background:P, border:"none", borderRadius:12,
            fontFamily:"Poppins,sans-serif", fontWeight:700, fontSize:15,
            color:W, cursor:"pointer", padding:14,
            boxShadow:"0 6px 20px rgba(86,59,231,.3)",
          }}
        >
          Confirm Address →
        </button>
      </div>
    </div>
  );
}