import { Router } from "express";
import {
  GetMeController,
  LoginController,
  RefreshTokenGenerateController,
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

export const AuthRoutes = _;
