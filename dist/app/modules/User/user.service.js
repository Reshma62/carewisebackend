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
exports.loginService = exports.insertIntoDbService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const doctor_model_1 = __importDefault(require("../Doctor/doctor.model"));
const patient_model_1 = __importDefault(require("../Patient/patient.model"));
const stripe_1 = __importDefault(require("../../utils/stripe/stripe"));
const config_1 = __importDefault(require("../../config"));
const insertIntoDbService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if user with same email exists
        const existingUser = yield user_model_1.default.findOne({ email: payload.email }).session(session);
        if (existingUser && !existingUser.isDeleted) {
            throw new Error("User with this email already exists.");
        }
        // Create user
        const createdUsers = yield user_model_1.default.create([payload], { session });
        const createdUser = createdUsers[0];
        // Create corresponding profile
        if (createdUser.role === "DOCTOR") {
            if (createdUser.role === "DOCTOR") {
                const now = new Date();
                const trialEnd = new Date(now.getTime() + config_1.default.trail_days * 24 * 60 * 60 * 1000);
                const stripeCustomer = yield stripe_1.default.customers.create({
                    email: createdUser.email,
                });
                yield doctor_model_1.default.create([
                    {
                        user: createdUser._id,
                        stripeCustomerId: stripeCustomer.id,
                        subscription: {
                            status: "trialing",
                            trialStart: now,
                            trialEnd: trialEnd,
                        },
                    },
                ], { session });
            }
        }
        else if (createdUser.role === "PATIENT") {
            console.log("patient profile creation logic here");
            yield patient_model_1.default.create([{ userId: createdUser._id }], { session });
        }
        yield session.commitTransaction();
        session.endSession();
        const userToSend = createdUser.toJSON();
        userToSend === null || userToSend === void 0 ? true : delete userToSend.password;
        return userToSend;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.insertIntoDbService = insertIntoDbService;
// Get from db single user
const loginService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findOne({ email: email }).select("+password");
    return result;
});
exports.loginService = loginService;
