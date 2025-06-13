import express from "express";
import dotenv from "dotenv";
import router from "./app/routes";
import globalErrorHandle from "./app/middlewares/globalErrorHandle";
import notFoundHandler from "./app/middlewares/notFound";
import { StripeRoutes } from "./app/utils/stripe/webhook.route";

dotenv.config();

const app = express();

// ✅ Stripe webhook route (MUST come before json parsers)
app.use(StripeRoutes);
// ✅ Global body parsers for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Other API routes
app.use("/api/v1", router);

// Test route
app.get("/", (_req, res) => {
  res.send("API is running...");
});

// 404 and global error handler
app.use(notFoundHandler);
app.use(globalErrorHandle);

export default app;
