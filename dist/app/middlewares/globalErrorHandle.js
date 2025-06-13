"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const zodErrorHandler_1 = __importDefault(require("../modules/errors/zodErrorHandler"));
const handleValidationError_1 = __importDefault(require("../modules/errors/handleValidationError"));
const hadleCastError_1 = __importDefault(require("../modules/errors/hadleCastError"));
const handleDuplicateError_1 = __importDefault(require("../modules/errors/handleDuplicateError"));
const AppError_1 = __importDefault(require("../modules/errors/AppError"));
const globalErrorHandle = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = err.message || "something went wrong";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong",
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, zodErrorHandler_1.default)(err);
        message = (simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message) || "something went wrong";
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        message = (simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message) || "something went wrong";
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const simplifiedError = (0, hadleCastError_1.default)(err);
        message = (simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message) || "something went wrong";
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err === null || err === void 0 ? void 0 : err.message,
            },
        ];
    }
    //default ultimate  response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.node_env === "development" ? err.stack : null,
    });
};
exports.default = globalErrorHandle;
