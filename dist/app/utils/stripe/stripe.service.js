"use strict";
//@ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.handleCheckoutStripe = void 0;
const config_1 = __importDefault(require("../../config"));
const doctor_model_1 = __importDefault(require("../../modules/Doctor/doctor.model"));
const stripe_1 = __importDefault(require("./stripe"));
const baseUrl = config_1.default.local_base_frontend_url;
// checkout url
const handleCheckoutStripe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, customerId } = payload;
    const prices = yield stripe_1.default.prices.list({
        product: productId,
        active: true,
    });
    const priceId = prices.data[0].id;
    const session = yield stripe_1.default.checkout.sessions.create({
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
});
exports.handleCheckoutStripe = handleCheckoutStripe;
// Webhook handler
function toDate(timestamp) {
    return timestamp ? new Date(timestamp * 1000) : null;
}
// Helper: calculate period end based on billing_cycle_anchor + plan interval
function getPeriodEnd(billingCycleAnchor, interval, intervalCount) {
    if (!billingCycleAnchor || !interval || !intervalCount)
        return null;
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
const handleStripeWebhook = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        if (!req.rawBody)
            throw new Error("No raw body provided");
        console.log("📩 Received Stripe Event");
        event = stripe_1.default.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        const data = event.data.object;
        const eventType = event.type;
        console.log(`📦 Event Type: ${eventType}`);
        console.log("📄 Metadata:", data.metadata);
        switch (eventType) {
            case "checkout.session.completed":
                if (data.mode === "subscription") {
                    const customerId = (_a = data === null || data === void 0 ? void 0 : data.metadata) === null || _a === void 0 ? void 0 : _a.customerId;
                    if (!customerId) {
                        console.error("❌ Missing metadata.customerId");
                        break;
                    }
                    const subscription = yield stripe_1.default.subscriptions.retrieve(data.subscription);
                    // Calculate base period start and end from Stripe
                    const periodStart = toDate(subscription.start_date);
                    const basePeriodEnd = getPeriodEnd(subscription.billing_cycle_anchor, (_b = subscription.plan) === null || _b === void 0 ? void 0 : _b.interval, (_c = subscription.plan) === null || _c === void 0 ? void 0 : _c.interval_count);
                    let extendedPeriodEnd = basePeriodEnd;
                    // Fetch the doctor to check if previous subscription still has time left
                    const existingDoctor = yield doctor_model_1.default.findOne({
                        stripeCustomerId: customerId,
                    });
                    if ((_d = existingDoctor === null || existingDoctor === void 0 ? void 0 : existingDoctor.subscription) === null || _d === void 0 ? void 0 : _d.periodEnd) {
                        const now = new Date();
                        const prevPeriodEnd = new Date(existingDoctor.subscription.periodEnd);
                        if (prevPeriodEnd > now) {
                            const remainingDays = Math.ceil((prevPeriodEnd.getTime() - now.getTime()) /
                                (1000 * 60 * 60 * 24));
                            // Extend the base period end by remaining days
                            extendedPeriodEnd = new Date(basePeriodEnd);
                            extendedPeriodEnd.setDate(extendedPeriodEnd.getDate() + remainingDays);
                            console.log(`📆 Adding ${remainingDays} leftover days to new subscription.`);
                        }
                    }
                    const updatedDoctor = yield doctor_model_1.default.findOneAndUpdate({ stripeCustomerId: customerId }, {
                        $set: {
                            "subscription.status": data.payment_status === "paid" ? "active" : "pending",
                            "subscription.stripeSubscriptionId": data.subscription,
                            "subscription.checkoutSessionId": data.id,
                            "subscription.planId": ((_e = data.metadata) === null || _e === void 0 ? void 0 : _e.planId) || null,
                            "subscription.amount": data.amount_total,
                            "subscription.currency": data.currency,
                            "subscription.created": toDate(data.created),
                            "subscription.trialStart": null,
                            "subscription.trialEnd": null,
                            "subscription.periodStart": periodStart,
                            "subscription.periodEnd": extendedPeriodEnd,
                            "subscription.currentPeriodEnd": extendedPeriodEnd,
                        },
                    }, { new: true, upsert: false });
                    if (!updatedDoctor) {
                        console.error(`❌ No doctor found for customerId: ${customerId}`);
                    }
                    else {
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
                    const periodEnd = getPeriodEnd(subscription.billing_cycle_anchor, (_f = subscription.plan) === null || _f === void 0 ? void 0 : _f.interval, (_g = subscription.plan) === null || _g === void 0 ? void 0 : _g.interval_count);
                    yield doctor_model_1.default.findOneAndUpdate({ stripeCustomerId: subscription.customer }, {
                        $set: Object.assign(Object.assign({ "subscription.status": subscription.status, "subscription.periodStart": periodStart, "subscription.periodEnd": periodEnd, "subscription.currentPeriodEnd": periodEnd, "subscription.planId": ((_h = subscription.plan) === null || _h === void 0 ? void 0 : _h.id) ||
                                ((_l = (_k = (_j = subscription.items) === null || _j === void 0 ? void 0 : _j.data[0]) === null || _k === void 0 ? void 0 : _k.price) === null || _l === void 0 ? void 0 : _l.id) ||
                                null, "subscription.stripeSubscriptionId": subscription.id }, (subscription.status === "trialing" && {
                            "subscription.trialStart": toDate(subscription.trial_start),
                            "subscription.trialEnd": toDate(subscription.trial_end),
                        })), (subscription.status !== "trialing" && {
                            "subscription.trialStart": null,
                            "subscription.trialEnd": null,
                        })),
                    }, { new: true }).then((updated) => {
                        if (!updated) {
                            console.error(`❌ No doctor found for ${subscription.customer}`);
                        }
                        else {
                            console.log(`✅ Subscription updated for ${updated._id}`);
                        }
                    });
                }
                break;
            case "customer.subscription.deleted":
            case "invoice.payment_failed":
                console.warn(`⚠️ Subscription ${eventType} for customer ${data.customer}`);
                yield doctor_model_1.default.findOneAndUpdate({ stripeCustomerId: data.customer }, {
                    $set: {
                        "subscription.status": "cancelled",
                        "subscription.periodStart": null,
                        "subscription.periodEnd": null,
                        "subscription.trialStart": null,
                        "subscription.trialEnd": null,
                    },
                }, { new: true }).then((updated) => {
                    if (!updated) {
                        console.error(`❌ No doctor found to cancel for ${data.customer}`);
                    }
                    else {
                        console.log(`✅ Subscription cancelled for ${updated._id}`);
                    }
                });
                break;
            default:
                console.log(`ℹ️ Unhandled Stripe event type: ${eventType}`);
        }
        return { received: true };
    }
    catch (err) {
        console.error("❌ Webhook Error:", err.message);
        return { received: false, error: err.message };
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
