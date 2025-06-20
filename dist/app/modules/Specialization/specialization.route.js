"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationRoutes = void 0;
const express_1 = require("express");
const specialization_controller_1 = require("./specialization.controller");
const ValidateDataSchema_1 = __importDefault(require("../../middlewares/ValidateDataSchema"));
const specialization_schemaValidation_1 = require("./specialization.schemaValidation");
const _ = (0, express_1.Router)();
// routes
_.get("/", specialization_controller_1.GetAllSpecializationsController);
_.get("/:id", specialization_controller_1.GetSpecializationByIdController);
_.post("/create-specialization", (0, ValidateDataSchema_1.default)(specialization_schemaValidation_1.specializationCreateSchema), specialization_controller_1.InsertIntoDbController);
_.patch("/update-specialization/:id", (0, ValidateDataSchema_1.default)(specialization_schemaValidation_1.specializationUpdateSchema), specialization_controller_1.UpdateSpecializationController);
_.delete("/delete-specialization/:id", specialization_controller_1.SoftDeletedController);
exports.SpecializationRoutes = _;
