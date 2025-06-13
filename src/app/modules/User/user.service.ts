import mongoose from "mongoose";
import { IUser } from "./user.interface";
import User from "./user.model";
import Doctor from "../Doctor/doctor.model";
import Patient from "../Patient/patient.model";

export const insertIntoDbService = async (payload: IUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Check if user with same email exists
    const existingUser = await User.findOne({ email: payload.email }).session(
      session
    );
    if (existingUser && !existingUser.isDeleted) {
      throw new Error("User with this email already exists.");
    }

    // Create new user

    // Create user
    const createdUsers = await User.create([payload], { session });
    const createdUser = createdUsers[0];

    // Create corresponding profile
    if (createdUser.role === "DOCTOR") {
      await Doctor.create([{ user: createdUser._id }], { session });
    } else if (createdUser.role === "PATIENT") {
      console.log("patient profile creation logic here");
      await Patient.create([{ userId: createdUser._id }], { session });
    }

    await session.commitTransaction();
    session.endSession();
    const userToSend = createdUser.toJSON() as any;
    delete userToSend?.password;

    return userToSend;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get from db single user

export const loginService = async (email: string) => {
  const result = await User.findOne({ email: email }).select("+password");
  return result;
};