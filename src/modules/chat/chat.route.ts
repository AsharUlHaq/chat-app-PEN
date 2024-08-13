import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getChatMessagesController, getUserSpecificChatMessagesController } from "./chat.controller";

const chatRoutes = Router();

// // chatRoutes.post("/create-chat", protect, createChatHandler);
chatRoutes.get("/get-chat-messages/:recipientId",protect,getChatMessagesController);
chatRoutes.get("/get-user-specific-chat-messages/:recipientId", protect, getUserSpecificChatMessagesController);

export { chatRoutes };
