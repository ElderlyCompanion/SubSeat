'use client';
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: ${G}; color: ${C}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse  { 0%,100% { box-shadow: 0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow: 0 0 0 12px rgba(86,59,231,0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }

  .fu { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
  .d1 { animation-delay: .1s; } .d2 { animation-delay: .2s; } .d3 { animation-delay: .3s; }

  .service-card {
    background: ${W}; border-radius: 18px; padding: 24px;
    border: 1.5px solid #eee; transition: all .22s ease;
  }
  .service-card:hover { border-color: ${P}; box-shadow: 0 8px 32px rgba(86,59,231,.12); transform: translateY(-2px); }

  .staff-card {
    background: ${W}; border-radius: 16px; padding: 20px;
    border: 1.5px solid #eee; text-align: center; transition: all .2s;
  }
  .staff-card:hover { border-color: ${P}; transform: translateY(-2px); }

  .review-card {
    background: ${W}; border-radius: 16px; padding: 20px;
    border: 1.5px solid #eee;
  }

  .btn-subscribe {
    width: 100%; padding: 14px; border-radius: 12px;
    background: ${P}; color: ${W}; border: none;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 15px;
    cursor: pointer; transition: all .2s ease;
    box-shadow: 0 6px 20px rgba(86,59,231,.3);
  }
  .btn-subscribe:hover { background: #4429d4; transform: translateY(-1px); box-shadow: 0 10px 28px rgba(86,59,231,.4); }

  .tab { padding: 10px 20px; border: none; background: transparent; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; border-bottom: 2px solid transparent; transition: all .18s; color: #888; }
  .tab.active { color: ${P}; border-bottom-color: ${P}; }
  .tab:hover { color: ${P}; }

  .share-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px; border: 1.5px solid #eee;
    background: ${W}; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 13px;
    color: ${C}; cursor: pointer; transition: all .18s;
  }
  .share-btn:hover { border-color: ${P}; color: ${P}; background: ${L}; }

  @media(max-width: 768px) {
    .profile-grid { grid-template-columns: 1fr !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .staff-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media(max-width: 480px) {
    .staff-grid { grid-template-columns: 1fr 1fr !important; }
    .stats-row { grid-template-columns: 1fr 1fr !important; }
  }
`;

function StarRating({ rating, size = 16 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${L}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
      <h2 style={{ fontWeight: 800, fontSize: 24, color: C, marginBottom: 8 }}>Business not found</h2>
      <p style={{ color: "#888", marginBottom: 24 }}>This profile doesn't exist or may have been removed.</p>
      <a href="/discover" style={{ color: P, fontWeight: 700, textDecoration: "none" }}>← Browse all professionals</a>
    </div>
  );
}

export default function BusinessProfilePage({ params }) {
  const { category, slug } = params;
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  useEffect(() => {
    fetchBusinessData();
  }, [slug]);

  const fetchBusinessData = async () => {
    setLoading(true);
    const { data: biz, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !biz) { setNotFound(true); setLoading(false); return; }
    setBusiness(biz);

    const [{ data: svcs }, { data: stf }, { data: revs }] = await Promise.all([
      supabase.from("services").select("*").eq("business_id", biz.id).eq("is_active", true),
      supabase.from("staff").select("*").eq("business_id", biz.id).eq("is_active", true),
      supabase.from("reviews").select("*, profiles(full_name, avatar_url)").eq("business_id", biz.id).eq("is_visible", true).order("created_at", { ascending: false }).limit(10),
    ]);

    setServices(svcs || []);
    setStaff(stf || []);
    setReviews(revs || []);
    setLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = (service) => {
    setSelectedService(service);
    setShowSubscribeModal(true);
  };

  if (loading) return <><style>{css}</style><LoadingSpinner /></>;
  if (notFound) return <><style>{css}</style><NotFound /></>;

  const categoryLabel = category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background: W, borderBottom: `1px solid #eee`, padding: "0 5%", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: P, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "pulse 3s infinite" }}>
            <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: W }} />
            <span style={{ color: W, fontWeight: 900, fontSize: 16 }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: P }}>SubSeat</span>
        </a>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="share-btn" onClick={handleCopyLink}>
            <span>{copied ? "✅" : "🔗"}</span>
            {copied ? "Copied!" : "Share"}
          </button>
          <a href="/auth" style={{ background: P, color: W, textDecoration: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: "Poppins" }}>Sign In</a>
        </div>
      </nav>

      {/* BANNER */}
      <div style={{ position: "relative", height: 240, background: `linear-gradient(135deg, ${P} 0%, #7c5cff 100%)`, overflow: "hidden" }}>
        {business.banner_url && (
          <img src={business.banner_url} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)" }} />
      </div>

      {/* PROFILE HEADER */}
      <div style={{ background: W, borderBottom: `1px solid #eee` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 5%" }}>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-end", transform: "translateY(-40px)", marginBottom: "-16px", flexWrap: "wrap" }}>
            {/* LOGO */}
            <div style={{
              width: 96, height: 96, borderRadius: 22, border: `4px solid ${W}`,
              background: business.logo_url ? "transparent" : L,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0, boxShadow: "0 4px 20px rgba(0,0,0,.15)"
            }}>
              {business.logo_url
                ? <img src={business.logo_url} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 36 }}>✂️</span>
              }
            </div>

            {/* INFO */}
            <div style={{ flex: 1, paddingBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1 style={{ fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)", color: C, letterSpacing: "-.5px" }}>{business.business_name}</h1>
                {business.is_verified && (
                  <div style={{ background: L, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: P }}>✓ Verified</div>
                )}
                {business.tier === "partner" && (
                  <div style={{ background: P, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: W }}>Partner</div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, color: "#888" }}>📍 {business.city}</span>
                <span style={{ fontSize: 14, color: "#888" }}>✂️ {categoryLabel}</span>
                {avgRating && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <StarRating rating={avgRating} size={14} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: C }}>{avgRating}</span>
                    <span style={{ fontSize: 13, color: "#888" }}>({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", borderTop: `1px solid #eee`, marginTop: 8 }}>
            {["services", "staff", "reviews", "about"].map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "reviews" && reviews.length > 0 && ` (${reviews.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 5%" }}>
        <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28 }}>

          {/* LEFT — MAIN */}
          <div>

            {/* SERVICES TAB */}
            {activeTab === "services" && (
              <div className="fu">
                <h2 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 20 }}>Subscription Plans</h2>
                {services.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#888" }}>No services listed yet.</div>
                ) : (
                  <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {services.map(s => (
                      <div key={s.id} className="service-card">
                        <div style={{ fontWeight: 800, fontSize: 17, color: C, marginBottom: 6 }}>{s.name}</div>
                        {s.description && <div style={{ fontSize: 13, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>{s.description}</div>}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                          <div style={{ background: G, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#666" }}>⏱ {s.duration_minutes} mins</div>
                          <div style={{ background: L, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: P }}>Priority member</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                          <div>
                            <span style={{ fontWeight: 900, fontSize: 28, color: C, letterSpacing: "-1px" }}>£{parseFloat(s.monthly_price).toFixed(0)}</span>
                            <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>/month</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#aaa" }}>Cancel anytime</div>
                        </div>
                        <button className="btn-subscribe" onClick={() => handleSubscribe(s)}>
                          Subscribe & Book
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STAFF TAB */}
            {activeTab === "staff" && (
              <div className="fu">
                <h2 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 20 }}>Meet the Team</h2>
                {staff.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#888" }}>No staff profiles added yet.</div>
                ) : (
                  <div className="staff-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {staff.map(s => (
                      <div key={s.id} className="staff-card">
                        <div style={{ width: 72, height: 72, borderRadius: "50%", background: L, margin: "0 auto 12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {s.photo_url
                            ? <img src={s.photo_url} alt={s.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : <span style={{ fontSize: 28 }}>👤</span>
                          }
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: C, marginBottom: 4 }}>{s.full_name}</div>
                        {s.role && <div style={{ fontSize: 12, color: "#888" }}>{s.role}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="fu">
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <h2 style={{ fontWeight: 800, fontSize: 20, color: C }}>Reviews</h2>
                  {avgRating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: L, borderRadius: 100, padding: "6px 16px" }}>
                      <StarRating rating={avgRating} size={16} />
                      <span style={{ fontWeight: 800, fontSize: 16, color: P }}>{avgRating}</span>
                    </div>
                  )}
                </div>
                {reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#888" }}>No reviews yet — be the first!</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {reviews.map(r => (
                      <div key={r.id} className="review-card">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: L, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                              {r.profiles?.avatar_url ? <img src={r.profiles.avatar_url} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="" /> : "👤"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14, color: C }}>{r.profiles?.full_name || "Customer"}</div>
                              <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(r.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</div>
                            </div>
                          </div>
                          <StarRating rating={r.rating} size={14} />
                        </div>
                        {r.comment && <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{r.comment}</p>}
                        {r.business_response && (
                          <div style={{ background: G, borderRadius: 10, padding: "12px 14px", marginTop: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: P, marginBottom: 4 }}>Response from {business.business_name}</div>
                            <div style={{ fontSize: 13, color: "#666" }}>{r.business_response}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <div className="fu">
                <h2 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 20 }}>About</h2>
                <div style={{ background: W, borderRadius: 16, padding: 24, border: `1.5px solid #eee`, marginBottom: 20 }}>
                  {business.description && (
                    <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, marginBottom: 20 }}>{business.description}</p>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { icon: "📍", label: "Address", val: `${business.address}, ${business.city} ${business.postcode}` },
                      { icon: "📞", label: "Phone", val: business.phone },
                      { icon: "📧", label: "Email", val: business.email },
                    ].filter(i => i.val).map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 14, color: C, fontWeight: 500 }}>{item.val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — SIDEBAR */}
          <div>
            {/* QUICK SUBSCRIBE */}
            <div className="fu d1" style={{ background: W, borderRadius: 20, padding: 24, border: `1.5px solid #eee`, marginBottom: 20, boxShadow: "0 4px 20px rgba(86,59,231,.08)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C, marginBottom: 4 }}>Subscribe from</div>
              <div style={{ fontWeight: 900, fontSize: 36, color: P, letterSpacing: "-1.5px", marginBottom: 4 }}>
                £{services.length > 0 ? Math.min(...services.map(s => parseFloat(s.monthly_price))).toFixed(0) : "—"}<span style={{ fontSize: 14, fontWeight: 500, color: "#888" }}>/mo</span>
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Priority booking · Cancel anytime</div>
              <button className="btn-subscribe" onClick={() => services.length > 0 && handleSubscribe(services[0])}>
                Subscribe Now
              </button>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#bbb" }}>🔒 Stripe-secured payments</div>
            </div>

            {/* STATS */}
            <div className="fu d2" style={{ background: W, borderRadius: 20, padding: 24, border: `1.5px solid #eee`, marginBottom: 20 }}>
              <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { val: services.length, label: "Plans" },
                  { val: staff.length || "—", label: "Staff" },
                  { val: reviews.length, label: "Reviews" },
                  { val: avgRating || "New", label: "Rating" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center", background: G, borderRadius: 14, padding: "16px 10px" }}>
                    <div style={{ fontWeight: 900, fontSize: 22, color: P, letterSpacing: "-0.5px" }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SHARE */}
            <div className="fu d3" style={{ background: W, borderRadius: 20, padding: 24, border: `1.5px solid #eee` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C, marginBottom: 16 }}>Share this profile</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="share-btn" onClick={handleCopyLink} style={{ justifyContent: "center" }}>
                  {copied ? "✅ Link copied!" : "🔗 Copy link"}
                </button>
                <button className="share-btn" onClick={() => window.open(`https://wa.me/?text=Check out ${business.business_name} on SubSeat: ${window.location.href}`, "_blank")} style={{ justifyContent: "center" }}>
                  💬 Share on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBSCRIBE MODAL */}
      {showSubscribeModal && selectedService && (
        <>
          <div onClick={() => setShowSubscribeModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 998, backdropFilter: "blur(4px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, background: W, borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", maxWidth: 520, margin: "0 auto", boxShadow: "0 -8px 60px rgba(0,0,0,.2)" }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: "#e0e0e0", margin: "0 auto 24px" }} />
            <h3 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 6 }}>Subscribe to {selectedService.name}</h3>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>at {business.business_name}</p>
            <div style={{ background: G, borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: "#666" }}>Monthly subscription</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: C }}>£{parseFloat(selectedService.monthly_price).toFixed(2)}/mo</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#666" }}>Appointment duration</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C }}>{selectedService.duration_minutes} mins</span>
              </div>
            </div>
            <a href="/auth" style={{ display: "block", background: P, color: W, textDecoration: "none", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: 16, fontFamily: "Poppins", textAlign: "center", boxShadow: "0 6px 24px rgba(86,59,231,.32)", marginBottom: 12 }}>
              Sign Up & Subscribe
            </a>
            <button onClick={() => setShowSubscribeModal(false)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "transparent", border: `2px solid #eee`, fontFamily: "Poppins", fontWeight: 600, fontSize: 15, cursor: "pointer", color: "#888" }}>
              Maybe later
            </button>
          </div>
        </>
      )}
    </>
  );
}