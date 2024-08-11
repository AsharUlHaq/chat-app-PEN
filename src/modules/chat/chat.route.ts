import { Router } from "express";
import { createChatHandler, getChatByIdHandler } from "./chat.controller";
import { protect } from "../../middlewares/auth.middleware";

const chatRoutes = Router();

chatRoutes.post("/create-chat", protect, createChatHandler);
chatRoutes.get("/get-chat",protect,getChatByIdHandler);

export { chatRoutes };
