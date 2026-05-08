import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const {
      customerName, customerEmail, businessName, businessPhone,
      serviceName, dateStr, time, address, isMobile,
    } = await req.json();

    if (!customerEmail) return Response.json({ error: "No email" }, { status: 400 });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Booking Confirmed</title>
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
      <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:40px 32px;text-align:center;">
        <div style="font-size:52px;margin-bottom:12px;">✅</div>
        <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 8px;font-family:Arial,sans-serif;">Booking Confirmed!</h1>
        <p style="color:rgba(255,255,255,.8);font-size:15px;margin:0;font-family:Arial,sans-serif;">Your appointment is all set.</p>
      </div>

      <!-- BODY -->
      <div style="padding:32px;">
        <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 24px;font-family:Arial,sans-serif;">
          Hi <strong style="color:#171717;">${customerName}</strong>,<br/><br/>
          Your booking with <strong style="color:#171717;">${businessName}</strong> is confirmed. We look forward to seeing you!
        </p>

        <!-- BOOKING DETAILS -->
        <div style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:16px;padding:24px;margin-bottom:24px;">
          <h3 style="font-size:14px;font-weight:700;color:#563BE7;margin:0 0 16px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Booking Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="font-size:13px;color:#888;font-weight:600;padding:8px 0;width:120px;border-bottom:1px solid #ede9ff;font-family:Arial,sans-serif;">Service</td>
              <td style="font-size:14px;color:#171717;font-weight:700;padding:8px 0;border-bottom:1px solid #ede9ff;font-family:Arial,sans-serif;">${serviceName}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#888;font-weight:600;padding:8px 0;border-bottom:1px solid #ede9ff;font-family:Arial,sans-serif;">With</td>
              <td style="font-size:14px;color:#171717;font-weight:700;padding:8px 0;border-bottom:1px solid #ede9ff;font-family:Arial,sans-serif;">${businessName}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#888;font-weight:600;padding:8px 0;border-bottom:1px solid #ede9ff;font-family:Arial,sans-serif;">Date</td>
              <td style="font-size:15px;color:#563BE7;font-weight:900;padding:8px 0;border-bottom:1px solid #ede9ff;font-family:Arial,sans-serif;">${dateStr}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#888;font-weight:600;padding:8px 0;${address ? "border-bottom:1px solid #ede9ff;" : ""}font-family:Arial,sans-serif;">Time</td>
              <td style="font-size:15px;color:#563BE7;font-weight:900;padding:8px 0;${address ? "border-bottom:1px solid #ede9ff;" : ""}font-family:Arial,sans-serif;">${time}</td>
            </tr>
            ${address ? `
            <tr>
              <td style="font-size:13px;color:#888;font-weight:600;padding:8px 0;font-family:Arial,sans-serif;">📍 Address</td>
              <td style="font-size:14px;color:#171717;font-weight:700;padding:8px 0;font-family:Arial,sans-serif;">${address}</td>
            </tr>` : ""}
          </table>
        </div>

        ${isMobile ? `
        <!-- MOBILE BARBER NOTE -->
        <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
          <p style="font-size:13px;color:#166534;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
            🚐 <strong>Mobile appointment</strong> — your professional will come to you. Make sure someone is available at the address above.
          </p>
        </div>` : ""}

        <!-- CONTACT DETAILS -->
        <div style="background:#f9f9f9;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
          <p style="font-size:13px;color:#888;margin:0 0 6px;font-family:Arial,sans-serif;font-weight:700;">Need to make changes?</p>
          <p style="font-size:13px;color:#555;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
            Contact <strong>${businessName}</strong> directly${businessPhone ? ` on <strong>${businessPhone}</strong>` : ""}.
          </p>
        </div>

        <!-- REMINDER NOTE -->
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:14px 18px;margin-bottom:24px;">
          <p style="font-size:13px;color:#92400e;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
            📱 You'll receive a reminder before your appointment. Add this to your calendar so you don't forget!
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;">
          <a href="https://subseat.co.uk/discover" style="display:inline-block;background:linear-gradient(135deg,#563BE7,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;font-family:Arial,sans-serif;box-shadow:0 6px 20px rgba(86,59,231,.35);">
            Discover More Professionals →
          </a>
        </div>
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
      to:      [customerEmail],
      subject: `✅ Booking confirmed — ${businessName} on ${dateStr}`,
      html,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Booking confirm email error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}