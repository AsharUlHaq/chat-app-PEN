// // import prisma from "../../utils/db.util";

// // export async function createChat(userId: number, recipientId: number) {
// //     const conversationId = userId + recipientId;

  
// //     const existingChat = await prisma.chat.findFirst({
// //         where: { conversationId: conversationId },
// //     });

// //     if (existingChat) {
// //         return existingChat;
// //     }

// //     const chat = await prisma.chat.create({
// //         data: {
// //             conversationId: conversationId,
// //             users: {
// //                 connect: [{ id: userId }, { id: recipientId }],
// //             },
// //         },
// //     });

// //     return chat;
// // }
// //---------------------------------------------------------------------------------------------------------------------------
// import prisma from "../../utils/db.util";
// import { chat } from "@prisma/client"; 

// export async function createChat(conversationId: number, userIds: number[]): Promise<chat> {

//     const existingChat = await prisma.chat.findFirst({
//         where: {
//             conversationId: conversationId,
//         },
//     });

//     if (existingChat) {
//         return existingChat; 
//     }


//     const chat = await prisma.chat.create({
//         data: {
//             conversationId: conversationId,
//             users: {
//                 connect: userIds.map((id) => ({ id })),
//             },
//         },
//         include: {
//             users: true, 
//             messages: true, 
//         },
//     });

//     return chat;
// }


// export async function getAllChats() {
//     const chats = await prisma.chat.findMany({
//         include: {
//             users: {
//                 select: {
//                     id: true,
//                     username: true,
//                     email: true,
//                     avatar: true,
//                 },
//             },
//             messages: {
//                 select: {
//                     id: true,
//                     content: true,
//                     createdAt: true,
//                     sender: {
//                         select: {
//                             id: true,
//                             username: true,
//                             email: true,
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     return chats;
// }

// export async function findChatById(chatId: number) {
//     const chat = await prisma.chat.findUnique({
//         where: { id: chatId },
//         include: {
//             users: {
//                 select: {
//                     id: true,
//                     username: true,
//                     email: true,
//                     avatar: true,
//                 },
//             },
//             messages: {
//                 select: {
//                     id: true,
//                     content: true,
//                     createdAt: true,
//                     sender: {
//                         select: {
//                             id: true,
//                             username: true,
//                             email: true,
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     if (!chat) {
//         throw new Error(`Chat with ID: ${chatId} not found`);
//     }

//     return chat;
// }

import prisma from "../../utils/db.util";
import { chat } from "@prisma/client";

export async function createOrGetChat(senderId: number, receiverId: number): Promise<chat> {
    const conversationId = senderId + receiverId;

  
    const existingChat = await prisma.chat.findFirst({
        where: {
            conversationId: conversationId,
        },
        include: {
            users: true,
            messages: true,
        },
    });

    if (existingChat) {
        return existingChat;
    }

   
    const chat = await prisma.chat.create({
        data: {
            conversationId: conversationId,
            users: {
                connect: [{ id: senderId }, { id: receiverId }],
                //{ id: senderId } and { id: receiverId } specify the two users involved in this chat. The connect operation means that Prisma will not create new User records but will instead associate the existing users with the chat.
            },
        },
        include: {
            users: true,
            messages: true,
        },
    });

    return chat;
}

export async function saveMessage(chatId: number, senderId: number, content: string) {
    const message = await prisma.message.create({
        data: {
            chatId: chatId,
            senderId: senderId,
            content: content,
        },
    });

    return message;
}
