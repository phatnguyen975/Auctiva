import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  username: z.string().min(2).max(50).optional(),
  fullName: z.string().min(2).max(100).optional(),
  address: z.string().max(255).optional(),
  birthDate: z.string().date().optional(),
  avatarUrl: z.string().url().optional(),
});

export const AuthUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(1).optional(),
});
