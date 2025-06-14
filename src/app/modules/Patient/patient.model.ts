import { IPatient } from "./patient.interface";
import { Schema, model } from "mongoose";

const dataSchema = new Schema<IPatient>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Patient = model<IPatient>("Patient", dataSchema);

export default Patient;
