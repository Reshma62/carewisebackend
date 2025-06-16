import { Router } from "express";
import {
  LoginController,
  RefreshTokenGenerateController,
} from "./auth.controller";
import ValidateDataSchema from "../../middlewares/ValidateDataSchema";
import { loginUserZodSchema } from "../User/user.schemaValidation";
const _ = Router();
// controller
// routes
_.post("/login", ValidateDataSchema(loginUserZodSchema), LoginController);
_.post("/token-generate", RefreshTokenGenerateController);

export const AuthRoutes = _;
