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

  .input-field {
    width: 100%; padding: 12px 14px; border-radius: 10px;
    border: 1.5px solid #e0e0e0; background: ${W};
    font-family: 'Poppins', sans-serif; font-size: 14px; color: ${C};
    outline: none; transition: border-color .2s;
  }
  .input-field:focus { border-color: ${P}; box-shadow: 0 0 0 3px rgba(86,59,231,.08); }

  .btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    background: ${P}; color: ${W}; border: none;
    padding: 13px 24px; border-radius: 10px;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 15px;
    cursor: pointer; transition: all .2s;
  }
  .btn-primary:hover { background: #4429d4; transform: translateY(-1px); }

  .sub-card {
    background: ${W}; border-radius: 16px; padding: 20px;
    border: 1.5px solid #eee; transition: all .2s; text-decoration: none; display: block;
  }
  .sub-card:hover { border-color: ${P}; box-shadow: 0 8px 24px rgba(86,59,231,.12); }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 12px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: #888;
    transition: all .18s; border: none; background: transparent;
    font-family: 'Poppins', sans-serif; width: 100%; text-align: left;
  }
  .nav-item:hover { background: ${L}; color: ${P}; }
  .nav-item.active { background: ${P}; color: ${W}; }

  @media(max-width: 900px) {
    .profile-layout { grid-template-columns: 1fr !important; }
    .sidebar { display: none !important; }
  }
`;

function Sidebar({ active, setActive, profile, onSignOut }) {
  const items = [
    { id: "overview",      icon: "🏠", label: "My Subscriptions" },
    { id: "appointments",  icon: "📅", label: "Appointments" },
    { id: "account",       icon: "👤", label: "My Account" },
    { id: "discover",      icon: "🔍", label: "Find Professionals" },
  ];
  return (
    <div style={{ background: W, borderRadius: 20, padding: 20, border: `1.5px solid #eee`, height: "fit-content", position: "sticky", top: 88 }}>
      {/* AVATAR */}
      <div style={{ textAlign: "center", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid #f0f0f0` }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: L, margin: "0 auto 10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "👤"
          }
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: C, marginBottom: 2 }}>{profile?.full_name || "Welcome!"}</div>
        <div style={{ fontSize: 12, color: "#888" }}>SubSeat Member</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map(item => (
          <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => item.id === "discover" ? window.location.href = "/discover" : setActive(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ borderTop: `1px solid #f0f0f0`, marginTop: 12, paddingTop: 12 }}>
          <button className="nav-item" onClick={onSignOut} style={{ color: "#e53e3e" }}>
            <span>🚪</span>Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MY SUBSCRIPTIONS ── */
function MySubscriptions({ subscriptions }) {
  if (subscriptions.length === 0) return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>My Subscriptions</h2>
      <div style={{ background: W, borderRadius: 18, padding: "48px 24px", border: `1.5px solid #eee`, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✂️</div>
        <h3 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 8 }}>No subscriptions yet</h3>
        <p style={{ color: "#888", marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>Find a barber, salon or beauty professional and subscribe for priority booking.</p>
        <a href="/discover" style={{ display: "inline-block", background: P, color: W, textDecoration: "none", padding: "14px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: "Poppins" }}>
          Find a Professional →
        </a>
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>My Subscriptions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {subscriptions.map((s, i) => (
          <a key={i} href={`/${s.businesses?.category}/${s.businesses?.slug}`} className="sub-card">
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: L, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>✂️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: C, marginBottom: 2 }}>{s.businesses?.business_name || "Business"}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{s.businesses?.city} · £{parseFloat(s.monthly_price || 0).toFixed(0)}/month</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "#dcfce7", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#166534", marginBottom: 4 }}>Active</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>Priority member</div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── APPOINTMENTS ── */
function Appointments({ bookings }) {
  const upcoming = bookings.filter(b => new Date(b.start_time) >= new Date() && b.status !== "cancelled");
  const past = bookings.filter(b => new Date(b.start_time) < new Date() || b.status === "completed");

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>Appointments</h2>

      {/* UPCOMING */}
      <div style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee`, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 16 }}>Upcoming</h3>
        {upcoming.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 14 }}>No upcoming appointments</div>
          </div>
        ) : upcoming.map((b, i) => (
          <div key={i} style={{ background: L, borderRadius: 14, padding: "16px 20px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C, marginBottom: 4 }}>
                  {new Date(b.start_time).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <div style={{ fontSize: 13, color: P, fontWeight: 600 }}>
                  {new Date(b.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              <div style={{ background: P, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, color: W }}>{b.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* PAST */}
      <div style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee` }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: C, marginBottom: 16 }}>Past Appointments</h3>
        {past.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 14 }}>No past appointments yet</div>
        ) : past.slice(0, 5).map((b, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < past.length - 1 ? `1px solid #f0f0f0` : "none" }}>
            <div style={{ fontSize: 14, color: C, fontWeight: 500 }}>
              {new Date(b.start_time).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div style={{ fontSize: 13, color: "#888" }}>{b.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ACCOUNT SETTINGS WITH PHOTO UPLOAD ── */
function AccountSettings({ profile, user, onRefresh }) {
  const [form, setForm] = useState({ full_name: profile?.full_name || "", phone: profile?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null);
  const [dob, setDob] = useState(profile?.date_of_birth || "");

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadingPhoto(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", user.id);
        onRefresh();
      }
    } catch (err) { console.error(err); }
    setUploadingPhoto(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("profiles").update({ ...form, date_of_birth: dob || null }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onRefresh();
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: 22, color: C, marginBottom: 20 }}>My Account</h2>
      <div style={{ background: W, borderRadius: 18, padding: 28, border: `1.5px solid #eee` }}>

        {/* PHOTO UPLOAD */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid #f0f0f0` }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: L, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: `3px solid ${W}`, boxShadow: "0 4px 16px rgba(86,59,231,.2)" }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "👤"
              }
            </div>
            {uploadingPhoto && (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(86,59,231,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 24, height: 24, border: `2px solid rgba(255,255,255,.4)`, borderTop: `2px solid ${W}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              </div>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C, marginBottom: 4 }}>Profile Photo</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>Upload a photo so businesses recognise you</div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, background: L, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: P, cursor: "pointer" }}>
              📷 {avatarPreview ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>

        {/* FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Full Name</label>
            <input className="input-field" placeholder="Your full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Email Address</label>
            <input className="input-field" value={user?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Phone Number</label>
            <input className="input-field" placeholder="07700 000000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>
              Date of Birth <span style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>(optional — for birthday rewards)</span>
            </label>
            <input className="input-field" type="date" value={dob} onChange={e => setDob(e.target.value)} />
          </div>

          {/* MARKETING CONSENT */}
          <div style={{ background: G, borderRadius: 12, padding: "14px 16px" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" defaultChecked style={{ marginTop: 2, accentColor: P, width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>
                I agree to receive booking reminders and relevant offers from businesses I subscribe to. You can opt out anytime.
              </span>
            </label>
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ alignSelf: "flex-start" }}>
            {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div style={{ background: W, borderRadius: 18, padding: 24, border: `1.5px solid #eee`, marginTop: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: "#e53e3e", marginBottom: 8 }}>Account</h3>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Need to make changes to your account or cancel?</p>
        <button style={{ background: "#fff5f5", color: "#e53e3e", border: "1.5px solid #ffcccc", borderRadius: 10, padding: "10px 20px", fontFamily: "Poppins", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Contact Support
        </button>
      </div>
    </div>
  );
}

/* ── ROOT ── */
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/auth"; return; }
    setUser(user);

    const [{ data: prof }, { data: subs }, { data: bkgs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("subscriptions").select("*, businesses(business_name, city, category, slug)").eq("customer_id", user.id).eq("status", "active"),
      supabase.from("bookings").select("*").eq("customer_id", user.id).order("start_time", { ascending: false }),
    ]);

    setProfile(prof);
    setSubscriptions(subs || []);
    setBookings(bkgs || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${L}`, borderTop: `3px solid ${P}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background: W, borderBottom: `1px solid #eee`, padding: "0 5%", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: P, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "pulse 3s infinite" }}>
            <div style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: W }} />
            <span style={{ color: W, fontWeight: 900, fontSize: 16 }}>S</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: P }}>SubSeat</span>
        </a>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#888" }}>My Profile</div>
        <a href="/discover" style={{ background: P, color: W, textDecoration: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, fontFamily: "Poppins" }}>Find Professionals</a>
      </nav>

      {/* LAYOUT */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 5%", display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }} className="profile-layout">
        <div className="sidebar">
          <Sidebar active={activeSection} setActive={setActiveSection} profile={profile} onSignOut={handleSignOut} />
        </div>
        <div className="fu">
          {activeSection === "overview"     && <MySubscriptions subscriptions={subscriptions} />}
          {activeSection === "appointments" && <Appointments bookings={bookings} />}
          {activeSection === "account"      && <AccountSettings profile={profile} user={user} onRefresh={loadData} />}
        </div>
      </div>
    </>
  );
}