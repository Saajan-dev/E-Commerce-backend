import {
  chatBotController,
  deleteMessageController,
} from "controllers/chatBotController";
import { Router } from "express";
import { verifyTokens } from "middlewares/validations";

const chatBotRouter = Router();

chatBotRouter.get("/get-all-messages", verifyTokens, chatBotController);
chatBotRouter.delete(
  "/delete-all-messages",
  verifyTokens,
  deleteMessageController
);

export default chatBotRouter;
