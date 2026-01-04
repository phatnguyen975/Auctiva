import BidRejectionService from "../services/bidRejectionService.js";

const BidRejectionController = {
  create: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const sellerId = req.user.id;
      const bidderId = req.body.bidderId;

      if (!bidderId) {
        return res.error("Bidder ID is required");
      }

      const newBidRejection = await BidRejectionService.createBidRejection({
        productId,
        bidderId,
        sellerId,
      });
      res.created("Bid rejection created successfully", newBidRejection);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default BidRejectionController;
