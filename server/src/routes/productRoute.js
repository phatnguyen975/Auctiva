import express from "express";
import ProductController from "../controllers/productController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  ProductCreateSchema,
  ProductIdSchema,
  ProductQuerySchema,
} from "../schemas/productSchema.js";
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

router.get(
  "/",
  validate({ query: ProductQuerySchema }),
  ProductController.getAll
);

router.get("/ending-soon", ProductController.getEndingSoon);

router.get("/most-bids", ProductController.getMostBids);

router.get("/highest-price", ProductController.getHighestPrice);

router.delete(
  "/:id",
  verifyToken,
  authorize(["admin"]),
  validate({ params: ProductIdSchema }),
  ProductController.delete
);

export default router;
