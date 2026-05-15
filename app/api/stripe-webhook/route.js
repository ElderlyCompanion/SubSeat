import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  let body;
  let signature;

  try {
    body      = await req.text();
    signature = req.headers.get("stripe-signature");
  } catch(err) {
    console.error("Failed to read webhook body:", err);
    return new Response("Failed to read body", { status: 400 });
  }

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

  console.log("Webhook received:", event.type);

  try {
    switch(event.type) {

      case "account.updated": {
        const account = event.data.object;
        const status  = account.charges_enabled ? "active" : "pending";
        await supabase
          .from("businesses")
          .update({ stripe_account_status: status })
          .eq("stripe_account_id", account.id);
        console.log("Connect account updated:", account.id, status);
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object;
        const meta    = session.metadata || {};
        console.log("Checkout completed:", session.id, "mode:", session.mode);

        if (session.mode === "subscription") {
          const monthlyPrice = session.amount_total / 100;

          const { error } = await supabase.from("subscriptions").insert({
            business_id:            meta.businessId,
            customer_id:            null,
            service_id:             null,
            stripe_subscription_id: session.subscription,
            stripe_customer_id:     session.customer,
            customer_email:         session.customer_email,
            customer_name:          meta.customerName || "",
            plan_name:              meta.planName || "Subscription",
            monthly_price:          monthlyPrice,
            subseat_fee:            Math.round(monthlyPrice * 0.06 * 100) / 100,
            status:                 "active",
            started_at:             new Date().toISOString(),
          });

          if (error) {
            console.error("Supabase insert error:", error);
          } else {
            console.log("Subscription saved to Supabase");
          }

          // Notify business
          if (meta.businessId) {
            const { data: biz } = await supabase
              .from("businesses")
              .select("business_name, email, id")
              .eq("id", meta.businessId)
              .maybeSingle();

            if (biz) {
              await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/api/notify-business`,
                {
                  method:  "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type:     "subscriber",
                    business: { id: biz.id, business_name: biz.business_name, owner_email: biz.email },
                    customer: { name: meta.customerName || session.customer_email, email: session.customer_email },
                    subscription: {
                      plan_name:     meta.planName,
                      monthly_price: monthlyPrice,
                    },
                  }),
                }
              ).catch(e => console.error("Notify business error:", e));
            }
          }

          // Send confirmation email to customer
          await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "https://subseat.co.uk"}/api/booking-confirm`,
            {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerName:  meta.customerName || "Subscriber",
                customerEmail: session.customer_email,
                businessName:  meta.businessName || "",
                serviceName:   meta.planName || "Subscription",
                dateStr:       "Your subscription is now active",
                time:          "",
                isMobile:      false,
              }),
            }
          ).catch(e => console.error("Confirmation email error:", e));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        console.log("Subscription cancelled:", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", invoice.subscription);
        console.log("Payment failed:", invoice.subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.billing_reason === "subscription_cycle") {
          await supabase
            .from("subscriptions")
            .update({ status: "active", last_payment: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription);
          console.log("Subscription renewed:", invoice.subscription);
        }
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

    return Response.json({ received: true });
  } catch(err) {
    console.error("Webhook handler error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}