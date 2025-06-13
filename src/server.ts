// src/server.ts

import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

async function startServer() {
  try {
    await mongoose.connect(config.database_url);
    console.log("✅ MongoDB connected");

    app.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

startServer();
