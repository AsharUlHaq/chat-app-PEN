import { z } from 'zod';

const sendMessageSchema = z.object({
    content: z.string().min(1, { message: "Content must be a non-empty string." }),
    recipientId: z.number().int().positive({ message: "Recipient ID must be a positive integer." }),
});

export { sendMessageSchema };
