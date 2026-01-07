import { Router } from "express";
import TransactionController from "../controllers/transactionController.js";
import { validateApiKey } from "../middlewares/apiMiddleware.js";
import { verifyToken, authorize } from "../middlewares/userAuthMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { RatingSchema } from "../schemas/transactionSchema.js";
const router = Router();

router.use(validateApiKey);

// Route lấy thông tin chi tiết để hiển thị giao diện theo trạng thái
router.get("/:id", verifyToken, TransactionController.getDetail);

// GIAI ĐOẠN 1: Winner nộp thông tin (now expects URL in body)
router.post("/:id/payment", verifyToken, TransactionController.submitPayment);

// GIAI ĐOẠN 2: Seller xác nhận và gửi hàng (now expects URL in body)
router.post("/:id/ship", verifyToken, TransactionController.confirmShipping);

// GIAI ĐOẠN 2: Seller hủy giao dịch
router.post(
  "/:id/cancel",
  verifyToken,
  authorize(["seller"]),
  TransactionController.cancel
);

// GIAI ĐOẠN 3: Winner xác nhận nhận hàng
router.post("/:id/receive", verifyToken, TransactionController.confirmReceived);

// GIAI ĐOẠN 4: Cả 2 thực hiện đánh giá
router.post(
  "/:id/rate",
  verifyToken,
  validate({ body: RatingSchema }),
  TransactionController.rate
);

export default router;
