import BidRejectionService from "../services/bidRejectionService.js";

const BidRejectionController = {
  create: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const userId = req.user.id;
      const newBidRejection = await BidRejectionService.createBidRejection({
        productId,
        userId,
      });
      res.created("Bid rejection created successfully", newBidRejection);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default BidRejectionController;
