"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandle_1 = __importDefault(require("./app/middlewares/globalErrorHandle"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const webhook_route_1 = require("./app/utils/stripe/webhook.route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Enable CORS
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // adjust as needed
    credentials: true, // needed to allow cookies
}));
// ✅ Enable Cookie Parser
app.use((0, cookie_parser_1.default)());
// ✅ Stripe webhook route (no JSON parser before this)
app.use(webhook_route_1.StripeRoutes);
// ✅ Body parsers for all other routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Main API routes
app.use("/api/v1", routes_1.default);
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
app.use(notFound_1.default);
app.use(globalErrorHandle_1.default);
exports.default = app;
