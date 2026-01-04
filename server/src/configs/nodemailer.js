import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, text = null, html = null }) => {
  if (!text && !html) {
    throw new Error("Email must have text or html content");
  }

  const response = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "Auctiva"}" <${
      process.env.SMTP_USERNAME
    }>`,
    to,
    subject,
    text,
    html,
  });

  return response;
};

export const EmailTemplates = {
  // 1. Mẫu gửi cho Người bán khi có câu hỏi mới
  newQuestion: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .header { background-color: #0f172a; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; color: #334155; }
        .box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Auctiva</h1></div>
        <div class="content">
          <h2>You have a new question!</h2>
          <p>Hello <strong>${data.sellerName}</strong>,</p>
          <p>User <strong>${data.bidderName}</strong> just asked about product <strong>${data.productName}</strong>:</p>
          <div class="box"><i>"${data.questionContent}"</i></div>
          <p>Reply soon to increase your chances of making a sale!</p>
          <a href="${data.productLink}" class="button">Reply Now</a>
        </div>
      </div>
    </body>
    </html>
  `,

  // 2. Mẫu gửi cho những người quan tâm khi có câu trả lời
  newAnswer: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; color: #334155; }
        .qa-section { margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .q { padding: 12px; background-color: #f8fafc; font-weight: bold; border-bottom: 1px solid #e2e8f0; }
        .a { padding: 12px; background-color: #ffffff; }
        .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Auctiva Update</h1></div>
        <div class="content">
          <h2>The seller has responded to your question!</h2>
          <p>Hello,</p>
          <p>The product <strong>${data.productName}</strong> you're interested in has new information:</p>
          <div class="qa-section">
            <div class="q">Question: ${data.questionContent}</div>
            <div class="a"><strong>Answer:</strong> ${data.answerContent}</div>
          </div>
          <a href="${data.productLink}" class="button">View Product Details</a>
        </div>
      </div>
    </body>
    </html>
  `,

  // 3. Mẫu gửi cho Người mua khi bị Ban khỏi sản phẩm
  bannedNotification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; color: #334155; line-height: 1.6; }
        .product-name { font-weight: bold; color: #1e293b; }
        .footer { background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Notification from Auctiva</h1></div>
        <div class="content">
          <h2>Your account has been banned from bidding</h2>
          <p>Hello <strong>${data.bidderName}</strong>,</p>
          <p>We regret to inform you that the seller has blocked your account from participating in the auction for product: <span class="product-name">${data.productName}</span>.</p>
          <p><strong>This means:</strong></p>
          <ul>
            <li>Your current bids for this product have been cancelled.</li>
            <li>You cannot place new bids for this product.</li>
          </ul>
          <p>If you have any questions, please contact our support team or review our community guidelines.</p>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // 4. Gửi cho Người bán: Thông báo có người đặt giá mới
  newBidSeller: (data) => `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Your product has a new bid!</h2>
      <p>Product: <strong>${data.productName}</strong></p>
      <p>Current Price: <span style="color: #16a34a; font-weight: bold;">${data.currentPrice} USD</span></p>
      <p>Current Leader: ${data.winnerName}</p>
      <a href="${data.productLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Product</a>
    </div>
  `,

  // 5. Gửi cho Người vừa đặt giá: Xác nhận đặt giá thành công
  bidConfirmation: (data) => `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Bid Confirmation</h2>
      <p>You just placed a maximum bid of <strong>${
        data.maxBid
      } USD</strong> for product <strong>${data.productName}</strong>.</p>
      <p>Current Market Price: <span style="color: #16a34a; font-weight: bold;">${
        data.currentPrice
      } USD</span></p>
      <p>Status: <strong>${
        data.isWinning
          ? "You are in the lead!"
          : "You were immediately outbid by someone else's hidden bid!"
      }</strong></p>
    </div>
  `,

  // 6. Gửi cho Người giữ giá trước đó: Thông báo bị vượt mặt (Outbid)
  outbidNotification: (data) => `
    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444;">
      <h2 style="color: #ef4444;">You've been outbid!</h2>
      <p>Unfortunately! Another bidder has placed a higher bid than you for product <strong>${data.productName}</strong>.</p>
      <p>Current price has increased to: <span style="color: #ef4444; font-weight: bold;">${data.currentPrice} USD</span></p>
      <p>Come back and place a new bid to regain the lead!</p>
      <a href="${data.productLink}" style="background: #ef4444; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Bid Now</a>
    </div>
  `,
};
