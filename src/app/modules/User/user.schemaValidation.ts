import { z } from "zod";

export const createUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),

    role: z.enum(["ADMIN", "DOCTOR", "PATIENT"]).optional(),

    needPasswordChange: z.boolean().optional(),

    isDeleted: z.boolean().optional(),
  }),
});



//login
export const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});
