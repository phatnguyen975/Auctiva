import { prisma } from "../configs/prisma.js";

const QAService = {
  // Lấy danh sách câu hỏi kèm câu trả lời của một sản phẩm
  getQAByProduct: async (productID) => {
    return await prisma.productQuestion.findMany({
      where: { productId: Number(productID) },
      include: {
        bidder: { select: { fullName: true, avatarUrl: true } },
        answers: {
          include: {
            seller: { select: { fullName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Tạo câu hỏi mới
  createQuestion: async (productId, bidderId, question) => {
    return await prisma.productQuestion.create({
      data: {
        productId: Number(productId),
        bidderId,
        question,
      },
      include: { bidder: { select: { fullName: true, avatarUrl: true } } },
    });
  },

  // Tạo câu trả lời (Dành cho Seller)
  createAnswer: async (questionId, sellerId, answer) => {
    return await prisma.productAnswer.create({
      data: {
        questionId: Number(questionId),
        sellerId,
        answer,
      },
      include: { seller: { select: { fullName: true, avatarUrl: true } } },
    });
  },
};

export default QAService;
