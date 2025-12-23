import express from "express";
import CategoryController from "../controllers/categoryController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { CategoryCreateSchema } from "../schemas/categorySchema.js";
import { verifyToken, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.post(
  "/",
  verifyToken,
  authorize(["admin"]),
  validate({ body: CategoryCreateSchema }),
  CategoryController.create
);

router.get(
  "/",
  // verifyToken,
  CategoryController.getAll
);

export default router;
