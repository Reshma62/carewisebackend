// 🧩 Define the interface here in the same file
export interface IUser extends Document {
  email?: string;
  password: string;
  role: "ADMIN" | "USER" | "GUEST" | "DOCTOR" | "PATIENT";
  needPasswordChange: boolean;
  isDeleted: boolean;
}
