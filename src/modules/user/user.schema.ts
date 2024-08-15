import z from "zod"

export const updateUserPasswordSchema = z.object({
    // email: z.string().email({ message: "Invalid, Enter valid email address" }),
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
  });
  
  export type updateUserPasswordType = z.infer<typeof updateUserPasswordSchema>;