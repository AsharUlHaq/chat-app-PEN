// import { Request, Response } from "express";
// import { createChat } from "./chat.service";

// export async function createChatHandler(req: Request, res: Response) {
//     try {
//         const { userId, recipientId } = req.body;
//         const chat = await createChat(userId, recipientId);
//         res.status(201).json({
//             status: 201,
//             message: "Chat created successfully",
//             data: chat,
//             success: true,
//         });
//     } catch (error: any) {
//         console.error(error.message);
//         res.status(400).json({
//             status: 400,
//             message: error.message,
//             data: null,
//             success: false,
//         });
//     }
// }
//-----------------------------------------------------------------------------------------------------------
import { Request, Response } from "express";
import { createChat, findChatById, getAllChats } from "./chat.service";
import { createChatSchema } from "./chat.schema"; // Import the schema
export async function createChatHandler(req: Request, res: Response) {
    try {
        // Validate the request body using the schema
        const { userId, recipientId } = createChatSchema.parse(req.body);

        // Create a conversation ID based on userId and recipientId
        const conversationId = userId + recipientId;

        // Call the service to create the chat
        const chat = await createChat(conversationId, [userId, recipientId]);

        res.status(201).json({
            status: 201,
            message: "Chat created successfully",
            data: chat,
            success: true,
        });
    } catch (error: any) {
        // If the error is a ZodError, handle it separately
        if (error.name === 'ZodError') {
            const message = error.errors.map((err: any) => err.message).join(", ");
            console.error("Validation Error:", message);
            return res.status(400).json({
                status: 400,
                message: message,
                data: null,
                success: false,
            });
        }

        console.error("Internal Server Error:", error.message);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            success: false,
        });
    }
}

export async function getAllChatsHandler(req: Request, res: Response) {
    try {
        // Get all chats from the service
        const chats = await getAllChats();

        res.status(200).json({
            status: 200,
            message: "Chats retrieved successfully",
            data: chats,
            success: true,
        });
    } catch (error: any) {
        console.error("Internal Server Error:", error.message);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            success: false,
        });
    }
}

export async function getChatByIdHandler(req: Request, res: Response) {
    try {
        const chatId = parseInt(req.params.id, 10);

        // Get the chat by ID from the service
        const chat = await findChatById(chatId);

        if (!chat) {
            return res.status(404).json({
                status: 404,
                message: "Chat not found",
                data: null,
                success: false,
            });
        }

        res.status(200).json({
            status: 200,
            message: "Chat retrieved successfully",
            data: chat,
            success: true,
        });
    } catch (error: any) {
        console.error("Internal Server Error:", error.message);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            success: false,
        });
    }
}
