import { prisma } from "../configs/prisma.js";

const TransactionService = {
  // Lấy chi tiết giao dịch
  getTransactionById: async (id, userId) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(id) },
      include: {
        product: {
          include: { images: true },
        },
        winner: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
        seller: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            ratingPositive: true,
            ratingCount: true,
          },
        },
      },
    });

    if (!transaction) throw new Error("Giao dịch không tồn tại.");

    // Check if user is participant (winner or seller)
    const isParticipant =
      transaction.winnerId === userId || transaction.sellerId === userId;

    // If not participant, return limited public info
    if (!isParticipant) {
      return {
        id: transaction.id,
        status: transaction.status,
        product: transaction.product,
        winner: {
          id: transaction.winner.id,
          fullName: transaction.winner.fullName,
          avatarUrl: transaction.winner.avatarUrl,
          ratingPositive: transaction.winner.ratingPositive,
          ratingCount: transaction.winner.ratingCount,
        },
        seller: {
          id: transaction.seller.id,
          fullName: transaction.seller.fullName,
          avatarUrl: transaction.seller.avatarUrl,
          ratingPositive: transaction.seller.ratingPositive,
          ratingCount: transaction.seller.ratingCount,
        },
        // Hide sensitive information
        shippingAddress: null,
        paymentProof: null,
        shippingReceipt: null,
        winnerId: transaction.winnerId,
        sellerId: transaction.sellerId,
        finalPrice: transaction.finalPrice,
        createdAt: transaction.createdAt,
      };
    }

    // For participants, fetch ratings
    // Winner's rating (winner rates seller)
    const winnerRating = await prisma.rating.findFirst({
      where: {
        productId: transaction.productId,
        type: "bidder_seller",
        fromUserId: transaction.winnerId,
        targetUserId: transaction.sellerId,
      },
    });

    // Seller's rating (seller rates winner)
    const sellerRating = await prisma.rating.findFirst({
      where: {
        productId: transaction.productId,
        type: "seller_bidder",
        fromUserId: transaction.sellerId,
        targetUserId: transaction.winnerId,
      },
    });

    return {
      ...transaction,
      buyerRating: winnerRating
        ? winnerRating.score > 0
          ? "up"
          : "down"
        : null,
      buyerReview: winnerRating?.comment || null,
      sellerRating: sellerRating
        ? sellerRating.score > 0
          ? "up"
          : "down"
        : null,
      sellerReview: sellerRating?.comment || null,
    };
  },

  // Giai đoạn 1: Buyer nộp địa chỉ và minh chứng chuyển tiền
  submitPaymentInfo: async (
    id,
    userId,
    { shippingAddress, paymentProofUrl }
  ) => {
    const tx = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!tx || tx.winnerId !== userId)
      throw new Error("Chỉ người mua mới có quyền này.");
    if (tx.status !== "pending")
      throw new Error("Giao dịch không ở trạng thái chờ thanh toán.");

    return await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        shippingAddress,
        paymentProof: paymentProofUrl,
        status: "paid", // Chuyển sang Giai đoạn 2: Chờ seller confirm và ship
      },
    });
  },

  // Giai đoạn 2: Seller xác nhận đã nhận tiền và upload biên lai giao hàng
  confirmAndShip: async (id, userId, { shippingReceiptUrl }) => {
    const tx = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!tx || tx.sellerId !== userId)
      throw new Error("Chỉ người bán mới có quyền này.");
    if (tx.status !== "paid")
      throw new Error("Người mua chưa nộp minh chứng thanh toán.");

    return await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        shippingReceipt: shippingReceiptUrl,
        status: "shipped", // Chuyển sang Giai đoạn 3: Đang vận chuyển
      },
    });
  },

  // Giai đoạn 2 (Option): Seller hủy giao dịch
  cancelTransaction: async (transactionId, sellerId) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra sự tồn tại của giao dịch và quyền sở hữu [cite: 27]
      const transaction = await tx.transaction.findUnique({
        where: { id: transactionId },
      });

      if (!transaction || transaction.sellerId !== sellerId) {
        throw new Error("Giao dịch không tồn tại hoặc bạn không có quyền.");
      }

      // Không cho phép hủy nếu giao dịch đã hoàn thành hoặc đã bị hủy trước đó [cite: 27]
      if (
        transaction.status === "cancelled" ||
        transaction.status === "completed"
      ) {
        throw new Error("Không thể hủy giao dịch đã kết thúc.");
      }

      // 2. Cập nhật trạng thái giao dịch thành 'cancelled' [cite: 27]
      const updated = await tx.transaction.update({
        where: { id: transactionId },
        data: { status: "cancelled" },
      });

      // 3. Tự động tạo đánh giá xấu từ Bidder gửi cho Seller
      await tx.rating.create({
        data: {
          score: -1,
          comment: "Seller did not sell",
          type: "bidder_seller", // Bidder đánh giá Seller
          product: {
            connect: { id: transaction.productId }, // Kết nối với sản phẩm
          },
          targetUser: {
            connect: { id: transaction.sellerId }, // Người bị đánh giá là Seller
          },
          fromUser: {
            connect: { id: transaction.winnerId }, // Người gửi đánh giá là Bidder (winner)
          },
        },
      });

      // 4. Cập nhật tổng số lượt đánh giá của Seller trong hồ sơ
      await tx.profile.update({
        where: { id: sellerId },
        data: {
          ratingCount: { increment: 1 },
        },
      });

      return updated;
    });
  },

  // Giai đoạn 3: Buyer xác nhận đã nhận được hàng
  confirmReceived: async (id, userId) => {
    const tx = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!tx || tx.winnerId !== userId)
      throw new Error("Chỉ người mua mới có quyền xác nhận.");
    if (tx.status !== "shipped")
      throw new Error("Sản phẩm chưa được chuyển đi.");

    return await prisma.transaction.update({
      where: { id: Number(id) },
      data: { status: "completed" }, // Chuyển sang Giai đoạn 4: Đã giao hàng
    });
  },

  // Giai đoạn 4: Đánh giá đối phương
  submitRating: async (id, fromUserId, { score, comment }) => {
    const tx = await prisma.transaction.findUnique({
      where: { id: Number(id) },
    });

    if (!tx || tx.status !== "completed")
      throw new Error("Giao dịch chưa hoàn tất.");

    // Xác định người được đánh giá (target)
    if (tx.winnerId !== fromUserId && tx.sellerId !== fromUserId)
      throw new Error("Bạn không tham gia giao dịch này.");

    const targetUserId = tx.winnerId === fromUserId ? tx.sellerId : tx.winnerId;
    const ratingType =
      tx.winnerId === fromUserId ? "bidder_seller" : "seller_bidder";

    // Kiểm tra xem đã đánh giá giao dịch này chưa
    const existingRating = await prisma.rating.findFirst({
      where: {
        productId: tx.productId,
        type: ratingType,
        fromUserId: fromUserId,
        targetUserId: targetUserId,
      },
    });
    if (existingRating)
      throw new Error("Bạn đã thực hiện đánh giá cho giao dịch này rồi.");

    return await prisma.$transaction(async (p) => {
      // 1. Tạo bản ghi đánh giá
      const rating = await p.rating.create({
        data: {
          productId: tx.productId,
          type: ratingType,
          fromUserId,
          targetUserId,
          score,
          comment,
        },
      });

      // 2. Cập nhật uy tín cho người nhận đánh giá
      const currentProfile = await p.profile.findUnique({
        where: { id: targetUserId },
        select: { ratingCount: true, ratingPositive: true },
      });

      const currentCount = currentProfile?.ratingCount || 0;
      const currentPositive = currentProfile?.ratingPositive || 0;

      await p.profile.update({
        where: { id: targetUserId },
        data: {
          ratingCount: currentCount + 1,
          ratingPositive: score > 0 ? currentPositive + 1 : currentPositive,
        },
      });

      return rating;
    });
  },
};

export default TransactionService;
