import { z } from "zod";

export const ProductImageCreateSchema = z.object({
  url: z.string().url("Image URL is invalid"),
  isPrimary: z.boolean().default(false),
});
