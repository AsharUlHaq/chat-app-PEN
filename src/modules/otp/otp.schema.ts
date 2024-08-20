// // src/otp/otp.schema.ts

// import { z } from 'zod';

// export const requestOtpSchema = z.object({
//   email: z.string().email(),
// });

// export const verifyOtpSchema = z.object({
//   email: z.string().email(),
//   otp: z.string().length(6).regex(/^\d+$/, "OTP must be a 6-digit number"), // Ensures OTP is numeric and 6 digits
// });

// src/otp/otp.schema.ts

import { z } from 'zod';

export const requestOtpSchema = z.object({
  email: z.string().email(),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/, "OTP must be a 6-digit number"),
});
