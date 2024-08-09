// // src/websocket/websocket.server.ts
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export const setupWebSocketServer = (server: Server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', (message) => {
            console.log('Received message:',message.toString());

            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    console.log('WebSocket server running at ws://localhost:5000');
};

// src/websocket/websocket.server.ts
// import { WebSocketServer, WebSocket } from 'ws';
// import { Server } from 'http';
// import { v4 as uuidv4 } from 'uuid';

// interface ExtendedWebSocket extends WebSocket {
//     id?: string;
// }

// export const setupWebSocketServer = (server: Server) => {
//     const wss = new WebSocketServer({ server });

//     wss.on('connection', (ws: ExtendedWebSocket) => {
//         // Assign a unique ID to each new connection
//         ws.id = uuidv4();
//         console.log(`New client connected with ID: ${ws.id}`);

//         ws.on('message', (message) => {
//             const parsedMessage = JSON.parse(message.toString());

//             if (parsedMessage.type === 'broadcast') {
//                 // Broadcasting to all connected clients except the sender
//                 wss.clients.forEach((client) => {
//                     if (client !== ws && client.readyState === WebSocket.OPEN) {
//                         client.send(parsedMessage.content);
//                     }
//                 });
//             } else if (parsedMessage.type === 'direct') {
//                 // Sending a message to a specific user
//                 const targetClient = Array.from(wss.clients).find(
//                     (client: ExtendedWebSocket) => client.id === parsedMessage.targetId
//                 );

//                 if (targetClient && targetClient.readyState === WebSocket.OPEN) {
//                     targetClient.send(parsedMessage.content);
//                 }
//             }
//         });

//         ws.on('close', () => {
//             console.log(`Client with ID ${ws.id} disconnected`);
//         });
//     });

//     console.log('WebSocket server is running');
// };
