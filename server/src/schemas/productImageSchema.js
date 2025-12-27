import { z } from "zod";

export const ProductImageCreateSchema = z.object({
  productId: z
    .number("ID must be a number")
    .int("ID must be an integer")
    .positive("ID must be positive")
    .optional(),
  url: z.string().url("Image URL is invalid"),
  isPrimary: z.boolean().default(false).optional(),
});
