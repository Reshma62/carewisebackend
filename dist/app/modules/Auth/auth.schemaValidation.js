"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpdateSchema = void 0;
const zod_1 = require("zod");
const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";
exports.ProfileUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
            .min(1, "Name cannot be empty"),
        image: zod_1.z.string().url("Invalid URL format for image").optional(),
        phone: zod_1.z
            .string()
            .regex(/^\+?\d{5,15}$/, "Phone number must be 5–15 digits, with optional '+'")
            .optional(),
        address: zod_1.z.string().optional(),
    }),
});
