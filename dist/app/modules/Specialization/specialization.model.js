"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dataSchema = new mongoose_1.Schema({
    name: {
        type: String,
    },
    image: {
        type: String, // URL to the specialization image
    },
    doctor: {
        type: [mongoose_1.Schema.Types.ObjectId], // Reference to the doctor
        ref: "Doctor",
    },
}, { timestamps: true } // Automatically add createdAt and updatedAt
);
const Specialization = (0, mongoose_1.model)("Specialization", dataSchema);
exports.default = Specialization;
