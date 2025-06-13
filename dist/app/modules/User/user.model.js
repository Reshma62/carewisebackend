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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const dataSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["ADMIN", "DOCTOR", "PATIENT"],
        default: "PATIENT",
    },
    needPasswordChange: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// 👉 Pre-save hook for password hashing
dataSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Check if user is deleted, skip hashing password
        if (user.isDeleted) {
            throw new AppError_1.default(401, "User deleted");
        }
        // Only hash password if modified
        if (!user.isModified("password")) {
            return next();
        }
        const saltRounds = Number(config_1.default.bcrypt_salt_rounds);
        user.password = yield bcrypt_1.default.hash(user.password, saltRounds);
        next();
    });
});
const User = (0, mongoose_1.model)("User", dataSchema);
exports.default = User;
