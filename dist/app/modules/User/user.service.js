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
exports.insertIntoDbService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("./user.model"));
const doctor_model_1 = __importDefault(require("../Doctor/doctor.model"));
const insertIntoDbService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if user with same email exists
        const existingUser = yield user_model_1.default.findOne({ email: payload.email }).session(session);
        if (existingUser && !existingUser.isDeleted) {
            throw new Error("User with this email already exists.");
        }
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isDeleted) {
            throw new Error("User with this email already exists but is deleted. Please restore the user first.");
        }
        // Create new user
        // Create user
        const createdUsers = yield user_model_1.default.create([payload], { session });
        const createdUser = createdUsers[0];
        // Create corresponding profile
        if (createdUser.role === "DOCTOR") {
            yield doctor_model_1.default.create([{ user: createdUser._id }], { session });
        }
        else if (createdUser.role === "PATIENT") {
            console.log("patient profile creation logic here");
            //await PatientProfile.create([{ userId: createdUser._id }], { session });
        }
        yield session.commitTransaction();
        session.endSession();
        return createdUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.insertIntoDbService = insertIntoDbService;
