'use client';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";
const RED = "#e53e3e";
const GREEN = "#22c55e";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: #0f0f1a; color: ${W}; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes pulse  { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

  .fu { animation: fadeUp .4s cubic-bezier(.22,1,.36,1) both; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; cursor: pointer;
    font-size: 13px; font-weight: 600; color: rgba(255,255,255,.5);
    transition: all .18s; border: none; background: transparent;
    font-family: 'Poppins', sans-serif; width: 100%; text-align: left;
  }
  .nav-item:hover { background: rgba(255,255,255,.08); color: ${W}; }
  .nav-item.active { background: ${P}; color: ${W}; }

  .card {
    background: #1a1a2e; border-radius: 16px; padding: 24px;
    border: 1px solid rgba(255,255,255,.08);
  }
  .card:hover { border-color: rgba(86,59,231,.4); }

  .stat-card {
    background: #1a1a2e; border-radius: 16px; padding: 24px;
    border: 1px solid rgba(255,255,255,.08); transition: all .2s;
  }
  .stat-card:hover { border-color: ${P}; transform: translateY(-2px); }

  .table-row {
    display: grid; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,.06);
    align-items: center; transition: background .15s;
  }
  .table-row:hover { background: rgba(255,255,255,.04); }
  .table-row:last-child { border-bottom: none; }

  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 700;
  }
  .badge-green  { background: rgba(34,197,94,.15);  color: #4ade80; }
  .badge-red    { background: rgba(239,68,68,.15);  color: #f87171; }
  .badge-purple { background: rgba(86,59,231,.3);   color: #a78bfa; }
  .badge-orange { background: rgba(245,158,11,.15); color: #fbbf24; }
  .badge-grey   { background: rgba(255,255,255,.08); color: rgba(255,255,255,.4); }

  .btn-danger {
    background: rgba(239,68,68,.15); color: #f87171;
    border: 1px solid rgba(239,68,68,.3);
    border-radius: 8px; padding: 6px 14px;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 12px;
    cursor: pointer; transition: all .18s;
  }
  .btn-danger:hover { background: rgba(239,68,68,.3); }
  .btn-danger:disabled { opacity: .4; cursor: not-allowed; }

  .btn-primary {
    background: ${P}; color: ${W}; border: none;
    border-radius: 10px; padding: 10px 20px;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all .2s;
  }
  .btn-primary:hover { background: #4429d4; }

  .input-field {
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 10px 14px; color: ${W};
    font-family: 'Poppins', sans-serif; font-size: 14px; outline: none; width: 100%;
  }
  .input-field:focus { border-color: ${P}; }
  .input-field::placeholder { color: rgba(255,255,255,.3); }

  .live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${GREEN}; animation: pulse 2s infinite;
  }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.85);
    display: flex; align-items: center; justify-content: center;
    z-index: 999; backdrop-filter: blur(6px);
  }

  @media(max-width: 900px) {
    .admin-layout { grid-template-columns: 1fr !important; }
    .sidebar      { display: none !important; }
    .stats-grid   { grid-template-columns: 1fr 1fr !important; }
  }
`;

const ADMIN_EMAIL = "mrnicholson@hotmail.com";

/* ── CONFIRM MODAL ── */
function ConfirmModal({ message, confirmLabel = "Yes, Remove", onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div style={{ background: "#1a1a2e", borderRadius: 20, padding: 32, maxWidth: 420, width: "90%", border: "1px solid rgba(255,255,255,.12)" }}>
        <div style={{ fontSize: 44, textAlign: "center", marginBottom: 16 }}>⚠️</div>
        <h3 style={{ fontWeight: 800, fontSize: 18, color: W, textAlign: "center", marginBottom: 12 }}>Are you sure?</h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.6)", textAlign: "center", marginBottom: 8, lineHeight: 1.65 }}>{message}</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,.3)", textAlign: "center", marginBottom: 28 }}>
          Their data is kept securely in the database and can be restored at any time.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, background: "rgba(255,255,255,.08)", border: "none", borderRadius: 10, padding: "13px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, color: W, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: RED, border: "none", borderRadius: 10, padding: "13px", fontFamily: "Poppins", fontWeight: 700, fontSize: 14, color: W, cursor: "pointer" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SIDEBAR ── */
function Sidebar({ active, setActive }) {
  const items = [
    { id: "overview",   icon: "📊", label: "Overview"   },
    { id: "businesses", icon: "🏪", label: "Businesses" },
    { id: "customers",  icon: "👥", label: "Customers"  },
    { id: "finance",    icon: "💰", label: "Finance"    },
    { id: "disputes",   icon: "⚠️",  label: "Disputes"   },
    { id: "analytics",  icon: "📈", label: "Analytics"  },
  ];
  return (
    <div style={{ background: "#13131f", borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,.06)", height: "fit-content", position: "sticky", top: 88 }}>
      <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: P, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", position: "relative" }}>
          <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: W }} />
          <span style={{ color: W, fontWeight: 900, fontSize: 22 }}>S</span>
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, color: W }}>Super Admin</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 11, color: "#4ade80" }}>Live</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", marginTop: 12, paddingTop: 12 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <button className="nav-item"><span>🌐</span>View Site</button>
          </a>
          <button className="nav-item" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }} style={{ color: "#f87171" }}>
            <span>🚪</span>Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── OVERVIEW ── */
function Overview({ businesses, profiles, subscriptions }) {
  const stats = [
    { label: "Total Businesses",     val: businesses.length,                                                                                        icon: "🏪", color: P          },
    { label: "Total Customers",      val: profiles.filter(p => p.role === "customer").length,                                                       icon: "👥", color: "#22c55e"  },
    { label: "Active Subscriptions", val: subscriptions.length,                                                                                     icon: "💳", color: "#f59e0b"  },
    { label: "Platform Revenue",     val: `£${subscriptions.reduce((a, s) => a + parseFloat(s.monthly_price || 0) * 0.05, 0).toFixed(2)}`,          icon: "💰", color: "#8b5cf6"  },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: W }}>Platform Overview</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,.15)", borderRadius: 100, padding: "4px 12px" }}>
          <div className="live-dot" /><span style={{ fontSize: 12, color: "#4ade80", fontWeight: 700 }}>Live</span>
        </div>
      </div>

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card fu">
            <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontWeight: 900, fontSize: 28, color: s.color, letterSpacing: "-1px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="card fu" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: W, marginBottom: 16 }}>Recently Joined Businesses</h3>
        {businesses.length === 0 && <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>No businesses yet</div>}
        {businesses.slice(0, 5).map((b, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: W }}>{b.business_name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{b.category} · {b.city}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className={`badge ${b.is_active ? "badge-green" : "badge-red"}`}>{b.is_active ? "Active" : "Hidden"}</span>
              {b.tier === "partner" && <span className="badge badge-purple">Partner</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="card fu">
        <h3 style={{ fontWeight: 700, fontSize: 15, color: W, marginBottom: 16 }}>Platform Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Partner Businesses", val: businesses.filter(b => b.tier === "partner").length },
            { label: "Verified Businesses", val: businesses.filter(b => b.is_verified).length },
            { label: "Active Businesses",  val: businesses.filter(b => b.is_active).length },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.04)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
              <div style={{ fontWeight: 900, fontSize: 24, color: P }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── BUSINESSES ── */
function Businesses({ businesses, onRefresh }) {
  const [search, setSearch]             = useState("");
  const [confirm, setConfirm]           = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showHidden, setShowHidden]     = useState(false);

  const visible  = businesses.filter(b => showHidden ? true : b.slug && !b.slug.startsWith("removed-"));
  const filtered = visible.filter(b =>
    b.business_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.city?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  /* SOFT DELETE — hides from platform, keeps all data in Supabase */
  const confirmRemove = async () => {
    setActionLoading(confirm.id);
    await supabase
      .from("businesses")
      .update({
        is_active: false,
        slug: `removed-${confirm.id.slice(0, 8)}`,
      })
      .eq("id", confirm.id);
    setConfirm(null);
    setActionLoading(null);
    onRefresh();
  };

  const toggleActive = async (id, current) => {
    setActionLoading(id);
    await supabase.from("businesses").update({ is_active: !current }).eq("id", id);
    setActionLoading(null);
    onRefresh();
  };

  const toggleVerified = async (id, current) => {
    setActionLoading(id);
    await supabase.from("businesses").update({ is_verified: !current }).eq("id", id);
    setActionLoading(null);
    onRefresh();
  };

  const setTier = async (id, tier) => {
    await supabase.from("businesses").update({ tier }).eq("id", id);
    onRefresh();
  };

  /* RESTORE a previously removed business */
  const restoreBusiness = async (b) => {
    const slug = b.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setActionLoading(b.id);
    await supabase.from("businesses").update({ is_active: true, slug }).eq("id", b.id);
    setActionLoading(null);
    onRefresh();
  };

  const isRemoved = (b) => b.slug?.startsWith("removed-");

  return (
    <div>
      {confirm && (
        <ConfirmModal
          confirmLabel="Yes, Remove from Platform"
          message={`"${confirm.name}" will be hidden from SubSeat and their profile URL will be deactivated. All their data — services, staff, subscribers and history — stays safely in the database and can be restored at any time.`}
          onConfirm={confirmRemove}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: W }}>Businesses ({businesses.length})</h2>
        <button onClick={() => setShowHidden(!showHidden)}
          style={{ background: "rgba(255,255,255,.08)", border: "none", borderRadius: 8, padding: "8px 16px", fontFamily: "Poppins", fontWeight: 600, fontSize: 12, color: showHidden ? "#fbbf24" : "rgba(255,255,255,.5)", cursor: "pointer" }}>
          {showHidden ? "Hide Removed" : "Show Removed"}
        </button>
      </div>

      <input className="input-field" placeholder="Search by name, city or category..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 20 }} />

      <div style={{ background: "#1a1a2e", borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden" }}>
        {/* HEADER */}
        <div className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          {["Business", "Category", "City", "Tier", "Status", "Actions"].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,.3)" }}>No businesses found</div>
        )}

        {filtered.map(b => (
          <div key={b.id} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto", opacity: isRemoved(b) ? 0.5 : 1 }}>
            {/* NAME */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: W }}>{b.business_name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{b.slug}</div>
            </div>
            {/* CATEGORY */}
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", textTransform: "capitalize" }}>{b.category?.replace(/-/g, " ")}</div>
            {/* CITY */}
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{b.city || "—"}</div>
            {/* TIER */}
            <div>
              {isRemoved(b) ? (
                <span className="badge badge-grey">Removed</span>
              ) : (
                <select value={b.tier || "basic"} onChange={e => setTier(b.id, e.target.value)}
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "4px 8px", color: W, fontFamily: "Poppins", fontSize: 12, cursor: "pointer" }}>
                  <option value="basic">Basic</option>
                  <option value="partner">Partner</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              )}
            </div>
            {/* STATUS */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {isRemoved(b)
                ? <span className="badge badge-red">Hidden</span>
                : <span className={`badge ${b.is_active ? "badge-green" : "badge-red"}`}>{b.is_active ? "Active" : "Suspended"}</span>
              }
              {b.is_verified && !isRemoved(b) && <span className="badge badge-purple">Verified</span>}
            </div>
            {/* ACTIONS */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {isRemoved(b) ? (
                <button onClick={() => restoreBusiness(b)} disabled={actionLoading === b.id}
                  style={{ background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", borderRadius: 8, padding: "6px 12px", fontFamily: "Poppins", fontWeight: 700, fontSize: 11, color: "#4ade80", cursor: "pointer" }}>
                  Restore
                </button>
              ) : (
                <>
                  <button onClick={() => toggleActive(b.id, b.is_active)} disabled={actionLoading === b.id}
                    style={{ background: "rgba(255,255,255,.08)", border: "none", borderRadius: 8, padding: "6px 12px", fontFamily: "Poppins", fontWeight: 600, fontSize: 11, color: W, cursor: "pointer" }}>
                    {b.is_active ? "Suspend" : "Activate"}
                  </button>
                  <button onClick={() => toggleVerified(b.id, b.is_verified)} disabled={actionLoading === b.id}
                    style={{ background: "rgba(86,59,231,.2)", border: "none", borderRadius: 8, padding: "6px 12px", fontFamily: "Poppins", fontWeight: 600, fontSize: 11, color: "#a78bfa", cursor: "pointer" }}>
                    {b.is_verified ? "Unverify" : "Verify"}
                  </button>
                  <a href={`/${b.category}/${b.slug}`} target="_blank" style={{ textDecoration: "none" }}>
                    <button style={{ background: "rgba(255,255,255,.06)", border: "none", borderRadius: 8, padding: "6px 10px", fontFamily: "Poppins", fontWeight: 600, fontSize: 11, color: W, cursor: "pointer" }}>View</button>
                  </a>
                  <button className="btn-danger" onClick={() => setConfirm({ id: b.id, name: b.business_name })} disabled={actionLoading === b.id}>
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CUSTOMERS ── */
function Customers({ profiles }) {
  const [search, setSearch] = useState("");
  const customers = profiles.filter(p => p.role !== "business");
  const filtered  = customers.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: W, marginBottom: 20 }}>Customers ({customers.length})</h2>
      <input className="input-field" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 20 }} />
      <div style={{ background: "#1a1a2e", borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden" }}>
        <div className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr", background: "rgba(255,255,255,.04)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          {["Name", "Email", "Role", "Joined"].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,.3)" }}>No customers found</div>}
        {filtered.map(p => (
          <div key={p.id} className="table-row" style={{ gridTemplateColumns: "2fr 2fr 1fr 1fr" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: W }}>{p.full_name || "—"}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>{p.email}</div>
            <div><span className={`badge ${p.role === "business" ? "badge-purple" : "badge-green"}`}>{p.role || "customer"}</span></div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{new Date(p.created_at).toLocaleDateString("en-GB")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FINANCE ── */
function Finance({ businesses, subscriptions }) {
  const totalGross = subscriptions.reduce((a, s) => a + parseFloat(s.monthly_price || 0), 0);
  const totalFee   = totalGross * 0.05;
  const totalVAT   = totalFee  * 0.20;
  const totalNet   = totalFee  - totalVAT;
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: W, marginBottom: 24 }}>Finance & Commission</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Gross Volume",     val: `£${totalGross.toFixed(2)}`, sub: "All subscription revenue", color: "#22c55e" },
          { label: "Platform Fee (5%)",val: `£${totalFee.toFixed(2)}`,   sub: "SubSeat commission",       color: P         },
          { label: "VAT (20%)",        val: `£${totalVAT.toFixed(2)}`,   sub: "Payable to HMRC",          color: "#f59e0b" },
          { label: "Net Revenue",      val: `£${totalNet.toFixed(2)}`,   sub: "After VAT",                color: "#8b5cf6" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            <div style={{ fontWeight: 900, fontSize: 24, color: s.color, letterSpacing: "-1px", marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: 15, color: W, marginBottom: 16 }}>Commission Per Business</h3>
        {businesses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,.3)" }}>No businesses yet</div>
        ) : (
          <>
            <div className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "rgba(255,255,255,.04)", borderRadius: "8px 8px 0 0" }}>
              {["Business", "Subscribers", "Monthly Revenue", "SubSeat Fee"].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
              ))}
            </div>
            {businesses.map(b => {
              const bizSubs    = subscriptions.filter(s => s.business_id === b.id);
              const bizRevenue = bizSubs.reduce((a, s) => a + parseFloat(s.monthly_price || 0), 0);
              const bizFee     = bizRevenue * 0.05;
              return (
                <div key={b.id} className="table-row" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: W }}>{b.business_name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{bizSubs.length}</div>
                  <div style={{ fontSize: 13, color: "#4ade80" }}>£{bizRevenue.toFixed(2)}</div>
                  <div style={{ fontSize: 13, color: P }}>£{bizFee.toFixed(2)}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

/* ── DISPUTES ── */
function Disputes({ disputes }) {
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: W, marginBottom: 20 }}>Disputes & Support</h2>
      <div className="card">
        {disputes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: W, marginBottom: 8 }}>No open disputes</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.4)" }}>All clear — no issues to resolve right now.</div>
          </div>
        ) : disputes.map((d, i) => (
          <div key={d.id} style={{ padding: "16px 0", borderBottom: i < disputes.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: W }}>{d.category}</div>
              <span className={`badge ${d.status === "open" ? "badge-red" : d.status === "resolved" ? "badge-green" : "badge-orange"}`}>{d.status}</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 6 }}>{d.description}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>{new Date(d.created_at).toLocaleDateString("en-GB")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ANALYTICS ── */
function Analytics({ businesses }) {
  const categoryCount = businesses.reduce((acc, b) => { acc[b.category] = (acc[b.category] || 0) + 1; return acc; }, {});
  const cityCount     = businesses.reduce((acc, b) => { if (b.city) acc[b.city] = (acc[b.city] || 0) + 1; return acc; }, {});
  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: W, marginBottom: 24 }}>Platform Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: 15, color: W, marginBottom: 16 }}>Businesses by Category</h3>
          {Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).map(([cat, count], i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)", textTransform: "capitalize" }}>{cat.replace(/-/g, " ")}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: W }}>{count}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / businesses.length) * 100}%`, background: P, borderRadius: 100 }} />
              </div>
            </div>
          ))}
          {Object.keys(categoryCount).length === 0 && <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>No data yet</div>}
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: 15, color: W, marginBottom: 16 }}>Businesses by City</h3>
          {Object.entries(cityCount).sort((a, b) => b[1] - a[1]).map(([city, count], i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>{city}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: W }}>{count}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,.08)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / businesses.length) * 100}%`, background: "#22c55e", borderRadius: 100 }} />
              </div>
            </div>
          ))}
          {Object.keys(cityCount).length === 0 && <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>No data yet</div>}
        </div>
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: W, marginBottom: 16 }}>Platform Health</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[
              { label: "Active Rate",  val: `${businesses.length > 0 ? Math.round(businesses.filter(b => b.is_active).length / businesses.length * 100) : 0}%`, color: "#22c55e" },
              { label: "Verified Rate",val: `${businesses.length > 0 ? Math.round(businesses.filter(b => b.is_verified).length / businesses.length * 100) : 0}%`, color: P         },
              { label: "Partner Rate", val: `${businesses.length > 0 ? Math.round(businesses.filter(b => b.tier === "partner").length / businesses.length * 100) : 0}%`, color: "#f59e0b" },
              { label: "Avg Rating",   val: businesses.length > 0 ? (businesses.reduce((a, b) => a + parseFloat(b.rating || 0), 0) / businesses.length).toFixed(1) : "—", color: "#f59e0b" },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.04)", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontWeight: 900, fontSize: 28, color: s.color, marginBottom: 4 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function AdminPage() {
  const [loading, setLoading]           = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [businesses, setBusinesses]     = useState([]);
  const [profiles, setProfiles]         = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [disputes, setDisputes]         = useState([]);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) { setUnauthorized(true); setLoading(false); return; }
    await loadData();
  };

  const loadData = async () => {
    setLoading(true);
    const [{ data: bizs }, { data: profs }, { data: subs }, { data: disps }] = await Promise.all([
      supabase.from("businesses").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("*").eq("status", "active"),
      supabase.from("disputes").select("*").order("created_at", { ascending: false }),
    ]);
    setBusinesses(bizs || []);
    setProfiles(profs || []);
    setSubscriptions(subs || []);
    setDisputes(disps || []);
    setLoading(false);
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(86,59,231,.3)", borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ color: "rgba(255,255,255,.4)", fontSize: 14 }}>Loading SubSeat Admin...</div>
      </div>
    </>
  );

  if (unauthorized) return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 16, textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 64 }}>🔒</div>
        <h1 style={{ fontWeight: 900, fontSize: 28, color: W }}>Access Denied</h1>
        <p style={{ color: "rgba(255,255,255,.4)", fontSize: 15, maxWidth: 320 }}>This area is restricted to SubSeat administrators only.</p>
        <a href="/" style={{ background: P, color: W, textDecoration: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 14, fontFamily: "Poppins" }}>Back to SubSeat</a>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <nav style={{ background: "#13131f", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "0 5%", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: P, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: W, fontWeight: 900, fontSize: 16 }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: W }}>SubSeat</span>
          <div style={{ background: "rgba(86,59,231,.3)", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#a78bfa", letterSpacing: 1 }}>ADMIN</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>All systems operational</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>subseat.co.uk/admin</div>
      </nav>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 5%", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }} className="admin-layout">
        <div className="sidebar">
          <Sidebar active={activeSection} setActive={setActiveSection} />
        </div>
        <div className="fu">
          {activeSection === "overview"   && <Overview   businesses={businesses} profiles={profiles} subscriptions={subscriptions} />}
          {activeSection === "businesses" && <Businesses businesses={businesses} onRefresh={loadData} />}
          {activeSection === "customers"  && <Customers  profiles={profiles} />}
          {activeSection === "finance"    && <Finance    businesses={businesses} subscriptions={subscriptions} />}
          {activeSection === "disputes"   && <Disputes   disputes={disputes} />}
          {activeSection === "analytics"  && <Analytics  businesses={businesses} profiles={profiles} subscriptions={subscriptions} />}
        </div>
      </div>
    </>
  );
}