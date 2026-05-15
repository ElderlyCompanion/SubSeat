import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe   = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { businessId, businessName, email, action } = await req.json();

    // GET DASHBOARD LINK for already connected account
    if (action === "dashboard") {
      const { data: biz } = await supabase
        .from("businesses")
        .select("stripe_account_id")
        .eq("id", businessId)
        .maybeSingle();

      if (!biz?.stripe_account_id) {
        return Response.json({ error: "No Stripe account found" }, { status: 400 });
      }

      const loginLink = await stripe.accounts.createLoginLink(biz.stripe_account_id);
      return Response.json({ url: loginLink.url });
    }

    // CHECK existing account
    const { data: existingBiz } = await supabase
      .from("businesses")
      .select("stripe_account_id, stripe_account_status")
      .eq("id", businessId)
      .maybeSingle();

    let accountId = existingBiz?.stripe_account_id;

    // CREATE new Connect account if none exists
    if (!accountId) {
      const account = await stripe.accounts.create({
        type:         "express",
        country:      "GB",
        email:        email,
        capabilities: {
          card_payments: { requested: true },
          transfers:     { requested: true },
        },
        business_profile: {
          name: businessName,
          url:  `https://subseat.co.uk`,
        },
        metadata: { businessId, businessName },
      });

      accountId = account.id;

      // Save to Supabase
      await supabase
        .from("businesses")
        .update({
          stripe_account_id:     accountId,
          stripe_account_status: "pending",
        })
        .eq("id", businessId);
    }

    // CREATE onboarding link
    const accountLink = await stripe.accountLinks.create({
      account:     accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/dashboard?connect=refresh`,
      return_url:  `${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/dashboard?connect=success`,
      type:        "account_onboarding",
    });

    return Response.json({ url: accountLink.url });
  } catch(err) {
    console.error("Stripe Connect error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    const { data: biz } = await supabase
      .from("businesses")
      .select("stripe_account_id, stripe_account_status")
      .eq("id", businessId)
      .maybeSingle();

    if (!biz?.stripe_account_id) {
      return Response.json({ status: "not_connected" });
    }

    // Check account status with Stripe
    const account = await stripe.accounts.retrieve(biz.stripe_account_id);
    const status  = account.charges_enabled ? "active" : "pending";

    // Update in Supabase if changed
    if (status !== biz.stripe_account_status) {
      await supabase
        .from("businesses")
        .update({ stripe_account_status: status })
        .eq("id", businessId);
    }

    return Response.json({
      status,
      charges_enabled:  account.charges_enabled,
      payouts_enabled:  account.payouts_enabled,
      details_submitted: account.details_submitted,
    });
  } catch(err) {
    console.error("Stripe Connect status error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}