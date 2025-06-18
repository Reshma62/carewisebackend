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
exports.verifyDoctorAccess = exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const token_1 = require("../../utils/token");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../modules/errors/AppError"));
const doctor_model_1 = __importDefault(require("../../modules/Doctor/doctor.model"));
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, " Token not found");
            }
            const verifiedUser = (0, token_1.verifyToken)(token, config_1.default.accessTokenSecret);
            if (roles.length && !roles.includes(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role)) {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Unauthorized access");
            }
            req.user = verifiedUser;
            next();
            // console.log(verifiedUser);
        }
        catch (error) {
            next(error);
        }
    });
};
exports.auth = auth;
//! Test purpose
const verifyDoctorAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role !== "DOCTOR") {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Only doctors are allowed");
        }
        const doctor = yield doctor_model_1.default.findOne({ user: userId });
        if (!doctor) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Doctor profile not found");
        }
        const subscription = doctor.subscription;
        const now = Date.now();
        const isTrialValid = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === "trialing" &&
            (subscription === null || subscription === void 0 ? void 0 : subscription.trialEnd) &&
            new Date(subscription.trialEnd).getTime() > now;
        const isSubscriptionActive = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === "active" &&
            (subscription === null || subscription === void 0 ? void 0 : subscription.currentPeriodEnd) &&
            new Date(subscription.currentPeriodEnd).getTime() > now;
        if (!isTrialValid && !isSubscriptionActive) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your subscription has expired. Please renew to access the dashboard.");
        }
        req.doctor = doctor;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.verifyDoctorAccess = verifyDoctorAccess;
