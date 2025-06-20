import { Schema, model } from "mongoose";
import { ISpecializationInput } from "./specialization.interface";

const dataSchema = new Schema<ISpecializationInput>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String, // URL to the specialization image
    },
    doctor: {
      type: [Schema.Types.ObjectId], // Reference to the doctor
      ref: "Doctor",
    },
    isDeleted: {
      type: Boolean,
      default: false, // Flag to mark if the specialization is deleted
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Specialization = model<ISpecializationInput>(
  "Specialization",
  dataSchema
);

export default Specialization;
