import { z } from "zod";
import { BigIntIdSchema } from "./commonSchema.js";

export const ProductIdSchema = z.object({
  id: BigIntIdSchema,
});

export const ProductCreateSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10),
  slug: z.string().min(2).max(80).optional(),
  categoryId: BigIntIdSchema,
  startPrice: z.number().nonnegative(),
  stepPrice: z.number().positive(),
  buyNowPrice: z.number().positive().optional(),
  postDate: z.string().datetime().optional(),
  endDate: z.string().datetime(),
  isAutoExtend: z.boolean().default(true),
  isInstantPurchase: z.boolean().default(false),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();
