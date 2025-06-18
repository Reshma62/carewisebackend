import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join((process.cwd(), ".env")) });
export default {
  port: process.env.PORT,
  database_url: process.env.MONGO_URI as string,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND as string,
  node_env: process.env.NODE_ENV,
  stripe_sk_key_test: process.env.STRIPE_SECRET_KEY as string,
  trail_days: parseInt(process.env.TRIAL_DAYS || "15"),
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET as string,
  local_base_frontend_url: process.env.LOCAL_BASE_URL as string,
  live_fronted_url: process.env.LIVE_BASE_URL,
  accessTokenExp: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN as string,
  refreshTokenExp: process.env.JWT_EXPIRES_IN_RE_TOKEN as string,
  accessTokenSecret: process.env.JWT_SECRETS_ACCESS_TOKEN as string,
  refreshTokenSecret: process.env.JWT_SECRETS_RE_TOKEN as string,
  node_mailer_email: process.env.EMAIL,
  node_mailer_pass: process.env.PASS,
  forget_pass_secret: process.env.JWT_FORGET_PASS_SECRET as string,
  forget_pass_exp: process.env.JWT_FORGET_PASS_EXP as string,
};
