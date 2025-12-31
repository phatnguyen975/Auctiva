import { prisma } from "../configs/prisma.js";

const RatingService = {
  createRating: async ({ fromUserId, targetUserId, score, comment }) => {
    if (fromUserId === targetUserId) {
      throw new Error("You cannot rate yourself");
    }

    return prisma.$transaction(async (tx) => {
      const rating = await tx.rating.create({
        data: {
          fromUserId,
          targetUserId,
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
    return await prisma.rating.findMany({
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
  },
};

export default RatingService;
