import express from "express";
import UserController from "../controllers/userController.js";
import WatchlistController from "../controllers/watchlistController.js";
import RatingController from "../controllers/ratingController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  ProfileUpdateSchema,
  AuthUpdateSchema,
} from "../schemas/profileSchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

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

router.put(
  "/profile",
  verifyToken,
  validate({ body: ProfileUpdateSchema }),
  UserController.updateProfile
);

router.put(
  "/email",
  verifyToken,
  validate({ body: AuthUpdateSchema }),
  UserController.updateEmail
);

router.put(
  "/password",
  verifyToken,
  validate({ body: AuthUpdateSchema }),
  UserController.updatePassword
);

export default router;
