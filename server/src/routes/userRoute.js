import express from "express";
import WatchlistController from "../controllers/watchlistController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.get(
  "/me/watchlist",
  verifyToken,
  authorize(["bidder", "seller"]),
  WatchlistController.getByUserId
);

export default router;
