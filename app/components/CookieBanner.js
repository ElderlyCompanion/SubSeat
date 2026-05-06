'use client';
import { useState, useEffect } from "react";

const P = "#563BE7";
const C = "#171717";
const W = "#ffffff";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("subseat_cookie_consent");
      if (!consent) setVisible(true);
    } catch { setVisible(true); }
  }, []);

  const accept = (type) => {
    try {
      localStorage.setItem("subseat_cookie_consent", type);
      localStorage.setItem("subseat_cookie_date", new Date().toISOString());
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: C,
      borderTop: "1px solid rgba(255,255,255,.1)",
      padding: "16px 5%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
      boxShadow: "0 -8px 32px rgba(0,0,0,.25)",
    }}>
      {/* TEXT */}
      <p style={{
        fontSize: 13,
        color: "rgba(255,255,255,.75)",
        lineHeight: 1.6,
        margin: 0,
        flex: 1,
        minWidth: 240,
      }}>
        We use essential cookies to keep SubSeat working. We also use analytics to improve the platform.{" "}
        <a href="/privacy" style={{ color: "#a78bfa", textDecoration: "underline", fontWeight: 600 }}>
          Privacy Policy
        </a>
      </p>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
        <button
          onClick={() => accept("essential")}
          style={{
            background: "transparent",
            color: "rgba(255,255,255,.6)",
            border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 8,
            padding: "10px 18px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
            minHeight: 44,
          }}>
          Essential Only
        </button>
        <button
          onClick={() => accept("all")}
          style={{
            background: P,
            color: W,
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
            minHeight: 44,
            boxShadow: "0 4px 14px rgba(86,59,231,.4)",
          }}>
          Accept All
        </button>
      </div>
    </div>
  );
}