"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const ValidateDataSchema_1 = __importDefault(require("../../middlewares/ValidateDataSchema"));
const user_schemaValidation_1 = require("../User/user.schemaValidation");
const authGuard_1 = require("../../middlewares/authGuard");
const user_constant_1 = require("../User/user.constant");
const auth_schemaValidation_1 = require("./auth.schemaValidation");
const _ = (0, express_1.Router)();
// controller
// routes
_.get("/me", (0, authGuard_1.auth)(user_constant_1.userRole.DOCTOR, user_constant_1.userRole.PATIENT, user_constant_1.userRole.PATIENT), auth_controller_1.GetMeController);
_.post("/login", (0, ValidateDataSchema_1.default)(user_schemaValidation_1.loginUserZodSchema), auth_controller_1.LoginController);
_.post("/token-generate", auth_controller_1.RefreshTokenGenerateController);
_.post("/forget-password", auth_controller_1.ForgotPassController);
_.post("/reset-password", auth_controller_1.ResetPasswordController);
_.patch("/update-profile", (0, ValidateDataSchema_1.default)(auth_schemaValidation_1.ProfileUpdateSchema), (0, authGuard_1.auth)(user_constant_1.userRole.ADMIN, user_constant_1.userRole.DOCTOR, user_constant_1.userRole.PATIENT), auth_controller_1.UpdateUserProfileController);
exports.AuthRoutes = _;
