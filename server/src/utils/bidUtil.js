export const calculateProxyBidding = (bids, startPrice, stepPrice) => {
  if (bids.length === 0) return { leader: null, currentPrice: startPrice };

  let leader = bids[0];
  let currentPrice = startPrice;

  for (let i = 1; i < bids.length; i++) {
    const bid = bids[i];

    // Nếu người đặt giá mới TRÙNG với người đang dẫn đầu
    if (bid.bidderId === leader.bidderId) {
      // Chỉ cập nhật mức trần (MaxBid), không tăng CurrentPrice
      if (Number(bid.maxBid) > Number(leader.maxBid)) {
        leader = bid;
      }
      continue; // Bỏ qua việc tính lại giá
    }

    // Nếu là người khác đặt giá
    if (Number(bid.maxBid) <= Number(leader.maxBid)) {
      // Người cũ vẫn thắng, nâng giá lên mức của người mới (không cần + step theo ví dụ của bạn)
      currentPrice = Number(bid.maxBid);
    } else {
      // Người mới vượt mặt, giá = Max cũ + Bước giá
      currentPrice = Math.min(
        Number(leader.maxBid) + Number(stepPrice),
        Number(bid.maxBid)
      );
      leader = bid;
    }
  }

  return { leader, currentPrice };
};

export const checkBidderRating = async ({
  tx,
  bidderId,
  isInstantPurchase,
}) => {
  const bidderProfile = await tx.profile.findUnique({
    where: { id: bidderId },
    select: {
      ratingPositive: true,
      ratingCount: true,
    },
  });

  if (!bidderProfile) {
    throw new Error("Bidder profile not found");
  }

  if (bidderProfile.ratingCount === 0) {
    // Nếu không phải mua ngay (đang đấu giá) thì không cho phép
    if (!isInstantPurchase) {
      throw new Error("This product does not allow unrated bidders");
    }
    return; // Cho phép nếu là Instant Purchase
  }

  const ratio = bidderProfile.ratingPositive / bidderProfile.ratingCount;
  if (ratio < 0.8) {
    throw new Error("Your rating score is too low to place a bid");
  }
};

export const checkBidRejection = async ({ tx, productId, bidderId }) => {
  const rejected = await tx.bidRejection.findFirst({
    where: {
      productId,
      bidderId,
    },
  });

  if (rejected) {
    throw new Error("You are rejected from bidding this product");
  }
};
