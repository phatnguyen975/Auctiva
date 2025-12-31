import RatingService from "../services/ratingService.js";

const RatingController = {
  create: async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const { targetUserId, score, comment } = req.validated.body;
      const newRating = await RatingService.createRating({
        fromUserId,
        targetUserId,
        score,
        comment,
      });
      res.created("Rating created successfully", newRating);
    } catch (error) {
      res.error(error.message);
    }
  },

  getByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      const ratings = await RatingService.getRatingsByUserId(userId);
      res.ok("Ratings retrieved successfully", ratings);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default RatingController;
