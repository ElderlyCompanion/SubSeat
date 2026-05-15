import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk";
const FEE  = 6; // SubSeat 6% platform fee

export async function POST(req) {
  try {
    const {
      businessId, businessName, businessSlug,
      businessCategory, planName, price,
      customerEmail, customerName,
    } = await req.json();

    if (!businessId || !planName || !price || price <= 0) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if business has active Stripe Connect account
    const { data: biz } = await supabase
      .from("businesses")
      .select("stripe_account_id, stripe_account_status")
      .eq("id", businessId)
      .maybeSingle();

    const hasConnect     = biz?.stripe_account_id && biz?.stripe_account_status === "active";
    const stripeAccount  = biz?.stripe_account_id;

    // Create Stripe product + price
    const product = await stripe.products.create({
      name:     `${planName} — ${businessName}`,
      metadata: { businessId, businessSlug, businessCategory },
    });

    const stripePrice = await stripe.prices.create({
      product:     product.id,
      unit_amount: Math.round(price * 100),
      currency:    "gbp",
      recurring:   { interval: "month" },
    });

    // Build session
    const subscriptionData = {
      metadata: {
        businessId,
        businessName,
        planName,
        subSeatFeePercent: String(FEE),
        hasConnect:        hasConnect ? "true" : "false",
      },
    };

    // If business has Connect — auto split payments
    if (hasConnect && stripeAccount) {
      subscriptionData.application_fee_percent = FEE;
      subscriptionData.transfer_data           = { destination: stripeAccount };
    }

    const session = await stripe.checkout.sessions.create({
      mode:                       "subscription",
      payment_method_types:       ["card"],
      line_items:                 [{ price: stripePrice.id, quantity: 1 }],
      metadata: {
        businessId, businessName, businessSlug,
        businessCategory, planName,
        customerName: customerName || "",
      },
      subscription_data: subscriptionData,
      success_url: `${SITE}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&business=${businessSlug}&category=${businessCategory}`,
      cancel_url:  `${SITE}/${businessCategory}/${businessSlug}`,
      allow_promotion_codes:      true,
      billing_address_collection: "auto",
    });

    return Response.json({ url: session.url, sessionId: session.id, hasConnect });
  } catch(err) {
    console.error("Checkout error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}