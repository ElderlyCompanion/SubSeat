'use client';
import { useState, useEffect, use } from "react";
import { supabase } from "../../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { height:100%; }
  body { font-family:'Poppins',sans-serif; background:${G}; color:${C}; min-height:100vh; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes pop     { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(86,59,231,.4)} 50%{box-shadow:0 0 0 16px rgba(86,59,231,0)} }
  @keyframes confetti{ 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(80px) rotate(360deg);opacity:0} }

  .fu  { animation:fadeUp .5s cubic-bezier(.22,1,.36,1) both }
  .d1  { animation-delay:.1s }
  .d2  { animation-delay:.2s }
  .d3  { animation-delay:.3s }

  .inp {
    width:100%; padding:16px 18px; border-radius:14px;
    border:2px solid #eee; background:${W};
    font-family:'Poppins',sans-serif; font-size:16px; color:${C};
    outline:none; transition:all .2s;
    -webkit-appearance:none;
  }
  .inp:focus { border-color:${P}; box-shadow:0 0 0 4px rgba(86,59,231,.1); }
  .inp::placeholder { color:#bbb; }

  .btn-main {
    width:100%; padding:18px; border-radius:14px;
    background:${P}; color:${W}; border:none;
    font-family:'Poppins',sans-serif; font-weight:800; font-size:17px;
    cursor:pointer; transition:all .2s;
    box-shadow:0 8px 24px rgba(86,59,231,.35);
    -webkit-appearance:none;
  }
  .btn-main:hover   { background:#4429d4; transform:translateY(-2px); box-shadow:0 12px 32px rgba(86,59,231,.45); }
  .btn-main:active  { transform:translateY(0); }
  .btn-main:disabled{ opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }

  .success-icon {
    width:96px; height:96px; border-radius:50%;
    background:linear-gradient(135deg,#22c55e,#16a34a);
    display:flex; align-items:center; justify-content:center;
    font-size:44px; margin:0 auto 24px;
    animation:pop .5s cubic-bezier(.22,1,.36,1) both;
    box-shadow:0 8px 32px rgba(34,197,94,.35);
  }
`;

export default function WalkInPage({ params }) {
  const { slug } = use(params);

  const [business,  setBusiness]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [step,      setStep]      = useState("form"); // form | success
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone:     "",
    email:     "",
    marketing: true,
  });

  useEffect(() => { fetchBusiness(); }, [slug]);

  const fetchBusiness = async () => {
    const { data, error } = await supabase
      .from("businesses")
      .select("id, business_name, category, city, logo_url, slug")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) { setNotFound(true); setLoading(false); return; }
    setBusiness(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { setError("Please enter your name"); return; }
    if (!form.phone.trim())     { setError("Please enter your phone number"); return; }
    setError("");
    setSaving(true);

    try {
      // 1. Save walk-in record to notification_queue / walk_ins table
      const { error: wiError } = await supabase.from("walk_ins").insert({
        business_id:      business.id,
        full_name:        form.full_name.trim(),
        phone:            form.phone.trim(),
        email:            form.email.trim() || null,
        marketing_consent:form.marketing,
        source:           "qr_code",
        visited_at:       new Date().toISOString(),
      });

      // 2. Queue welcome email if email provided
      if (form.email && !wiError) {
        await supabase.from("notification_queue").insert({
          business_id:       business.id,
          notification_type: "walk_in_welcome",
          recipient:         form.email.trim(),
          subject:           `Thanks for visiting ${business.business_name}! 👋`,
          message:           `Hi ${form.full_name.trim()}, great to meet you at ${business.business_name} today! Next time you can book online at subseat.co.uk/${business.category}/${business.slug} — or even subscribe for priority slots every month. See you soon! ✂️`,
          status:            "pending",
          channel:           "email",
          scheduled_for:     new Date().toISOString(),
        });
      }

      // 3. Queue Day 7 upsell email
      if (form.email && !wiError) {
        const day7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        await supabase.from("notification_queue").insert({
          business_id:       business.id,
          notification_type: "membership_upsell_day_7",
          recipient:         form.email.trim(),
          subject:           `💡 Save money every month at ${business.business_name}`,
          message:           `Hi ${form.full_name.trim()}, it was great having you at ${business.business_name}! Did you know you can subscribe monthly and get priority booking? Check out the membership plans at subseat.co.uk/${business.category}/${business.slug} — cancel anytime.`,
          status:            "pending",
          channel:           "email",
          scheduled_for:     day7,
        });
      }

      // 4. Notify business owner of new walk-in
      await supabase.from("notification_queue").insert({
        business_id:       business.id,
        notification_type: "new_walk_in",
        recipient:         "owner",
        subject:           `New walk-in: ${form.full_name.trim()}`,
        message:           `${form.full_name.trim()} just checked in via QR code at ${business.business_name}. Phone: ${form.phone.trim()}${form.email ? ` · Email: ${form.email.trim()}` : ""}`,
        status:            "pending",
        channel:           "email",
        scheduled_for:     new Date().toISOString(),
      });

      setStep("success");

    } catch (err) {
      setError("Something went wrong — please try again.");
      console.error(err);
    }

    setSaving(false);
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
        <div style={{ width:36, height:36, border:`3px solid ${L}`, borderTop:`3px solid ${P}`, borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      </div>
    </>
  );

  if (notFound) return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:24, textAlign:"center" }}>
        <div>
          <div style={{ fontSize:64, marginBottom:16 }}>😕</div>
          <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:8 }}>Business not found</h2>
          <p style={{ color:"#888", marginBottom:24 }}>This QR code may have expired or the business is no longer active.</p>
          <a href="/discover" style={{ color:P, fontWeight:700 }}>Browse SubSeat</a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
        <div style={{ width:"100%", maxWidth:400 }}>

          {/* LOGO + BUSINESS */}
          <div className="fu" style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:72, height:72, borderRadius:18, background:business.logo_url?"transparent":L, margin:"0 auto 14px", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, boxShadow:"0 4px 20px rgba(86,59,231,.15)", border:`3px solid ${W}` }}>
              {business.logo_url
                ? <img src={business.logo_url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : "✂️"}
            </div>
            <h1 style={{ fontWeight:900, fontSize:24, color:C, letterSpacing:"-.5px", marginBottom:4 }}>{business.business_name}</h1>
            <p style={{ fontSize:14, color:"#888" }}>📍 {business.city}</p>
          </div>

          {step === "form" && (
            <div className="fu d1" style={{ background:W, borderRadius:24, padding:28, boxShadow:"0 8px 40px rgba(86,59,231,.12)", border:`1.5px solid ${L}` }}>
              <h2 style={{ fontWeight:800, fontSize:20, color:C, marginBottom:6 }}>👋 Welcome in!</h2>
              <p style={{ fontSize:14, color:"#888", marginBottom:24, lineHeight:1.55 }}>
                Leave your details and we'll keep you updated with offers and let you book online next time.
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {/* NAME */}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Your Name *</label>
                  <input
                    className="inp"
                    placeholder="Jordan Smith"
                    value={form.full_name}
                    onChange={e => setForm(f=>({...f, full_name:e.target.value}))}
                    autoComplete="name"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>Phone Number *</label>
                  <input
                    className="inp"
                    type="tel"
                    placeholder="07700 000000"
                    value={form.phone}
                    onChange={e => setForm(f=>({...f, phone:e.target.value}))}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:C, display:"block", marginBottom:6 }}>
                    Email <span style={{ fontWeight:400, color:"#aaa" }}>(optional — for offers)</span>
                  </label>
                  <input
                    className="inp"
                    type="email"
                    placeholder="jordan@email.com"
                    value={form.email}
                    onChange={e => setForm(f=>({...f, email:e.target.value}))}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                {/* MARKETING CONSENT */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, background:G, borderRadius:12, padding:"12px 14px", cursor:"pointer" }}
                  onClick={()=>setForm(f=>({...f, marketing:!f.marketing}))}>
                  <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${form.marketing?P:"#ddd"}`, background:form.marketing?P:W, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, transition:"all .18s" }}>
                    {form.marketing && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3 4 7-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <p style={{ fontSize:12, color:"#666", lineHeight:1.5, margin:0 }}>
                    I'm happy to receive booking reminders and offers from {business.business_name} via SubSeat. You can unsubscribe anytime.
                  </p>
                </div>

                {/* ERROR */}
                {error && (
                  <div style={{ background:"#fff5f5", border:"1px solid #ffcccc", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#e53e3e", fontWeight:600 }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  className="btn-main"
                  onClick={handleSubmit}
                  disabled={saving || !form.full_name || !form.phone}
                >
                  {saving ? "Checking you in..." : "Check In ✓"}
                </button>

                <p style={{ fontSize:11, color:"#bbb", textAlign:"center", lineHeight:1.55 }}>
                  Your details are stored securely by SubSeat and only shared with {business.business_name}. We never sell your data.
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="fu" style={{ background:W, borderRadius:24, padding:32, boxShadow:"0 8px 40px rgba(86,59,231,.12)", border:`1.5px solid ${L}`, textAlign:"center" }}>
              <div className="success-icon">✓</div>
              <h2 style={{ fontWeight:900, fontSize:24, color:C, marginBottom:10, letterSpacing:"-.5px" }}>
                You're checked in!
              </h2>
              <p style={{ fontSize:15, color:"#666", lineHeight:1.65, marginBottom:28 }}>
                Welcome to {business.business_name}, {form.full_name.split(" ")[0]}! 
                {form.email && " We'll send you a message with your details."}
              </p>

              {/* UPSELL */}
              <div style={{ background:`linear-gradient(135deg,${P},#7c5cff)`, borderRadius:16, padding:20, marginBottom:20 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.75)", marginBottom:4 }}>💡 Did you know?</div>
                <div style={{ fontSize:15, fontWeight:800, color:W, marginBottom:8 }}>
                  Subscribe monthly for priority booking
                </div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", marginBottom:16, lineHeight:1.5 }}>
                  Members get priority slots and lock in their price every month.
                </div>
                <a href={`/${business.category}/${business.slug}`}
                  style={{ display:"block", background:"rgba(255,255,255,.2)", color:W, textDecoration:"none", padding:"12px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"Poppins", border:"1px solid rgba(255,255,255,.3)" }}>
                  View Membership Plans →
                </a>
              </div>

              {/* BOOK ONLINE */}
              <a href={`/${business.category}/${business.slug}`}
                style={{ display:"block", background:G, color:C, textDecoration:"none", padding:"14px", borderRadius:12, fontWeight:700, fontSize:15, fontFamily:"Poppins", marginBottom:16 }}>
                📅 Book Online Next Time
              </a>

              <p style={{ fontSize:12, color:"#bbb" }}>
                Powered by <a href="https://subseat.co.uk" style={{ color:P, fontWeight:700, textDecoration:"none" }}>SubSeat</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}