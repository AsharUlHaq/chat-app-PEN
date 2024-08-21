import z from "zod"

export const messageSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    recipientId: z.number().positive('Recipient ID must be a positive number'),
})

export type messageSchemaType = z.infer<typeof messageSchema>
