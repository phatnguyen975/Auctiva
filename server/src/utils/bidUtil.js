export const calculateProxyBidding = (bids, startPrice, stepPrice) => {
  let leader = null;
  let currentPrice = startPrice;

  for (const bid of bids) {
    if (!leader) {
      leader = bid;
      continue;
    }

    if (bid.maxBid <= leader.maxBid) {
      currentPrice = Math.min(bid.maxBid, leader.maxBid);
    } else {
      currentPrice = Math.min(leader.maxBid + stepPrice, bid.maxBid);
      leader = bid;
    }
  }

  return {
    leader,
    currentPrice,
  };
};

export const checkBidderRating = async ({
  tx,
  bidderId,
  isInstantPurchase,
}) => {
  const ratings = await tx.rating.findMany({
    where: { targetUserId: bidderId },
    select: {
      score: true,
    },
  });

  if (ratings.length === 0) {
    if (!isInstantPurchase) {
      throw new Error("This product does not allow unrated bidders");
    }
    return;
  }

  const positiveCount = ratings.filter((r) => r.score > 0).length;
  const ratio = positiveCount / ratings.length;

  if (ratio < 0.8) {
    throw new Error("Your rating score is too low to place a bid");
  }
};
