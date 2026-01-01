import express from "express";
import ProductController from "../controllers/productController.js";
import BidController from "../controllers/bidController.js";
import BidRejectionController from "../controllers/bidRejectionController.js";
import WatchlistController from "../controllers/watchlistController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  ProductCreateSchema,
  ProductIdSchema,
  ProductQuerySchema,
  ProductUpdateSchema,
} from "../schemas/productSchema.js";
import { BidCreateSchema } from "../schemas/bidSchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.post(
  "/",
  verifyToken,
  authorize(["seller"]),
  validate({ body: ProductCreateSchema }),
  ProductController.create
);

router.post(
  "/:id/bids",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ body: BidCreateSchema, params: ProductIdSchema }),
  BidController.create
);

router.post(
  "/:id/bid-rejections",
  verifyToken,
  authorize(["seller"]),
  validate({ params: ProductIdSchema }),
  BidRejectionController.create
);

router.post(
  "/:id/watchlist",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ params: ProductIdSchema }),
  WatchlistController.create
);

router.get(
  "/",
  validate({ query: ProductQuerySchema }),
  ProductController.getAll
);

router.get("/:id/bids", BidController.getByProductId);

router.get("/ending-soon", ProductController.getEndingSoon);

router.get("/most-bids", ProductController.getMostBids);

router.get("/highest-price", ProductController.getHighestPrice);

router.put(
  "/:id",
  verifyToken,
  authorize(["seller"]),
  validate({ body: ProductUpdateSchema, params: ProductIdSchema }),
  ProductController.update
);

router.delete(
  "/:id",
  verifyToken,
  authorize(["admin"]),
  validate({ params: ProductIdSchema }),
  ProductController.delete
);

router.delete(
  "/:id/watchlist",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ params: ProductIdSchema }),
  WatchlistController.delete
);

export default router;
