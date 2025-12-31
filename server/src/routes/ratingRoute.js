import express from "express";
import RatingController from "../controllers/ratingController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { RatingCreateSchema } from "../schemas/ratingSchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.post(
  "/",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ body: RatingCreateSchema }),
  RatingController.create
);

export default router;
