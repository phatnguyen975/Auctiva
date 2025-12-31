import { z } from "zod";

export const RatingIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number),
});

export const RatingCreateSchema = z.object({
  targetUserId: z.string().uuid("Invalid UUID format"),
  score: z.number().refine((v) => v === 1 || v === -1, {
    message: "Score must be 1 or -1",
  }),
  comment: z.string().min(1, "Comment cannot be empty"),
});
