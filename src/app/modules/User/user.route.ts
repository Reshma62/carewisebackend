import { Router } from "express";
import { CreateController } from "./user.controller";
import ValidateDataSchema from "../../middlewares/ValidateDataSchema";
import { createUserZodSchema } from "./user.schemaValidation";

const _ = Router();
// controller
// routes

// _.post("/register", CreateController);
_.post("/register", ValidateDataSchema(createUserZodSchema), CreateController);


export const UserRoutes = _;
