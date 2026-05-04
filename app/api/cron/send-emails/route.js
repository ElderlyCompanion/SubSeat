import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend  = new Resend(process.env.RESEND_API_KEY);
const FROM    = 'SubSeat <hello@subseat.co.uk>';
const SECRET  = process.env.CRON_SECRET;

/* ── VERIFY THIS IS VERCEL CALLING ── */
function isAuthorised(request) {
  const auth = request.headers.get("authorization");
  // Vercel sends this header automatically for cron jobs
  if (request.headers.get("x-vercel-cron") === "1") return true;
  if (auth === `Bearer ${SECRET}`) return true;
  return false;
}

/* ── EMAIL TEMPLATES ── */
function buildEmail(notif) {
  const base = (title, color, content) => `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Poppins,Arial,sans-serif">
      <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:${color};padding:28px 32px;text-align:center">
          <div style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.2);margin-bottom:10px">
            <span style="color:#fff;font-size:22px;font-weight:900">S</span>
          </div>
          <h1 style="color:#fff;font-size:20px;font-weight:800;margin:0;letter-spacing:-.3px">${title}</h1>
        </div>
        <div style="padding:28px 32px">${content}</div>
        <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a> · <a href="https://subseat.co.uk/unsubscribe" style="color:#aaa">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  switch(notif.notification_type) {

    case "booking_confirmation_customer":
      return {
        subject: notif.subject || "✅ Booking confirmed",
        html: base("Booking Confirmed! ✅", "linear-gradient(135deg,#563BE7,#7c5cff)", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "Your booking has been confirmed."}</p>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">View My Bookings</a>
        `),
      };

    case "booking_confirmation_business":
      return {
        subject: notif.subject || "📅 New booking received",
        html: base("New Booking", "#171717", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "You have a new booking."}</p>
          <a href="https://subseat.co.uk/dashboard" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">View Dashboard</a>
        `),
      };

    case "booking_reminder_24h":
      return {
        subject: notif.subject || "⏰ Appointment reminder — tomorrow",
        html: base("Reminder ⏰", "#f59e0b", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "You have an appointment tomorrow."}</p>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">View Details</a>
        `),
      };

    case "booking_reminder_2h":
      return {
        subject: notif.subject || "⏰ Appointment in 2 hours",
        html: base("See You Soon! ✂️", "#563BE7", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "Your appointment is in 2 hours."}</p>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">View Details</a>
        `),
      };

    case "membership_started":
      return {
        subject: notif.subject || "🎉 Welcome to your membership!",
        html: base("You're a Member! 🎉", "linear-gradient(135deg,#22c55e,#16a34a)", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "Your membership is now active."}</p>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">Book Your First Appointment</a>
        `),
      };

    case "membership_upsell_day_7":
      return {
        subject: notif.subject || "💡 Save more with a monthly membership",
        html: base("Loved Your Visit? 💈", "linear-gradient(135deg,#563BE7,#7c5cff)", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "Subscribe monthly and save."}</p>
          <a href="https://subseat.co.uk/discover" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center;margin-bottom:10px">View Membership Plans →</a>
          <p style="font-size:12px;color:#aaa;text-align:center;margin:0">Cancel anytime · No hidden fees</p>
        `),
      };

    case "holiday_decision":
      return {
        subject: notif.subject || "Holiday request update",
        html: base("Holiday Request Update", "#563BE7", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "Your holiday request has been updated."}</p>
          <a href="https://subseat.co.uk/dashboard" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">View Dashboard</a>
        `),
      };

    case "churn_risk":
      return {
        subject: notif.subject || "We miss you! 👋 Come back and book",
        html: base("We Miss You! 👋", "linear-gradient(135deg,#f59e0b,#d97706)", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "It's been a while — book your next appointment."}</p>
          <a href="https://subseat.co.uk/discover" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">Book Now</a>
        `),
      };

    case "walk_in_welcome":
      return {
        subject: notif.subject || "Thanks for visiting! 👋",
        html: base("Great to Meet You! ✂️", "linear-gradient(135deg,#563BE7,#7c5cff)", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || "Thanks for your visit today."}</p>
          <a href="https://subseat.co.uk/discover" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">Book Online Next Time</a>
        `),
      };

    default:
      return {
        subject: notif.subject || "Message from SubSeat",
        html: base("SubSeat", "#563BE7", `
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 20px">${notif.message || ""}</p>
          <a href="https://subseat.co.uk" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-weight:700;font-size:14px;text-align:center">Visit SubSeat</a>
        `),
      };
  }
}

/* ── PROCESS QUEUE ── */
async function processQueue(db) {
  const now = new Date().toISOString();

  const { data: pending, error } = await db
    .from("notification_queue")
    .select("*")
    .eq("status", "pending")
    .eq("channel", "email")
    .lte("scheduled_for", now)
    .limit(25);

  if (error) throw new Error(`Queue fetch failed: ${error.message}`);
  if (!pending?.length) return { processed:0, skipped:0, errors:[] };

  let processed = 0, skipped = 0;
  const errors = [];

  for (const notif of pending) {
    // Skip if no recipient email
    if (!notif.recipient || !notif.recipient.includes("@")) {
      await db.from("notification_queue").update({ status:"cancelled", error_message:"No valid recipient email" }).eq("id", notif.id);
      skipped++;
      continue;
    }

    try {
      const email = buildEmail(notif);

      const { error: sendError } = await resend.emails.send({
        from:    FROM,
        to:      notif.recipient,
        subject: email.subject,
        html:    email.html,
      });

      if (sendError) {
        await db.from("notification_queue").update({
          status:        "failed",
          error_message: sendError.message,
        }).eq("id", notif.id);
        errors.push({ id:notif.id, error:sendError.message });
      } else {
        await db.from("notification_queue").update({
          status:  "sent",
          sent_at: new Date().toISOString(),
        }).eq("id", notif.id);
        processed++;
      }
    } catch (err) {
      await db.from("notification_queue").update({
        status:        "failed",
        error_message: err.message,
      }).eq("id", notif.id);
      errors.push({ id:notif.id, error:err.message });
    }
  }

  return { processed, skipped, errors };
}

/* ── HANDLER ── */
export async function GET(request) {
  if (!isAuthorised(request)) {
    return Response.json({ error:"Unauthorised" }, { status:401 });
  }

  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const result = await processQueue(db);

    console.log(`[Email Cron] Processed: ${result.processed}, Skipped: ${result.skipped}, Errors: ${result.errors.length}`);

    return Response.json({
      ok:        true,
      processed: result.processed,
      skipped:   result.skipped,
      errors:    result.errors.length,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("[Email Cron Error]", err);
    return Response.json({ ok:false, error:err.message }, { status:500 });
  }
}