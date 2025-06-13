import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  port: process.env.PORT,
  database_url: process.env.MONGO_URI as string,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  node_env: process.env.NODE_ENV,
  stripe_sk_key_test: process.env.STRIPE_SECRET_KEY as string,
  trail_days: parseInt(process.env.TRIAL_DAYS || "15"),
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET as string,
  local_base_frontend_url: process.env.LOCAL_BASE_URL as string,
};
