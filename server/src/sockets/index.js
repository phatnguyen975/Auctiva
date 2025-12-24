import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { app } from "../app.js";
import { socketAuth } from "../middlewares/socketAuthMiddleware.js";

export const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true,
  },
});

io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.user.id);

  

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.user.id);
  });
});
