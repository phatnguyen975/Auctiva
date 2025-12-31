import WatchlistService from "../services/watchlistService.js";

const WatchlistController = {
  create: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const userId = req.user.id;
      const newWatchlist = await WatchlistService.addProductToWatchlist({
        productId,
        userId,
      });
      res.created("Product added to watchlist successfully", newWatchlist);
    } catch (error) {
      res.error(error.message);
    }
  },

  getByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      const watchlist = await WatchlistService.getWatchlistByUserId(userId);
      res.ok("Watchlist retrieved successfully", watchlist);
    } catch (error) {
      res.error(error.message);
    }
  },

  delete: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const userId = req.user.id;
      await WatchlistService.deleteProductFromWatchlist({ productId, userId });
      res.ok("Product deleted from watchlist successfully", null);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default WatchlistController;
