import { Router } from "express";
import QAController from "../controllers/qaController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { AskQuestionSchema, ReplyQuestionSchema } from "../schemas/qaSchema.js";

const router = Router();

router.use(validateApiKey);

// GET /api/qa/:productID
router.get("/:productID", QAController.getProductQA);

// POST /api/qa/ask
router.post(
  "/ask",
  verifyToken,
  authorize(["bidder", "seller"]),
  validate({ body: AskQuestionSchema }),
  QAController.ask
);

// POST /api/qa/reply
router.post(
  "/reply",
  verifyToken,
  authorize(["seller"]),
  validate({ body: ReplyQuestionSchema }),
  QAController.reply
);

export default router;
