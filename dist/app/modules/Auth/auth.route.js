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
const _ = (0, express_1.Router)();
// controller
// routes
_.post("/login", (0, ValidateDataSchema_1.default)(user_schemaValidation_1.loginUserZodSchema), auth_controller_1.LoginController);
_.post("/token-generate", auth_controller_1.RefreshTokenGenerateController);
exports.AuthRoutes = _;
