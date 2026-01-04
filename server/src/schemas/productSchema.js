import { z } from "zod";
import { ProductImageCreateSchema } from "./productImageSchema.js";

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
    .positive("ID must be positive"),
  startPrice: z.number().nonnegative(),
  stepPrice: z.number().positive(),
  buyNowPrice: z.number().positive().optional(),
  endDate: z.string().datetime(),
  isAutoExtend: z.boolean().default(true),
  isInstantPurchase: z.boolean().default(false),
  minImages: z.number().positive().optional(),
  images: z
    .array(ProductImageCreateSchema)
    .min(1, "Product must have at least one image"),
});

export const ProductUpdateSchema = z.object({
  description: z.string().min(1).optional(),
  isAutoExtend: z.boolean().optional(),
  isInstantPurchase: z.boolean().optional(),
});

export const ProductQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .default(1),
  limit: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .default(9),
  categoryIds: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val.split(",").map(Number).filter((n) => !isNaN(n));
    }),
  sortBy: z.enum(["endDate", "currentPrice"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  keyword: z.string().trim().optional(),
});
