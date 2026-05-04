import { createClient } from '@supabase/supabase-js';

/* ── Runs daily at 8am ── */
/* Queues reminder emails for appointments in the next 24 hours */

function isAuthorised(request) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  if (request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`) return true;
  return false;
}

export async function GET(request) {
  if (!isAuthorised(request)) {
    return Response.json({ error:"Unauthorised" }, { status:401 });
  }

  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const now       = new Date();
    const in24hrs   = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25hrs   = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Get bookings happening in the next 24 hours
    const { data: bookings } = await db
      .from("bookings")
      .select("*, businesses(business_name, email), profiles(email, full_name)")
      .eq("status", "confirmed")
      .gte("start_time", in24hrs.toISOString())
      .lte("start_time", in25hrs.toISOString());

    if (!bookings?.length) {
      return Response.json({ ok:true, queued:0, message:"No upcoming bookings to remind" });
    }

    let queued = 0;

    for (const booking of bookings) {
      const customerEmail = booking.profiles?.email;
      const customerName  = booking.profiles?.full_name || "there";
      const businessName  = booking.businesses?.business_name || "your appointment";
      const apptTime      = new Date(booking.start_time).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
      const apptDate      = new Date(booking.start_time).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" });

      if (!customerEmail) continue;

      // Check we haven't already queued this reminder
      const { data: existing } = await db
        .from("notification_queue")
        .select("id")
        .eq("notification_type", "booking_reminder_24h")
        .eq("recipient", customerEmail)
        .gte("created_at", new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString())
        .maybeSingle();

      if (existing) continue;

      await db.from("notification_queue").insert({
        business_id:       booking.business_id,
        notification_type: "booking_reminder_24h",
        recipient:         customerEmail,
        subject:           `⏰ Reminder: appointment tomorrow at ${apptTime}`,
        message:           `Hi ${customerName}, just a reminder that your appointment at <strong>${businessName}</strong> is tomorrow — <strong>${apptDate} at ${apptTime}</strong>. See you soon! ✂️`,
        status:            "pending",
        channel:           "email",
        scheduled_for:     new Date().toISOString(),
      });

      queued++;
    }

    console.log(`[Reminder Cron] Queued ${queued} reminders`);

    return Response.json({
      ok:        true,
      queued,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("[Reminder Cron Error]", err);
    return Response.json({ ok:false, error:err.message }, { status:500 });
  }
}