//@ts-nocheck

import config from "../../config";
import Doctor from "../../modules/Doctor/doctor.model";
import stripe from "./stripe";
const baseUrl = config.local_base_frontend_url;
// checkout url
export const handleCheckoutStripe = async (payload: any) => {
  const { productId, customerId } = payload;

  const prices = await stripe.prices.list({
    product: productId,
    active: true,
  });

  const priceId = prices.data[0].id;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    metadata: {
      planId: "1546",
      customerId: customerId,
    },
  });

  return session.url;
};

// Webhook handler

function toDate(timestamp: number | null | undefined): Date | null {
  return timestamp ? new Date(timestamp * 1000) : null;
}

// Helper: calculate period end based on billing_cycle_anchor + plan interval
function getPeriodEnd(
  billingCycleAnchor: number | null | undefined,
  interval: string | null | undefined,
  intervalCount: number | null | undefined
): Date | null {
  if (!billingCycleAnchor || !interval || !intervalCount) return null;

  const startDate = new Date(billingCycleAnchor * 1000);
  const periodEnd = new Date(startDate);

  switch (interval) {
    case "day":
      periodEnd.setDate(periodEnd.getDate() + intervalCount);
      break;
    case "week":
      periodEnd.setDate(periodEnd.getDate() + 7 * intervalCount);
      break;
    case "month":
      periodEnd.setMonth(periodEnd.getMonth() + intervalCount);
      break;
    case "year":
      periodEnd.setFullYear(periodEnd.getFullYear() + intervalCount);
      break;
    default:
      return null;
  }

  return periodEnd;
}

export const handleStripeWebhook = async (req: any) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    if (!req.rawBody) throw new Error("No raw body provided");

    console.log("📩 Received Stripe Event");

    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const data = event.data.object as any;
    const eventType = event.type;

    console.log(`📦 Event Type: ${eventType}`);
    console.log("📄 Metadata:", data.metadata);

    switch (eventType) {
      case "checkout.session.completed":
        if (data.mode === "subscription") {
          const customerId = data?.metadata?.customerId;
          if (!customerId) {
            console.error("❌ Missing metadata.customerId");
            break;
          }

          const subscription = await stripe.subscriptions.retrieve(
            data.subscription
          );

          // Calculate base period start and end from Stripe
          const periodStart = toDate(subscription.start_date);
          const basePeriodEnd = getPeriodEnd(
            subscription.billing_cycle_anchor,
            subscription.plan?.interval,
            subscription.plan?.interval_count
          );

          let extendedPeriodEnd = basePeriodEnd;

          // Fetch the doctor to check if previous subscription still has time left
          const existingDoctor = await Doctor.findOne({
            stripeCustomerId: customerId,
          });

          if (existingDoctor?.subscription?.periodEnd) {
            const now = new Date();
            const prevPeriodEnd = new Date(
              existingDoctor.subscription.periodEnd
            );

            if (prevPeriodEnd > now) {
              const remainingDays = Math.ceil(
                (prevPeriodEnd.getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              // Extend the base period end by remaining days
              extendedPeriodEnd = new Date(basePeriodEnd);
              extendedPeriodEnd.setDate(
                extendedPeriodEnd.getDate() + remainingDays
              );

              console.log(
                `📆 Adding ${remainingDays} leftover days to new subscription.`
              );
            }
          }

          const updatedDoctor = await Doctor.findOneAndUpdate(
            { stripeCustomerId: customerId },
            {
              $set: {
                "subscription.status":
                  data.payment_status === "paid" ? "active" : "pending",
                "subscription.stripeSubscriptionId": data.subscription,
                "subscription.checkoutSessionId": data.id,
                "subscription.planId": data.metadata?.planId || null,
                "subscription.amount": data.amount_total,
                "subscription.currency": data.currency,
                "subscription.created": toDate(data.created),
                "subscription.trialStart": null,
                "subscription.trialEnd": null,
                "subscription.periodStart": periodStart,
                "subscription.periodEnd": extendedPeriodEnd,
                "subscription.currentPeriodEnd": extendedPeriodEnd,
              },
            },
            { new: true, upsert: false }
          );

          if (!updatedDoctor) {
            console.error(`❌ No doctor found for customerId: ${customerId}`);
          } else {
            console.log(`✅ Checkout updated Doctor ID: ${updatedDoctor._id}`);
          }
        }
          
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        {
          console.log("📦 Handling Subscription Create/Update");

          // subscription object in data
          const subscription = data;

          const periodStart = toDate(subscription.start_date);
          const periodEnd = getPeriodEnd(
            subscription.billing_cycle_anchor,
            subscription.plan?.interval,
            subscription.plan?.interval_count
          );

          await Doctor.findOneAndUpdate(
            { stripeCustomerId: subscription.customer },
            {
              $set: {
                "subscription.status": subscription.status,
                "subscription.periodStart": periodStart,
                "subscription.periodEnd": periodEnd,
                "subscription.currentPeriodEnd": periodEnd,
                "subscription.planId":
                  subscription.plan?.id ||
                  subscription.items?.data[0]?.price?.id ||
                  null,
                "subscription.stripeSubscriptionId": subscription.id,
                ...(subscription.status === "trialing" && {
                  "subscription.trialStart": toDate(subscription.trial_start),
                  "subscription.trialEnd": toDate(subscription.trial_end),
                }),
                ...(subscription.status !== "trialing" && {
                  "subscription.trialStart": null,
                  "subscription.trialEnd": null,
                }),
              },
            },
            { new: true }
          ).then((updated) => {
            if (!updated) {
              console.error(`❌ No doctor found for ${subscription.customer}`);
            } else {
              console.log(`✅ Subscription updated for ${updated._id}`);
            }
          });
        }
        break;

      case "customer.subscription.deleted":
      case "invoice.payment_failed":
        console.warn(
          `⚠️ Subscription ${eventType} for customer ${data.customer}`
        );
        await Doctor.findOneAndUpdate(
          { stripeCustomerId: data.customer },
          {
            $set: {
              "subscription.status": "cancelled",
              "subscription.periodStart": null,
              "subscription.periodEnd": null,
              "subscription.trialStart": null,
              "subscription.trialEnd": null,
            },
          },
          { new: true }
        ).then((updated) => {
          if (!updated) {
            console.error(`❌ No doctor found to cancel for ${data.customer}`);
          } else {
            console.log(`✅ Subscription cancelled for ${updated._id}`);
          }
        });
        break;

      default:
        console.log(`ℹ️ Unhandled Stripe event type: ${eventType}`);
    }

    return { received: true };
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return { received: false, error: err.message };
  }
};
