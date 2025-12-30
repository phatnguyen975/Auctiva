import { prisma } from "../configs/prisma.js";

const SellerUpgradeService = {
  createSellerUpgrade: async (userId) => {
    return await prisma.sellerUpgradeRequest.create({
      data: { userId },
    });
  },

  getSellerUpgrade: async () => {
    return await prisma.sellerUpgradeRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
      omit: { userId: true },
    });
  },

  updateSellerUpgrade: async ({ id, userId, status }) => {
    const sellerUpgrade = await prisma.sellerUpgradeRequest.findUnique({
      where: { id },
    });

    if (!sellerUpgrade) {
      throw new Error("Seller upgrade not found");
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

export default SellerUpgradeService;
