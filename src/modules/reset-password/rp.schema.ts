// import { z } from 'zod';

// export const resetPasswordSchema = z.object({
//   email: z.string().email(),
//   newPassword: z.string().min(8, "Password must be at least 8 characters long"),
// });

// src/resetpassword/resetpassword.schema.ts

import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d+$/, "OTP must be a 6-digit number"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});
