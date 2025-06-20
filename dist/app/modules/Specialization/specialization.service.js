"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteService = exports.updateDbService = exports.insertIntoDbService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const specialization_model_1 = __importDefault(require("./specialization.model"));
const insertIntoDbService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield specialization_model_1.default.findOne({ name: payload.name });
    if (existing) {
        if (existing.isDeleted) {
            // If deleted, update and return the restored record
            existing.isDeleted = false;
            //   Object.assign(existing, payload); // update other fields if needed
            yield existing.save();
            return existing;
        }
        else {
            throw new Error("Specialization with this name already exists.");
        }
    }
    // If not found, create new
    const result = yield specialization_model_1.default.create(payload);
    return result;
});
exports.insertIntoDbService = insertIntoDbService;
const updateDbService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find specialization by ID
    const specialization = yield specialization_model_1.default.findById(id);
    if (!specialization) {
        throw new Error("Specialization not found");
    }
    if (specialization.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot update a deleted specialization.");
    }
    // Check if another specialization with the same name exists in the same category (exclude current one)
    const duplicate = yield specialization_model_1.default.findOneAndUpdate({
        _id: { $ne: id }, // exclude current record
        name: payload.name,
        isDeleted: false,
    });
    if (duplicate) {
        throw new Error("Another specialization with this name already exists in the same category.");
    }
    // Update the specialization
    const updatedData = yield specialization_model_1.default.findOneAndUpdate({ _id: id }, { $set: payload }, { new: true } // return the updated document            );
    );
    return updatedData;
});
exports.updateDbService = updateDbService;
const softDeleteService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const specialization = yield specialization_model_1.default.findById(id);
    if (!specialization) {
        throw new Error("Specialization not found");
    }
    // Mark as deleted
    specialization.isDeleted = true;
    yield specialization.save();
    return specialization;
});
exports.softDeleteService = softDeleteService;
