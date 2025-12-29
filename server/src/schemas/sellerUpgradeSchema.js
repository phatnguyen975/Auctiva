import { z } from "zod";

export const SellerUpgradeIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

export const SellerUpgradeUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
