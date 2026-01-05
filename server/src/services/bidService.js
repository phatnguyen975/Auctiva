import { prisma } from "../configs/prisma.js";
import Decimal from "decimal.js";
import AdminSettingsService from "../services/adminSettingService.js";
import {
  calculateProxyBidding,
  checkBidderRating,
  checkBidRejection,
} from "../utils/bidUtil.js";

const BidService = {
  createBid: async ({ productId, userId, emailBidder, maxBid }) => {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { seller: true, winner: true },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const now = new Date();
      const endDate = new Date(product.endDate);

      if (endDate <= now) {
        throw new Error("Auction already ended");
      }

      const settings = await AdminSettingsService.getAdminSettings();
      const extendThresholdMinutes = settings.extend_threshold_minutes;
      const autoExtendMinutes = settings.auto_extend_minutes;

      const remainingMinutes =
        (endDate.getTime() - now.getTime()) / (1000 * 60);
      let newEndDate = endDate;

      if (product.isAutoExtend && remainingMinutes <= extendThresholdMinutes) {
        newEndDate = new Date(
          endDate.getTime() + autoExtendMinutes * 60 * 1000
        );

        await tx.product.update({
          where: { id: product.id },
          data: { endDate: newEndDate },
        });
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

      const emailTasks = {
        seller: {
          email: product.seller.email,
          data: {
            productName: product.name,
            currentPrice,
            winnerName: leader.fullName,
            productLink: `${process.env.CLIENT_URL}/products/${productId}`,
          },
        },
        currentBidder: {
          email: emailBidder, // Email của người vừa nhấn Bid
          data: {
            productName: product.name,
            maxBid,
            currentPrice,
            isWinning: leader.bidderId === userId,
          },
        },
        oldWinner:
          product.winner && product.winner.id !== leader.bidderId
            ? {
                email: product.winner.email,
                data: {
                  productName: product.name,
                  currentPrice,
                  productLink: `${process.env.CLIENT_URL}/products/${productId}`,
                },
              }
            : null,
      };

      return {
        newBid: {
          leaderId: leader?.bidderId ?? null,
          leaderMaxBid: leader?.maxBid ?? null,
          currentPrice,
        },
        emailTasks,
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
            ratingPositive: true,
            ratingCount: true,
          },
        },
      },
      omit: { bidderId: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getBidsByUserId: async (userId) => {
    const products = await prisma.product.findMany({
      where: {
        status: "active",
        endDate: { gt: new Date() },
        bids: {
          some: {
            bidderId: userId,
            status: "valid",
          },
        },
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
          select: {
            url: true,
          },
        },
        bids: {
          where: { status: "valid" },
          select: {
            bidderId: true,
            maxBid: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: { endDate: "asc" },
    });

    return products.map((product) => {
      const myBids = product.bids.filter((b) => b.bidderId === userId);

      const myBid = myBids.length
        ? Decimal.max(...myBids.map((b) => new Decimal(b.maxBid))).toNumber()
        : 0;

      const highestBid = product.bids.length
        ? Decimal.max(
            ...product.bids.map((b) => new Decimal(b.maxBid))
          ).toNumber()
        : 0;

      return {
        id: product.id,
        image: product.images[0]?.url ?? "",
        title: product.name,
        myBid,
        currentBid: new Decimal(product.currentPrice).toNumber(),
        isWinning: myBid > 0 && myBid === highestBid,
        timeLeft: product.endDate,
        totalBids: product._count.bids,
      };
    });
  },
};

export default BidService;
