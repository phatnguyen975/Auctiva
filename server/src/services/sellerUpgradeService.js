import { prisma } from "../configs/prisma.js";

const CategoryService = {
  createSellerUpgrade: async (data) => {
    const user = await prisma.profile.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.sellerUpgradeRequest.create({
      data: { userId: data.userId },
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

  updateSellerUpgrade: async (id, data) => {
    const user = await prisma.profile.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (data.status === "approved") {
      await prisma.profile.update({
        where: { id: data.userId },
        data: { role: "seller" },
      })
    }

    return await prisma.sellerUpgradeRequest.update({
      where: { id },
      data: { status: data.status },
    });
  },
};

export default CategoryService;
