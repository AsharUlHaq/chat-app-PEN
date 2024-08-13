import prisma from "../../utils/db.util";

export async function createMessage(chatId: number, senderId: number, content: string) {
    const message = await prisma.message.create({
        data: {
            content: content,
            chatId: chatId,
            senderId: senderId,
        },
    });

    return message;
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

export async function getAllMessages(chatId: number){
    const allMessages = await prisma.message.findMany({
        select:{
            chatId: true,
            id: true,
            content: true,
            sender: true,
            senderId: true
        },
        where:{chatId: chatId}
})   
return allMessages;
}