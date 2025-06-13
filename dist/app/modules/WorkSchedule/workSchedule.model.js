"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workPeriodSchema = new mongoose_1.Schema({
    startTime: {
        type: String, // e.g., "15:00"
        required: true,
    },
    endTime: {
        type: String, // e.g., "17:00"
        required: true,
    },
}, { _id: false });
const workScheduleSchema = new mongoose_1.Schema({
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    day: {
        type: Number, // eg., 0 for Sunday, 1 for Monday, etc.
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    workPeriods: {
        type: [workPeriodSchema], // Array of time periods
        default: [],
    },
}, { timestamps: true });
const WorkSchedule = (0, mongoose_1.model)("WorkSchedule", workScheduleSchema);
exports.default = WorkSchedule;
