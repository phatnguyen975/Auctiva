import { prisma } from "../configs/prisma.js";
import { calculateProxyBidding } from "../utils/bidUtil.js";

const BidRejectionService = {
  createBidRejection: async ({ productId, bidderId, sellerId }) => {
    return prisma.$transaction(async (tx) => {
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

      return {
        leaderId: leader?.bidderId ?? null,
        leaderMaxBid: leader?.maxBid ?? null,
        currentPrice,
      };
    });
  },
};

export default BidRejectionService;
