import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend   = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk";

export async function POST(req) {
  try {
    const { business, affectedBookings, startDate, endDate, reason, sameDay } = await req.json();

    if (!affectedBookings || affectedBookings.length === 0) {
      return Response.json({ success: true, notified: 0 });
    }

    const dateRange = sameDay ? startDate : `${startDate} to ${endDate}`;
    let notified = 0;

    for (const booking of affectedBookings) {
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

      // Build action URLs
      const rescheduleUrl  = `${SITE}/${business.category}/${business.slug}?action=reschedule&booking=${booking.id}`;
      const carryOverUrl   = `${SITE}/api/holiday-action?action=carry_over&booking=${booking.id}&email=${encodeURIComponent(customerEmail)}`;
      const cancelVisitUrl = `${SITE}/api/holiday-action?action=cancel_visit&booking=${booking.id}&email=${encodeURIComponent(customerEmail)}`;

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your booking is affected</title>
</head>
<body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:24px 16px 40px;">

  <!-- LOGO -->
  <div style="text-align:center;padding:16px 0 20px;">
    <a href="${SITE}" style="text-decoration:none;">
      <span style="display:inline-block;width:32px;height:32px;background:#563BE7;border-radius:8px;text-align:center;line-height:32px;font-size:16px;font-weight:900;color:#fff;font-family:Arial,sans-serif;">S</span>
      <span style="font-size:18px;font-weight:900;color:#563BE7;font-family:Arial,sans-serif;vertical-align:middle;margin-left:8px;">SubSeat</span>
    </a>
  </div>

  <div style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(86,59,231,.12);">

    <!-- HERO -->
    <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:36px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🏖️</div>
      <h1 style="color:#fff;font-size:22px;font-weight:900;margin:0 0 8px;font-family:Arial,sans-serif;">
        Your booking is affected
      </h1>
      <p style="color:rgba(255,255,255,.9);font-size:14px;margin:0;font-family:Arial,sans-serif;">
        ${business.business_name} is taking time off ${dateRange}
      </p>
    </div>

    <div style="padding:32px;">

      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 6px;font-family:Arial,sans-serif;">
        Hi <strong style="color:#171717;">${customerName}</strong>,
      </p>
      <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 24px;font-family:Arial,sans-serif;">
        <strong style="color:#171717;">${business.business_name}</strong> will be unavailable 
        <strong>${dateRange}</strong>${reason ? ` due to <strong>${reason}</strong>` : ""}. 
        Your booking on <strong style="color:#d97706;">${bookingDate} at ${bookingTime}</strong> is affected.
      </p>

      <!-- AFFECTED BOOKING BOX -->
      <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:14px;padding:18px 22px;margin-bottom:28px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:6px 0;width:100px;font-family:Arial,sans-serif;">Service</td>
            <td style="font-size:14px;color:#171717;font-weight:700;padding:6px 0;font-family:Arial,sans-serif;">${booking.service_name || "Your booking"}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#888;font-weight:600;padding:6px 0;font-family:Arial,sans-serif;">Was booked</td>
            <td style="font-size:14px;color:#d97706;font-weight:800;padding:6px 0;font-family:Arial,sans-serif;">${bookingDate} at ${bookingTime}</td>
          </tr>
        </table>
      </div>

      <!-- 3 OPTIONS -->
      <h3 style="font-size:16px;font-weight:800;color:#171717;margin:0 0 16px;font-family:Arial,sans-serif;">
        What would you like to do?
      </h3>

      <!-- OPTION 1 — RESCHEDULE -->
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;">
        <tr>
          <td style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:14px;padding:18px 20px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#171717;font-family:Arial,sans-serif;">📅 Reschedule my visit</p>
                  <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Pick a new date and time that works for you.</p>
                </td>
                <td style="vertical-align:middle;text-align:right;padding-left:16px;white-space:nowrap;">
                  <a href="${rescheduleUrl}" style="display:inline-block;background:#563BE7;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:700;font-size:13px;font-family:Arial,sans-serif;">
                    Reschedule →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- OPTION 2 — CARRY OVER -->
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:12px;">
        <tr>
          <td style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:18px 20px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#171717;font-family:Arial,sans-serif;">🔄 Carry over to next month</p>
                  <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Skip this visit and add an extra one to next month's allowance.</p>
                </td>
                <td style="vertical-align:middle;text-align:right;padding-left:16px;white-space:nowrap;">
                  <a href="${carryOverUrl}" style="display:inline-block;background:#22c55e;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:700;font-size:13px;font-family:Arial,sans-serif;">
                    Carry Over →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- OPTION 3 — CANCEL VISIT -->
      <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
        <tr>
          <td style="background:#fff5f5;border:1.5px solid #ffcccc;border-radius:14px;padding:18px 20px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="vertical-align:middle;">
                  <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#171717;font-family:Arial,sans-serif;">❌ Cancel this visit</p>
                  <p style="margin:0;font-size:13px;color:#888;font-family:Arial,sans-serif;">Cancel just this visit. Your subscription continues as normal.</p>
                </td>
                <td style="vertical-align:middle;text-align:right;padding-left:16px;white-space:nowrap;">
                  <a href="${cancelVisitUrl}" style="display:inline-block;background:#e53e3e;color:#fff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:700;font-size:13px;font-family:Arial,sans-serif;">
                    Cancel Visit →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- SUBSCRIPTION NOTE -->
      <div style="background:#f8f6ff;border:1.5px solid #ede9ff;border-radius:12px;padding:14px 18px;margin-bottom:20px;">
        <p style="font-size:13px;color:#563BE7;margin:0;line-height:1.65;font-family:Arial,sans-serif;">
          <strong>Your subscription is not affected.</strong> Whichever option you choose, your monthly subscription continues and your priority slot remains guaranteed.
        </p>
      </div>

      <!-- CONTACT -->
      <p style="font-size:13px;color:#888;line-height:1.7;margin:0;font-family:Arial,sans-serif;">
        Need to speak to ${business.business_name} directly?${business.phone ? ` Call <strong>${business.phone}</strong> or` : ""} reply to this email and we'll help.
      </p>

    </div>

    <!-- FOOTER -->
    <div style="background:#171717;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;">
        <a href="${SITE}" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">subseat.co.uk</a>
        <a href="${SITE}/help" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Help</a>
        <a href="${SITE}/privacy" style="color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;margin:0 8px;">Privacy</a>
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
        subject: `🏖️ Action needed: Your booking with ${business.business_name} is affected`,
        html,
      });

      // Save notification to queue
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