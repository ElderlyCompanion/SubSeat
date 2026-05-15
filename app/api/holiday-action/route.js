import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action    = searchParams.get("action");
    const bookingId = searchParams.get("booking");
    const email     = searchParams.get("email");

    if (!action || !bookingId) {
      return NextResponse.redirect(`${SITE}?error=invalid_link`);
    }

    // Get booking details
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, businesses(business_name, slug, category)")
      .eq("id", bookingId)
      .maybeSingle();

    if (!booking) {
      return NextResponse.redirect(`${SITE}?error=booking_not_found`);
    }

    const bizSlug     = booking.businesses?.slug;
    const bizCategory = booking.businesses?.category;
    const bizName     = booking.businesses?.business_name;

    if (action === "carry_over") {
      // Mark booking as carried over
      await supabase
        .from("bookings")
        .update({
          status: "carried_over",
          notes:  (booking.notes || "") + " [Carried over due to holiday]",
        })
        .eq("id", bookingId);

      // Redirect to confirmation page
      return NextResponse.redirect(
        `${SITE}/holiday-response?action=carry_over&business=${bizName || "your professional"}`
      );
    }

    if (action === "cancel_visit") {
      // Mark just this visit as cancelled
      await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          notes:  (booking.notes || "") + " [Cancelled by customer due to holiday]",
        })
        .eq("id", bookingId);

      return NextResponse.redirect(
        `${SITE}/holiday-response?action=cancel_visit&business=${bizName || "your professional"}`
      );
    }

    // Fallback
    return NextResponse.redirect(`${SITE}`);

  } catch(err) {
    console.error("Holiday action error:", err);
    return NextResponse.redirect(`${SITE}?error=something_went_wrong`);
  }
}