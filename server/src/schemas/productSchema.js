import { z } from "zod";

export const ProductIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

export const ProductCreateSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10),
  slug: z.string().min(2).max(80).optional(),
  categoryId: z
    .number("ID must be a number")
    .int("ID must be an integer")
    .positive("ID must be positive")
    .optional(),
  startPrice: z.number().nonnegative(),
  stepPrice: z.number().positive(),
  buyNowPrice: z.number().positive().optional(),
  postDate: z.string().datetime().optional(),
  endDate: z.string().datetime(),
  isAutoExtend: z.boolean().default(true),
  isInstantPurchase: z.boolean().default(false),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();
