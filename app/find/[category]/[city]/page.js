'use client';
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const P = "#563BE7";
const C = "#171717";
const W = "#ffffff";
const G = "#F4F4F4";
const L = "#E9E6FF";

const CITIES = [
  "London","Manchester","Birmingham","Leeds","Bristol","Sheffield",
  "Liverpool","Newcastle","Nottingham","Leicester","Southampton",
  "Oxford","Cambridge","Brighton","Edinburgh","Glasgow","Cardiff"
];

const CATEGORIES = {
  "barbers":      { label:"Barbers",      emoji:"✂️",  desc:"barber shops and barbershops" },
  "hair-salons":  { label:"Hair Salons",  emoji:"💇",  desc:"hair salons and stylists" },
  "nail-techs":   { label:"Nail Techs",   emoji:"💅",  desc:"nail technicians and nail salons" },
  "lash-artists": { label:"Lash Artists", emoji:"👁️",  desc:"lash artists and eyelash technicians" },
  "brow-artists": { label:"Brow Artists", emoji:"🪮",  desc:"brow artists and eyebrow specialists" },
  "massage":      { label:"Massage",      emoji:"💆",  desc:"massage therapists and studios" },
  "skincare":     { label:"Skincare",     emoji:"✨",  desc:"skincare specialists and estheticians" },
  "wellness":     { label:"Wellness",     emoji:"🌿",  desc:"wellness professionals and studios" },
};

export default function CityPage({ params }) {
  const { category, city } = params;
  const [businesses, setBusinesses] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const cat      = CATEGORIES[category] || { label: category, emoji: "✂️", desc: category };
  const cityName = city?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "";

  useEffect(() => {
    if (!category || !city) return;
    supabase
      .from("businesses")
      .select("id, business_name, slug, category, city, rating, review_count, is_verified, tier, logo_url")
      .eq("category", category)
      .ilike("city", `%${cityName}%`)
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(20)
      .then(({ data }) => { setBusinesses(data || []); setLoading(false); });
  }, [category, city]);

  const title = `${cat.label} in ${cityName} | Subscribe and Save | SubSeat`;
  const desc  = `Find the best ${cat.desc} in ${cityName}. Subscribe monthly for priority booking and guaranteed slots. No more waiting. Join SubSeat today.`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Poppins',sans-serif; background:${W}; color:${C}; }
        .biz-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }
        .biz-card { background:${W}; border-radius:16px; overflow:hidden; border:1.5px solid #eee; text-decoration:none; color:${C}; transition:all .2s; display:block; }
        .biz-card:hover { box-shadow:0 8px 32px rgba(86,59,231,.15); transform:translateY(-2px); border-color:${P}; }
        @media(max-width:600px){ .biz-grid{grid-template-columns:1fr} }
      `}</style>

      {/* NAV */}
      <nav style={{ background:W, borderBottom:"1px solid #eee", padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:P }}>SubSeat</span>
        </a>
        <div style={{ display:"flex", gap:8 }}>
          <a href="/discover" style={{ textDecoration:"none" }}><button style={{ background:G, border:"none", borderRadius:8, padding:"9px 16px", fontFamily:"Poppins", fontWeight:600, fontSize:13, cursor:"pointer" }}>Browse All</button></a>
          <a href="/auth" style={{ textDecoration:"none" }}><button style={{ background:P, color:W, border:"none", borderRadius:8, padding:"9px 16px", fontFamily:"Poppins", fontWeight:700, fontSize:13, cursor:"pointer" }}>Get Started</button></a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background:`linear-gradient(135deg,#0f0f1a,#1a1040)`, padding:"64px 5% 56px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ display:"inline-block", background:"rgba(86,59,231,.25)", border:"1px solid rgba(86,59,231,.4)", borderRadius:100, padding:"5px 16px", fontSize:11, fontWeight:700, color:"#a78bfa", letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>
            {cityName} · {cat.label}
          </div>
          <h1 style={{ fontWeight:900, fontSize:"clamp(28px,4.5vw,52px)", color:W, letterSpacing:"-2px", marginBottom:16, lineHeight:1.1 }}>
            {cat.emoji} {cat.label} in {cityName}
          </h1>
          <p style={{ fontSize:17, color:"rgba(255,255,255,.7)", maxWidth:560, lineHeight:1.75, marginBottom:28 }}>
            Find and subscribe to the best {cat.desc} in {cityName}. Lock in your regular slot, never miss an appointment and save money every month with SubSeat.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <a href="/auth?mode=signup" style={{ background:P, color:W, textDecoration:"none", padding:"13px 26px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:14, boxShadow:"0 6px 20px rgba(86,59,231,.4)" }}>
              Find a Professional →
            </a>
            <a href="/discover" style={{ background:"rgba(255,255,255,.1)", color:W, textDecoration:"none", padding:"13px 26px", borderRadius:12, fontFamily:"Poppins", fontWeight:600, fontSize:14, border:"1px solid rgba(255,255,255,.2)" }}>
              Browse All Categories
            </a>
          </div>
        </div>
      </section>

      {/* WHY SUBSEAT */}
      <section style={{ background:G, padding:"40px 5%" }}>
        <div style={{ maxWidth:800, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
          {[
            ["💳", "Subscribe monthly", `Lock in your regular slot with ${cityName} professionals`],
            ["🔔", "Automatic reminders", "Never forget an appointment again"],
            ["💰", `Simple 6% fee`, "No hidden charges. No monthly software fee."],
            ["📵", "Fewer no-shows", "You've paid — so you always show up"],
          ].map(([icon, title, body]) => (
            <div key={title} style={{ background:W, borderRadius:14, padding:"18px 20px" }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
              <div style={{ fontWeight:700, fontSize:14, color:C, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:13, color:"#888", lineHeight:1.55 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESSES */}
      <section style={{ padding:"56px 5%", background:W }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, flexWrap:"wrap", gap:12 }}>
            <div>
              <h2 style={{ fontWeight:800, fontSize:26, color:C, letterSpacing:"-0.5px" }}>
                {cat.label} in {cityName}
              </h2>
              <p style={{ fontSize:14, color:"#888", marginTop:4 }}>
                {loading ? "Finding professionals..." : businesses.length > 0 ? `${businesses.length} professional${businesses.length!==1?"s":""} found` : "Be the first to join in this area"}
              </p>
            </div>
            <a href="/discover" style={{ textDecoration:"none" }}>
              <button style={{ background:L, color:P, border:"none", borderRadius:10, padding:"10px 20px", fontFamily:"Poppins", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                View All Categories →
              </button>
            </a>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:60, color:"#aaa" }}>
              <div style={{ fontSize:36, marginBottom:12 }}>✂️</div>
              <div>Loading professionals...</div>
            </div>
          ) : businesses.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 24px", background:G, borderRadius:20 }}>
              <div style={{ fontSize:52, marginBottom:16 }}>{cat.emoji}</div>
              <h3 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:10 }}>Coming to {cityName} soon</h3>
              <p style={{ fontSize:15, color:"#888", maxWidth:400, margin:"0 auto 24px", lineHeight:1.7 }}>
                We're growing fast. Are you a {cat.label.toLowerCase().replace(/s$/,"")} in {cityName}? Join SubSeat free and be first in your area.
              </p>
              <a href="/auth?mode=signup&type=business" style={{ display:"inline-block", background:P, color:W, textDecoration:"none", padding:"13px 28px", borderRadius:12, fontFamily:"Poppins", fontWeight:700, fontSize:14 }}>
                Join SubSeat Free →
              </a>
            </div>
          ) : (
            <div className="biz-grid">
              {businesses.map(b => (
                <a key={b.id} href={`/${b.category}/${b.slug}`} className="biz-card">
                  <div style={{ height:120, background:`linear-gradient(135deg,${P},#7c3aed)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>
                    {cat.emoji}
                  </div>
                  <div style={{ padding:"14px 16px 18px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                      <div style={{ fontWeight:800, fontSize:15, color:C }}>{b.business_name}</div>
                      {b.is_verified && <span style={{ background:L, borderRadius:100, padding:"2px 8px", fontSize:10, fontWeight:700, color:P }}>✓ Verified</span>}
                    </div>
                    <div style={{ fontSize:12, color:"#888", marginBottom:8 }}>{b.city}</div>
                    {b.rating > 0 && (
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ fontSize:12 }}>⭐</span>
                        <span style={{ fontWeight:700, fontSize:13, color:C }}>{parseFloat(b.rating).toFixed(1)}</span>
                        <span style={{ fontSize:12, color:"#aaa" }}>({b.review_count})</span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OTHER CITIES */}
      <section style={{ background:G, padding:"48px 5%" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <h2 style={{ fontWeight:800, fontSize:22, color:C, marginBottom:20 }}>
            {cat.label} in other UK cities
          </h2>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {CITIES.filter(c => c !== cityName).slice(0, 12).map(c => (
              <a key={c} href={`/find/${category}/${c.toLowerCase().replace(/\s+/g,"-")}`}
                style={{ background:W, border:"1px solid #eee", borderRadius:100, padding:"8px 18px", textDecoration:"none", fontSize:13, fontWeight:600, color:C, transition:"all .18s" }}>
                {cat.emoji} {cat.label} in {c}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION — AEO */}
      <section style={{ padding:"56px 5%", background:W }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <h2 style={{ fontWeight:800, fontSize:24, color:C, marginBottom:28 }}>
            Frequently asked questions
          </h2>
          {[
            [`How do I find ${cat.label.toLowerCase()} in ${cityName}?`, `Use SubSeat's discover page to search for ${cat.desc} in ${cityName}. You can browse profiles, see reviews, view portfolios and subscribe directly online.`],
            [`What is a subscription barber or salon?`, `A subscription model means you pay a fixed monthly fee to secure your regular slot with a professional. Instead of booking and paying each time, you subscribe once and your appointment is guaranteed every month.`],
            [`How much does it cost to subscribe on SubSeat?`, `Subscription prices are set by each individual business. Most barber subscriptions in the UK range from £30 to £65 per month for regular cuts. SubSeat charges a simple 6% platform fee with no hidden charges.`],
            [`Can I cancel my subscription?`, `Yes. You can cancel any subscription at any time from your SubSeat dashboard. You keep access until the end of your current billing period.`],
            [`Is SubSeat available in ${cityName}?`, `Yes. SubSeat is available to beauty and wellness professionals and customers across the UK, including ${cityName}. If there are no professionals listed in your area yet, you can sign up to be notified when new professionals join.`],
          ].map(([q, a]) => (
            <div key={q} style={{ borderBottom:"1px solid #f0f0f0", padding:"20px 0" }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:C, marginBottom:8 }}>{q}</h3>
              <p style={{ fontSize:14, color:"#666", lineHeight:1.75, margin:0 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:`linear-gradient(135deg,${P},#7c3aed)`, padding:"64px 5%", textAlign:"center" }}>
        <h2 style={{ fontWeight:900, fontSize:"clamp(24px,4vw,40px)", color:W, letterSpacing:"-1px", marginBottom:14 }}>
          Ready to find your perfect professional in {cityName}?
        </h2>
        <p style={{ fontSize:16, color:"rgba(255,255,255,.8)", marginBottom:28 }}>Free to join. Cancel anytime.</p>
        <a href="/auth?mode=signup" style={{ display:"inline-block", background:W, color:P, textDecoration:"none", padding:"14px 32px", borderRadius:14, fontFamily:"Poppins", fontWeight:800, fontSize:15 }}>
          Get Started Free →
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"28px 5%", textAlign:"center" }}>
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap", marginBottom:12 }}>
          {[["Home","/"],["Discover","/discover"],["For Businesses","/auth"],["Terms","/terms"],["Privacy","/privacy"],["Help","/help"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,.35)", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.2)" }}>SubSeat Ltd &middot; United Kingdom &middot; SubSeat&reg; is a registered trademark.</p>
      </footer>
    </>
  );
}