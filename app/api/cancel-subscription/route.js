import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { subscriptionId, customerId } = await req.json();

    if (!subscriptionId) {
      return Response.json({ error: "No subscription ID provided" }, { status: 400 });
    }

    // Get subscription from Supabase to verify ownership
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*, businesses(business_name)")
      .eq("id", subscriptionId)
      .maybeSingle();

    if (!sub) {
      return Response.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Cancel in Stripe at period end (they keep access until billing period ends)
    if (sub.stripe_subscription_id) {
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    }

    // Update in Supabase
    await supabase
      .from("subscriptions")
      .update({
        status:       "cancelling",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId);

    return Response.json({
      success: true,
      message: "Subscription cancelled. You keep access until the end of your billing period.",
    });
  } catch(err) {
    console.error("Cancel subscription error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}