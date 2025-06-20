import { z } from "zod";
const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

export const ProfileUpdateSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(1, "Name cannot be empty"),
    image: z.string().url("Invalid URL format for image").optional(),

    phone: z
      .string()
      .regex(
        /^\+?\d{5,15}$/,
        "Phone number must be 5–15 digits, with optional '+'"
      )
      .optional(),
    address: z.string().optional(),
  }),
});
