import { Schema, model } from "mongoose";

const dataSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String, // URL to the specialization image
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const Specialization = model("Specialization", dataSchema);

export default Specialization;
