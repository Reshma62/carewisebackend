import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const dataSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
  { timestamps: true }
);

const User = model("User", dataSchema);

export default User;
