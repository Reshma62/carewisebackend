import { Schema, model } from "mongoose";

const dataSchema = new Schema(
  {
    name: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Patient = model("Patient", dataSchema);

export default Patient;
