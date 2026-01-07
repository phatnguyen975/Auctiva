import TransactionService from "../services/transactionService.js";

const TransactionController = {
  // Lấy chi tiết
  getDetail: async (req, res) => {
    try {
      const data = await TransactionService.getTransactionById(
        req.params.id,
        req.user.id
      );
      res.json(data);
    } catch (error) {
      console.log("Error in getDetail:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  // Giai đoạn 1: Buyer submit
  submitPayment: async (req, res) => {
    try {
      const paymentData = {
        shippingAddress: req.body.shippingAddress,
        paymentProofUrl: req.body.paymentProofUrl, // Now expecting URL string from client
      };

      const data = await TransactionService.submitPaymentInfo(
        req.params.id,
        req.user.id,
        paymentData
      );
      res.json({
        success: true,
        message: "Đã gửi minh chứng thanh toán thành công.",
        data,
      });
    } catch (error) {
      console.log("Error in submitPayment:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  // Giai đoạn 2: Seller confirm & ship
  confirmShipping: async (req, res) => {
    try {
      const shippingData = {
        shippingReceiptUrl: req.body.shippingReceiptUrl, // Now expecting URL string from client
      };

      const data = await TransactionService.confirmAndShip(
        req.params.id,
        req.user.id,
        shippingData
      );
      res.json({
        success: true,
        message: "Xác nhận đã nhận tiền và đang giao hàng.",
        data,
      });
    } catch (error) {
      console.log("Error in confirmShipping:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  // Giai đoạn 2: Seller cancel
  cancel: async (req, res) => {
    try {
      const cancelledTransaction = await TransactionService.cancelTransaction(
        Number(req.params.id),
        req.user.id
      );
      res.ok(
        "The order has been successfully canceled. A negative review has been recorded for your profile.",
        cancelledTransaction
      );
    } catch (error) {
      console.log("Error in cancel:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  // Giai đoạn 3: Buyer confirm received
  confirmReceived: async (req, res) => {
    try {
      const data = await TransactionService.confirmReceived(
        req.params.id,
        req.user.id
      );
      res.json({
        success: true,
        message: "Bạn đã xác nhận nhận hàng thành công.",
        data,
      });
    } catch (error) {
      console.log("Error in confirmReceived:", error.message);
      res.status(400).json({ message: error.message });
    }
  },

  // Giai đoạn 4: Rating
  rate: async (req, res) => {
    try {
      const data = await TransactionService.submitRating(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({ success: true, message: "Đánh giá đã được ghi nhận.", data });
    } catch (error) {
      console.log("Error in rate:", error.message);
      res.status(400).json({ message: error.message });
    }
  },
};

export default TransactionController;
