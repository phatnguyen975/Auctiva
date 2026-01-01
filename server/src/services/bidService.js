import { prisma } from "../configs/prisma.js";
import {
  calculateProxyBidding,
  checkBidderRating,
  checkBidRejection,
} from "../utils/bidUtil.js";

const BidService = {
  createBid: async ({ productId, userId, maxBid }) => {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const now = new Date();
      if (new Date(product.endDate) < now) {
        throw new Error("Auction already ended");
      }

      await checkBidderRating({
        tx,
        bidderId: userId,
        isInstantPurchase: product.isInstantPurchase,
      });

      await checkBidRejection({
        tx,
        productId,
        bidderId: userId,
      });

      await tx.bid.create({
        data: {
          productId,
          bidderId: userId,
          maxBid,
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

  getBidsByProductId: async (productId) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return await prisma.bid.findMany({
      where: { productId },
      include: {
        bidder: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
      omit: { bidderId: true },
      orderBy: { createdAt: "desc" },
    });
  },
};

export default BidService;
