import { Router } from "express";
import {
  ForgotPassController,
  GetMeController,
  LoginController,
  RefreshTokenGenerateController,
  ResetPasswordController,
  UpdateUserProfileController,
} from "./auth.controller";
import ValidateDataSchema from "../../middlewares/ValidateDataSchema";
import { loginUserZodSchema } from "../User/user.schemaValidation";
import { auth } from "../../middlewares/authGuard";
import { userRole } from "../User/user.constant";
import { ProfileUpdateSchema } from "./auth.schemaValidation";
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
_.patch(
  "/update-profile",
  ValidateDataSchema(ProfileUpdateSchema),
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT),
  UpdateUserProfileController
);

export const AuthRoutes = _;
