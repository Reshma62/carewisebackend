import { z } from "zod";

const specializationBase = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  image: z
    .string({
      required_error: "Image URL is required",
    })
    .url("Image must be a valid URL"),
});
export const specializationCreateSchema = z.object({
  body: specializationBase,
});
export const specializationUpdateSchema = z.object({
  body: specializationBase.partial(),
});
