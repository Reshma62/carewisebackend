"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPatientSchema = void 0;
const zod_1 = require("zod");
exports.createPatientSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        image: zod_1.z.string().url("Image must be a valid URL").optional(),
        phone: zod_1.z
            .string()
            .regex(/^\+?[1-9]\d{6,14}$/, "Phone number should be in the format +855651234567 (6-14 digits, optional +)")
            .optional(),
        address: zod_1.z.string().optional(),
        isBlocked: zod_1.z.boolean().optional(),
    }),
});
