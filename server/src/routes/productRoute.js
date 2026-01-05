import express from "express";
import ProductController from "../controllers/productController.js";
import BidController from "../controllers/bidController.js";
import RatingController from "../controllers/ratingController.js";
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
import { RatingCreateSchema } from "../schemas/ratingSchema.js";
import {
  verifyToken,
  authorize,
  optionalAuth,
} from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.get("/home", optionalAuth, ProductController.getHome);

router.get(
  "/",
  optionalAuth,
  validate({ query: ProductQuerySchema }),
  ProductController.getAll
);

router.get(
  "/won",
  verifyToken,
  authorize(["bidder"]),
  ProductController.getWonByUserId
);

router.post(
  "/",
  verifyToken,
  authorize(["seller"]),
  validate({ body: ProductCreateSchema }),
  ProductController.create
);

router.get(
  "/active",
  verifyToken,
  authorize(["seller"]),
  ProductController.getActiveByUserId
);

router.get(
  "/sold",
  verifyToken,
  authorize(["seller"]),
  ProductController.getSoldByUserId
);

router.get(
  "/analysis",
  verifyToken,
  authorize(["seller"]),
  ProductController.getAnalysisByUserId
);

router.get(
  "/:id",
  validate({ params: ProductIdSchema }),
  ProductController.getById
);

router.get(
  "/:id/related",
  validate({ params: ProductIdSchema }),
  ProductController.getRelated
);

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

router.get(
  "/:id/bids",
  validate({ params: ProductIdSchema }),
  BidController.getByProductId
);

router.post(
  "/:id/bids",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ body: BidCreateSchema, params: ProductIdSchema }),
  BidController.create
);

router.post(
  "/:id/ratings",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ body: RatingCreateSchema, params: ProductIdSchema }),
  RatingController.create
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

router.delete(
  "/:id/watchlist",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ params: ProductIdSchema }),
  WatchlistController.delete
);

export default router;
