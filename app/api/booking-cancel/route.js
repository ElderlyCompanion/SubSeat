import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const {
      customerName, customerEmail,
      businessName, businessPhone,
      serviceName, dateStr, time,
      cancelledBy, // "customer" or "business"
      reason,
    } = await req.json();

    if (!customerEmail) return Response.json({ error: "No email" }, { status: 400 });

    const byBusiness = cancelledBy === "business";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Booking Cancelled</title>
</head>
<body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px 40px;">

  <!-- LOGO -->
  <div style="text-align:center;padding:16px 0 20px;">
    <a href="https://subseat.co.uk" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
      <span style="display:inline-block;width:32px;height:32px;background:#563BE7;border-radius:8px;text-align:center;line-height:32px;font-size:16px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
      <span style="font-size:18px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;">SubSeat</span>
    </a>
  </div>

  <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(86,59,231,.12);">

    <!-- HERO -->
    <div style="background:linear-gradient(135deg,#e53e3e,#c53030);padding:40px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:12px;">❌</div>
      <h1 style="color:#fff;font-size:24px;font-weight:900;margin:0 0 8px;font-family:Arial,sans-serif;">Booking Cancelled</h1>
      <p style="color:rgba(255,255,255,.8);font-size:14px;margin:0;font-family:Arial,sans-serif;">
        ${byBusiness ? `${businessName} has cancelled your booking` : "Your booking has been cancelled"}
      </p>
    </div>

    <div style="padding:32px;">

      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 20px;font-family:Arial,sans-serif;">
        Hi <strong style="color:#171717;">${customerName}</strong>,<br/><br/>
        ${byBusiness
          ? `Unfortunately <strong style="color:#171717;">${businessName}</strong> has had to cancel your booking. We apologise for any inconvenience caused.`
          : `Your booking with <strong style="color:#171717;">${businessName}</strong> has been successfully cancelled.`
        }
      </p>

      <!-- CANCELLED BOOKING DETAILS -->
      <div style="background:#fff5f5;border:1.5px solid #ffcccc;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
        <h3 style="font-size:13px;font-weight:700;color:#e53e3e;margin:0 0 14px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Cancelled Booking</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;width:110px;border-bottom:1px solid #ffe4e4;font-family:Arial,sans-serif;">Service</td>
            <td style="font-size:14px;color:#171717;font-weight:700;padding:7px 0;border-bottom:1px solid #ffe4e4;font-family:Arial,sans-serif;">${serviceName}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;border-bottom:1px solid #ffe4e4;font-family:Arial,sans-serif;">With</td>
            <td style="font-size:14px;color:#171717;font-weight:700;padding:7px 0;border-bottom:1px solid #ffe4e4;font-family:Arial,sans-serif;">${businessName}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;border-bottom:1px solid #ffe4e4;font-family:Arial,sans-serif;">Was on</td>
            <td style="font-size:14px;color:#e53e3e;font-weight:700;padding:7px 0;border-bottom:1px solid #ffe4e4;font-family:Arial,sans-serif;">${dateStr} at ${time}</td>
          </tr>
          ${reason ? `
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;font-family:Arial,sans-serif;">Reason</td>
            <td style="font-size:14px;color:#171717;font-weight:700;padding:7px 0;font-family:Arial,sans-serif;">${reason}</td>
          </tr>` : ""}
        </table>
      </div>

      ${byBusiness ? `
      <!-- BUSINESS CANCELLED — offer rebook and refund info -->
      <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
        <p style="font-size:13px;color:#166534;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
          <strong>What happens next?</strong><br/>
          ${businessName} should contact you to arrange an alternative appointment. If you paid for a one-off booking, you are entitled to a full refund. Contact us at <a href="mailto:hello@subseat.co.uk" style="color:#16a34a;">hello@subseat.co.uk</a> if you need help.
        </p>
      </div>
      ` : `
      <!-- CUSTOMER CANCELLED -->
      <div style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:14px;padding:16px 20px;margin-bottom:20px;">
        <p style="font-size:13px;color:#563BE7;margin:0;line-height:1.6;font-family:Arial,sans-serif;">
          If you'd like to rebook, visit your dashboard or contact ${businessName} directly${businessPhone ? ` on <strong>${businessPhone}</strong>` : ""}.
        </p>
      </div>
      `}

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:8px;">
        <tr>
          <td style="padding-right:8px;">
            <a href="https://subseat.co.uk/discover" style="display:block;background:linear-gradient(135deg,#563BE7,#7c3aed);color:#fff;text-decoration:none;padding:13px 20px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;text-align:center;">
              Find Another Professional →
            </a>
          </td>
          <td style="padding-left:8px;">
            <a href="https://subseat.co.uk/help" style="display:block;background:#f4f0ff;color:#563BE7;text-decoration:none;padding:13px 20px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;text-align:center;border:2px solid #ede9ff;">
              Help Centre
            </a>
          </td>
        </tr>
      </table>

    </div>

    <!-- FOOTER -->
    <div style="background:#171717;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;">
        <a href="https://subseat.co.uk" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">subseat.co.uk</a>
        <a href="https://subseat.co.uk/help" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Help</a>
        <a href="https://subseat.co.uk/privacy" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Privacy</a>
      </p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,.2);font-family:Arial,sans-serif;">SubSeat Ltd · United Kingdom · SubSeat® is a registered trademark.</p>
    </div>

  </div>
</div>
</body>
</html>`;

    await resend.emails.send({
      from:    "SubSeat <hello@subseat.co.uk>",
      to:      [customerEmail],
      subject: `❌ Booking cancelled — ${businessName} on ${dateStr}`,
      html,
    });

    return Response.json({ success: true });
  } catch(err) {
    console.error("Cancellation email error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}