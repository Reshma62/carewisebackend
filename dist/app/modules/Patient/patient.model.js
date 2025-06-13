"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dataSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true } // Automatically add createdAt and updatedAt
);
const Patient = (0, mongoose_1.model)("Patient", dataSchema);
exports.default = Patient;
