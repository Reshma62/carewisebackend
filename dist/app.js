"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandle_1 = __importDefault(require("./app/middlewares/globalErrorHandle"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
// Test route
app.get("/", (_req, res) => {
    res.send("API is running...");
});
// not found
app.use(notFound_1.default); // 404
// global error handler
app.use(globalErrorHandle_1.default);
exports.default = app;
