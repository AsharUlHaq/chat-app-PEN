
import { Request, Response } from 'express';
import { getChatMessages, getUserSpecificChatMessages } from './chat.service';
import jwt from 'jsonwebtoken'; 
import { ENV } from '../../utils/env.util'; 

export async function getChatMessagesController(req: Request, res: Response) {
    const { recipientId } = req.params;

    if (!recipientId) {
        return res.status(404).json({
            status: 404, 
            message: 'Recipient ID not found', 
            data: null, 
            success: false 
        });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(404).json({
                status: 404, 
                message: 'Authorization header not found', 
                data: null, 
                success: false 
            });
        }

        const token = authHeader.split(' ')[1];
        let senderId: number;

        try {
            const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
            senderId = decoded.id;
        } catch (err:any) {
            return res.status(401).json({ 
                status: 401,
                message: 'Invalid or expired token',
                data: null, 
                success: false 
            });
        }

        const messages = await getChatMessages(senderId, parseInt(recipientId));

        res.status(200).json({
            status: 200,
            message: 'Success', 
            data: messages.map((msg) => ({
                id: msg.id,
                createdAt: msg.createdAt,
                content: msg.content,
                sender: {
                    id: msg.sender.id,
                    username: msg.sender.username,
                },
            })),
            success: true
        });
    } catch (error:any) {
        res.status(400).json({
            status: 400, 
            message: "Missing conversation data or argument. Unable to fetch messages.", 
            data: null, 
            success: false 
        });
    }
}

export async function getUserSpecificChatMessagesController(req: Request, res: Response) {
    const { recipientId } = req.params;

    if (!recipientId) {
        return res.status(404).json({status:404, message: 'Missing recipientId', data:null, success:false });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ status: 404 ,message: 'Authorization header missing', data: null, success:false });
        }

        const token = authHeader.split(' ')[1];
        let senderId: number;

        try {
            const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
            senderId = decoded.id;
        } catch (err) {
            return res.status(401).json({status:401 , message: 'Invalid or expired token', data:null, success:false });
        }

        const messages = await getUserSpecificChatMessages(senderId, parseInt(recipientId));

        res.status(200).json({
            status: 200,
            message: "success",
            data: messages.map((msg) => ({
            id: msg.id,
            createdAt: msg.createdAt,
            content: msg.content,
            sender: {
                id: msg.sender.id,
                username: msg.sender.username,
            },
            success: true
        })),

    });
    } catch (error:any) {
        res.status(400).json({status: 400,  message: error.message, data: null, success: false });
    }
}