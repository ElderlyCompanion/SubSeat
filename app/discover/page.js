'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: ${G}; color: ${C}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse  { 0%,100% { box-shadow: 0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow: 0 0 0 10px rgba(86,59,231,0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }

  .fu { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }

  .biz-card {
    background: ${W}; border-radius: 20px; overflow: hidden;
    border: 1.5px solid #eee; transition: all .22s ease; cursor: pointer;
    text-decoration: none; display: block; color: inherit;
  }
  .biz-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(86,59,231,.16); border-color: ${P}; }

  .cat-pill {
    padding: 8px 16px; border-radius: 100px; border: 1.5px solid #eee;
    background: ${W}; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 13px;
    cursor: pointer; transition: all .18s; white-space: nowrap; color: ${C};
  }
  .cat-pill:hover { border-color: ${P}; color: ${P}; background: ${L}; }
  .cat-pill.active { background: ${P}; color: ${W}; border-color: ${P}; }

  .search-input {
    flex: 1; border: none; outline: none; background: transparent;
    font-family: 'Poppins', sans-serif; font-size: 15px; color: ${C};
  }
  .search-input::placeholder { color: #aaa; }

  @media(max-width: 768px) {
    .biz-grid { grid-template-columns: 1fr !important; }
  }
  @media(max-width: 480px) {
    .biz-grid { grid-template-columns: 1fr !important; }
  }
`;

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "barbers", label: "✂️ Barbers" },
  { id: "hair-salons", label: "💇 Hair Salons" },
  { id: "nail-techs", label: "💅 Nail Techs" },
  { id: "lash-artists", label: "👁️ Lash Artists" },
  { id: "brow-artists", label: "🪮 Brow Artists" },
  { id: "massage", label: "💆 Massage" },
  { id: "skincare", label: "🧴 Skincare" },
  { id: "wellness", label: "🧘 Wellness" },
];

function StarRating({ rating, size = 14 }) {
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

function BusinessCard({ business }) {
  const categoryLabel = business.category?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return (
    <a href={`/${business.category}/${business.slug}`} className="biz-card">
      {/* BANNER */}
      <div style={{ height: 140, background: `linear-gradient(135deg, ${P} 0%, #7c5cff 100%)`, position: "relative", overflow: "hidden" }}>
        {business.banner_url && (
          <img src={business.banner_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.4) 0%, transparent 60%)" }} />
        {business.tier === "partner" && (
          <div style={{ position: "absolute", top: 12, right: 12, background: P, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: W }}>Partner</div>
        )}
        {business.is_verified && (
          <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,.9)", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: P }}>✓ Verified</div>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          {/* LOGO */}
          <div style={{ width: 48, height: 48, borderRadius: 14, background: business.logo_url ? "transparent" : L, border: `2px solid ${W}`, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -28, boxShadow: "0 2px 12px rgba(0,0,0,.12)" }}>
            {business.logo_url
              ? <img src={business.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 20 }}>✂️</span>
            }
          </div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: C, marginBottom: 2 }}>{business.business_name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{categoryLabel} · {business.city}</div>
          </div>
        </div>

        {/* RATING */}
        {business.rating > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <StarRating rating={business.rating} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C }}>{parseFloat(business.rating).toFixed(1)}</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>({business.review_count} reviews)</span>
          </div>
        )}

        {/* DESCRIPTION */}
        {business.description && (
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {business.description}
          </p>
        )}

        {/* FOOTER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid #f0f0f0` }}>
          <div style={{ fontSize: 12, color: "#888" }}>📍 {business.city}</div>
          <div style={{ background: L, borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: P }}>View Plans →</div>
        </div>
      </div>
    </a>
  );
}

export default function DiscoverPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    // Check URL params for category
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setActiveCategory(cat);
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false });

    if (!error) setBusinesses(data || []);
    setLoading(false);
  };

  const filtered = businesses.filter(b => {
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    const matchSearch = !search ||
      b.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.city?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
          <a href="/auth" style={{ background: "transparent", color: P, textDecoration: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: "Poppins", border: `2px solid ${P}` }}>Sign In</a>
          <a href="/onboarding" style={{ background: P, color: W, textDecoration: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: "Poppins" }}>List Your Business</a>
        </div>
      </nav>

      {/* HERO SEARCH */}
      <div style={{ background: `linear-gradient(135deg, ${P} 0%, #7c5cff 100%)`, padding: "48px 5%" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontWeight: 900, fontSize: "clamp(24px,4vw,40px)", color: W, marginBottom: 8, letterSpacing: "-1px" }}>Find your perfect professional</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.75)", marginBottom: 28 }}>Subscribe monthly for priority booking and better value</p>
          <div style={{ background: W, borderRadius: 16, padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 16px 48px rgba(0,0,0,.2)" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#aaa" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input className="search-input" placeholder="Search by name, city or service..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#aaa", padding: "0 8px" }}>✕</button>
            )}
            <button style={{ background: P, color: W, border: "none", borderRadius: 12, padding: "13px 24px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Search</button>
          </div>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ background: W, borderBottom: `1px solid #eee`, padding: "16px 5%", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 10, maxWidth: 1280, margin: "0 auto", minWidth: "max-content" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`cat-pill ${activeCategory === cat.id ? "active" : ""}`} onClick={() => setActiveCategory(cat.id)}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 5%" }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: C }}>
              {loading ? "Loading..." : `${filtered.length} professional${filtered.length !== 1 ? "s" : ""} found`}
            </h2>
            {activeCategory !== "all" && (
              <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
                Filtered by: {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </p>
            )}
          </div>
          {!loading && filtered.length === 0 && (
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} style={{ background: L, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: P, cursor: "pointer" }}>
              Clear filters
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${L}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 8 }}>No professionals found</h3>
            <p style={{ color: "#888", marginBottom: 24 }}>Try adjusting your search or browsing all categories.</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} style={{ background: P, color: W, border: "none", borderRadius: 12, padding: "14px 28px", fontFamily: "Poppins", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Browse All
            </button>
          </div>
        )}

        {/* GRID */}
        {!loading && filtered.length > 0 && (
          <div className="biz-grid fu" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.map(b => <BusinessCard key={b.id} business={b} />)}
          </div>
        )}

        {/* CTA FOR BUSINESSES */}
        {!loading && (
          <div style={{ textAlign: "center", marginTop: 60, padding: "40px", background: W, borderRadius: 24, border: `1.5px solid ${L}` }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 8 }}>Are you a professional?</h3>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>Join SubSeat and start earning predictable monthly income through subscriptions.</p>
            <a href="/onboarding" style={{ display: "inline-block", background: P, color: W, textDecoration: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "Poppins" }}>
              List Your Business Free →
            </a>
          </div>
        )}
      </div>
    </>
  );
}