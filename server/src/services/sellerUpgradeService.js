import { prisma } from "../configs/prisma.js";

const CategoryService = {
  createSellerUpgrade: async (userId) => {
    const user = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.sellerUpgradeRequest.create({
      data: { userId },
    });
  },

  getSellerUpgrade: async () => {
    return await prisma.sellerUpgradeRequest.findMany({
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  },

  updateSellerUpgrade: async ({ id, userId, status }) => {
    const user = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (status === "approved") {
      await prisma.profile.update({
        where: { id: userId },
        data: { role: "seller" },
      });
    }

    return await prisma.sellerUpgradeRequest.update({
      where: { id },
      data: { status },
    });
  },
};

export default CategoryService;
