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
          <p style={{ fontSize:14, color:"#888" }}>Last updated: 1 May 2026 &middot; SubSeat Ltd</p>
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
            <p>SubSeat acts as a platform intermediary. The contract for services is between the customer and the business. SubSeat is not a party to that contract.</p>
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
            <h2>4. Subscriptions and Payments</h2>
            <h3>For Customers</h3>
            <ul>
              <li>Subscriptions are billed monthly via Stripe on the date you subscribed</li>
              <li>You can cancel your subscription at any time from your dashboard</li>
              <li>Cancellations take effect at the end of the current billing period. No partial refunds are issued for unused time</li>
              <li>If a payment fails, we will notify you and attempt to collect payment again within 3 days</li>
              <li>After 3 failed payment attempts your subscription will be paused until payment is resolved</li>
              <li>Subscription prices are set by individual businesses and may change with 30 days notice</li>
            </ul>
            <h3>For Businesses</h3>
            <ul>
              <li>SubSeat charges a platform fee of 6% plus VAT where applicable on all subscription revenue collected through the platform</li>
              <li>SubSeat reserves the right to introduce fees on one-off bookings, walk-in captures and other platform services in the future. Any such fees will be communicated with a minimum of 30 days written notice</li>
              <li>SubSeat reserves the right to adjust platform fees, introduce new fee categories or change its pricing structure at any time with a minimum of 30 days written notice to affected businesses</li>
              <li>Fee changes may occur as a result of changes to VAT legislation, changes to Stripe payment processing fees, business growth, investment requirements or changes to the cost of providing the platform</li>
              <li>Current platform fees are displayed at subseat.co.uk and in your business dashboard at all times</li>
              <li>Continued use of SubSeat after a fee change takes effect constitutes acceptance of the new fees</li>
              <li>VAT will be charged at the prevailing UK rate where SubSeat is VAT registered. SubSeat will notify businesses when VAT registration takes effect</li>
              <li>Payouts are processed weekly via Stripe to your connected bank account, minus the applicable platform fee</li>
              <li>The Basic tier is free to join with no monthly software fees</li>
              <li>The Partner Seat founding fee of &pound;39.99 is a one-time non-refundable payment</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Pricing and Fee Changes</h2>
            <p>SubSeat operates a transparent pricing model. The following terms govern how fees may change over time:</p>
            <h3>Current Fees</h3>
            <ul>
              <li>Subscription platform fee: 6% plus VAT where applicable</li>
              <li>One-off booking fee: currently 0%, subject to change with notice</li>
              <li>Marketplace fee: 1% on completed marketplace transactions</li>
              <li>Walk-in capture: currently free, subject to change with notice</li>
            </ul>
            <h3>How Fees May Change</h3>
            <ul>
              <li>SubSeat will provide a minimum of 30 days written notice via email before any fee increases take effect</li>
              <li>Fee changes may be introduced to reflect increases in payment processing costs, platform development, compliance requirements or business investment</li>
              <li>New fee categories may be introduced for services currently provided free of charge</li>
              <li>Founding Partner businesses who joined during the pre-launch period are entitled to their agreed founding rate for a minimum of 12 months from their join date</li>
            </ul>
            <h3>VAT</h3>
            <ul>
              <li>SubSeat is not currently VAT registered</li>
              <li>When SubSeat becomes VAT registered, VAT at the prevailing UK rate will be added to platform fees</li>
              <li>Businesses will receive a minimum of 30 days notice before VAT is applied to their fees</li>
              <li>VAT-registered businesses may be able to reclaim VAT paid on SubSeat fees. Please consult your accountant</li>
            </ul>
            <h3>Your Rights If Fees Change</h3>
            <ul>
              <li>If you do not agree to a fee change you may cancel your SubSeat account before the new fees take effect</li>
              <li>Continued use of SubSeat after a fee change constitutes acceptance of the updated fees</li>
              <li>SubSeat will never apply fee changes retrospectively to completed transactions</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Fair Usage Policy</h2>
            <p>Subscription plans on SubSeat include a defined number of appointments per month as set by each business. This fair usage policy exists to protect businesses from subscription abuse.</p>
            <h3>Customers</h3>
            <ul>
              <li>Subscriptions are personal and non-transferable. You may not share your subscription with others</li>
              <li>Appointment allowances are set by each business and displayed on their profile</li>
              <li>Attempting to book beyond your plan allowance in a given month constitutes misuse</li>
              <li>Businesses may restrict access or cancel subscriptions where misuse is identified</li>
              <li>Unused appointments do not roll over to the following month unless explicitly stated by the business</li>
            </ul>
            <h3>Businesses</h3>
            <ul>
              <li>You may set a monthly appointment limit on any subscription plan</li>
              <li>You may cancel a customer subscription with immediate effect if misuse is confirmed</li>
              <li>SubSeat is not liable for losses arising from customer misuse of subscription plans</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Cancellations and Refunds</h2>
            <h3>Customer Subscription Cancellations</h3>
            <p>Customers may cancel a subscription at any time from their dashboard. Access continues until the end of the current billing period. No refunds are issued for the current billing period. Cancellations must be made at least 24 hours before the next renewal date to take effect for that period.</p>
            <h3>Customer Booking Cancellations</h3>
            <p>For one-off bookings, cancellation policies are set by individual businesses and displayed on their profile page. SubSeat is not responsible for enforcing individual business cancellation policies but will assist in genuine disputes.</p>
            <h3>Business Cancellations</h3>
            <p>Businesses that cancel a confirmed booking must offer the customer an alternative appointment or a full refund within 5 business days. Repeated unexplained cancellations may result in removal from the platform.</p>
            <h3>Refund Policy</h3>
            <ul>
              <li>Subscription fees are non-refundable once a billing period has started</li>
              <li>One-off booking refunds are subject to the individual business cancellation policy</li>
              <li>If a business cancels your appointment without reasonable notice, you are entitled to a full refund</li>
              <li>Refund requests must be submitted within 14 days of the disputed transaction</li>
              <li>Contact hello@subseat.co.uk with your booking reference and we will investigate within 5 business days</li>
              <li>Fraudulent chargeback requests may result in account suspension</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>8. Disputes</h2>
            <p>SubSeat provides a dispute resolution process for disagreements between customers and businesses.</p>
            <ul>
              <li>All disputes must be submitted via hello@subseat.co.uk within 14 days of the incident</li>
              <li>We aim to acknowledge all disputes within 24 hours</li>
              <li>We aim to resolve all disputes within 5 business days</li>
              <li>Both parties will be contacted and given an opportunity to provide their account of events</li>
              <li>SubSeat's decision on disputes is final within the scope of our platform</li>
              <li>For disputes involving significant sums, we recommend seeking independent legal advice</li>
            </ul>
            <p>SubSeat acts as a neutral intermediary. We are not liable for outcomes of disputes between customers and businesses.</p>
          </div>

          <div className="legal-section">
            <h2>9. Business Responsibilities</h2>
            <p>Businesses using SubSeat agree to:</p>
            <ul>
              <li>Provide accurate information about their services, pricing and availability</li>
              <li>Honour all bookings made through SubSeat unless cancelled with reasonable notice</li>
              <li>Treat customers fairly, professionally and without discrimination</li>
              <li>Comply with all applicable employment, health and safety, and data protection laws</li>
              <li>Not use SubSeat to engage in fraudulent, deceptive or harmful practices</li>
              <li>Maintain appropriate professional insurance for their services</li>
              <li>Respond to customer messages within a reasonable timeframe</li>
              <li>Keep their profile information, availability and pricing up to date</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>10. Customer Responsibilities</h2>
            <p>Customers using SubSeat agree to:</p>
            <ul>
              <li>Attend booked appointments or cancel with reasonable notice (minimum 24 hours)</li>
              <li>Treat business owners and staff with respect and courtesy</li>
              <li>Not share, resell or transfer subscription plans to other individuals</li>
              <li>Provide honest and fair reviews based on genuine experiences</li>
              <li>Not engage in fraudulent chargebacks or payment disputes without genuine cause</li>
              <li>Not book appointments with no intention of attending</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>11. Data and Account Deletion</h2>
            <p>You have the right to request deletion of your SubSeat account and associated personal data at any time.</p>
            <ul>
              <li>To request account deletion, email privacy@subseat.co.uk with the subject "Account Deletion Request"</li>
              <li>Include your registered email address and full name in your request</li>
              <li>We will confirm receipt within 48 hours and complete deletion within 30 days</li>
              <li>Financial records may be retained for up to 6 years as required by UK law</li>
              <li>Active subscriptions must be cancelled before account deletion can be processed</li>
              <li>Deleted accounts cannot be recovered</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>12. Prohibited Uses</h2>
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
            <h2>13. Intellectual Property</h2>
            <p>All content on the SubSeat platform, including the brand, logo, design, code and written content, is the property of SubSeat Ltd and is protected by UK copyright and trademark law. SubSeat&reg; is a registered UK trademark.</p>
            <p>You may not reproduce, distribute or create derivative works from SubSeat content without our written permission.</p>
          </div>

          <div className="legal-section">
            <h2>14. Limitation of Liability</h2>
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
            <h2>15. Platform Availability</h2>
            <p>We aim to keep SubSeat available 24/7 but cannot guarantee uninterrupted access. We may carry out maintenance, updates or improvements that temporarily affect availability. We will endeavour to notify users in advance of planned downtime.</p>
          </div>

          <div className="legal-section">
            <h2>16. Termination</h2>
            <p>SubSeat reserves the right to suspend or terminate any account at any time for violation of these Terms. Businesses may be removed from the platform if they receive consistent negative reviews, fail to honour bookings, or engage in conduct that damages the SubSeat community.</p>
            <p>You may close your account at any time by contacting hello@subseat.co.uk.</p>
          </div>

          <div className="legal-section">
            <h2>17. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes via email or a notice on the platform. Continued use of SubSeat after changes take effect constitutes acceptance of the updated Terms.</p>
          </div>

          <div className="legal-section">
            <h2>18. Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>

          <div className="legal-section">
            <h2>19. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at <a href="mailto:hello@subseat.co.uk" style={{ color:P }}>hello@subseat.co.uk</a>.</p>
          </div>

          <div style={{ background:G, borderRadius:14, padding:"20px 24px", marginTop:40 }}>
            <p style={{ fontSize:13, color:"#888", margin:0 }}>SubSeat Ltd &middot; hello@subseat.co.uk &middot; subseat.co.uk &middot; UK Registered Company</p>
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
        <p style={{ fontSize:13, color:"rgba(255,255,255,.3)" }}>&copy; 2026 SubSeat Ltd. All rights reserved. SubSeat&reg; is a UK registered trademark.</p>
      </footer>
    </>
  );
}