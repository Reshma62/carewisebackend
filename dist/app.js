"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandle_1 = __importDefault(require("./app/middlewares/globalErrorHandle"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const webhook_route_1 = require("./app/utils/stripe/webhook.route");
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Stripe webhook route (MUST come before json parsers)
app.use(webhook_route_1.StripeRoutes);
// ✅ Global body parsers for all other routes
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Other API routes
app.use("/api/v1", routes_1.default);
// Test route
app.get("/", (_req, res) => {
    res.send("API is running...");
});
// 404 and global error handler
app.use(notFound_1.default);
app.use(globalErrorHandle_1.default);
exports.default = app;
