import { Router } from "express";
import {
  InsertIntoDbController,
  SoftDeletedController,
  UpdateSpecializationController,
} from "./specialization.controller";
import ValidateDataSchema from "../../middlewares/ValidateDataSchema";
import {
  specializationCreateSchema,
  specializationUpdateSchema,
} from "./specialization.schemaValidation";
const _ = Router();

// routes
_.post(
  "/create-specialization",
  ValidateDataSchema(specializationCreateSchema),
  InsertIntoDbController
);
_.patch(
  "/update-specialization/:id",
  ValidateDataSchema(specializationUpdateSchema),
  UpdateSpecializationController
);
_.delete("/delete-specialization/:id", SoftDeletedController);

export const SpecializationRoutes = _;
