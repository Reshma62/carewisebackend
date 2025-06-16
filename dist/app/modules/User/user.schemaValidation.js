"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, "Password must be at least 6 characters"),
        role: zod_1.z.enum(["ADMIN", "DOCTOR", "PATIENT"]).optional(),
        needPasswordChange: zod_1.z.boolean().optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
//login
exports.loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        password: zod_1.z
            .string({
            required_error: "Password is required",
        })
            .min(6, "Password must be at least 6 characters"),
    }),
});
