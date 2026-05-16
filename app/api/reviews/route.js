import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);
const SITE   = process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk";

export async function POST(req) {
  try {
    const { businessId, customerEmail, customerName, rating, comment, bookingId } = await req.json();

    if (!businessId || !rating || rating < 1 || rating > 5) {
      return Response.json({ error: "Invalid review data" }, { status: 400 });
    }

    // Check for duplicate review
    if (bookingId) {
      const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("booking_id", bookingId)
        .maybeSingle();
      if (existing) {
        return Response.json({ error: "Review already submitted for this booking" }, { status: 400 });
      }
    }

    // Save review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        business_id:    businessId,
        customer_email: customerEmail || null,
        customer_name:  customerName  || "Anonymous",
        rating:         parseInt(rating),
        comment:        comment || "",
        booking_id:     bookingId || null,
        is_visible:     true,
        status:         "published",
      })
      .select()
      .single();

    if (error) throw error;

    // Update business average rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("business_id", businessId)
      .eq("is_visible", true);

    if (allReviews && allReviews.length > 0) {
      const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
      await supabase
        .from("businesses")
        .update({
          rating:       Math.round(avg * 10) / 10,
          review_count: allReviews.length,
        })
        .eq("id", businessId);
    }

    // Notify business of new review
    const { data: biz } = await supabase
      .from("businesses")
      .select("business_name, email")
      .eq("id", businessId)
      .maybeSingle();

    if (biz?.email) {
      const stars = "⭐".repeat(parseInt(rating));
      await resend.emails.send({
        from:    "SubSeat <hello@subseat.co.uk>",
        to:      [biz.email],
        subject: `${stars} New ${rating}-star review on SubSeat`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#563BE7;">New Review for ${biz.business_name}</h2>
            <div style="background:#f8f6ff;border-radius:12px;padding:20px;margin:16px 0;">
              <div style="font-size:28px;margin-bottom:8px;">${stars}</div>
              <div style="font-weight:700;color:#171717;margin-bottom:4px;">${customerName || "Anonymous"}</div>
              ${comment ? `<p style="color:#555;line-height:1.6;">"${comment}"</p>` : ""}
            </div>
            <a href="${SITE}/dashboard" style="background:#563BE7;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
              View Dashboard →
            </a>
          </div>
        `,
      }).catch(() => {});
    }

    return Response.json({ success: true, review });
  } catch(err) {
    console.error("Review submit error:", err);
    return Response.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Response.json({ reviews: reviews || [] });
  } catch(err) {
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}