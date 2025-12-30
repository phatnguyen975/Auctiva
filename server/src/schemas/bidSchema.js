import { z } from "zod";

export const BidIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

export const BidCreateSchema = z.object({
  maxBid: z.number().positive(),
  amount: z.number().positive().optional(),
  status: z.enum(["valid", "rejected"]).optional(),
});
