import { prisma } from "../configs/prisma.js";

const WatchlistService = {
  addProductToWatchlist: async ({ productId, userId }) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const watchedProduct = await prisma.watchlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (watchedProduct) {
      throw new Error("Product already exist");
    }

    return await prisma.watchlist.create({
      data: {
        userId,
        productId,
      },
    });
  },

  getWatchlistByUserId: async (userId) => {
    return await prisma.product.findMany({
      where: {
        watchlist: {
          some: { userId },
        },
      },
      orderBy: { endDate: "asc" },
    });
  },

  deleteProductFromWatchlist: async ({ productId, userId }) => {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const watchedProduct = await prisma.watchlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!watchedProduct) {
      throw new Error("Product not watched");
    }

    await prisma.watchlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  },
};

export default WatchlistService;
