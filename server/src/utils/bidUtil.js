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
