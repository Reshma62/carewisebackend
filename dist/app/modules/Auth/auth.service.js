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
exports.refreshTokenService = exports.loginService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../User/user.model"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const token_1 = require("../../utils/token");
const config_1 = __importDefault(require("../../config"));
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Find user by email and include password
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // check if the user is deleted or not
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User Deleted");
    }
    // 2. Compare passwords
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credential");
    }
    const userPayload = {
        id: user === null || user === void 0 ? void 0 : user._id.toString(),
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, token_1.generateToken)(userPayload, "access");
    const refreshToken = (0, token_1.generateToken)(userPayload, "refresh");
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange,
    }; // Password matched, return user data
});
exports.loginService = loginService;
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.refreshTokenSecret);
        const isUserExits = yield user_model_1.default.findOne({ email: decoded === null || decoded === void 0 ? void 0 : decoded.email });
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
