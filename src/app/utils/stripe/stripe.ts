import Stripe from "stripe";
import config from "../../config";

const stripe = new Stripe(config.stripe_sk_key_test);

export default stripe;
