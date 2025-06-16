"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), ".env")) });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.MONGO_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
    node_env: process.env.NODE_ENV,
    stripe_sk_key_test: process.env.STRIPE_SECRET_KEY,
    trail_days: parseInt(process.env.TRIAL_DAYS || "15"),
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    local_base_frontend_url: process.env.LOCAL_BASE_URL,
    accessTokenExp: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN,
    refreshTokenExp: process.env.JWT_EXPIRES_IN_RE_TOKEN,
    accessTokenSecret: process.env.JWT_SECRETS_ACCESS_TOKEN,
    refreshTokenSecret: process.env.JWT_SECRETS_RE_TOKEN,
};
