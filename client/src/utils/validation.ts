import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase, lowercase, and number"
    ),
});

export const verifyEmailSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createListingSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  parentCategoryId: z.number("Category is required"),
  subCategoryId: z.number("Subcategory is required"),
  endDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in the future",
  }),
  startPrice: z.coerce
    .number()
    .min(0.1, "Starting price is required and must be positive"),
  stepPrice: z.coerce
    .number()
    .min(0.1, "Bid step is required and must be positive"),
  buyNowPrice: z.coerce.number().optional(),
  description: z.string().min(10, "Description is too short (min 10 chars)"),
  images: z
    .array(z.any())
    .min(3, "Please upload at least 3 images"),
});
