import express, { Response } from "express";
import cors from "cors";
import http from "http";
import config from "config/index";
import logger from "utils/logger";
import rootRouter from "routes";
import { Server } from "socket.io";
import { chatbotService } from "socket/chatbot";

const server = express();
const socketServer = http.createServer(server);
const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

server.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);

server.get("/", (_, res: Response) => {
  res.send("Site is Working.");
});

server.use("/api/v1", rootRouter);

io.on("connection", (socket) => {
  logger.info(`New socket connection: ${socket.id}`);

  socket.on("message", async (data) => {
    const chatbotRes = await chatbotService(data);
    logger.info(`Message received: ${chatbotRes}`);
    console.log(chatbotRes);
    socket.emit("message", JSON.stringify(chatbotRes?.data));
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

socketServer.listen(config.port, () => {
  logger.info(`App is listening on port ${config.port}`);
});
