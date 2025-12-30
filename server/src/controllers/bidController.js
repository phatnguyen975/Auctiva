import BidService from "../services/bidService.js";

const BidController = {
  create: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const userId = req.user.id;
      const maxBid = req.validated.body.maxBid;
      const newBid = await BidService.createBid({ productId, userId, maxBid });
      res.created("Bid created successfully", newBid);
    } catch (error) {
      res.error(error.message);
    }
  },

  getByProductId: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const bids = await BidService.getBidsByProductId(productId);
      res.ok("Bids retrieved successfully", bids);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default BidController;
