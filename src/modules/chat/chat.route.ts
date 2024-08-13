import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getChatMessagesController } from "./chat.controller";

const chatRoutes = Router();

// // chatRoutes.post("/create-chat", protect, createChatHandler);
chatRoutes.get("/get-chat-messages/:recipientId",protect,getChatMessagesController);

export { chatRoutes };
