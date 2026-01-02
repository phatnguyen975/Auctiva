import { z } from "zod";

// Validator cho việc đặt câu hỏi
export const AskQuestionSchema = z.object({
  productId: z.number().int().positive("ID sản phẩm không hợp lệ"),
  question: z
    .string()
    .min(5, "Câu hỏi phải có ít nhất 5 ký tự")
    .max(500, "Câu hỏi quá dài"),
});

// Validator cho việc trả lời
export const ReplyQuestionSchema = z.object({
  questionId: z.number().int().positive("ID câu hỏi không hợp lệ"),
  answer: z
    .string()
    .min(2, "Câu trả lời quá ngắn")
    .max(1000, "Câu trả lời quá dài"),
});
