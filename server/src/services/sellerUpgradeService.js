import { prisma } from "../configs/prisma.js";

const SellerUpgradeService = {
  // Bidder gửi yêu cầu nâng cấp lên Seller
  createSellerUpgrade: async (userId) => {
    // Check xem có request nào đang pending không để tránh spam
    const existingRequest = await prisma.sellerUpgradeRequest.findFirst({
      where: { userId, status: "pending" },
    });

    if (existingRequest) {
      throw new Error("You already have a pending request.");
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
            id: true,
            username: true,
            fullName: true,
            email: true,
            role: true,
            ratingPositive: true,
            ratingCount: true,
            _count: {
              select: {
                bids: true,
              },
            },
          },
        },
      },
      omit: { userId: true },
    });
  },

  getSellerPermission: async (userId) => {
    const permission = await prisma.sellerPermission.findFirst({
      where: { userId },
      orderBy: { approvedAt: "desc" },
    });

    if (!permission) {
      return null;
    }

    return {
      approvedAt: permission.approvedAt,
      expiredAt: permission.expiredAt,
    };
  },

  updateSellerUpgrade: async ({ id, status }) => {
    const request = await prisma.sellerUpgradeRequest.findUnique({
      where: { id: Number(id) },
    });

    if (!request) {
      throw new Error("Seller upgrade request not found");
    }

    if (request.status !== "pending") {
      throw new Error("Request has already been processed.");
    }

    // Nếu REJECT thì chỉ cập nhật status request
    if (status === "rejected") {
      return await prisma.sellerUpgradeRequest.update({
        where: { id: Number(id) },
        data: { status: "rejected" },
      });
    }

    // Nếu APPROVE thì chạy Transaction
    if (status === "approved") {
      const now = new Date();
      const expiredAt = new Date();
      expiredAt.setDate(now.getDate() + 7); // +7 ngày

      return await prisma.$transaction(async (tx) => {
        // Cập nhật request thành approved
        const updatedRequest = await tx.sellerUpgradeRequest.update({
          where: { id: Number(id) },
          data: { status: "approved" },
        });

        // Cập nhật Role trong Profile thành seller
        await tx.profile.update({
          where: { id: request.userId },
          data: { role: "seller" },
        });

        // Tạo Seller Permission mới
        // Lưu ý: Nên set các permission cũ của user này thành expired trước (nếu có) để tránh xung đột
        await tx.sellerPermission.updateMany({
          where: { userId: request.userId, status: "active" },
          data: { status: "expired" },
        });

        await tx.sellerPermission.create({
          data: {
            userId: request.userId,
            status: "active",
            approvedAt: now,
            expiredAt: expiredAt,
          },
        });

        return updatedRequest;
      });
    }
  },
};

export default SellerUpgradeService;
