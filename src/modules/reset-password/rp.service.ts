// // src/reset-password/reset-password.service.ts

// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import { OTPService } from '../otp/otp.service';

// const prisma = new PrismaClient();
// const otpService = new OTPService();

// export class ResetPasswordService {
//   async resetPassword(email: string, otp: string, newPassword: string): Promise<boolean> {
//     const isOtpValid = await otpService.verifyOtp(email,otp);

//     if (!isOtpValid) {
//       throw new Error('Invalid or expired OTP.');
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await prisma.user.update({
//       where: { email },
//       data: {
//         password: hashedPassword,
//       },
//     });

//     return true;
//   }
// }

// src/auth/auth.service.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResetPasswordService {
  async resetPassword(email: string, newPassword: string) {
    await prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}
