// src/websocket/websocket.server.ts
// broadcasting to all clients

// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });

//     wss.on('connection', (ws) => {
//         console.log('New client connected');

//         ws.on('message', (message) => {
//             console.log('Received message:',message.toString());

//             wss.clients.forEach((client) => {
//                 if (client !== ws && client.readyState === WebSocket.OPEN) {
//                     client.send(message.toString());
//                 }
//             });
//         });

//         ws.on('close', () => {
//             console.log('Client disconnected');
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };

//-----------------------------------------------------------------------------------------------------------------
// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import prisma from '../../utils/db.util';

// const prismaClient = prisma;

// interface Client extends WebSocket {
//     userId?: number;
//     username?: string; 
// }

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });
//     const clients = new Map<number, Client>(); 

//     wss.on('connection', async (ws: WebSocket, request: any) => {
       
//         const userId = parseInt(request.headers.id as string, 10);

//         if (!userId) {
//             ws.send(JSON.stringify({ error: 'User ID not found.' }));
//             ws.close();
//             return;
//         }

    
//         const user = await prismaClient.user.findUnique({ where: { id: userId } });

//         if (!user) {
//             ws.send(JSON.stringify({ error: 'User not found.' }));
//             ws.close();
//             return;
//         }

       
//         const client = ws as Client;
//         client.userId = user.id;
//         client.username = user.username;
//         clients.set(user.id, client);

//         console.log(`User with ID: ${user.id} and Username: ${user.username} connected`);

       
//         ws.on('message', (message: string) => {
//             try {
//                 const parsedMessage = JSON.parse(message);
//                 const { recipientId, content } = parsedMessage;

              
//                 if (!recipientId || !content) {
//                     ws.send(JSON.stringify({ error: 'Invalid message format. Must include recipientId and content.' }));
//                     return;
//                 }

                
//                 const recipientClient = clients.get(recipientId);

//                 if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
//                     recipientClient.send(JSON.stringify({
//                         from: { id: user.id, username: user.username },
//                         content: content,
//                     }));
//                     console.log(`Message from ${user.username} (ID: ${user.id}) to ${recipientClient.username} (ID: ${recipientId}): ${content}`);
//                 } else {
//                     ws.send(JSON.stringify({ error: 'Recipient not found or not connected.' }));
//                 }
//             } catch (error) {
//                 console.error('Failed to parse message:', error);
//                 ws.send(JSON.stringify({ error: 'Invalid message format.' }));
//             }
//         });

//         ws.on('close', () => {
//             if (client.userId) {
//                 clients.delete(client.userId); 
//                 console.log(`Client with Username: ${client.username} and ID: ${client.userId} disconnected`);
//             }
//         });

//         ws.on('error', (error) => {
//             console.error('WebSocket error:', error);
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };


//note: Storing connected clients in a Map is a common and effective practice when working with WebSocket servers, especially when you need to manage one-to-one communication between clients. Here are some considerations regarding this approach:

// Benefits of Using a Map:
// Efficient Lookups: The Map data structure provides an efficient way to associate client connections with unique identifiers (such as user IDs). Lookups, insertions, and deletions in a Map are generally fast, making it suitable for managing real-time connections.

// Direct Access to Clients: By storing clients in a Map with their user IDs as keys, you can directly access a specific client's WebSocket connection, which is crucial for one-on-one communication.

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import prisma from '../../utils/db.util';
import jwt from 'jsonwebtoken'; // Ensure you have this package installed
import { ENV } from '../../utils/env.util';
import { parse } from 'path';

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
        if(!tokenParam){
            ws.send(JSON.stringify({ error: 'Token not found.' }));
            ws.close();
            return;
        }
        
        const splitedToken = tokenParam.split("=");
        const key = splitedToken[0];
        if(key !== "token"){
            ws.send(JSON.stringify({ error: 'Token not found.' }));
            ws.close();
            return;
        }
        const token = splitedToken[1]; 
    
        if (!token) {
            ws.send(JSON.stringify({ error: 'Token not found.' }));
            ws.close();
            return;
        }

        let userId: number;
        try {
            const decoded: any = jwt.verify(token, ENV.JWT_SECRET!);
            userId = decoded.id;
        } catch (err) {
            console.log(err)
            ws.send(JSON.stringify({ error: 'Invalid token.' }));
            ws.close();
            return;
        }

        const user = await prismaClient.user.findUnique({ where: { id: userId } });

        if (!user) {
            ws.send(JSON.stringify({ error: 'User not found.' }));
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
        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);
                const content = parsedMessage.content;

               const recipientId = parsedMessage.recipientId;

                if (!recipientId || !content) {
                    ws.send(JSON.stringify({ error: 'Invalid message format. Must include recipientId and content.' }));
                    return;
                }

                const recipientClient = clients.get(recipientId);

                if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
                    recipientClient.send(JSON.stringify({
                        from: { id: user.id, username: user.username },
                        content: content,
                    }));
                    console.log(`Message from ${user.username} (ID: ${user.id}) to ${recipientClient.username} (ID: ${recipientId}): ${content}`);
                } else {
                    ws.send(JSON.stringify({ error: 'Recipient not found or not connected.' }));
                }
            } catch (error) {
                console.error('Failed to parse message:', error);
                ws.send(JSON.stringify({ error: 'Invalid message format.' }));
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
