import { Types } from "mongoose";

export interface ISpecializationInput {
  name: string;
  image: string;
  isDeleted?: boolean; // Optional field to mark if the specialization is deleted
  doctor?: Types.ObjectId[] | string[]; // Allow ObjectId or string if parsed from body
}
