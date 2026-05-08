import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, businessName, slug, category } = await req.json();

    if (!email) return Response.json({ error: "No email" }, { status: 400 });

    const profileUrl  = `https://subseat.co.uk/${category}/${slug}`;
    const dashboardUrl = "https://subseat.co.uk/dashboard";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your SubSeat Profile is Live!</title>
</head>
<body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:24px auto;padding:0 16px;">

    <!-- LOGO -->
    <div style="text-align:center;padding:20px 0;">
      <a href="https://subseat.co.uk" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
        <span style="display:inline-block;width:32px;height:32px;background:#563BE7;border-radius:8px;text-align:center;line-height:32px;font-size:16px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
        <span style="font-size:18px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;">SubSeat</span>
      </a>
    </div>

    <!-- CARD -->
    <div style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(86,59,231,.15);">

      <!-- HERO -->
      <div style="background:linear-gradient(135deg,#563BE7 0%,#6d28d9 60%,#4c1d95 100%);padding:44px 32px;text-align:center;position:relative;">
        <div style="font-size:52px;margin-bottom:14px;">🚀</div>
        <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 10px;font-family:Arial,sans-serif;letter-spacing:-0.5px;">
          You're live, ${name}!
        </h1>
        <p style="color:rgba(255,255,255,.8);font-size:15px;margin:0;font-family:Arial,sans-serif;line-height:1.6;">
          ${businessName} is now on SubSeat and ready to take subscribers.
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:32px;">

        <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 24px;font-family:Arial,sans-serif;">
          Hi <strong style="color:#171717;">${name}</strong>,<br/><br/>
          Congratulations! Your SubSeat business profile is now live. Customers can find you, book with you and subscribe to your plans right now.
        </p>

        <!-- PROFILE URL BOX -->
        <div style="background:#f8f6ff;border:2px solid #563BE7;border-radius:16px;padding:20px 24px;margin-bottom:28px;text-align:center;">
          <p style="font-size:12px;font-weight:700;color:#888;margin:0 0 8px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Your public profile</p>
          <a href="${profileUrl}" style="font-size:16px;font-weight:900;color:#563BE7;text-decoration:none;font-family:Arial,sans-serif;word-break:break-all;">
            ${profileUrl}
          </a>
          <p style="font-size:12px;color:#aaa;margin:10px 0 0;font-family:Arial,sans-serif;">Share this link with your customers to start getting subscribers</p>
        </div>

        <!-- NEXT STEPS -->
        <div style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:16px;padding:24px;margin-bottom:24px;">
          <h3 style="font-size:14px;font-weight:700;color:#171717;margin:0 0 18px;font-family:Arial,sans-serif;">What to do next</h3>

          <table style="width:100%;border-collapse:collapse;">
            ${[
              ["📱", "Share your profile link", "Send it on WhatsApp, Instagram and TikTok. Tell your regulars to subscribe."],
              ["📸", "Add photos to your profile", "Businesses with photos get 3x more subscribers. Upload in your dashboard."],
              ["💰", "Check your subscription plans", "Make sure your pricing is set. Adjust anytime from your dashboard."],
              ["🔗", "Download your QR code", "Print it in your shop so walk-ins can scan and subscribe instantly."],
            ].map(([icon, title, body]) => `
              <tr>
                <td style="width:36px;vertical-align:top;padding:0 12px 16px 0;font-size:24px;">${icon}</td>
                <td style="vertical-align:top;padding-bottom:16px;">
                  <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#171717;font-family:Arial,sans-serif;">${title}</p>
                  <p style="margin:0;font-size:12px;color:#888;line-height:1.55;font-family:Arial,sans-serif;">${body}</p>
                </td>
              </tr>
            `).join("")}
          </table>
        </div>

        <!-- GREEN BADGE -->
        <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:16px 20px;margin-bottom:28px;">
          <table cellpadding="0" cellspacing="0" style="width:100%">
            <tr>
              <td style="width:32px;font-size:22px;vertical-align:middle;padding-right:10px;">✅</td>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#166534;font-family:Arial,sans-serif;">Free to join. Simple 6% platform fee.</p>
                <p style="margin:0;font-size:12px;color:#166534;opacity:.85;font-family:Arial,sans-serif;">We only earn when you earn. No monthly charges, no hidden fees. Ever.</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- CTA BUTTONS -->
        <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:8px;">
          <tr>
            <td style="padding-right:8px;">
              <a href="${dashboardUrl}" style="display:block;background:linear-gradient(135deg,#563BE7,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;text-align:center;box-shadow:0 6px 20px rgba(86,59,231,.35);">
                Go to Dashboard →
              </a>
            </td>
            <td style="padding-left:8px;">
              <a href="${profileUrl}" style="display:block;background:#f4f0ff;color:#563BE7;text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;text-align:center;border:2px solid #ede9ff;">
                View My Profile →
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size:13px;color:#aaa;text-align:center;margin:16px 0 0;font-family:Arial,sans-serif;">
          Questions? Reply to this email — we're always happy to help.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background:#171717;padding:20px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;">
          <a href="https://subseat.co.uk" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">subseat.co.uk</a>
          <a href="https://subseat.co.uk/privacy" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Privacy</a>
          <a href="https://subseat.co.uk/terms" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Terms</a>
        </p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,.2);font-family:Arial,sans-serif;">
          SubSeat Ltd · United Kingdom · SubSeat® is a registered trademark.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from:    "SubSeat <hello@subseat.co.uk>",
      to:      [email],
      subject: `🚀 ${businessName} is live on SubSeat — here's what to do next`,
      html,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Onboarding complete email error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}