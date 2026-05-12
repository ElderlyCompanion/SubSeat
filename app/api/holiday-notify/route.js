import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend   = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { business, affectedBookings, startDate, endDate, reason, sameDay } = await req.json();

    if (!affectedBookings || affectedBookings.length === 0) {
      return Response.json({ success: true, notified: 0 });
    }

    const dateRange = sameDay ? startDate : `${startDate} to ${endDate}`;
    let notified = 0;

    for (const booking of affectedBookings) {
      // Get customer email from booking or profiles table
      let customerEmail = booking.customer_email;
      let customerName  = booking.customer_name || "Valued Customer";

      if (!customerEmail && booking.customer_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", booking.customer_id)
          .maybeSingle();
        if (profile) {
          customerEmail = profile.email;
          customerName  = profile.full_name || customerName;
        }
      }

      if (!customerEmail) continue;

      const bookingDate = new Date(booking.start_time).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long"
      });
      const bookingTime = new Date(booking.start_time).toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit"
      });

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Important: Your Booking</title>
</head>
<body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px 40px;">

  <!-- LOGO -->
  <div style="text-align:center;padding:16px 0 20px;">
    <a href="https://subseat.co.uk" style="text-decoration:none;">
      <span style="display:inline-block;width:32px;height:32px;background:#563BE7;border-radius:8px;text-align:center;line-height:32px;font-size:16px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
      <span style="font-size:18px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;vertical-align:middle;margin-left:8px;">SubSeat</span>
    </a>
  </div>

  <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(86,59,231,.12);">

    <!-- HERO -->
    <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:36px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:12px;">🏖️</div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 8px;font-family:Arial,sans-serif;">
        Important: Your Booking
      </h1>
      <p style="color:rgba(255,255,255,.9);font-size:14px;margin:0;font-family:Arial,sans-serif;">
        ${business.business_name} is taking time off
      </p>
    </div>

    <div style="padding:32px;">

      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 20px;font-family:Arial,sans-serif;">
        Hi <strong style="color:#171717;">${customerName}</strong>,
      </p>

      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 20px;font-family:Arial,sans-serif;">
        <strong style="color:#171717;">${business.business_name}</strong> will be unavailable on <strong>${dateRange}</strong>${reason ? ` due to <strong>${reason}</strong>` : ""}.
      </p>

      <!-- AFFECTED BOOKING -->
      <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
        <h3 style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 14px;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Your Affected Booking</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;width:100px;border-bottom:1px solid #fde68a;font-family:Arial,sans-serif;">With</td>
            <td style="font-size:14px;color:#171717;font-weight:700;padding:7px 0;border-bottom:1px solid #fde68a;font-family:Arial,sans-serif;">${business.business_name}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;border-bottom:1px solid #fde68a;font-family:Arial,sans-serif;">Date</td>
            <td style="font-size:14px;color:#d97706;font-weight:800;padding:7px 0;border-bottom:1px solid #fde68a;font-family:Arial,sans-serif;">${bookingDate}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:7px 0;font-family:Arial,sans-serif;">Time</td>
            <td style="font-size:14px;color:#d97706;font-weight:800;padding:7px 0;font-family:Arial,sans-serif;">${bookingTime}</td>
          </tr>
        </table>
      </div>

      <!-- WHAT HAPPENS NEXT -->
      <div style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:14px;padding:16px 20px;margin-bottom:24px;">
        <p style="font-size:13px;color:#563BE7;margin:0;line-height:1.7;font-family:Arial,sans-serif;">
          <strong>What happens next?</strong><br/>
          ${business.business_name} will be in touch to arrange an alternative date. If you need to rearrange sooner, contact them directly${business.phone ? ` on <strong>${business.phone}</strong>` : ""}.
        </p>
      </div>

      <!-- APOLOGY NOTE -->
      <p style="font-size:13px;color:#888;line-height:1.7;margin:0 0 24px;font-family:Arial,sans-serif;">
        We apologise for any inconvenience this may cause. If you are a subscriber, your subscription will continue as normal and your next available slot will be prioritised.
      </p>

      <!-- CTA -->
      <div style="text-align:center;">
        <a href="https://subseat.co.uk/discover" style="display:inline-block;background:linear-gradient(135deg,#563BE7,#7c3aed);color:#fff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif;box-shadow:0 6px 20px rgba(86,59,231,.3);">
          Find Other Professionals →
        </a>
      </div>

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
        subject: `🏖️ Important: Your booking with ${business.business_name} on ${bookingDate}`,
        html,
      });

      // Also save in-app notification for customer
      if (booking.customer_id) {
        await supabase.from("notification_queue").insert({
          business_id:       business.id,
          booking_id:        booking.id,
          channel:           "email",
          notification_type: "holiday_notice",
          recipient:         customerEmail,
          subject:           `Holiday notice from ${business.business_name}`,
          message:           `${business.business_name} is unavailable ${dateRange}. Your booking on ${bookingDate} at ${bookingTime} is affected.`,
          status:            "sent",
          scheduled_for:     new Date().toISOString(),
        }).catch(() => {});
      }

      notified++;
    }

    return Response.json({ success: true, notified });
  } catch(err) {
    console.error("Holiday notify error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}