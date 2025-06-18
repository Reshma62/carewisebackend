import { Router } from "express";
import { CreateController } from "./user.controller";
import ValidateDataSchema from "../../middlewares/ValidateDataSchema";
import { createUserZodSchema } from "./user.schemaValidation";
import { auth } from "../../middlewares/authGuard";

const _ = Router();
// controller
// routes

// _.post("/register", CreateController);
_.post(
  "/register",
  auth("PATIENT"),
  ValidateDataSchema(createUserZodSchema),
  CreateController
);


export const UserRoutes = _;
