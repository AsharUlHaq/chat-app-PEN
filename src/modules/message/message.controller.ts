import { Request, Response } from "express";
import { sendMessageSchema } from "./message.schema";  
import { createMessage } from "./message.service";

export async function createMessageHandler(req: Request, res: Response) {
    try {
        const { chatId, senderId, content } = sendMessageSchema.parse(req.body);

        const message = await createMessage(chatId, senderId, content);

        res.status(201).json({
            status: 201,
            message: "Message sent successfully",
            data: message,
            success: true,
        });
    } catch (error: any) {
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
