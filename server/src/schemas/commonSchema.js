import { z } from "zod";

export const UUIDSchema = z.string().uuid("Invalid UUID format");

export const BigIntIdSchema = z
  .string()
  .regex(/^\d+$/, "ID must be a number")
  .transform(BigInt);
