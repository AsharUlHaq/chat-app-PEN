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
// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// interface Client extends WebSocket {
//     userId?: number; // Use the database user ID
// }

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });
//     const clients = new Map<number, Client>(); // Map to keep track of clients by their database IDs

//     wss.on('connection', (ws: WebSocket) => {
//         const client = ws as Client;

//         ws.on('message', async (message: string) => {
//             try {
//                 const parsedMessage = JSON.parse(message);
//                 const { email, content, recipientId } = parsedMessage;

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

//                 if (!user) {
//                     ws.send(JSON.stringify({ error: 'User not found.' }));
//                     return;
//                 }

//                 const userId = user.id;
//                 client.userId = userId; // Assign database user ID to client
//                 console.log(`User with ID: ${userId} (Email: ${email}) connected`);

//                 // Update clients map with database ID
//                 clients.set(userId, client);

//                 // Handle sending a message to a specific client using recipientId
//                 if (recipientId && content) {
//                     const recipientClient = clients.get(recipientId);

//                     if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
//                         recipientClient.send(JSON.stringify({ from: userId, content: content }));
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
//             if (client.userId) {
//                 clients.delete(client.userId); // Remove client from the map on disconnect
//                 console.log(`Client with ID: ${client.userId} disconnected`);
//             }
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };
// ---------------------------------------------------------------------------------------------------
// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import { PrismaClient } from '@prisma/client';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();

// interface Client extends WebSocket {
//     userId?: number; // Use the database user ID
// }

// const SECRET_KEY = 'your_secret_key'; // Replace with your actual secret key

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });
//     const clients = new Map<number, Client>(); // Map to keep track of clients by their database IDs

//     wss.on('connection', (ws: WebSocket) => {
//         const client = ws as Client;

//         ws.on('message', async (message: string) => {
//             try {
//                 const parsedMessage = JSON.parse(message);
                
//                 // Check if the message is for authentication or other operations
//                 if (parsedMessage.token) {
//                     // Authenticate user with the token
//                     const decoded = jwt.verify(parsedMessage.token, SECRET_KEY) as { id: number, email: string };
//                     const userId = decoded.id;

//                     // Store the authenticated user's ID in the client
//                     client.userId = userId;

//                     // Fetch the user from the database to confirm
//                     const user = await prisma.user.findUnique({
//                         where: { id: userId },
//                     });

//                     if (!user) {
//                         ws.send(JSON.stringify({ error: 'User not found.' }));
//                         return;
//                     }

//                     console.log(`User with ID: ${userId} (Email: ${user.email}) connected`);
//                     clients.set(userId, client);
//                     return;
//                 }

//                 const { content, recipientId } = parsedMessage;

//                 // Handle sending a message to a specific client using recipientId
//                 if (recipientId && content) {
//                     const recipientClient = clients.get(recipientId);

//                     if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
//                         recipientClient.send(JSON.stringify({ from: client.userId, content: content }));
//                         console.log(`Message from ${client.userId} to ${recipientId}: ${content}`);
//                     } else {
//                         ws.send(JSON.stringify({ error: 'Recipient not found or not connected.' }));
//                     }
//                 }
//             } catch (err: any) {
//                 console.error('Failed to parse message or verify token:', err.message);
//                 ws.send(JSON.stringify({ error: `Failed to parse message or verify token: ${err.message}` }));
//             }
//         });

//         ws.on('close', () => {
//             if (client.userId) {
//                 clients.delete(client.userId); // Remove client from the map on disconnect
//                 console.log(`Client with ID: ${client.userId} disconnected`);
//             }
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };
//--------------------------------------------------------------------------------------------------------
// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import { ENV } from '../../utils/env.util';
// import prisma from '../../utils/db.util';
// import jwt from 'jsonwebtoken';


// const prismaClient = prisma;
// const jwtSecret = ENV.JWT_SECRET;

// interface Client extends WebSocket {
//     userId?: number; // Use the database user ID
// }

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });
//     const clients = new Map<number, Client>(); // Map to keep track of clients by their database IDs

//     wss.on('connection', (ws: WebSocket) => {
//         const client = ws as Client;

//         ws.on('message', async (message: string) => {
//             try {
//                 const parsedMessage = JSON.parse(message);
//                 const { token, content, recipientId } = parsedMessage;

//                 if (token) {
//                     // Verify the JWT token
//                     jwt.verify(token, jwtSecret, async (err: any, decoded: any) => {
//                         if (err) {
//                             ws.send(JSON.stringify({ error: 'Invalid token.' }));
//                             return;
//                         }

//                         // Extract user ID from the token
//                         const userId = decoded.userId;

//                         // Ensure userId is valid before querying
//                         if (!userId) {
//                             ws.send(JSON.stringify({ error: 'User ID not found in token.' }));
//                             return;
//                         }

//                         // Fetch user from the database
//                         const user = await prismaClient.user.findUnique({
//                             where: { id: userId },
//                         });

//                         if (!user) {
//                             ws.send(JSON.stringify({ error: 'User not found.' }));
//                             return;
//                         }

//                         client.userId = user.id;
//                         console.log(`User with ID: ${user.id} connected`);

//                         // Update clients map with database ID
//                         clients.set(user.id, client);

//                         // Handle sending a message to a specific client using recipientId
//                         if (recipientId && content) {
//                             const recipientClient = clients.get(recipientId);

//                             if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
//                                 recipientClient.send(JSON.stringify({ from: user.id, content: content }));
//                                 console.log(`Message from ${user.id} to ${recipientId}: ${content}`);
//                             } else {
//                                 ws.send(JSON.stringify({ error: 'Recipient not found or not connected.' }));
//                             }
//                         }
//                     });
//                 } else {
//                     ws.send(JSON.stringify({ error: 'No token provided.' }));
//                 }

//             } catch (err: any) {
//                 console.error('Failed to parse message or fetch user from database:', err.message);
//                 ws.send(JSON.stringify({ error: `Invalid message format. Received: ${message}` }));
//             }
//         });

//         ws.on('close', () => {
//             if (client.userId) {
//                 clients.delete(client.userId); // Remove client from the map on disconnect
//                 console.log(`Client with ID: ${client.userId} disconnected`);
//             }
//         });

//         ws.on('error', (error) => {
//             console.error('WebSocket error:', error);
//         });
//     });

//     console.log('WebSocket server running at ws://localhost:5000');
// };
//---------------------------------------------------------------------------------------------------
import { WebSocketServer, WebSocket } from 'ws'; //WebSocketServer creates a WebSocket server, and WebSocket represents a WebSocket connection.
import { Server } from 'http'; //This is used to create an HTTP server, which the WebSocket server will use to handle connections.
import prisma from '../../utils/db.util';

const prismaClient = prisma;

interface Client extends WebSocket {
    userId?: number; // Use the database user ID
}

export const setupWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });
    const clients = new Map<number, Client>(); // Map to store connected clients by user ID

    wss.on('connection', async (ws: WebSocket, request: any) => {
        // Extract user ID from headers
        const userId = parseInt(request.headers.id as string, 10);

        if (!userId) {
            ws.send(JSON.stringify({ error: 'User ID not found.' }));
            ws.close();
            return;
        }

        // Fetch user from the database
        const user = await prismaClient.user.findUnique({ where: { id: userId } });

        if (!user) {
            ws.send(JSON.stringify({ error: 'User not found.' }));
            ws.close();
            return;
        }

        // Store the client in the map
        const client = ws as Client;
        client.userId = user.id;
        clients.set(user.id, client);

        console.log(`User with ID: ${user.id} connected`);

        // Handle incoming messages
        ws.on('message', (message: string) => {
            try {
                const parsedMessage = JSON.parse(message);
                const { recipientId, content } = parsedMessage;

                // Check if recipientId is valid
                if (!recipientId || !content) {
                    ws.send(JSON.stringify({ error: 'Invalid message format. Must include recipientId and content.' }));
                    return;
                }

                // Find the recipient's client connection
                const recipientClient = clients.get(recipientId);

                if (recipientClient && recipientClient.readyState === WebSocket.OPEN) {
                    recipientClient.send(JSON.stringify({
                        from: user.id,
                        content: content,
                    }));
                    console.log(`Message from ${user.id} to ${recipientId}: ${content}`);
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
                clients.delete(client.userId); // Remove client from the map on disconnect
                console.log(`Client with ID: ${client.userId} disconnected`);
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