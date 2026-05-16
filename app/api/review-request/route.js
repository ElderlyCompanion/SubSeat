import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE   = process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk";

export async function POST(req) {
  try {
    const {
      customerName, customerEmail,
      businessName, businessSlug, businessCategory,
      bookingId, serviceName,
    } = await req.json();

    if (!customerEmail) return Response.json({ error: "No email" }, { status: 400 });

    const reviewUrl = `${SITE}/${businessCategory}/${businessSlug}?tab=reviews&booking=${bookingId}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>How was your visit?</title>
</head>
<body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px 40px;">

  <!-- LOGO -->
  <div style="text-align:center;padding:16px 0 20px;">
    <a href="${SITE}" style="text-decoration:none;">
      <span style="display:inline-block;width:32px;height:32px;background:#563BE7;border-radius:8px;text-align:center;line-height:32px;font-size:16px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
      <span style="font-size:18px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;vertical-align:middle;margin-left:8px;">SubSeat</span>
    </a>
  </div>

  <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(86,59,231,.12);">

    <!-- HERO -->
    <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:40px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:12px;">⭐</div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 8px;font-family:Arial,sans-serif;">
        How was your visit?
      </h1>
      <p style="color:rgba(255,255,255,.85);font-size:14px;margin:0;font-family:Arial,sans-serif;">
        We'd love to hear about your experience with ${businessName}
      </p>
    </div>

    <div style="padding:32px;">

      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 24px;font-family:Arial,sans-serif;">
        Hi <strong style="color:#171717;">${customerName}</strong>,<br/><br/>
        Thank you for your recent visit to <strong style="color:#171717;">${businessName}</strong>${serviceName ? ` for your <strong>${serviceName}</strong>` : ""}. We hope it went brilliantly!
      </p>

      <!-- STAR RATING BUTTONS -->
      <p style="font-size:14px;font-weight:700;color:#171717;margin:0 0 14px;font-family:Arial,sans-serif;">How would you rate your experience?</p>

      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
        <tr>
          ${[1,2,3,4,5].map(n => `
          <td style="text-align:center;padding:0 4px;">
            <a href="${reviewUrl}&rating=${n}" style="display:block;background:${n >= 4 ? '#f0fdf4' : n === 3 ? '#fffbeb' : '#fff5f5'};border:1.5px solid ${n >= 4 ? '#bbf7d0' : n === 3 ? '#fde68a' : '#ffcccc'};border-radius:12px;padding:14px 8px;text-decoration:none;">
              <div style="font-size:28px;margin-bottom:4px;">${'⭐'.repeat(n)}</div>
              <div style="font-size:11px;font-weight:700;color:#555;font-family:Arial,sans-serif;">${n === 1 ? 'Poor' : n === 2 ? 'Fair' : n === 3 ? 'Good' : n === 4 ? 'Great' : 'Amazing'}</div>
            </a>
          </td>`).join('')}
        </tr>
      </table>

      <!-- OR WRITE A REVIEW -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${reviewUrl}" style="display:inline-block;background:linear-gradient(135deg,#563BE7,#7c3aed);color:#fff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;box-shadow:0 6px 20px rgba(86,59,231,.3);">
          Write a Review →
        </a>
      </div>

      <!-- WHY IT MATTERS -->
      <div style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:14px;padding:16px 20px;">
        <p style="font-size:13px;color:#555;margin:0;line-height:1.65;font-family:Arial,sans-serif;">
          Your review helps <strong>${businessName}</strong> grow and helps other customers find great professionals on SubSeat. It takes less than 30 seconds.
        </p>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="background:#171717;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;">
        <a href="${SITE}" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">subseat.co.uk</a>
        <a href="${SITE}/privacy" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Privacy</a>
        <a href="${SITE}/help" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Help</a>
      </p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,.2);font-family:Arial,sans-serif;">
        You received this because you had an appointment booked through SubSeat.<br/>
        SubSeat Ltd &middot; United Kingdom
      </p>
    </div>

  </div>
</div>
</body>
</html>`;

    await resend.emails.send({
      from:    "SubSeat <hello@subseat.co.uk>",
      to:      [customerEmail],
      subject: `How was your visit to ${businessName}? Leave a review`,
      html,
    });

    return Response.json({ success: true });
  } catch(err) {
    console.error("Review request email error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}