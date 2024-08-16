
import prisma from "../../utils/db.util";
import { chat } from "@prisma/client";
import { getAllMessages } from "../message/message.service";
import { findUserById } from "../user/user.service";
import { error } from "console";

export async function createOrGetChat(senderId: number, receiverId: number): Promise<chat> {
    const conversationId = senderId + receiverId;

    const checkRecipientId = await findUserById(receiverId);
    if(!checkRecipientId){
        throw new Error("RecipientId not found")
    }

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

// export async function getChatMessages(senderId: number, receiverId: number) {
//     const conversationId = senderId + receiverId;

//     const chat = await prisma.chat.findFirst({
//         where: {
//             conversationId: conversationId,
//         },
//         include: {
//             messages: {
//                 orderBy: {
//                     createdAt: 'asc', 
//                 },
//                 include: {
//                     sender: true, 
//                 },
//             },
//         },
//     });

//     if (!chat) {
//         throw new Error('Chat not found');
//     }

//     return chat.messages;
// }
export async function getChatMessages(senderId: number, receiverId: number) {
    const conversationId = senderId + receiverId;

    const chat = await prisma.chat.findFirst({
        where: {
            conversationId: conversationId,
            users: {
                some: {
                    id: senderId,
                },
            },
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc', 
                },
                include: {
                    sender: true, 
                },
            },
        },
    });

    if (!chat) {
        throw new Error('Chat not found or you are not part of this conversation');
    }

    return chat.messages;
}


export async function getUserSpecificChatMessages(senderId: number, receiverId: number) {
    const conversationId = senderId + receiverId;

    const chat = await prisma.chat.findFirst({
        where: {
            conversationId: conversationId,
        },
        include: {
            messages: {
                where: {
                    senderId: senderId, 
                },
                orderBy: {
                    createdAt: 'asc',
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            },
        },
    });

    if (!chat) {
        throw new Error('Chat not found');
    }

    return chat.messages;
}