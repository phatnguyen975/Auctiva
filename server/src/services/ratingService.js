import { prisma } from "../configs/prisma.js";

const RatingService = {
  createRating: async ({
    productId,
    fromUserId,
    targetUserId,
    type,
    score,
    comment,
  }) => {
    if (fromUserId === targetUserId) {
      throw new Error("You cannot rate yourself");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return prisma.$transaction(async (tx) => {
      const rating = await tx.rating.create({
        data: {
          productId,
          fromUserId,
          targetUserId,
          type,
          score,
          comment,
        },
      });

      await tx.profile.update({
        where: { id: targetUserId },
        data: {
          ratingCount: { increment: 1 },
          ...(score === 1 && {
            ratingPositive: { increment: 1 },
          }),
        },
      });

      return rating;
    });
  },

  getRatingsByUserId: async (userId) => {
    const ratings = await prisma.rating.findMany({
      where: { targetUserId: userId },
      include: {
        fromUser: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      omit: { fromUserId: true },
    });

    return ratings.map((rating) => ({
      id: rating.id,
      reviewer: rating.fromUser.fullName || rating.fromUser.username,
      score: rating.score,
      comment: rating.comment,
      ratedAt: rating.createdAt,
    }));
  },
};

export default RatingService;
