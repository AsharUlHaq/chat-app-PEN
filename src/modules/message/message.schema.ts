import { z } from 'zod';

export const sendMessageSchema = z.object({
  chatId: z.number().min(1, { message: 'Chat ID must be a positive number' }),
  content: z.string().min(1, { message: 'Content cannot be empty' }),
  senderId: z.number().min(1, { message: 'Sender ID must be a positive number' })
});

export const getMessagesByChatIdSchema = z.object({
  chatId: z.number().min(1, { message: 'Chat ID must be a positive number' })
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetMessagesByChatIdInput = z.infer<typeof getMessagesByChatIdSchema>;
