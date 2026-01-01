import express from "express";
import CategoryController from "../controllers/categoryController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  CategoryCreateSchema,
  CategoryIdSchema,
  CategoryUpdateSchema,
} from "../schemas/categorySchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.post(
  "/",
  verifyToken,
  authorize(["admin"]),
  validate({ body: CategoryCreateSchema }),
  CategoryController.create
);

router.get("/", CategoryController.getAll);

router.put(
  "/:id",
  verifyToken,
  authorize(["admin"]),
  validate({ body: CategoryUpdateSchema, params: CategoryIdSchema }),
  CategoryController.update
);

router.delete(
  "/:id",
  verifyToken,
  authorize(["admin"]),
  validate({ params: CategoryIdSchema }),
  CategoryController.delete
);

export default router;
