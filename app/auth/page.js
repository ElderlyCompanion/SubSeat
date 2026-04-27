'use client';
import { useState } from "react";
import { supabase } from "../lib/supabase";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: #f0eeff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow: 0 0 0 10px rgba(86,59,231,0); } }
  .card { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
  .input-field {
    width: 100%; padding: 14px 16px; border-radius: 12px;
    border: 1.5px solid #e0e0e0; background: ${W};
    font-family: 'Poppins', sans-serif; font-size: 15px; color: ${C};
    outline: none; transition: border-color .2s ease;
  }
  .input-field:focus { border-color: ${P}; box-shadow: 0 0 0 3px rgba(86,59,231,.1); }
  .btn-primary {
    width: 100%; padding: 16px; border-radius: 12px;
    background: ${P}; color: ${W}; border: none;
    font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 16px;
    cursor: pointer; transition: all .2s ease;
    box-shadow: 0 6px 24px rgba(86,59,231,.32);
  }
  .btn-primary:hover { background: #4429d4; transform: translateY(-2px); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .tab { 
    flex: 1; padding: 12px; border: none; background: transparent;
    font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px;
    cursor: pointer; border-radius: 10px; transition: all .2s;
  }
  .tab.active { background: ${P}; color: ${W}; }
  .tab.inactive { color: #888; }
  .tab.inactive:hover { background: ${L}; color: ${P}; }
  .role-card {
    flex: 1; padding: 16px; border-radius: 14px;
    border: 2px solid #e0e0e0; background: ${W};
    cursor: pointer; transition: all .2s; text-align: center;
  }
  .role-card.selected { border-color: ${P}; background: ${L}; }
  .role-card:hover { border-color: ${P}; }
`;

function LogoMark() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: P, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "pulse 3s infinite", margin: "0 auto 12px" }}>
      <div style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, borderRadius: "50%", background: W }} />
      <span style={{ color: W, fontWeight: 900, fontSize: 22, fontFamily: "Poppins" }}>S</span>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("signup"); // signup | login
  const [role, setRole] = useState("customer"); // customer | business
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a confirmation link to complete your sign up!");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = role === "business" ? "/dashboard" : "/discover";
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="card" style={{ background: W, borderRadius: 28, padding: "40px 36px", maxWidth: 440, width: "100%", boxShadow: "0 32px 80px rgba(86,59,231,.18)" }}>

        {/* LOGO */}
        <LogoMark />
        <h1 style={{ fontWeight: 900, fontSize: 26, color: C, textAlign: "center", marginBottom: 6, letterSpacing: "-.5px" }}>
          {mode === "signup" ? "Join SubSeat" : "Welcome back"}
        </h1>
        <p style={{ fontSize: 14, color: "#888", textAlign: "center", marginBottom: 28 }}>
          {mode === "signup" ? "Create your free account today" : "Sign in to your account"}
        </p>

        {/* TABS */}
        <div style={{ display: "flex", gap: 6, background: G, borderRadius: 12, padding: 4, marginBottom: 28 }}>
          <button className={`tab ${mode === "signup" ? "active" : "inactive"}`} onClick={() => { setMode("signup"); setError(null); setMessage(null); }}>
            Sign Up
          </button>
          <button className={`tab ${mode === "login" ? "active" : "inactive"}`} onClick={() => { setMode("login"); setError(null); setMessage(null); }}>
            Sign In
          </button>
        </div>

        {/* ROLE SELECTOR — signup only */}
        {mode === "signup" && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: C, marginBottom: 10 }}>I am a:</p>
            <div style={{ display: "flex", gap: 10 }}>
              <div className={`role-card ${role === "customer" ? "selected" : ""}`} onClick={() => setRole("customer")}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>👤</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: role === "customer" ? P : C }}>Customer</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Find & book professionals</div>
              </div>
              <div className={`role-card ${role === "business" ? "selected" : ""}`} onClick={() => setRole("business")}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🏪</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: role === "business" ? P : C }}>Business</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Grow recurring revenue</div>
              </div>
            </div>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={mode === "signup" ? handleSignUp : handleLogin}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Full name — signup only */}
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Full Name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Email Address</label>
              <input
                className="input-field"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: C, display: "block", marginBottom: 6 }}>Password</label>
              <input
                className="input-field"
                type="password"
                placeholder={mode === "signup" ? "Min 8 characters" : "Your password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div style={{ background: "#fff5f5", border: "1.5px solid #ffcccc", borderRadius: 10, padding: "12px 14px", marginTop: 16 }}>
              <p style={{ fontSize: 13, color: "#e53e3e", fontWeight: 500 }}>⚠️ {error}</p>
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div style={{ background: "#f0fff4", border: "1.5px solid #9ae6b4", borderRadius: 10, padding: "12px 14px", marginTop: 16 }}>
              <p style={{ fontSize: 13, color: "#276749", fontWeight: 500 }}>✅ {message}</p>
            </div>
          )}

          {/* SUBMIT */}
          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 24 }}>
            {loading ? "Please wait..." : mode === "signup" ? "Create My Account" : "Sign In"}
          </button>
        </form>

        {/* FOOTER NOTE */}
        <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
          {mode === "signup"
            ? "By signing up you agree to SubSeat's Terms of Service and Privacy Policy. Free to join."
            : "Forgot your password? Contact support@subseat.co.uk"}
        </p>

        {/* BACK HOME */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/" style={{ fontSize: 13, color: P, fontWeight: 600, textDecoration: "none" }}>← Back to SubSeat</a>
        </div>
      </div>
    </>
  );
}