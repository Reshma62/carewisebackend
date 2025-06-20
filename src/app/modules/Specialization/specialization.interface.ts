import { Types } from "mongoose";

export interface ISpecializationInput {
  name?: string;
  image?: string;
  doctor?: Types.ObjectId[] | string[]; // Allow ObjectId or string if parsed from body
}
