import { prisma } from "../configs/prisma.js";
import { sendEmail, EmailTemplates } from "../configs/nodemailer.js";

const AuctionTaskService = {
  processExpiredAuctions: async () => {
    const now = new Date();

    // 1. Tìm các sản phẩm đã hết giờ nhưng vẫn ở trạng thái 'active'
    const expiredProducts = await prisma.product.findMany({
      where: {
        endDate: { lte: now },
        status: "active",
      },
      include: {
        seller: true,
        winner: true,
      },
    });

    if (expiredProducts.length === 0) return;

    for (const product of expiredProducts) {
      try {
        await prisma.$transaction(async (tx) => {
          if (product.winnerId) {
            // TRƯỜNG HỢP 1: CÓ NGƯỜI THẮNG
            // 1.1 Tạo Transaction
            const transaction = await tx.transaction.create({
              data: {
                productId: product.id,
                winnerId: product.winnerId,
                sellerId: product.sellerId,
                status: "pending", // Trạng thái chờ thanh toán
              },
            });

            // 1.2 Cập nhật sản phẩm thành 'sold'
            await tx.product.update({
              where: { id: product.id },
              data: { status: "sold" },
            });

            // Gửi mail cho Winner & Seller (Gửi sau khi commit)
            await AuctionTaskService.sendAuctionEndEmails(product, true);
          } else {
            // TRƯỜNG HỢP 2: KHÔNG CÓ AI ĐẤU GIÁ
            // Cập nhật sản phẩm thành 'expired'
            await tx.product.update({
              where: { id: product.id },
              data: { status: "expired" },
            });

            await AuctionTaskService.sendAuctionEndEmails(product, false);
          }
        });
      } catch (error) {
        console.error(`Lỗi khi xử lý sản phẩm ${product.id}:`, error.message);
      }
    }
  },

  sendAuctionEndEmails: async (product, hasWinner) => {
    if (hasWinner) {
      // Mail cho Winner và Seller song song
      await Promise.all([
        sendEmail({
          to: product.winner.email,
          subject: "[Auctiva] Congratulations! You won the auction",
          html: EmailTemplates.auctionWon({
            productName: product.name,
            finalPrice: product.currentPrice,
            transactionLink: `${process.env.CLIENT_URL}/account/transactions`,
          }),
        }),
        sendEmail({
          to: product.seller.email,
          subject: "[Auctiva] Your product has been sold successfully",
          html: EmailTemplates.productSold({
            productName: product.name,
            winnerName: product.winner.fullName,
            finalPrice: product.currentPrice,
          }),
        }),
      ]);
    } else {
      // Mail thông báo cho Seller sản phẩm bị ế (expired)
      await sendEmail({
        to: product.seller.email,
        subject: "[Auctiva] Your auction has ended",
        html: `<p>Product <b>${product.name}</b> has ended with no participants in the auction.</p>`,
      });
    }
  },
};

export default AuctionTaskService;
