import { z } from "zod";

const emptyStringToNull = (val) => (val === "" ? null : val);

export const ProfileIdSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export const ProfileUpdateSchema = z.object({
  username: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(50)
      .nullable()
      .optional()
  ),

  fullName: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100)
      .nullable()
      .optional()
  ),
  email: z.preprocess(
    emptyStringToNull,
    z.string().email("Invalid email address").nullable().optional()
  ),
  address: z.preprocess(
    emptyStringToNull,
    z.string().max(255).nullable().optional()
  ),
  birthDate: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .date("Invalid date format (YYYY-MM-DD)")
      .transform((val) => new Date(val))
      .nullable()
      .optional()
  ),
  avatarUrl: z.preprocess(
    emptyStringToNull,
    z.string().url("Invalid URL").nullable().optional()
  ),
});

export const PasswordUpdateSchema = z.object({
  userId: z.string().uuid(),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const ProfileQuerySchema = z.object({
  keyword: z.string().trim().optional(),
});
