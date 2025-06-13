"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const ValidateDataSchema_1 = __importDefault(require("../../middlewares/ValidateDataSchema"));
const user_schemaValidation_1 = require("./user.schemaValidation");
const _ = (0, express_1.Router)();
// controller
// routes
// _.post("/register", CreateController);
_.post("/register", (0, ValidateDataSchema_1.default)(user_schemaValidation_1.createUserZodSchema), user_controller_1.CreateController);
_.get("/login", user_controller_1.LoginController);
exports.UserRoutes = _;
