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
exports.RefreshTokenGenerateController = exports.GetMeController = exports.LoginController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
//? Login in controller
const LoginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield (0, auth_service_1.loginService)(email, password);
        const { refreshToken, accessToken, needPasswordChange } = result;
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // 🔒 Prevents JS access to cookie
            secure: config_1.default.node_env === "production", // 🔒 Sends only over HTTPS in production
            sameSite: "strict", // 🛡️ Protects against CSRF
            //maxAge: 15 * 24 * 60 * 60 * 1000, // ⏳ 15 days in milliseconds
        });
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: " User logged in successfully",
            data: {
                accessToken,
                needPasswordChange,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.LoginController = LoginController;
//? Get me controller
const GetMeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.user;
        const result = yield (0, auth_service_1.getMeService)(data);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: " is created successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.GetMeController = GetMeController;
//? access token generate
const RefreshTokenGenerateController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const result = yield (0, auth_service_1.refreshTokenService)(refreshToken);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Token generate successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.RefreshTokenGenerateController = RefreshTokenGenerateController;
