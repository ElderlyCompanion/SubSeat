import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch(err) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch(event.type) {

      /* ── SUBSCRIPTION CREATED / PAYMENT SUCCESS ── */
      case "checkout.session.completed": {
        const session = event.data.object;
        const meta    = session.metadata || {};

        if (session.mode === "subscription") {
          // Save subscription to Supabase
          const { error } = await supabase.from("subscriptions").insert({
            business_id:         meta.businessId,
            stripe_subscription_id: session.subscription,
            stripe_customer_id:  session.customer,
            customer_email:      session.customer_email,
            customer_name:       meta.customerName || "",
            plan_name:           meta.planName || "Subscription",
            monthly_price:       session.amount_total / 100,
            status:              "active",
            started_at:          new Date().toISOString(),
          });

          if (error) console.error("Supabase subscription insert error:", error);

          // Notify business of new subscriber
          if (meta.businessId) {
            const { data: biz } = await supabase
              .from("businesses")
              .select("business_name, email, id")
              .eq("id", meta.businessId)
              .maybeSingle();

            if (biz) {
              await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/api/notify-business`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type:     "subscriber",
                  business: { id: biz.id, business_name: biz.business_name, owner_email: biz.email },
                  customer: { name: meta.customerName, email: session.customer_email },
                  subscription: {
                    plan_name:     meta.planName,
                    monthly_price: session.amount_total / 100,
                  },
                }),
              }).catch(() => {});
            }
          }
        }
        break;
      }

      /* ── SUBSCRIPTION CANCELLED ── */
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      /* ── PAYMENT FAILED ── */
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", invoice.subscription);

        // Email customer about failed payment
        if (invoice.customer_email) {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/api/payment-failed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email:  invoice.customer_email,
              amount: invoice.amount_due / 100,
            }),
          }).catch(() => {});
        }
        break;
      }

      /* ── SUBSCRIPTION RENEWED ── */
      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.billing_reason === "subscription_cycle") {
          await supabase
            .from("subscriptions")
            .update({ status: "active", last_payment: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch(err) {
    console.error("Webhook handler error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}