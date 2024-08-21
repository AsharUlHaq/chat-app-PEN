// import { z } from 'zod';

// export const resetPasswordSchema = z.object({
//   email: z.string().email(),
//   newPassword: z.string().min(8, "Password must be at least 8 characters long"),
// });


//-----------------
// src/reset-password/rp.schema.ts

import { z } from 'zod';

export const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, 'Token must be at least 20 characters long'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});
