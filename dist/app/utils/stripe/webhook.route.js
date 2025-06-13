"use strict";
//@ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const stripe_webhook_controller_1 = require("./stripe.webhook.controller");
const router = express_1.default.Router();
router.post("/api/v1/payments/webhook", express_1.default.raw({ type: "application/json" }), (req, res, next) => {
    try {
        // Use req.body directly (provided by express.raw as a Buffer)
        if (!req.body) {
            throw new Error("No raw body provided");
        }
        req.rawBody = req.body; // Attach to req.rawBody for consistency in WebhookController
        next();
    }
    catch (err) {
        console.error("Error processing raw body:", err);
        res.status(400).send("Webhook Error: Failed to read raw body");
    }
}, stripe_webhook_controller_1.WebhookController);
router.post("/api/v1/payments/checkout", express_1.default.json(), stripe_webhook_controller_1.HandleCheckoutController);
exports.StripeRoutes = router;
