import { z } from "zod";

export const CategoryIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

export const CategoryCreateSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2).max(80),
  slug: z.string().min(2).max(80).optional(),
  parentId: z
    .number("ID must be a number")
    .int("ID must be an integer")
    .positive("ID must be positive")
    .optional(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();
