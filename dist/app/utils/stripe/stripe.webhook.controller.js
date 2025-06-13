"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = exports.HandleCheckoutController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const SendResponse_1 = __importDefault(require("../SendResponse"));
const stripe_service_1 = require("./stripe.service");
const HandleCheckoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield (0, stripe_service_1.handleCheckoutStripe)(data);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: " checkout url  ",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.HandleCheckoutController = HandleCheckoutController;
const WebhookController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, stripe_service_1.handleStripeWebhook)(req);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Webhook received successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.WebhookController = WebhookController;
