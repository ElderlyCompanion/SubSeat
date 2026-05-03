import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = 'SubSeat <hello@subseat.co.uk>';

/* ── EMAIL TEMPLATES ── */
function bookingConfirmationCustomer({ customerName, businessName, date, time, service }) {
  return {
    subject: `✅ Booking confirmed — ${businessName}`,
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:linear-gradient(135deg,#563BE7 0%,#7c5cff 100%);padding:32px 40px;text-align:center">
          <div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.2);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
            <span style="color:#fff;font-size:24px;font-weight:900">S</span>
          </div>
          <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0;letter-spacing:-.5px">Booking Confirmed!</h1>
        </div>
        <div style="padding:36px 40px">
          <p style="font-size:16px;color:#333;margin:0 0 24px">Hi ${customerName},</p>
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 28px">
            Your appointment with <strong style="color:#171717">${businessName}</strong> is confirmed. We'll see you soon!
          </p>
          <div style="background:#f4f4f4;border-radius:14px;padding:24px;margin-bottom:28px">
            <table style="width:100%;border-collapse:collapse">
              ${[
                ['📅 Date', date],
                ['🕐 Time', time],
                ['💈 Service', service],
                ['📍 Business', businessName],
              ].map(([label, val]) => `
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;font-weight:600;width:120px">${label}</td>
                  <td style="padding:8px 0;font-size:14px;color:#171717;font-weight:700">${val}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          <div style="background:#E9E6FF;border-radius:12px;padding:18px 20px;margin-bottom:28px">
            <p style="font-size:13px;color:#563BE7;font-weight:600;margin:0">
              💡 <strong>Subscribe for better value</strong> — get priority booking and save money every month.
            </p>
          </div>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-align:center">
            View My Bookings
          </a>
        </div>
        <div style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · The UK's subscription booking platform</p>
          <p style="font-size:12px;color:#aaa;margin:6px 0 0"><a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
        </div>
      </div>
    `,
  };
}

function bookingConfirmationBusiness({ businessName, customerName, date, time, service }) {
  return {
    subject: `📅 New booking — ${customerName}`,
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#171717;padding:32px 40px;text-align:center">
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">New Booking Received</h1>
        </div>
        <div style="padding:36px 40px">
          <p style="font-size:16px;color:#333;margin:0 0 24px">Hi ${businessName},</p>
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 28px">
            <strong style="color:#171717">${customerName}</strong> has booked an appointment with you.
          </p>
          <div style="background:#f4f4f4;border-radius:14px;padding:24px;margin-bottom:28px">
            <table style="width:100%;border-collapse:collapse">
              ${[
                ['👤 Customer', customerName],
                ['📅 Date',     date],
                ['🕐 Time',     time],
                ['💈 Service',  service],
              ].map(([label, val]) => `
                <tr>
                  <td style="padding:8px 0;font-size:13px;color:#888;font-weight:600;width:120px">${label}</td>
                  <td style="padding:8px 0;font-size:14px;color:#171717;font-weight:700">${val}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          <a href="https://subseat.co.uk/dashboard" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-align:center">
            View Dashboard
          </a>
        </div>
        <div style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
        </div>
      </div>
    `,
  };
}

function membershipStarted({ customerName, businessName, planName, price }) {
  return {
    subject: `🎉 Welcome to your ${planName} membership!`,
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);padding:32px 40px;text-align:center">
          <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0">You're a member! 🎉</h1>
        </div>
        <div style="padding:36px 40px">
          <p style="font-size:16px;color:#333;margin:0 0 24px">Hi ${customerName},</p>
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 28px">
            Welcome to your <strong style="color:#171717">${planName}</strong> membership at <strong style="color:#171717">${businessName}</strong>. You now have priority booking every month!
          </p>
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:24px;margin-bottom:28px;text-align:center">
            <div style="font-size:13px;color:#166534;margin-bottom:4px">Monthly subscription</div>
            <div style="font-size:36px;font-weight:900;color:#166534;letter-spacing:-1px">£${price}<span style="font-size:16px;font-weight:500">/mo</span></div>
          </div>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-align:center">
            Book Your First Appointment
          </a>
        </div>
        <div style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
        </div>
      </div>
    `,
  };
}

function appointmentReminder({ customerName, businessName, date, time, hoursAhead }) {
  return {
    subject: `⏰ Reminder: appointment ${hoursAhead===24?"tomorrow":"today"} at ${time}`,
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:#f59e0b;padding:32px 40px;text-align:center">
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">⏰ Appointment Reminder</h1>
        </div>
        <div style="padding:36px 40px">
          <p style="font-size:16px;color:#333;margin:0 0 20px">Hi ${customerName},</p>
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 24px">
            Just a reminder that your appointment at <strong style="color:#171717">${businessName}</strong> is ${hoursAhead===24?"tomorrow":"today"}.
          </p>
          <div style="background:#fef3c7;border-radius:14px;padding:24px;margin-bottom:28px;text-align:center">
            <div style="font-size:28px;font-weight:900;color:#92400e">${date}</div>
            <div style="font-size:22px;font-weight:700;color:#92400e;margin-top:4px">${time}</div>
          </div>
          <a href="https://subseat.co.uk/profile" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-align:center">
            View My Bookings
          </a>
        </div>
        <div style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
        </div>
      </div>
    `,
  };
}

function membershipUpsell({ customerName, businessName, planName, price, savings }) {
  return {
    subject: `💡 Save £${savings}/month with a ${businessName} membership`,
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:linear-gradient(135deg,#563BE7 0%,#7c5cff 100%);padding:32px 40px;text-align:center">
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">Enjoyed your visit? 💈</h1>
        </div>
        <div style="padding:36px 40px">
          <p style="font-size:16px;color:#333;margin:0 0 20px">Hi ${customerName},</p>
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 24px">
            Loved your visit to <strong style="color:#171717">${businessName}</strong>? Subscribe to the <strong>${planName}</strong> plan and save money every single month.
          </p>
          <div style="background:#E9E6FF;border-radius:14px;padding:24px;margin-bottom:24px;text-align:center">
            <div style="font-size:13px;color:#563BE7;font-weight:600;margin-bottom:8px">Monthly membership</div>
            <div style="font-size:36px;font-weight:900;color:#563BE7;letter-spacing:-1px">£${price}<span style="font-size:16px;font-weight:500">/mo</span></div>
            ${savings > 0 ? `<div style="font-size:13px;color:#22c55e;font-weight:700;margin-top:8px">Save ~£${savings}/month vs booking one-off</div>` : ''}
          </div>
          <a href="https://subseat.co.uk/discover" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-align:center;margin-bottom:12px">
            Join the Membership →
          </a>
          <p style="font-size:12px;color:#aaa;text-align:center;margin:0">Cancel anytime · No hidden fees</p>
        </div>
        <div style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
        </div>
      </div>
    `,
  };
}

function holidayDecision({ staffName, status, startDate, endDate, note }) {
  const approved = status === 'approved';
  return {
    subject: `${approved ? '✅' : '❌'} Holiday request ${approved ? 'approved' : 'rejected'}`,
    html: `
      <div style="font-family:Poppins,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <div style="background:${approved ? '#22c55e' : '#e53e3e'};padding:32px 40px;text-align:center">
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">Holiday Request ${approved ? 'Approved ✅' : 'Rejected ❌'}</h1>
        </div>
        <div style="padding:36px 40px">
          <p style="font-size:16px;color:#333;margin:0 0 20px">Hi ${staffName},</p>
          <p style="font-size:15px;color:#555;line-height:1.65;margin:0 0 24px">
            Your holiday request for <strong>${startDate}</strong> to <strong>${endDate}</strong> has been <strong>${status}</strong>.
          </p>
          ${note ? `<div style="background:#f4f4f4;border-radius:12px;padding:18px;margin-bottom:24px"><p style="font-size:14px;color:#555;margin:0">${note}</p></div>` : ''}
          <a href="https://subseat.co.uk/dashboard" style="display:block;background:#563BE7;color:#fff;text-decoration:none;padding:16px;border-radius:12px;font-weight:700;font-size:15px;text-align:center">
            View Dashboard
          </a>
        </div>
        <div style="padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center">
          <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
        </div>
      </div>
    `,
  };
}

/* ── PROCESS QUEUE ── */
async function processQueue(supabase) {
  const now = new Date().toISOString();

  const { data:pending } = await supabase
    .from("notification_queue")
    .select("*")
    .eq("status", "pending")
    .eq("channel", "email")
    .lte("scheduled_for", now)
    .limit(20);

  if (!pending?.length) return { processed:0, errors:[] };

  const errors = [];
  let processed = 0;

  for (const notif of pending) {
    try {
      let emailContent = null;

      switch (notif.notification_type) {
        case "booking_confirmation_customer":
          emailContent = bookingConfirmationCustomer({
            customerName: notif.message?.match(/Hi (.+?),/)?.[1] || "there",
            businessName: notif.subject?.replace("Booking confirmed with ", "") || "the business",
            date: "See your booking details",
            time: "",
            service: "",
          });
          emailContent.subject = notif.subject || emailContent.subject;
          break;

        case "booking_confirmation_business":
          emailContent = bookingConfirmationBusiness({
            businessName: "Your Business",
            customerName: notif.subject?.replace("New booking from ", "") || "A customer",
            date: "",
            time: "",
            service: "",
          });
          emailContent.subject = notif.subject || emailContent.subject;
          break;

        case "membership_started":
          emailContent = {
            subject: notif.subject || "Welcome to your membership!",
            html: `<div style="font-family:Poppins,sans-serif;padding:40px;max-width:560px;margin:0 auto">${notif.message}</div>`,
          };
          break;

        case "booking_reminder_24h":
          emailContent = {
            subject: notif.subject || "⏰ Reminder: appointment tomorrow",
            html: `<div style="font-family:Poppins,sans-serif;padding:40px;max-width:560px;margin:0 auto">${notif.message}</div>`,
          };
          break;

        case "membership_upsell_day_7":
          emailContent = {
            subject: notif.subject || "💡 Save with a membership",
            html: `<div style="font-family:Poppins,sans-serif;padding:40px;max-width:560px;margin:0 auto">${notif.message}</div>`,
          };
          break;

        case "holiday_decision":
          emailContent = {
            subject: notif.subject || "Holiday request update",
            html: `<div style="font-family:Poppins,sans-serif;padding:40px;max-width:560px;margin:0 auto">${notif.message}</div>`,
          };
          break;

        default:
          // Generic email for any other type
          emailContent = {
            subject: notif.subject || "Message from SubSeat",
            html: `<div style="font-family:Poppins,sans-serif;padding:40px;max-width:560px;margin:0 auto;line-height:1.65;color:#333">${notif.message}</div>`,
          };
      }

      if (!emailContent || !notif.recipient) {
        await supabase.from("notification_queue").update({ status:"cancelled" }).eq("id", notif.id);
        continue;
      }

      // Send via Resend
      const { error:sendError } = await resend.emails.send({
        from:    FROM,
        to:      notif.recipient,
        subject: emailContent.subject,
        html:    emailContent.html,
      });

      if (sendError) {
        await supabase.from("notification_queue").update({
          status:        "failed",
          error_message: sendError.message,
        }).eq("id", notif.id);
        errors.push({ id:notif.id, error:sendError.message });
      } else {
        await supabase.from("notification_queue").update({
          status:  "sent",
          sent_at: new Date().toISOString(),
        }).eq("id", notif.id);
        processed++;
      }

    } catch (err) {
      await supabase.from("notification_queue").update({
        status:        "failed",
        error_message: err.message,
      }).eq("id", notif.id);
      errors.push({ id:notif.id, error:err.message });
    }
  }

  return { processed, errors };
}

/* ── ROUTE HANDLER ── */
export async function POST(request) {
  try {
    // Verify this is coming from Supabase or our own cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error:"Unauthorized" }, { status:401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const result = await processQueue(supabase);

    return Response.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("Email queue error:", err);
    return Response.json({ error:err.message }, { status:500 });
  }
}

// Also allow GET for easy testing
export async function GET() {
  return Response.json({
    status: "SubSeat Email Queue",
    info:   "POST to this endpoint to process pending emails",
    from:   FROM,
  });
}