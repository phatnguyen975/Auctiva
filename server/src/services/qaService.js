import { prisma } from "../configs/prisma.js";

import { sendEmail, EmailTemplates } from "../configs/nodemailer.js";

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
    // return await prisma.productQuestion.create({
    //   data: {
    //     productId: Number(productId),
    //     bidderId,
    //     question,
    //   },
    //   include: { bidder: { select: { fullName: true, avatarUrl: true } } },
    // });

    // Tạo câu hỏi trong database
    const newQuestion = await prisma.productQuestion.create({
      data: {
        productId: Number(productId),
        bidderId,
        question,
      },
      include: {
        bidder: { select: { fullName: true } },
        product: {
          include: {
            seller: { select: { fullName: true, email: true } },
          },
        },
      },
    });

    // Gửi email thông báo cho Seller về câu hỏi mới
    try {
      const seller = newQuestion.product.seller;
      await sendEmail({
        to: seller.email,
        subject: `[Auctiva] Câu hỏi mới cho sản phẩm: ${newQuestion.product.name}`,
        html: EmailTemplates.newQuestion({
          sellerName: seller.fullName,
          bidderName: newQuestion.bidder.fullName,
          productName: newQuestion.product.name,
          questionContent: question,
          productLink: `${process.env.CLIENT_URL}/products/${productId}`,
        }),
      });
    } catch (error) {
      console.error("Lỗi gửi mail cho Seller:", error.message);
    }
  },

  // Tạo câu trả lời (Dành cho Seller)
  createAnswer: async (questionId, sellerId, answer) => {
    // return await prisma.productAnswer.create({
    //   data: {
    //     questionId: Number(questionId),
    //     sellerId,
    //     answer,
    //   },
    //   include: { seller: { select: { fullName: true, avatarUrl: true } } },
    // });

    // Tạo câu trả lời trong database
    const newAnswer = await prisma.productAnswer.create({
      data: {
        questionId: Number(questionId),
        sellerId,
        answer,
      },
      include: {
        seller: { select: { fullName: true } },
        question: { include: { product: true } },
      },
    });

    // Gửi email thông báo cho những người quan tâm về câu trả lời mới
    const productId = newAnswer.question.productId;

    const [bids, questions] = await Promise.all([
      prisma.bid.findMany({
        where: { productId },
        select: { bidder: { select: { email: true } } },
      }),
      prisma.productQuestion.findMany({
        where: { productId },
        select: { bidder: { select: { email: true } } },
      }),
    ]);

    // Loại bỏ các email trùng lặp
    const recipientEmails = [
      ...new Set([
        ...bids.map((b) => b.bidder.email),
        ...questions.map((q) => q.bidder.email),
      ]),
    ];

    // Gửi email đến từng người trong danh sách
    if (recipientEmails.length > 0) {
      const htmlContent = EmailTemplates.newAnswer({
        productName: newAnswer.question.product.name,
        questionContent: newAnswer.question.question,
        answerContent: answer,
        productLink: `${process.env.CLIENT_URL}/products/${productId}`,
      });

      recipientEmails.forEach((email) => {
        sendEmail({
          to: email,
          subject: `[Auctiva] Cập nhật thông tin Q&A: ${newAnswer.question.product.name}`,
          html: htmlContent,
        }).catch((err) =>
          console.error(`Gửi mail thất bại tới ${email}:`, err.message)
        );
      });
    }
  },
};

export default QAService;
