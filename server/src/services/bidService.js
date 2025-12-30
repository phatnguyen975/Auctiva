import { prisma } from "../configs/prisma.js";
import { calculateProxyBidding, checkBidderRating } from "../utils/bidUtil.js";

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
        bidderId,
        isInstantPurchase: product.isInstantPurchase,
      });

      await tx.bid.create({
        data: {
          productId,
          bidderId: userId,
          maxBid,
        },
      });

      const bids = await tx.bid.findMany({
        where: { productId },
        orderBy: { createdAt: "asc" },
      });

      const { leader, currentPrice } = calculateProxyBidding(
        bids,
        product.startPrice,
        product.stepPrice
      );

      await tx.product.update({
        where: { id: productId },
        data: {
          winnerId: leader.bidderId,
          currentPrice,
        },
      });

      return {
        leaderId: leader.bidderId,
        leaderMaxBid: leader.maxBid,
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
