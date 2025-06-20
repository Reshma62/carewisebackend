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
exports.GetAllSpecializationsController = exports.GetSpecializationByIdController = exports.SoftDeletedController = exports.UpdateSpecializationController = exports.InsertIntoDbController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const specialization_service_1 = require("./specialization.service");
const InsertIntoDbController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield (0, specialization_service_1.insertIntoDbService)(data);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Specialization created successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.InsertIntoDbController = InsertIntoDbController;
const UpdateSpecializationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const { id } = req.params; // Assuming the ID is passed as a URL parameter
        const result = yield (0, specialization_service_1.updateDbService)(id, data);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Specialization updated successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateSpecializationController = UpdateSpecializationController;
const SoftDeletedController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, specialization_service_1.softDeleteService)(id);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: " Specialization deleted successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.SoftDeletedController = SoftDeletedController;
const GetSpecializationByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield (0, specialization_service_1.getSpecializationById)(id);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Specialization retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.GetSpecializationByIdController = GetSpecializationByIdController;
const GetAllSpecializationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming you have a service to get all specializations
        const result = yield (0, specialization_service_1.getAllSpecializations)();
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "All specializations retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.GetAllSpecializationsController = GetAllSpecializationsController;
