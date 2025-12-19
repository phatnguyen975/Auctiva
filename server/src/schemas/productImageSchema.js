import { z } from "zod";
import { BigIntIdSchema } from "./commonSchema.js";

export const ProductImageCreateSchema = z.object({
  productId: BigIntIdSchema,
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
});
