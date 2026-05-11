import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, businessName, slug, category } = await req.json();
    if (!email) return Response.json({ error: "No email" }, { status: 400 });

    const profileUrl   = `https://subseat.co.uk/${category}/${slug}`;
    const dashboardUrl = "https://subseat.co.uk/dashboard";

    const features = [
      ["💰", "Predictable Monthly Income",    "Subscribers pay every month whether they book or not. No more feast and famine weeks."],
      ["📵", "Fewer No-Shows",                "Subscribers have already paid. Last minute cancellations hurt your diary, not your income."],
      ["🔔", "Automated WhatsApp Reminders",  "Reminders sent automatically to subscribers before every appointment. No chasing required."],
      ["📊", "Real-Time Dashboard",           "Track revenue, subscribers, bookings and growth all in one place on any device."],
      ["📱", "QR Code Walk-In Capture",       "Scan your unique QR code to capture walk-in customers instantly and convert them to subscribers."],
      ["🛍️", "SubSeat Marketplace",           "Buy and sell equipment, chairs and tools with other professionals. Only 1% platform fee."],
      ["💸", "SubSeat Finance",               "Apply for business funding of up to £50,000 directly through your SubSeat dashboard."],
      ["🛡️", "SubSeat Insurance",             "Get insurance quotes for public liability, equipment cover and more. Tailored for your industry."],
      ["🔗", "Your Own Booking Page",         "A professional profile at your own SubSeat URL. Share it on Instagram, TikTok and WhatsApp."],
      ["👥", "Staff Management",              "Add your team, track commission and manage individual calendars — all in one dashboard."],
    ];

    const steps = [
      ["1", "Share your profile link",       "Send it to your regulars on WhatsApp today. Even 3 subscribers is £150+ guaranteed every month."],
      ["2", "Add photos to your profile",    "Businesses with photos get significantly more subscribers. Upload your best shots in the dashboard."],
      ["3", "Download your QR code",         "Print it at your station so walk-ins can scan and subscribe on the spot."],
      ["4", "Set your subscription price",   "Industry average is £40 to £65/month for unlimited cuts. Start at a price your regulars will say yes to."],
    ];

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>You're live on SubSeat!</title>
</head>
<body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px 40px;">

  <!-- LOGO -->
  <div style="text-align:center;padding:16px 0 20px;">
    <a href="https://subseat.co.uk" style="text-decoration:none;display:inline-flex;align-items:center;gap:10px;">
      <span style="display:inline-block;width:34px;height:34px;background:#563BE7;border-radius:9px;text-align:center;line-height:34px;font-size:17px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
      <span style="font-size:19px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;">SubSeat</span>
    </a>
  </div>

  <!-- MAIN CARD -->
  <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 48px rgba(86,59,231,.18);">

    <!-- HERO -->
    <div style="background:linear-gradient(135deg,#563BE7 0%,#6d28d9 55%,#4c1d95 100%);padding:48px 36px 40px;text-align:center;position:relative;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:radial-gradient(rgba(255,255,255,.05) 1px,transparent 1px);background-size:24px 24px;"></div>
      <div style="font-size:58px;margin-bottom:14px;position:relative;">🚀</div>
      <h1 style="color:#ffffff;font-size:30px;font-weight:900;margin:0 0 12px;font-family:Arial,sans-serif;letter-spacing:-1px;position:relative;">
        You're live, ${name}!
      </h1>
      <p style="color:rgba(255,255,255,.8);font-size:16px;margin:0 auto;max-width:420px;line-height:1.7;font-family:Arial,sans-serif;position:relative;">
        <strong style="color:#fff;">${businessName}</strong> is now live on SubSeat. Your profile is active, your booking page is ready and your first subscriber is waiting.
      </p>
    </div>

    <div style="padding:36px 36px 0;">

      <!-- PROFILE URL -->
      <div style="background:#f8f6ff;border:2px solid #563BE7;border-radius:16px;padding:20px 24px;margin-bottom:28px;text-align:center;">
        <p style="font-size:11px;font-weight:700;color:#888;margin:0 0 8px;letter-spacing:1.5px;text-transform:uppercase;font-family:Arial,sans-serif;">Your public profile</p>
        <a href="${profileUrl}" style="font-size:17px;font-weight:900;color:#563BE7;text-decoration:none;font-family:Arial,sans-serif;word-break:break-all;">${profileUrl}</a>
        <p style="font-size:12px;color:#aaa;margin:10px 0 0;font-family:Arial,sans-serif;">Share this link on WhatsApp, Instagram and TikTok to get your first subscribers today</p>
      </div>

      <!-- WHAT TO DO NEXT -->
      <div style="margin-bottom:28px;">
        <h2 style="font-size:18px;font-weight:800;color:#171717;margin:0 0 18px;font-family:Arial,sans-serif;">What to do right now</h2>
        ${steps.map(([num, title, body]) => `
        <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
          <tr>
            <td style="width:44px;vertical-align:top;padding-right:14px;">
              <div style="width:44px;height:44px;background:#563BE7;border-radius:50%;text-align:center;line-height:44px;font-size:17px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">${num}</div>
            </td>
            <td style="vertical-align:top;padding-top:4px;">
              <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#171717;font-family:Arial,sans-serif;">${title}</p>
              <p style="margin:0;font-size:13px;color:#777;line-height:1.6;font-family:Arial,sans-serif;">${body}</p>
            </td>
          </tr>
        </table>`).join("")}
      </div>

      <!-- CTA BUTTONS -->
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:32px;">
        <tr>
          <td style="padding-right:8px;">
            <a href="${dashboardUrl}" style="display:block;background:linear-gradient(135deg,#563BE7,#7c3aed);color:#fff;text-decoration:none;padding:14px 16px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;text-align:center;box-shadow:0 6px 20px rgba(86,59,231,.35);">Go to Dashboard →</a>
          </td>
          <td style="padding-left:8px;">
            <a href="${profileUrl}" style="display:block;background:#f4f0ff;color:#563BE7;text-decoration:none;padding:14px 16px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;text-align:center;border:2px solid #ede9ff;">View My Profile →</a>
          </td>
        </tr>
      </table>

    </div>

    <!-- FEATURES SECTION -->
    <div style="background:#f8f6ff;padding:32px 36px;border-top:1.5px solid #ede9ff;">
      <h2 style="font-size:18px;font-weight:800;color:#171717;margin:0 0 6px;font-family:Arial,sans-serif;">Everything included with SubSeat</h2>
      <p style="font-size:13px;color:#888;margin:0 0 24px;font-family:Arial,sans-serif;">Free to join. Simple 6% platform fee only on subscriptions. No monthly charges. No hidden fees. Ever.</p>

      ${features.map(([icon, title, body]) => `
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:18px;">
        <tr>
          <td style="width:44px;vertical-align:top;padding-right:14px;">
            <div style="width:44px;height:44px;background:#fff;border-radius:12px;text-align:center;line-height:44px;font-size:22px;border:1.5px solid #ede9ff;">${icon}</div>
          </td>
          <td style="vertical-align:top;padding-top:4px;">
            <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#171717;font-family:Arial,sans-serif;">${title}</p>
            <p style="margin:0;font-size:12px;color:#777;line-height:1.55;font-family:Arial,sans-serif;">${body}</p>
          </td>
        </tr>
      </table>`).join("")}

      <!-- PLATFORM FEE NOTE -->
      <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:16px 20px;margin-top:8px;">
        <table cellpadding="0" cellspacing="0" style="width:100%">
          <tr>
            <td style="width:32px;font-size:22px;vertical-align:middle;padding-right:10px;">✅</td>
            <td>
              <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#166534;font-family:Arial,sans-serif;">Free to join. Simple 6% platform fee.</p>
              <p style="margin:0;font-size:12px;color:#166534;opacity:.85;font-family:Arial,sans-serif;">SubSeat only earns when you earn. No setup fees, no monthly charges, no surprises.</p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- SIGN OFF -->
    <div style="padding:28px 36px;">
      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 8px;font-family:Arial,sans-serif;">
        If you have any questions at all, just reply to this email. We're a small team and we read every message.
      </p>
      <p style="font-size:15px;color:#555;line-height:1.75;margin:0;font-family:Arial,sans-serif;">
        Here's to your first subscriber. 🥂<br/>
        <strong style="color:#171717;">The SubSeat Team</strong>
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background:#171717;padding:22px 36px;text-align:center;">
      <p style="margin:0 0 10px;font-family:Arial,sans-serif;">
        <a href="https://subseat.co.uk" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">subseat.co.uk</a>
        <a href="https://subseat.co.uk/privacy" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Privacy</a>
        <a href="https://subseat.co.uk/terms" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Terms</a>
        <a href="https://subseat.co.uk/contact" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Contact</a>
      </p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,.2);font-family:Arial,sans-serif;line-height:1.6;">
        SubSeat Ltd · United Kingdom · SubSeat® is a registered trademark.<br/>
        You received this because you completed SubSeat business onboarding.
      </p>
    </div>

  </div>
</div>
</body>
</html>`;

    await resend.emails.send({
      from:    "SubSeat <hello@subseat.co.uk>",
      to:      [email],
      subject: `🚀 ${businessName} is live on SubSeat — here's everything you get`,
      html,
    });

    return Response.json({ success: true });
  } catch(err) {
    console.error("Onboarding complete email error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}