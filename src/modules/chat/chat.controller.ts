
import { Request, Response } from 'express';
import { getChatMessages, getUserSpecificChatMessages } from './chat.service';
import jwt from 'jsonwebtoken'; 
import { ENV } from '../../utils/env.util'; 

export async function getChatMessagesController(req: Request, res: Response) {
    const { recipientId } = req.params;

    if (!recipientId) {
        return res.status(400).json({ error: 'Missing recipientId' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        let senderId: number;

        try {
            const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
            senderId = decoded.id;
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const messages = await getChatMessages(senderId, parseInt(recipientId));
     
        // res.status(200).json(
        //     messages.map((msg) => ({
        //     id: msg.id,
        //     createdAt: msg.createdAt,
        //     content: msg.content,
        //     sender: {
        //         id: msg.sender.id,
        //         username: msg.sender.username,
        //     },
        // })));
        res.status(200).json({
            message: messages.map((msg) => ({
              id: msg.id,
              createdAt: msg.createdAt,
              content: msg.content,
              sender: {
                id: msg.sender.id,
                username: msg.sender.username,
              },
            })),
          });
    } catch (error:any) {
        res.status(400).json({status:400, message:error.message, data: null, success: false });
    }
}


export async function getUserSpecificChatMessagesController(req: Request, res: Response) {
    const { recipientId } = req.params;

    if (!recipientId) {
        return res.status(400).json({ error: 'Missing recipientId' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        let senderId: number;

        try {
            const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
            senderId = decoded.id;
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const messages = await getUserSpecificChatMessages(senderId, parseInt(recipientId));

        res.status(200).json(messages.map((msg) => ({
            id: msg.id,
            createdAt: msg.createdAt,
            content: msg.content,
            sender: {
                id: msg.sender.id,
                username: msg.sender.username,
            },
        })));
    } catch (error:any) {
        res.status(400).json({status: 400,  message: error.message, data: null, success: false });
    }
}