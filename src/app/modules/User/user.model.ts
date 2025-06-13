import { HydratedDocument, Schema, model } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
import AppError from "../errors/AppError";
const dataSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  }
);
// 👉 Pre-save hook for password hashing
dataSchema.pre("save", async function (next) {
  const user = this;

  // Check if user is deleted, skip hashing password
  if (user.isDeleted) {
    throw new AppError(401, "User deleted");
  }

  // Only hash password if modified
  if (!user.isModified("password")) {
    return next();
  }

  const saltRounds = Number(config.bcrypt_salt_rounds);
  user.password = await bcrypt.hash(user.password, saltRounds);
  next();
});

const User = model<IUser>("User", dataSchema);

export default User;
