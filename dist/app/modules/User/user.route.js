"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
// import { ValidateDataSchema } from "../../middlewares/ValidateDataSchema";
// import { createUserZodSchema } from "./user.schemaValidation";
const _ = (0, express_1.Router)();
// controller
// routes
_.post("/register", user_controller_1.CreateController);
// _.post("/register", ValidateDataSchema(createUserZodSchema), CreateController);
exports.UserRoutes = _;
