import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fmt = n => `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function POST(req) {
  try {
    const { type, business, customer, booking, subscription } = await req.json();

    let title   = "";
    let message = "";
    let subject = "";
    let html    = "";

    /* ── NEW SUBSCRIBER ── */
    if (type === "subscriber") {
      title   = `New subscriber: ${customer?.name || customer?.email}`;
      message = `${customer?.name || "A new customer"} just subscribed to ${subscription?.plan_name || "your plan"} for ${fmt(subscription?.monthly_price || 0)}/month.`;
      subject = `🎉 New subscriber on SubSeat — ${customer?.name || customer?.email}`;
      html = `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(86,59,231,.12)">
          <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:28px 32px;text-align:center">
            <div style="font-size:44px;margin-bottom:8px">🎉</div>
            <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">New Subscriber!</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Hi <strong>${business?.business_name}</strong>,
            </p>
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Great news! <strong>${customer?.name || customer?.email}</strong> just subscribed to your SubSeat plan.
            </p>
            <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Customer</td><td style="font-size:14px;color:#171717;font-weight:700">${customer?.name || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Email</td><td style="font-size:14px;color:#171717;font-weight:700">${customer?.email || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Plan</td><td style="font-size:14px;color:#171717;font-weight:700">${subscription?.plan_name || "Subscription"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Monthly value</td><td style="font-size:16px;color:#22c55e;font-weight:900">${fmt(subscription?.monthly_price || 0)}/mo</td></tr>
              </table>
            </div>
            <div style="text-align:center">
              <a href="https://subseat.co.uk/dashboard" style="display:inline-block;background:#563BE7;color:#fff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif">
                View Dashboard →
              </a>
            </div>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
          </div>
        </div>
        </body></html>
      `;
    }

    /* ── NEW BOOKING ── */
    if (type === "booking") {
      const dateStr = booking?.start_time ? new Date(booking.start_time).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" }) : "—";
      const timeStr = booking?.start_time ? new Date(booking.start_time).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) : "—";
      title   = `New booking: ${customer?.name || customer?.email}`;
      message = `${customer?.name || "A customer"} booked ${booking?.service_name || "a service"} on ${dateStr} at ${timeStr}.`;
      subject = `📅 New booking on SubSeat — ${customer?.name || customer?.email}`;
      html = `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(86,59,231,.12)">
          <div style="background:linear-gradient(135deg,#563BE7,#7c3aed);padding:28px 32px;text-align:center">
            <div style="font-size:44px;margin-bottom:8px">📅</div>
            <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">New Booking!</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Hi <strong>${business?.business_name}</strong>, you have a new booking.
            </p>
            <div style="background:#f4f0ff;border:1.5px solid #ede9ff;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Customer</td><td style="font-size:14px;color:#171717;font-weight:700">${customer?.name || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Email</td><td style="font-size:14px;color:#171717;font-weight:700">${customer?.email || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Service</td><td style="font-size:14px;color:#171717;font-weight:700">${booking?.service_name || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Date</td><td style="font-size:14px;color:#563BE7;font-weight:800">${dateStr}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Time</td><td style="font-size:14px;color:#563BE7;font-weight:800">${timeStr}</td></tr>
                ${booking?.customer_address ? `<tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Address</td><td style="font-size:14px;color:#171717;font-weight:700">${booking.customer_address}</td></tr>` : ""}
              </table>
            </div>
            <div style="text-align:center">
              <a href="https://subseat.co.uk/dashboard" style="display:inline-block;background:#563BE7;color:#fff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif">
                View Dashboard →
              </a>
            </div>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
          </div>
        </div>
        </body></html>
      `;
    }

    /* ── CANCELLATION ── */
    if (type === "cancellation") {
      const dateStr = booking?.start_time ? new Date(booking.start_time).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" }) : "—";
      const timeStr = booking?.start_time ? new Date(booking.start_time).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" }) : "—";
      title   = `Cancellation: ${customer?.name || customer?.email}`;
      message = `${customer?.name || "A customer"} cancelled their ${booking?.service_name || "booking"} on ${dateStr} at ${timeStr}.`;
      subject = `❌ Booking cancelled — ${customer?.name || customer?.email}`;
      html = `
        <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0eeff;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:24px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(86,59,231,.12)">
          <div style="background:linear-gradient(135deg,#e53e3e,#c53030);padding:28px 32px;text-align:center">
            <div style="font-size:44px;margin-bottom:8px">❌</div>
            <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">Booking Cancelled</h1>
          </div>
          <div style="padding:28px 32px">
            <p style="font-size:15px;color:#555;line-height:1.7;margin:0 0 20px">
              Hi <strong>${business?.business_name}</strong>, a booking has been cancelled.
            </p>
            <div style="background:#fff5f5;border:1.5px solid #ffcccc;border-radius:14px;padding:20px 24px;margin-bottom:20px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Customer</td><td style="font-size:14px;color:#171717;font-weight:700">${customer?.name || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Service</td><td style="font-size:14px;color:#171717;font-weight:700">${booking?.service_name || "—"}</td></tr>
                <tr><td style="font-size:13px;color:#888;padding:6px 0;font-weight:600">Was booked for</td><td style="font-size:14px;color:#e53e3e;font-weight:800">${dateStr} at ${timeStr}</td></tr>
              </table>
            </div>
            <p style="font-size:13px;color:#888;line-height:1.6;margin:0 0 20px">
              The slot is now free. You may want to reach out to other customers or update your availability.
            </p>
            <div style="text-align:center">
              <a href="https://subseat.co.uk/dashboard" style="display:inline-block;background:#563BE7;color:#fff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:700;font-size:14px;font-family:Arial,sans-serif">
                View Dashboard →
              </a>
            </div>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #f0f0f0;text-align:center">
            <p style="font-size:12px;color:#aaa;margin:0">SubSeat · <a href="https://subseat.co.uk" style="color:#563BE7">subseat.co.uk</a></p>
          </div>
        </div>
        </body></html>
      `;
    }

    if (!title) return Response.json({ error: "Unknown notification type" }, { status: 400 });

    /* ── SAVE TO SUPABASE ── */
    await supabase.from("business_notifications").insert({
      business_id: business?.id,
      type,
      title,
      message,
      read: false,
    });

    /* ── SEND EMAIL ── */
    if (business?.owner_email) {
      await resend.emails.send({
        from:    "SubSeat <hello@subseat.co.uk>",
        to:      [business.owner_email],
        subject,
        html,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Notify business error:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}