import { z } from "zod";

export const createPatientSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    phone: z
      .string()
      .regex(
        /^\+?[1-9]\d{6,14}$/,
        "Phone number should be in the format +855651234567 (6-14 digits, optional +)"
      )
      .optional(),
    address: z.string().optional(),
    isBlocked: z.boolean().optional(),
  }),
});
