import express from "express";
import cors from "cors";
import cron from "node-cron";

import { logger } from "./configs/logger.js";
import { responseWrapper } from "./middlewares/responseMiddleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";

import userRouter from "./routes/userRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import productRouter from "./routes/productRoute.js";
import sellerUpgradeRouter from "./routes/sellerUpgradeRoute.js";
import transactionRouter from "./routes/transactionRoute.js";
import qaRouter from "./routes/qaRoute.js";

import AuctionTaskService from "./services/auctionTaskService.js";

export const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(logger);

// Response Wrapper
app.use(responseWrapper);

// Routes
app.get("/", (_, res) => res.send("Server is live!"));
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/seller-upgrade-requests", sellerUpgradeRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/qa", qaRouter);

// Check auction ending per minute
cron.schedule("* * * * *", async () => {
  await AuctionTaskService.processExpiredAuctions();
});

// Check seller permission per hour
cron.schedule("0 * * * *", async () => {
  await AuctionTaskService.checkExpiredPermissions();
  await AuctionTaskService.checkDowngradeToBidder();
});

// Error Handler
app.use(notFoundHandler);
app.use(errorHandler);
