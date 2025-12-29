import express from "express";
import BidController from "../controllers/bidController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { BidCreateSchema } from "../schemas/bidSchema.js";
import { ProductIdSchema } from "../schemas/productSchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";
import { checkAuctionEndTime } from "../middlewares/auctionEndMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.post(
  "/place/:id",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ body: BidCreateSchema, params: ProductIdSchema }),
  checkAuctionEndTime,
  BidController.create
);

export default router;
