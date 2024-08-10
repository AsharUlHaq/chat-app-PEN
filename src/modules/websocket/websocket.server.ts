// // src/websocket/websocket.server.ts
//broadcasting to all clients

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
// with uuid generation message to specific client

// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import { v4 as uuidv4 } from 'uuid'; // UUID library to generate unique IDs

// // Map to store client connections with their IDs
// const clients = new Map<string, WebSocket>();

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });

//     wss.on('connection', (ws) => {
//         // Generate a unique ID for the connected client
//         const clientId = uuidv4(); // Replace with a database ID if needed
//         clients.set(clientId, ws);

//         console.log(`New client connected with ID: ${clientId}`);

//         ws.on('message', (message) => {
//             try {
//                 const parsedMessage = JSON.parse(message.toString());
//                 const { recipientId, content } = parsedMessage;
        
//                 console.log(`Received message from ${clientId}: ${content}`);
        
//                 // Send the message to the specific client based on recipientId
//                 const recipientWs = clients.get(recipientId);
//                 if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
//                     recipientWs.send(JSON.stringify({ senderId: clientId, content }));
//                 } else {
//                     console.log(`Client with ID ${recipientId} is not connected.`);
//                 }
//             } catch (error) {
//                 console.error('Failed to parse message as JSON. Received:', message.toString());
//                 // Optionally, send a warning message back to the client
//                 ws.send('Invalid message format. Please send a JSON string.');
//             }
//         });

//         ws.on('close', () => {
//             console.log(`Client with ID ${clientId} disconnected`);
//             clients.delete(clientId); // Remove the client from the map on disconnect
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };
//---------------------------------------------------------------------------------------------------------

// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import { PrismaClient } from '@prisma/client';
// import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

// const prisma = new PrismaClient();

// interface Client extends WebSocket {
//     id?: string; // Add a custom property for tracking user ID
// }

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });
//     const clients = new Map<string, Client>(); // Map to keep track of clients by their IDs

//     wss.on('connection', (ws: WebSocket) => {
//         const clientId = uuidv4(); // Generate a unique client ID
//         const client = ws as Client;
//         client.id = clientId;
//         clients.set(clientId, client); // Add client to the map
//         console.log(`New client connected with ID: ${clientId}`);

//         ws.on('message', async (message: string) => {
//             try {
//                 // Parse the incoming message
//                 const parsedMessage = JSON.parse(message);
//                 const { email, content, recipientId } = parsedMessage;

//                 // Validate that the email exists in the message
//                 if (!email) {
//                     ws.send(JSON.stringify({ error: 'Invalid message format. Email is required.' }));
//                     return;
//                 }

//                 // Fetch user from the database using the email
//                 const user = await prisma.user.findUnique({
//                     where: {
//                         email: email,
//                     },
//                 });

//                 // Check if the user was found
//                 if (!user) {
//                     ws.send(JSON.stringify({ error: 'User not found.' }));
//                     return;
//                 }

//                 const userId = user.id;
//                 console.log(`User with ID: ${userId} (Email: ${email}) connected`);

//                 // Handle sending a message to a specific client using recipientId
//                 if (recipientId && content) {
//                     const recipient = clients.get(recipientId);

//                     if (recipient && recipient.readyState === WebSocket.OPEN) {
//                         recipient.send(JSON.stringify({ from: userId, content: content }));
//                         console.log(`Message from ${userId} to ${recipientId}: ${content}`);
//                     } else {
//                         ws.send(JSON.stringify({ error: 'Recipient not found or not connected.' }));
//                     }
//                 }

//             } catch (err:any) {
//                 console.error('Failed to parse message or fetch user from database:', err.message);
//                 ws.send(JSON.stringify({ error: `Invalid message format. Please send a JSON string. Received: ${message}` }));
//             }
//         });

//         ws.on('close', () => {
//             if (client.id) {
//                 clients.delete(client.id); // Remove client from the map on disconnect
//                 console.log(`Client with ID: ${client.id} disconnected`);
//             }
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };
//----------------------------------------------------------------------------------------------------------
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Client extends WebSocket {
    userId?: number; // Use the database user ID
}

export const setupWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });
    const clients = new Map<number, Client>(); // Map to keep track of clients by their database IDs

    wss.on('connection', (ws: WebSocket) => {
        const client = ws as Client;

        ws.on('message', async (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);
                const { email, content, recipientId } = parsedMessage;

                if (!email) {
                    ws.send(JSON.stringify({ error: 'Invalid message format. Email is required.' }));
                    return;
                }

                // Fetch user from the database using the email
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                if (!user) {
                    ws.send(JSON.stringify({ error: 'User not found.' }));
                    return;
                }

                const userId = user.id;
                client.userId = userId; // Assign database user ID to client
                console.log(`User with ID: ${userId} (Email: ${email}) connected`);

                // Update clients map with database ID
                clients.set(userId, client);

                // Handle sending a message to a specific client using recipientId
                if (recipientId && content) {
                    const recipientClient = clients.get(recipientId);

                    if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
                        recipientClient.send(JSON.stringify({ from: userId, content: content }));
                        console.log(`Message from ${userId} to ${recipientId}: ${content}`);
                    } else {
                        ws.send(JSON.stringify({ error: 'Recipient not found or not connected.' }));
                    }
                }

            } catch (err:any) {
                console.error('Failed to parse message or fetch user from database:', err.message);
                ws.send(JSON.stringify({ error: `Invalid message format. Please send a JSON string. Received: ${message}` }));
            }
        });

        ws.on('close', () => {
            if (client.userId) {
                clients.delete(client.userId); // Remove client from the map on disconnect
                console.log(`Client with ID: ${client.userId} disconnected`);
            }
        });
    });

    console.log('WebSocket server running at ws://localhost:5000');
};
