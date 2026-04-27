'use client';
import { useState } from "react";

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Poppins', sans-serif; background: #f0eeff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }

  @keyframes fadeUp   { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn  { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
  @keyframes pulse    { 0%,100% { box-shadow: 0 0 0 0 rgba(86,59,231,.4); } 50% { box-shadow: 0 0 0 10px rgba(86,59,231,0); } }
  @keyframes checkPop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
  @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-120px) rotate(720deg); opacity: 0; } }

  .card { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) both; }
  .dropdown { animation: scaleIn .2s cubic-bezier(.22,1,.36,1) both; }
  .overlay { animation: fadeIn .2s ease both; }
  .success-check { animation: checkPop .4s cubic-bezier(.22,1,.36,1) .1s both; }

  .cal-btn {
    display: flex; align-items: center; gap: 12px;
    width: 100%; padding: 14px 18px; border-radius: 12px;
    border: 1.5px solid ${L}; background: ${W};
    font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
    color: ${C}; cursor: pointer; transition: all .18s ease; text-align: left;
  }
  .cal-btn:hover { background: ${L}; border-color: ${P}; transform: translateX(3px); }
  .cal-btn-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }

  .main-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 16px; border-radius: 14px;
    background: ${P}; color: ${W}; border: none;
    font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all .2s ease;
    box-shadow: 0 8px 28px rgba(86,59,231,.32);
  }
  .main-btn:hover { background: #4429d4; transform: translateY(-2px); box-shadow: 0 14px 40px rgba(86,59,231,.42); }

  .close-btn {
    position: absolute; top: 16px; right: 16px;
    width: 32px; height: 32px; border-radius: 50%;
    background: ${G}; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: #888; transition: all .18s;
  }
  .close-btn:hover { background: #e0e0e0; color: ${C}; }

  .confetti-piece {
    position: absolute; width: 8px; height: 8px; border-radius: 2px;
    animation: confetti .8s ease forwards;
  }

  @media(max-width: 480px) {
    .booking-detail-grid { grid-template-columns: 1fr !important; }
  }
`;

/* ── HELPERS ── */

// Format date to ICS format: 20260214T140000
function toICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Generate ICS file content
function generateICS(appointment) {
  const start = new Date(appointment.startISO);
  const end = new Date(appointment.endISO);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SubSeat//SubSeat Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${appointment.title}`,
    `DESCRIPTION:Booked via SubSeat.\\nBusiness: ${appointment.business}\\nService: ${appointment.service}\\nQuestions? Contact via SubSeat app.`,
    `LOCATION:${appointment.location}`,
    `STATUS:CONFIRMED`,
    `SEQUENCE:0`,
    `BEGIN:VALARM`,
    `TRIGGER:-PT1H`,
    `ACTION:DISPLAY`,
    `DESCRIPTION:Reminder: ${appointment.title} in 1 hour`,
    `END:VALARM`,
    `BEGIN:VALARM`,
    `TRIGGER:-PT1D`,
    `ACTION:DISPLAY`,
    `DESCRIPTION:Tomorrow: ${appointment.title}`,
    `END:VALARM`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// Generate Google Calendar URL
function googleCalendarURL(appointment) {
  const start = new Date(appointment.startISO);
  const end = new Date(appointment.endISO);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: appointment.title,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    details: `Booked via SubSeat\nBusiness: ${appointment.business}\nService: ${appointment.service}`,
    location: appointment.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate Outlook Web URL
function outlookURL(appointment) {
  const start = new Date(appointment.startISO);
  const end = new Date(appointment.endISO);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: appointment.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: `Booked via SubSeat. Business: ${appointment.business}. Service: ${appointment.service}.`,
    location: appointment.location,
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

// Download .ics file
function downloadICS(appointment) {
  const ics = generateICS(appointment);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SubSeat-${appointment.service.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── CALENDAR OPTIONS ── */
const calendarOptions = [
  {
    id: "google",
    label: "Google Calendar",
    sublabel: "Android & most users",
    icon: "📅",
    color: "#4285f4",
    action: "url",
  },
  {
    id: "apple",
    label: "Apple Calendar",
    sublabel: "iPhone & Mac",
    icon: "🍎",
    color: "#000000",
    action: "ics",
  },
  {
    id: "outlook",
    label: "Outlook",
    sublabel: "Desktop & work email",
    icon: "📧",
    color: "#0078d4",
    action: "url",
  },
  {
    id: "ics",
    label: "Download .ics file",
    sublabel: "Works with any calendar",
    icon: "⬇️",
    color: "#563BE7",
    action: "ics",
  },
];

/* ── CONFETTI ── */
function Confetti() {
  const pieces = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: [P, "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"][i % 5],
    left: `${10 + i * 7}%`,
    delay: `${i * 0.06}s`,
    rotate: `${Math.random() * 360}deg`,
  }));
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 0, overflow: "visible", pointerEvents: "none" }}>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{ background: p.color, left: p.left, top: 20, animationDelay: p.delay, transform: `rotate(${p.rotate})` }} />
      ))}
    </div>
  );
}

/* ── SUCCESS STATE ── */
function SuccessState({ calendarName, onDone }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 24px 24px", position: "relative" }}>
      <Confetti />
      <div className="success-check" style={{ width: 72, height: 72, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M8 18l7 7 13-13" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 style={{ fontWeight: 800, fontSize: 20, color: C, marginBottom: 8 }}>Added to {calendarName}!</h3>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
        Your appointment is saved. We'll also send you a reminder via WhatsApp and email before your visit.
      </p>
      <button className="main-btn" onClick={onDone}>Done</button>
    </div>
  );
}

/* ── CALENDAR DROPDOWN ── */
function CalendarDropdown({ appointment, onSuccess, onClose }) {
  const handleOption = (option) => {
    if (option.id === "google") {
      window.open(googleCalendarURL(appointment), "_blank");
      onSuccess("Google Calendar");
    } else if (option.id === "outlook") {
      window.open(outlookURL(appointment), "_blank");
      onSuccess("Outlook");
    } else if (option.id === "apple") {
      downloadICS(appointment);
      onSuccess("Apple Calendar");
    } else if (option.id === "ics") {
      downloadICS(appointment);
      onSuccess("your calendar");
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div className="overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 998, backdropFilter: "blur(4px)" }} />

      {/* DROPDOWN PANEL */}
      <div className="dropdown" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, background: W, borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", boxShadow: "0 -8px 60px rgba(0,0,0,.2)", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: "#e0e0e0", margin: "0 auto 24px" }} />
        <h3 style={{ fontWeight: 800, fontSize: 18, color: C, marginBottom: 6 }}>Add to your calendar</h3>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Choose your calendar app</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {calendarOptions.map(opt => (
            <button key={opt.id} className="cal-btn" onClick={() => handleOption(opt)}>
              <div className="cal-btn-icon" style={{ background: `${opt.color}15` }}>
                <span>{opt.icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C }}>{opt.label}</div>
                <div style={{ fontWeight: 400, fontSize: 12, color: "#888" }}>{opt.sublabel}</div>
              </div>
              <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── BOOKING CONFIRMATION CARD ── */
function BookingConfirmationCard({ appointment }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [added, setAdded] = useState(false);
  const [calendarName, setCalendarName] = useState("");

  const handleSuccess = (name) => {
    setCalendarName(name);
    setShowDropdown(false);
    setAdded(true);
  };

  return (
    <div className="card" style={{ background: W, borderRadius: 28, overflow: "hidden", boxShadow: "0 32px 80px rgba(86,59,231,.18)", maxWidth: 460, width: "100%", position: "relative" }}>

      {/* SUCCESS HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${P} 0%, #7c5cff 100%)`, padding: "32px 28px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />

        {/* TICK */}
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-10" stroke={W} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontWeight: 900, fontSize: 22, color: W, marginBottom: 4 }}>Booking Confirmed!</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)" }}>Your appointment is secured</div>
      </div>

      {/* APPOINTMENT DETAILS */}
      {!added ? (
        <div style={{ padding: "28px 28px 32px" }}>
          {/* BUSINESS INFO */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, padding: "16px", background: G, borderRadius: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${P} 0%, #7c5cff 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>✂️</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: C }}>{appointment.business}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{appointment.service}</div>
            </div>
            <div style={{ marginLeft: "auto", background: L, borderRadius: 8, padding: "4px 10px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P }}>Confirmed</div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="booking-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { icon: "📅", label: "Date", value: appointment.displayDate },
              { icon: "🕐", label: "Time", value: appointment.displayTime },
              { icon: "📍", label: "Location", value: appointment.location },
              { icon: "⏱️", label: "Duration", value: appointment.duration },
            ].map((d, i) => (
              <div key={i} style={{ background: G, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{d.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{d.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C, lineHeight: 1.3 }}>{d.value}</div>
              </div>
            ))}
          </div>

          {/* REMINDER NOTICE */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: L, borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>📲</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: P, marginBottom: 2 }}>Reminders included</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>You'll receive a WhatsApp and email reminder 24 hours and 1 hour before your appointment.</div>
            </div>
          </div>

          {/* ADD TO CALENDAR BUTTON */}
          <button className="main-btn" onClick={() => setShowDropdown(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="3" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Add to My Calendar
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "#bbb", marginTop: 12 }}>Works with Google, Apple, Outlook & more</p>
        </div>
      ) : (
        <SuccessState calendarName={calendarName} onDone={() => setAdded(false)} />
      )}

      {/* CALENDAR DROPDOWN */}
      {showDropdown && (
        <CalendarDropdown
          appointment={appointment}
          onSuccess={handleSuccess}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

/* ── EXAMPLE APPOINTMENT DATA ──
   In production this gets passed in from the booking flow
*/
const exampleAppointment = {
  business:    "Marcus — The Cut Lab",
  service:     "Fade & Line Up",
  location:    "The Cut Lab, 14 Brick Lane, Shoreditch, London E1 6RF",
  displayDate: "Friday 14 February 2026",
  displayTime: "2:00 PM",
  duration:    "45 minutes",
  startISO:    "2026-02-14T14:00:00Z",
  endISO:      "2026-02-14T14:45:00Z",
  title:       "Fade & Line Up — Marcus @ The Cut Lab",
};

/* ── ROOT ── */
export default function AddToCalendarDemo() {
  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", maxWidth: 500, margin: "0 auto" }}>

        {/* DEMO LABEL */}
        <div style={{ background: "rgba(86,59,231,.12)", borderRadius: 100, padding: "6px 18px", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: P, letterSpacing: 1.5, textTransform: "uppercase" }}>Booking Confirmation — Component Preview</span>
        </div>

        <BookingConfirmationCard appointment={exampleAppointment} />

        {/* USAGE NOTE */}
        <div style={{ background: W, borderRadius: 16, padding: "18px 20px", width: "100%", border: `1.5px solid ${L}` }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C, marginBottom: 8 }}>🔧 How this works in production</div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
            This component receives real appointment data from the booking flow and generates calendar entries for Google Calendar, Apple Calendar, Outlook and a universal .ics download. Reminders are set for 24hrs and 1hr before automatically.
          </div>
        </div>
      </div>
    </>
  );
}