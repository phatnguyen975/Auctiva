import express from "express";
import SellerUpgradeController from "../controllers/sellerUpgradeController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  SellerUpgradeCreateSchema,
  SellerUpgradeIdSchema,
  SellerUpgradeUpdateSchema,
} from "../schemas/sellerUpgradeSchema.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.use(validateApiKey);

router.post(
  "/",
  verifyToken,
  authorize(["bidder"]),
  validate({ body: SellerUpgradeCreateSchema }),
  SellerUpgradeController.create
);

router.get(
  "/",
  verifyToken,
  authorize(["admin"]),
  SellerUpgradeController.getAll
);

router.put(
  "/:id",
  verifyToken,
  authorize(["admin"]),
  validate({ body: SellerUpgradeUpdateSchema, params: SellerUpgradeIdSchema }),
  SellerUpgradeController.update
);

export default router;
