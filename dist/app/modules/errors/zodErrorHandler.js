"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zodErrorHandle = (err) => {
    const statusCode = http_status_1.default.BAD_REQUEST;
    const errorSources = err.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    return {
        statusCode,
        message: " Validation error",
        errorSources,
    };
};
exports.default = zodErrorHandle;
