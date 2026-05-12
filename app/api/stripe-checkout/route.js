import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const {
      businessId,
      businessName,
      businessSlug,
      businessCategory,
      planName,
      price,        // in pence e.g. 4900 = £49
      customerEmail,
      customerName,
    } = await req.json();

    // Create or retrieve Stripe product
    const product = await stripe.products.create({
      name:     `${planName} — ${businessName}`,
      metadata: { businessId, businessSlug, businessCategory },
    });

    // Create price object
    const stripePrice = await stripe.prices.create({
      product:     product.id,
      unit_amount: Math.round(price * 100), // convert £ to pence
      currency:    "gbp",
      recurring:   { interval: "month" },
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode:               "subscription",
      payment_method_types: ["card"],
      line_items: [{
        price:    stripePrice.id,
        quantity: 1,
      }],
      customer_email: customerEmail || undefined,
      metadata: {
        businessId,
        businessName,
        businessSlug,
        businessCategory,
        planName,
        customerName: customerName || "",
      },
      subscription_data: {
        metadata: {
          businessId,
          businessName,
          planName,
          subSeatFeePercent: "6",
        },
        application_fee_percent: 6, // SubSeat 6% fee
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/subscribe/success?session_id={CHECKOUT_SESSION_ID}&business=${businessSlug}&category=${businessCategory}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/${businessCategory}/${businessSlug}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return Response.json({ url: session.url, sessionId: session.id });
  } catch(err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}