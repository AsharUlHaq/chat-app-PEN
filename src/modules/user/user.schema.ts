import z from "zod"

export const updateUserPasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
  });

  export const updateUserSchema = z.object({
    username: z.string().max(25).min(3).optional(),
    avatar: z.string().optional(),
  });
  
  export type updateUserType = z.infer<typeof updateUserSchema>;
  export type updateUserPasswordType = z.infer<typeof updateUserPasswordSchema>;