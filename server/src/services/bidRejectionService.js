import { prisma } from "../configs/prisma.js";
import { calculateProxyBidding } from "../utils/bidUtil.js";

import { sendEmail, EmailTemplates } from "../configs/nodemailer.js";

const BidRejectionService = {
  createBidRejection: async ({ productId, bidderId, sellerId }) => {
    const result = await prisma.$transaction(async (tx) => {
      // Check quyền của seller trên sản phẩm
      const initialProduct = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!initialProduct || initialProduct.sellerId !== sellerId) {
        throw new Error(
          "You do not have permission to manage this product's bidders."
        );
      }

      // Tạo bid rejection
      await tx.bidRejection.create({
        data: {
          productId,
          bidderId,
        },
      });

      const rejectedBidderIds = await tx.bidRejection.findMany({
        where: { productId },
        select: { bidderId: true },
      });

      const rejectedSet = new Set(rejectedBidderIds.map((r) => r.bidderId));

      const validBids = await tx.bid.findMany({
        where: {
          productId,
          bidderId: {
            notIn: [...rejectedSet],
          },
        },
        orderBy: { createdAt: "asc" },
      });

      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      const { leader, currentPrice } = calculateProxyBidding(
        validBids,
        product.startPrice,
        product.stepPrice
      );

      await tx.product.update({
        where: { id: productId },
        data: {
          winnerId: leader?.bidderId ?? null,
          currentPrice,
        },
      });

      // Lấy thông tin người bị ban để gửi mail
      const bannedUser = await tx.profile.findUnique({
        where: { id: bidderId },
        select: { email: true, fullName: true },
      });

      return {
        leaderId: leader?.bidderId ?? null,
        leaderMaxBid: leader?.maxBid ?? null,
        currentPrice,
        // Thông tin người bị ban để gửi mail
        bannedUser,
        productName: product.name,
      };
    });

    // Báo mail cho bidder bị từ chối
    if (result.bannedUser && result.bannedUser.email) {
      sendEmail({
        to: result.bannedUser.email,
        subject: `[Auctiva] Thông báo về việc tham gia đấu giá sản phẩm ${result.productName}`,
        html: EmailTemplates.bannedNotification({
          bidderName: result.bannedUser.fullName || result.bannedUser.username,
          productName: result.productName,
        }),
      }).catch((err) =>
        console.error("Lỗi gửi mail thông báo ban:", err.message)
      );
    }

    // Trả về kết quả
    return result;
  },
};

export default BidRejectionService;
