// src/app.ts
import express from "express";
import dotenv from "dotenv";
import router from "./app/routes";
import globalErrorHandle from "./app/middlewares/globalErrorHandle";
import notFoundHandler from "./app/middlewares/notFound";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use("/api/v1", router);

// Test route
app.get("/", (_req, res) => {
  res.send("API is running...");
});

// not found
app.use(notFoundHandler); // 404
// global error handler
app.use(globalErrorHandle);
export default app;
