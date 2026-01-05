import express from "express";
import UserController from "../controllers/userController.js";
import WatchlistController from "../controllers/watchlistController.js";
import RatingController from "../controllers/ratingController.js";
import BidController from "../controllers/bidController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  ProfileUpdateSchema,
  ProfileIdSchema,
  ProfileQuerySchema,
  PasswordUpdateSchema,
} from "../schemas/profileSchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.get(
  "/",
  verifyToken,
  authorize(["admin"]),
  validate({ query: ProfileQuerySchema }),
  UserController.getAll
);

router.get(
  "/me",
  verifyToken,
  authorize(["bidder", "seller", "admin"]),
  UserController.getMe
);

router.get(
  "/watchlist",
  verifyToken,
  authorize(["bidder", "seller"]),
  WatchlistController.getByUserId
);

router.get(
  "/watchlist/count",
  verifyToken,
  authorize(["bidder", "seller"]),
  WatchlistController.getCountByUserId
);

router.get(
  "/ratings",
  verifyToken,
  authorize(["bidder", "seller"]),
  RatingController.getByUserId
);

router.get(
  "/bids",
  verifyToken,
  authorize(["bidder", "seller"]),
  BidController.getByUserId
);

router.put(
  "/profile",
  verifyToken,
  authorize(["bidder", "seller", "admin"]),
  validate({ body: ProfileUpdateSchema }),
  UserController.updateProfile
);

router.put(
  "/password",
  validate({ body: PasswordUpdateSchema }),
  UserController.updatePassword
);

router.put(
  "/:id/reset-password",
  verifyToken,
  authorize(["admin"]),
  validate({ params: ProfileIdSchema }),
  UserController.resetPassword
);

router.delete(
  "/:id",
  verifyToken,
  authorize(["admin"]),
  validate({ params: ProfileIdSchema }),
  UserController.deleteById
);

export default router;
