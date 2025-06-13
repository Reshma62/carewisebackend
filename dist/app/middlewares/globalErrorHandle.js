"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_d_1 = require("./../../../node_modules/zod/dist/types/v4/classic/errors.d");
const http_status_1 = __importDefault(require("http-status"));
const error_1 = require("../modules/errors/interface/error");
const globalErrorHandle = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = err.message || "something went wrong";
    const zodErrorHandle = (err) => {
        const statusCode = http_status_1.default.BAD_REQUEST;
        const errorSources = err.issues.map((issue) => ({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        }));
        return {
            statusCode,
            message: "Zod validation error",
            errorSources,
        };
    };
    if (err instanceof errors_d_1.ZodError) {
        const simplifiedError = zodErrorHandle(err);
        message = "something went wrong";
    }
    //default ultimate  response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources: error_1.errorSources,
        // error: err,
    });
    // no return here!
};
exports.default = globalErrorHandle;
