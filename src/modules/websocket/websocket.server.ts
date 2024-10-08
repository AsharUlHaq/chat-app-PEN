
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import prisma from '../../utils/db.util';
import jwt from 'jsonwebtoken'; 
import { ENV } from '../../utils/env.util';
import { createOrGetChat, getChatMessages } from '../chat/chat.service';
import { saveMessage } from '../message/message.service';
import { messageSchema } from './ws.schema';
import { ZodError } from 'zod';

const prismaClient = prisma;

interface Client extends WebSocket {
    userId?: number;
    username?: string; 
}

export const setupWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });
    const clients = new Map<number, Client>();

    wss.on('connection', async (ws: WebSocket, request: any) => {
        const tokenParam = request.url.split("?")[1] as string | undefined;
        if (!tokenParam) {
            ws.send(JSON.stringify({ status: 404, message: 'Token not found.', data: null, success: false }));
            ws.close();
            return;
        }

        const splitedToken = tokenParam.split("=");
        const key = splitedToken[0];
        if (key !== "token") {
            ws.send(JSON.stringify({ status: 404, message: 'Token not found.', data: null, success: false }));
            ws.close();
            return;
        }
        const token = splitedToken[1];

        if (!token) {
            ws.send(JSON.stringify({ status: 404, message: 'Token not found.', data: null, success: false }));
            ws.close();
            return;
        }

        let userId: number;
        try {
            const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
            userId = decoded.id;
        } catch (err: any) {
            ws.send(JSON.stringify({ status: 403, message: err.message, data: null, success: false }));
            console.log(err.message);
            ws.close();
            return;
        }

        const user = await prismaClient.user.findUnique({ where: { id: userId } });

        if (!user) {
            ws.send(JSON.stringify({ status: 404, message: 'User not found', data: null, success: false }));
            ws.close();
            return;
        }

        // Store the client in the map
        const client = ws as Client;
        client.userId = user.id;
        client.username = user.username;
        clients.set(user.id, client);

        console.log(`User with ID: ${user.id} and Username: ${user.username} connected`);

        // Handle incoming messages
        ws.on('message', async (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);

                messageSchema.parse(parsedMessage);

                const { content, recipientId, type } = parsedMessage;

                const chat = await createOrGetChat(user.id, recipientId);
                const savedMessage = await saveMessage(chat.id, user.id, content);

                if (type === 'getMessages') {
                    const messages = await getChatMessages(user.id, recipientId);
                    ws.send(JSON.stringify({
                        status: 200,
                        message: "success",
                        data: {
                            type: 'previousMessages',
                            chat: chat.id,
                            conversationId: chat.conversationId,
                            messages: messages.map((msg) => ({
                                id: msg.id,
                                createdAt: msg.createdAt,
                                content: msg.content,
                                sender: {
                                    id: msg.sender.id,
                                    username: msg.sender.username,
                                },
                            })),
                        },
                        success: true
                    }));
                    return;
                }

                if (!recipientId || !content) {
                    ws.send(JSON.stringify({ status: 403, message: 'Invalid message format. Must include recipientId and content.', data: null, success: false }));
                    return;
                }

                const recipientClient = clients.get(recipientId);
                if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
                    recipientClient.send(JSON.stringify({
                        status: 200,
                        message: "success",
                        data: {
                            chatId: chat.id,
                            conversationId: chat.conversationId,
                            message: {
                                id: savedMessage.id,
                                createdAt: savedMessage.createdAt,
                                content: savedMessage.content,
                                sender: {
                                    id: user.id,
                                    username: user.username,
                                },
                            },
                        },
                        success: true
                    }));
                    console.log(`Message from ${user.username} (ID: ${user.id}) to ${recipientClient.username} (ID: ${recipientId}): ${content}`);
                } else {
                    ws.send(JSON.stringify({ status: 404, message: 'Recipient not found or not connected.', data: null, success: false }));
                }
            } catch (error: any) {
                if (error instanceof ZodError) {
                    // const validationErrors = error.errors.map(err => `${err.path.join('.')} is ${err.message}`).join(', ');
                    const messageJSON = JSON.parse(error.message);
                    const message = `${messageJSON[0].path[0]} is ${messageJSON[0].message}`;
                    console.error(message);
                   return ws.send(JSON.stringify({ status: 400, message: message, data: null, success: false }));
                } else {
                    console.error(error.message)

                    ws.send(JSON.stringify({ status: 403, message: error.message || 'Invalid message format.', data: null, success: false }));
                }
                //console.error(error.message);
            }
        });

        ws.on('close', () => {
            if (client.userId) {
                clients.delete(client.userId);
                console.log(`Client with Username: ${client.username} and ID: ${client.userId} disconnected`);
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    console.log('WebSocket server running at ws://localhost:5000');
};

//note: Storing connected clients in a Map is a common and effective practice when working with WebSocket servers, especially when you need to manage one-to-one communication between clients. Here are some considerations regarding this approach:

// Benefits of Using a Map:
// Efficient Lookups: The Map data structure provides an efficient way to associate client connections with unique identifiers (such as user IDs). Lookups, insertions, and deletions in a Map are generally fast, making it suitable for managing real-time connections.

// Direct Access to Clients: By storing clients in a Map with their user IDs as keys, you can directly access a specific client's WebSocket connection, which is crucial for one-on-one communication.

//-----------------------------------------------------------------------------------------------------------------------------------