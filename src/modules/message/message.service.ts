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
