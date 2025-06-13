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
        type: String, // URL to the doctor's profile image
    },
    phone: {
        type: String,
    },
    address: {
        type: String, // e.g., "123 Main St, City, Country"
    },
    specialization: {
        type: mongoose_1.Schema.Types.ObjectId, // e.g., "Cardiology", "Neurology"
        ref: "Specialization",
    },
    experience: {
        type: Number, // in years
    },
    profile_url: {
        type: String, // URL to the doctor's profile page
    },
    slotDuration: {
        type: Number, // Duration of each appointment slot in minutes
        default: 30, // Default to 30 minutes
    },
    isDeleted: {
        type: Boolean,
        default: false, // Soft delete flag
    },
    reviews: [
        {
            patient: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            rating: {
                type: Number, // Rating out of 5
                min: 1,
                max: 5,
            },
            comment: {
                type: String, // Review comment
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    workSchedule: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "WorkSchedule",
    },
    weekends: {
        type: [Number], // Array of numbers representing weekend days, e.g., [0, 6] for Sunday and Saturday
        default: [0, 6], // Default to Sunday and Saturday
        required: true,
    },
    stripeCustomerId: {
        type: String,
    },
    subscription: {
        status: {
            type: String,
            enum: ["trialing", "active", "cancelled", "expired"],
            default: "trialing",
        },
        trialStart: {
            type: Date,
            default: null,
        },
        trialEnd: {
            type: Date,
            default: null,
        },
        periodStart: {
            type: Date,
            default: null, // Start of the paid subscription period
        },
        periodEnd: {
            type: Date,
            default: null, // End of the paid subscription period
        },
        currentPeriodEnd: {
            type: Date,
        },
        planId: {
            type: String,
        },
        stripeSubscriptionId: {
            type: String,
        },
        checkoutSessionId: {
            type: String,
        },
        amount: {
            type: Number,
        },
        currency: {
            type: String,
        },
        created: {
            type: Date,
        },
    },
}, { timestamps: true } // Automatically add createdAt and updatedAt
);
const Doctor = (0, mongoose_1.model)("Doctor", dataSchema);
exports.default = Doctor;
