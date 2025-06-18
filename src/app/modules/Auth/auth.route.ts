import { Router } from "express";
import {
  ForgotPassController,
  GetMeController,
  LoginController,
  RefreshTokenGenerateController,
  ResetPasswordController,
} from "./auth.controller";
import ValidateDataSchema from "../../middlewares/ValidateDataSchema";
import { loginUserZodSchema } from "../User/user.schemaValidation";
import { auth } from "../../middlewares/authGuard";
import { userRole } from "../User/user.constant";
const _ = Router();
// controller
// routes
_.get(
  "/me",
  auth(userRole.DOCTOR, userRole.PATIENT, userRole.PATIENT),
  GetMeController
);
_.post("/login", ValidateDataSchema(loginUserZodSchema), LoginController);

_.post("/token-generate", RefreshTokenGenerateController);
_.post("/forget-password", ForgotPassController);
_.post("/reset-password", ResetPasswordController);

export const AuthRoutes = _;
