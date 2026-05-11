'use client';

const P = "#563BE7";
const L = "#E9E6FF";
const C = "#171717";
const G = "#F4F4F4";
const W = "#ffffff";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; background:${W}; color:${C}; }
  .legal-section { margin-bottom:40px; }
  .legal-section h2 { font-weight:700; font-size:20px; color:${C}; margin-bottom:14px; padding-bottom:10px; border-bottom:2px solid ${L}; }
  .legal-section h3 { font-weight:600; font-size:16px; color:${C}; margin:18px 0 8px; }
  .legal-section p  { font-size:14px; color:#555; line-height:1.85; margin-bottom:12px; }
  .legal-section ul { padding-left:20px; margin-bottom:12px; }
  .legal-section ul li { font-size:14px; color:#555; line-height:1.85; margin-bottom:6px; }
`;

export default function PrivacyPage() {
  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ background:W, borderBottom:`1px solid ${G}`, padding:"0 5%", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <a href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:P, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:W }} />
            <span style={{ color:W, fontWeight:900, fontSize:17 }}>S</span>
          </div>
          <span style={{ fontWeight:800, fontSize:18, color:P }}>SubSeat</span>
        </a>
        <a href="/auth" style={{ background:P, color:W, textDecoration:"none", padding:"10px 22px", borderRadius:10, fontWeight:700, fontSize:14, fontFamily:"Poppins" }}>Get Started</a>
      </nav>

      {/* HEADER */}
      <section style={{ background:G, padding:"56px 5%" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ display:"inline-block", background:L, borderRadius:100, padding:"6px 16px", fontSize:11, fontWeight:700, color:P, letterSpacing:2, textTransform:"uppercase", marginBottom:16 }}>Legal</div>
          <h1 style={{ fontWeight:900, fontSize:"clamp(28px,4vw,44px)", color:C, letterSpacing:"-1.5px", marginBottom:12 }}>Privacy Policy</h1>
          <p style={{ fontSize:14, color:"#888" }}>Last updated: 1 May 2026 · SubSeat Ltd</p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding:"60px 5%", background:W }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>

          <div className="legal-section">
            <h2>1. Who We Are</h2>
            <p>SubSeat Ltd ("SubSeat", "we", "us", "our") operates the SubSeat platform at subseat.co.uk. We are a UK-registered company and act as the data controller for personal data collected through our platform.</p>
            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us at <a href="mailto:hello@subseat.co.uk" style={{ color:P }}>hello@subseat.co.uk</a>.</p>
          </div>

          <div className="legal-section">
            <h2>2. What Data We Collect</h2>
            <h3>Account Data</h3>
            <ul>
              <li>Full name, email address and phone number</li>
              <li>Date of birth (optional, used for birthday offers)</li>
              <li>Profile photo (optional)</li>
              <li>Password (stored encrypted — we never see your password)</li>
            </ul>
            <h3>Booking & Subscription Data</h3>
            <ul>
              <li>Booking history, appointment times and services booked</li>
              <li>Subscription plan details and payment history</li>
              <li>Preferred professionals and businesses</li>
            </ul>
            <h3>Business Data (for business accounts)</h3>
            <ul>
              <li>Business name, address, category and contact details</li>
              <li>Staff information (names, roles, working hours)</li>
              <li>Service listings and pricing</li>
              <li>Stripe account information (handled directly by Stripe)</li>
            </ul>
            <h3>Walk-In / QR Data</h3>
            <ul>
              <li>Name and phone number captured via QR check-in</li>
              <li>Email address (optional, if provided)</li>
              <li>Marketing consent preference</li>
            </ul>
            <h3>Technical Data</h3>
            <ul>
              <li>IP address, browser type and device information</li>
              <li>Pages visited and time spent on the platform</li>
              <li>Cookies and session data</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. How We Use Your Data</h2>
            <ul>
              <li>To provide and operate the SubSeat platform</li>
              <li>To process bookings, subscriptions and payments</li>
              <li>To send booking confirmations and appointment reminders via email and WhatsApp</li>
              <li>To send marketing messages where you have given consent</li>
              <li>To improve our platform and fix technical issues</li>
              <li>To comply with legal obligations</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Legal Basis for Processing</h2>
            <p>We process your personal data under the following lawful bases under UK GDPR:</p>
            <ul>
              <li><strong>Contract</strong> — to fulfil bookings and subscriptions you have entered into</li>
              <li><strong>Legitimate interests</strong> — to improve our platform and prevent fraud</li>
              <li><strong>Consent</strong> — for marketing communications (you can withdraw at any time)</li>
              <li><strong>Legal obligation</strong> — where required by law</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Who We Share Your Data With</h2>
            <p>We do not sell your personal data. We share data only with trusted third parties necessary to operate SubSeat:</p>
            <ul>
              <li><strong>Stripe</strong> — payment processing (they handle card data directly)</li>
              <li><strong>Supabase</strong> — secure database hosting</li>
              <li><strong>Resend</strong> — email delivery</li>
              <li><strong>Vercel</strong> — platform hosting</li>
              <li><strong>Businesses on SubSeat</strong> — your booking details are shared with the business you book with</li>
            </ul>
            <p>All third parties are bound by data processing agreements and handle your data securely.</p>
          </div>

          <div className="legal-section">
            <h2>6. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active or as needed to provide our services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or financial compliance purposes (typically 6 years for financial records).</p>
          </div>

          <div className="legal-section">
            <h2>7. Your Rights</h2>
            <p>Under UK GDPR, you have the following rights:</p>
            <ul>
              <li><strong>Right to access</strong> — request a copy of your personal data</li>
              <li><strong>Right to rectification</strong> — correct inaccurate data</li>
              <li><strong>Right to erasure</strong> — request deletion of your data</li>
              <li><strong>Right to portability</strong> — receive your data in a portable format</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests</li>
              <li><strong>Right to withdraw consent</strong> — for marketing at any time</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:privacy@subseat.co.uk" style={{ color:P }}>privacy@subseat.co.uk</a>. We will respond within 30 days.</p>
          </div>

          <div className="legal-section">
            <h2>8. Account & Data Deletion</h2>
            <p>You have the right to request full deletion of your SubSeat account and personal data at any time.</p>
            <h3>How to request deletion</h3>
            <ul>
              <li>Email <a href="mailto:privacy@subseat.co.uk" style={{ color:P }}>privacy@subseat.co.uk</a> with the subject line <strong>"Account Deletion Request"</strong></li>
              <li>Include your registered email address and full name</li>
              <li>We will confirm receipt within 48 hours</li>
              <li>Deletion will be completed within 30 days of your request</li>
            </ul>
            <h3>What gets deleted</h3>
            <ul>
              <li>Your account credentials and profile information</li>
              <li>Your booking history and subscription records</li>
              <li>Any uploaded images or business content</li>
              <li>Your contact preferences and notification settings</li>
            </ul>
            <h3>What we must retain</h3>
            <ul>
              <li>Financial transaction records for up to 6 years as required by UK law</li>
              <li>Records required for ongoing legal disputes or chargebacks</li>
            </ul>
            <p>Please note: active subscriptions must be cancelled before account deletion can be completed. Deleted accounts cannot be recovered.</p>
          </div>

          <div className="legal-section">
            <h2>9. Cookies</h2>
            <p>SubSeat uses essential cookies to keep you logged in and operate the platform. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect platform functionality.</p>
          </div>

          <div className="legal-section">
            <h2>10. Security</h2>
            <p>We take security seriously. All data is encrypted in transit (HTTPS) and at rest. Passwords are hashed and never stored in plain text. Payment data is handled entirely by Stripe and never stored on our servers.</p>
          </div>

          <div className="legal-section">
            <h2>11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or via a notice on the platform. The date at the top of this page shows when it was last updated.</p>
          </div>

          <div className="legal-section">
            <h2>12. Contact & Complaints</h2>
            <p>If you have concerns about how we handle your data, please contact us first at <a href="mailto:hello@subseat.co.uk" style={{ color:P }}>hello@subseat.co.uk</a>. If you remain unsatisfied, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" style={{ color:P }} target="_blank">ico.org.uk</a>.</p>
          </div>

          <div style={{ background:G, borderRadius:14, padding:"20px 24px", marginTop:40 }}>
            <p style={{ fontSize:13, color:"#888", margin:0 }}>SubSeat Ltd · hello@subseat.co.uk · subseat.co.uk · UK Registered Company</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:C, padding:"32px 5%", textAlign:"center" }}>
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap", marginBottom:16 }}>
          {[["About","/about"],["Contact","/contact"],["Terms","/terms"],["Privacy","/privacy"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:13, color:"rgba(255,255,255,.4)", textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,.3)" }}>© 2026 SubSeat Ltd. All rights reserved. SubSeat® is a UK registered trademark.</p>
      </footer>
    </>
  );
}