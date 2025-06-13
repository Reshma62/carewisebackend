//@ts-nocheck

import express from "express";
import {
  HandleCheckoutController,
  WebhookController,
} from "./stripe.webhook.controller";

const router = express.Router();

router.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    try {
      // Use req.body directly (provided by express.raw as a Buffer)
      if (!req.body) {
        throw new Error("No raw body provided");
      }
      req.rawBody = req.body; // Attach to req.rawBody for consistency in WebhookController
      next();
    } catch (err) {
      console.error("Error processing raw body:", err);
      res.status(400).send("Webhook Error: Failed to read raw body");
    }
  },
  WebhookController
);

router.post(
  "/api/v1/payments/checkout",
  express.json(),
  HandleCheckoutController
);

export const StripeRoutes = router;
