"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specializationUpdateSchema = exports.specializationCreateSchema = void 0;
const zod_1 = require("zod");
const specializationBase = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    image: zod_1.z
        .string({
        required_error: "Image URL is required",
    })
        .url("Image must be a valid URL"),
});
exports.specializationCreateSchema = zod_1.z.object({
    body: specializationBase,
});
exports.specializationUpdateSchema = zod_1.z.object({
    body: specializationBase.partial(),
});
