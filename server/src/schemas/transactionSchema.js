import { z } from "zod";

export const SubmitPaymentSchema = z.object({
  shippingAddress: z.string().min(10, "Địa chỉ phải chi tiết hơn"),
  paymentProof: z.string().url("Link ảnh không hợp lệ"),
});

export const ConfirmShippingSchema = z.object({
  shippingReceipt: z.string().url("Link ảnh biên lai không hợp lệ"),
});

export const RatingSchema = z.object({
  score: z
    .number()
    .int()
    .min(-1)
    .max(1)
    .refine((val) => val === -1 || val === 1, "Score phải là -1 hoặc 1"),
  comment: z.string().min(1, "Bình luận không được để trống"),
});
