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
          <h2>Bạn có câu hỏi mới!</h2>
          <p>Chào <strong>${data.sellerName}</strong>,</p>
          <p>Người dùng <strong>${data.bidderName}</strong> vừa hỏi về sản phẩm <strong>${data.productName}</strong>:</p>
          <div class="box"><i>"${data.questionContent}"</i></div>
          <p>Hãy trả lời sớm để tăng khả năng bán được hàng nhé!</p>
          <a href="${data.productLink}" class="button">Trả lời ngay</a>
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
          <h2>Người bán đã phản hồi thắc mắc!</h2>
          <p>Chào bạn,</p>
          <p>Sản phẩm <strong>${data.productName}</strong> mà bạn đang quan tâm vừa có thông tin mới:</p>
          <div class="qa-section">
            <div class="q">Hỏi: ${data.questionContent}</div>
            <div class="a"><strong>Đáp:</strong> ${data.answerContent}</div>
          </div>
          <a href="${data.productLink}" class="button">Xem chi tiết sản phẩm</a>
        </div>
      </div>
    </body>
    </html>
  `,
};
