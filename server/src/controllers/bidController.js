import BidService from "../services/bidService.js";

import { sendEmail, EmailTemplates } from "../configs/nodemailer.js";

const BidController = {
  create: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const userId = req.user.id;
      const emailBidder = req.user.email;
      const maxBid = req.validated.body.maxBid;
      const { newBid, emailTasks } = await BidService.createBid({
        productId,
        userId,
        emailBidder,
        maxBid,
      });

      // === Gửi mail đồng thời ===
      // 1. Gửi cho Người bán
      sendEmail({
        to: emailTasks.seller.email,
        subject: `[Auctiva] Có lượt bid mới cho ${emailTasks.seller.data.productName}`,
        html: EmailTemplates.newBidSeller(emailTasks.seller.data),
      });

      // 2. Gửi cho Người vừa bid
      sendEmail({
        to: emailTasks.currentBidder.email,
        subject: `[Auctiva] Xác nhận đặt giá thành công`,
        html: EmailTemplates.bidConfirmation(emailTasks.currentBidder.data),
      });

      // 3. Gửi cho Người bị vượt mặt (Nếu có)
      if (emailTasks.oldWinner) {
        sendEmail({
          to: emailTasks.oldWinner.email,
          subject: `[Auctiva] Cảnh báo: Bạn đã bị vượt mặt!`,
          html: EmailTemplates.outbidNotification(emailTasks.oldWinner.data),
        });
      }

      res.created("Bid created successfully", newBid);
    } catch (error) {
      res.error(error.message);
    }
  },

  getByProductId: async (req, res) => {
    try {
      const productId = Number(req.validated.params.id);
      const bids = await BidService.getBidsByProductId(productId);
      res.ok("Bids retrieved successfully", bids);
    } catch (error) {
      res.error(error.message);
    }
  },
};

export default BidController;
