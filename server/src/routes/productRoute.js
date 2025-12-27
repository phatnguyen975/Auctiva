import express from "express";
import ProductController from "../controllers/productController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { ProductCreateSchema, ProductQuerySchema } from "../schemas/productSchema.js";
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

export default router;
