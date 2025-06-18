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
exports.refreshTokenService = exports.resetPasswordService = exports.forgotPasswordService = exports.getMeService = exports.loginService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../User/user.model"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const token_1 = require("../../utils/token");
const config_1 = __importDefault(require("../../config"));
const doctor_model_1 = __importDefault(require("../Doctor/doctor.model"));
const patient_model_1 = __importDefault(require("../Patient/patient.model"));
const moment_1 = __importDefault(require("moment"));
const emailSend_1 = require("../../utils/emailSend");
//Login
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find user by email and include password
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User Deleted");
    }
    // 2. Compare passwords
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credential");
    }
    const userPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, token_1.generateToken)(userPayload, "access");
    const refreshToken = (0, token_1.generateToken)(userPayload, "refresh");
    // 3. Check dashboard access for doctors
    let canAccessDashboard = true;
    if (user.role === "DOCTOR") {
        const doctor = yield doctor_model_1.default.findOne({ user: user._id });
        if (!doctor) {
            canAccessDashboard = false;
        }
        else {
            const subscription = doctor.subscription;
            const isTrialValid = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === "trialing" &&
                (subscription === null || subscription === void 0 ? void 0 : subscription.trialEnd) &&
                new Date(subscription.trialEnd).getTime() > Date.now();
            const isSubscriptionActive = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === "active";
            canAccessDashboard = isTrialValid || isSubscriptionActive;
        }
    }
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
        role: user.role,
        canAccessDashboard,
    };
});
exports.loginService = loginService;
//? Get me data
const getMeService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const getUser = yield user_model_1.default.findById(payload.id);
    if (!getUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const responseData = {
        role: getUser.role,
    };
    if (getUser.role === "DOCTOR") {
        const doctorData = yield doctor_model_1.default.findOne({ user: getUser._id }).populate("user", "email role");
        if (!doctorData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Doctor profile not found");
        }
        const subscription = doctorData.subscription;
        const now = new Date().getTime();
        const isTrialValid = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === "trialing" &&
            (subscription === null || subscription === void 0 ? void 0 : subscription.trialEnd) &&
            new Date(subscription.trialEnd).getTime() > now;
        const isSubscriptionActive = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === "active" &&
            (subscription === null || subscription === void 0 ? void 0 : subscription.currentPeriodEnd) &&
            new Date(subscription.currentPeriodEnd).getTime() > now;
        const canAccessDashboard = isTrialValid || isSubscriptionActive;
        // Calculate remaining subscription time
        let remainingSubscriptionTime = "Expired";
        if (isTrialValid && (subscription === null || subscription === void 0 ? void 0 : subscription.trialEnd)) {
            const endDate = (0, moment_1.default)(subscription.trialEnd);
            const nowMoment = (0, moment_1.default)();
            const daysRemaining = endDate.diff(nowMoment, "days");
            if (daysRemaining >= 30) {
                const months = Math.floor(daysRemaining / 30);
                const remainingDays = daysRemaining % 30;
                remainingSubscriptionTime = `${months} month${months > 1 ? "s" : ""}${remainingDays > 0
                    ? `, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
                    : ""}`;
            }
            else if (daysRemaining > 0) {
                remainingSubscriptionTime = `${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`;
            }
        }
        else if (isSubscriptionActive && (subscription === null || subscription === void 0 ? void 0 : subscription.currentPeriodEnd)) {
            const endDate = (0, moment_1.default)(subscription.currentPeriodEnd);
            const nowMoment = (0, moment_1.default)();
            const daysRemaining = endDate.diff(nowMoment, "days");
            if (daysRemaining >= 30) {
                const months = Math.floor(daysRemaining / 30);
                const remainingDays = daysRemaining % 30;
                remainingSubscriptionTime = `${months} month${months > 1 ? "s" : ""}${remainingDays > 0
                    ? `, ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
                    : ""}`;
            }
            else if (daysRemaining > 0) {
                remainingSubscriptionTime = `${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`;
            }
        }
        responseData.user = doctorData;
        responseData.canAccessDashboard = canAccessDashboard;
        responseData.remainingSubscriptionTime = remainingSubscriptionTime;
    }
    else if (getUser.role === "PATIENT") {
        const patientData = yield patient_model_1.default.findOne({ user: getUser._id }).populate("user", "email role");
        if (!patientData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Patient profile not found");
        }
        responseData.user = patientData;
    }
    else {
        responseData.user = getUser; // Fallback for other roles (e.g., ADMIN)
    }
    return responseData;
});
exports.getMeService = getMeService;
// Forget passwordService
const forgotPasswordService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User with this email does not exist");
    }
    const userData = {
        id: user === null || user === void 0 ? void 0 : user._id.toString(),
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    // Generate reset token
    const resetToken = (0, token_1.generateToken)(userData, "reset");
    // Create reset URL
    const baseUrl = process.env.NODE_ENV === "production"
        ? config_1.default.live_fronted_url
        : config_1.default.local_base_frontend_url;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    // Send email
    const emailResult = yield (0, emailSend_1.sendEmail)({
        to: user === null || user === void 0 ? void 0 : user.email,
        subject: "Password Reset Request",
        html: `
      <p>You requested a password reset.</p>
      <p>Click this <a href="${resetUrl}">link</a> to reset your password.</p>
      <p>This link will expire in 1 hour.</p>
    `,
    });
    return emailResult;
});
exports.forgotPasswordService = forgotPasswordService;
// Reset password service
const resetPasswordService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify token
        const decoded = (0, token_1.verifyToken)(payload.token, config_1.default.forget_pass_secret);
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        // Update password
        user.password = payload.newPassword;
        yield user.save();
        return { success: true };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or expired reset token");
    }
});
exports.resetPasswordService = resetPasswordService;
// Refresh token
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, token_1.verifyToken)(token, config_1.default.refreshTokenSecret);
        const isUserExits = yield user_model_1.default.findOne({
            email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
            isDeleted: false,
        });
        if (!isUserExits) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User Not found");
        }
        const newAccessToken = (0, token_1.generateToken)({
            id: isUserExits === null || isUserExits === void 0 ? void 0 : isUserExits._id.toString(),
            email: isUserExits === null || isUserExits === void 0 ? void 0 : isUserExits.email,
            role: isUserExits === null || isUserExits === void 0 ? void 0 : isUserExits.role,
        }, "access");
        return { accessToken: newAccessToken };
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid Refresh Token");
    }
});
exports.refreshTokenService = refreshTokenService;
