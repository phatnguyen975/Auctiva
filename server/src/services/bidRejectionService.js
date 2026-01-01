import { prisma } from "../configs/prisma.js";
import { calculateProxyBidding } from "../utils/bidUtil.js";

const BidRejectionService = {
  createBidRejection: async ({ productId, userId }) => {
    return prisma.$transaction(async (tx) => {
      await tx.bidRejection.create({
        data: {
          productId,
          bidderId: userId,
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
