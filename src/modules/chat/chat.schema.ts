// import { z } from 'zod';

// export const createChatSchema = z.object({
//   userId: z.number().min(1, { message: 'User ID must be a positive number' }),
//   recipientId: z.number().min(1, { message: 'Recipient ID must be a positive number' })
// });

// export const getChatByConversationIdSchema = z.object({
//   conversationId: z.number().min(1, { message: 'Conversation ID must be a positive number' })
// });

// export type CreateChatInput = z.infer<typeof createChatSchema>;
// export type GetChatByConversationIdInput = z.infer<typeof getChatByConversationIdSchema>;
