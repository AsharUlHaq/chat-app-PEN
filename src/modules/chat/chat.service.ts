// import prisma from "../../utils/db.util";

// export async function createChat(userId: number, recipientId: number) {
//     const conversationId = userId + recipientId;

  
//     const existingChat = await prisma.chat.findFirst({
//         where: { conversationId: conversationId },
//     });

//     if (existingChat) {
//         return existingChat;
//     }

//     const chat = await prisma.chat.create({
//         data: {
//             conversationId: conversationId,
//             users: {
//                 connect: [{ id: userId }, { id: recipientId }],
//             },
//         },
//     });

//     return chat;
// }
//---------------------------------------------------------------------------------------------------------------------------
import prisma from "../../utils/db.util";
import { chat } from "@prisma/client"; // Importing Prisma's Chat model

export async function createChat(conversationId: number, userIds: number[]): Promise<chat> {
    // Check if the chat already exists
    const existingChat = await prisma.chat.findFirst({
        where: {
            conversationId: conversationId,
        },
    });

    if (existingChat) {
        return existingChat; // If chat exists, return it
    }

    // Create a new chat with the conversation ID and user IDs
    const chat = await prisma.chat.create({
        data: {
            conversationId: conversationId,
            users: {
                connect: userIds.map((id) => ({ id })),
            },
        },
        include: {
            users: true, // Include users in the response
            messages: true, // Include messages in the response if needed
        },
    });

    return chat;
}


export async function getAllChats() {
    const chats = await prisma.chat.findMany({
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatar: true,
                },
            },
            messages: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    return chats;
}

export async function findChatById(chatId: number) {
    const chat = await prisma.chat.findUnique({
        where: { id: chatId },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    avatar: true,
                },
            },
            messages: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!chat) {
        throw new Error(`Chat with ID: ${chatId} not found`);
    }

    return chat;
}

