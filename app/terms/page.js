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

export default function TermsPage() {
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
          <h1 style={{ fontWeight:900, fontSize:"clamp(28px,4vw,44px)", color:C, letterSpacing:"-1.5px", marginBottom:12 }}>Terms of Service</h1>
          <p style={{ fontSize:14, color:"#888" }}>Last updated: 1 May 2026 · SubSeat Ltd</p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={{ padding:"60px 5%", background:W }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>

          <div className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using the SubSeat platform at subseat.co.uk ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Platform.</p>
            <p>These Terms apply to all users of SubSeat, including customers, business owners and staff members. SubSeat Ltd is registered in England and Wales.</p>
          </div>

          <div className="legal-section">
            <h2>2. The SubSeat Platform</h2>
            <p>SubSeat is a subscription booking platform that connects customers with barbers, salons, nail technicians and beauty professionals ("Businesses"). SubSeat enables:</p>
            <ul>
              <li>Customers to discover, book and subscribe to beauty and wellness professionals</li>
              <li>Businesses to create profiles, offer subscription plans and manage bookings</li>
              <li>Secure payment processing via Stripe</li>
              <li>Appointment reminders and notifications via email and WhatsApp</li>
            </ul>
            <p>SubSeat acts as a platform intermediary. The contract for services is between the customer and the business — SubSeat is not a party to that contract.</p>
          </div>

          <div className="legal-section">
            <h2>3. Account Registration</h2>
            <p>To use SubSeat you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and truthful information when registering</li>
              <li>Keep your login credentials secure and not share them with others</li>
              <li>Notify us immediately if you suspect unauthorised access to your account</li>
              <li>Be at least 18 years of age (or have parental consent)</li>
            </ul>
            <p>SubSeat reserves the right to suspend or terminate accounts that violate these Terms.</p>
          </div>

          <div className="legal-section">
            <h2>4. Subscriptions & Payments</h2>
            <h3>For Customers</h3>
            <ul>
              <li>Subscriptions are billed monthly via Stripe on the date you subscribed</li>
              <li>You can cancel your subscription at any time from your dashboard</li>
              <li>Cancellations take effect at the end of the current billing period — no partial refunds are issued for unused time</li>
              <li>If a payment fails, we will notify you and attempt to collect payment again</li>
            </ul>
            <h3>For Businesses</h3>
            <ul>
              <li>SubSeat charges a platform fee of 6% + VAT on all subscription revenue</li>
              <li>Payouts are processed via Stripe to your connected bank account</li>
              <li>The Basic tier is free to join — no monthly software fees apply</li>
              <li>The Partner Seat founding fee of £39.99 is a one-time non-refundable payment</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Cancellations & Refunds</h2>
            <h3>Customer Cancellations</h3>
            <p>Customers may cancel a subscription at any time. Access continues until the end of the billing period. No refunds are issued for the current billing period.</p>
            <h3>Business Cancellation Policies</h3>
            <p>Individual businesses may set their own cancellation policies for one-off bookings. These are displayed on the business profile page. SubSeat is not responsible for enforcing individual business cancellation policies.</p>
            <h3>Refund Disputes</h3>
            <p>If you believe you are owed a refund, please contact us at hello@subseat.co.uk. We will investigate and respond within 5 business days.</p>
          </div>

          <div className="legal-section">
            <h2>6. Business Responsibilities</h2>
            <p>Businesses using SubSeat agree to:</p>
            <ul>
              <li>Provide accurate information about their services, pricing and availability</li>
              <li>Honour all bookings made through SubSeat</li>
              <li>Treat customers fairly and professionally</li>
              <li>Comply with all applicable employment, health and safety, and data protection laws</li>
              <li>Not use SubSeat to engage in fraudulent, deceptive or harmful practices</li>
              <li>Maintain appropriate insurance for their services</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Customer Responsibilities</h2>
            <p>Customers using SubSeat agree to:</p>
            <ul>
              <li>Attend booked appointments or cancel with reasonable notice</li>
              <li>Treat business owners and staff with respect</li>
              <li>Not misuse subscription plans (e.g. sharing with others)</li>
              <li>Provide honest and fair reviews</li>
              <li>Not engage in fraudulent chargebacks or payment disputes without genuine cause</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Prohibited Uses</h2>
            <p>You must not use SubSeat to:</p>
            <ul>
              <li>Violate any applicable law or regulation</li>
              <li>Impersonate any person or entity</li>
              <li>Post false, misleading or defamatory content</li>
              <li>Attempt to gain unauthorised access to any part of the platform</li>
              <li>Transmit malware, spam or harmful content</li>
              <li>Scrape, copy or redistribute platform content without permission</li>
              <li>Use the platform for any unlawful commercial purpose</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Intellectual Property</h2>
            <p>All content on the SubSeat platform — including the brand, logo, design, code and written content — is the property of SubSeat Ltd and is protected by UK copyright and trademark law. SubSeat® is a registered UK trademark.</p>
            <p>You may not reproduce, distribute or create derivative works from SubSeat content without our written permission.</p>
          </div>

          <div className="legal-section">
            <h2>10. Limitation of Liability</h2>
            <p>SubSeat is a platform that connects customers and businesses. We are not liable for:</p>
            <ul>
              <li>The quality or outcome of services provided by businesses on the platform</li>
              <li>Disputes between customers and businesses</li>
              <li>Loss of earnings resulting from platform downtime or technical issues</li>
              <li>Any indirect, consequential or incidental losses</li>
            </ul>
            <p>Our total liability to you in any circumstances shall not exceed the platform fees paid by you to SubSeat in the preceding 12 months.</p>
          </div>

          <div className="legal-section">
            <h2>11. Platform Availability</h2>
            <p>We aim to keep SubSeat available 24/7 but cannot guarantee uninterrupted access. We may carry out maintenance, updates or improvements that temporarily affect availability. We will endeavour to notify users in advance of planned downtime.</p>
          </div>

          <div className="legal-section">
            <h2>12. Termination</h2>
            <p>SubSeat reserves the right to suspend or terminate any account at any time for violation of these Terms. Businesses may be removed from the platform if they receive consistent negative reviews, fail to honour bookings, or engage in conduct that damages the SubSeat community.</p>
            <p>You may close your account at any time by contacting hello@subseat.co.uk.</p>
          </div>

          <div className="legal-section">
            <h2>13. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes via email or a notice on the platform. Continued use of SubSeat after changes take effect constitutes acceptance of the updated Terms.</p>
          </div>

          <div className="legal-section">
            <h2>14. Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>

          <div className="legal-section">
            <h2>15. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at <a href="mailto:hello@subseat.co.uk" style={{ color:P }}>hello@subseat.co.uk</a>.</p>
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