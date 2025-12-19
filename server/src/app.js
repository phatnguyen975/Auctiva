import express from "express";
import cors from "cors";

import { logger } from "./configs/logger.js";
import { responseWrapper } from "./middlewares/responseMiddleware.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.js";

export const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(logger);

// Response Wrapper
app.use(responseWrapper);

// Routes


// Error Handler
app.use(notFoundHandler);
app.use(errorHandler);
