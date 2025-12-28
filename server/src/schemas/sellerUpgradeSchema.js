import { z } from "zod";

export const SellerUpgradeIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

export const SellerUpgradeCreateSchema = z.object({
  userId: z.string().uuid("Invalid UUID format"),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const SellerUpgradeUpdateSchema = SellerUpgradeCreateSchema.partial();
