import { z } from "zod";
import { BigIntIdSchema } from "./commonSchema.js";

export const CategoryIdSchema = z.object({
  id: BigIntIdSchema,
});

export const CategoryCreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80).optional(),
  parentId: BigIntIdSchema.optional(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();
