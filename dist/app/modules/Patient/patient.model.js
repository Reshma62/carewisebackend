"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dataSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true } // Automatically add createdAt and updatedAt
);
const Patient = (0, mongoose_1.model)("Patient", dataSchema);
exports.default = Patient;
