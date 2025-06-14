import { Types } from "mongoose";

export interface IPatient {
  user: Types.ObjectId;
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
  isBlocked?: boolean;
}
