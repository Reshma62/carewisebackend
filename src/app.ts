import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandle from "./app/middlewares/globalErrorHandle";
import notFoundHandler from "./app/middlewares/notFound";
import { StripeRoutes } from "./app/utils/stripe/webhook.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // adjust as needed
    credentials: true, // needed to allow cookies
  })
);

// ✅ Enable Cookie Parser
app.use(cookieParser());

// ✅ Stripe webhook route (no JSON parser before this)
app.use(StripeRoutes);

// ✅ Body parsers for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Main API routes
app.use("/api/v1", router);

// ✅ Test route
app.get("/", (_req, res) => {
  res.send(`
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      font-family: Arial, sans-serif;
    ">
      <h1 style="
        color: #2e86de;
        font-size: 2.5rem;
        border: 2px solid #2e86de;
        padding: 20px 40px;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      ">
        🚀 API is running...
      </h1>
    </div>
  `);
});


// ✅ 404 and Global Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandle);

export default app;
