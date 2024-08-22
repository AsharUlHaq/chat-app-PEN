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
//----------------------------------------------------------------------------
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// export class ResetPasswordService {
//   async resetPassword(email: string, newPassword: string): Promise<void> {
//     // Hash the new password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update the user's password in the database
//     await prisma.user.update({
//       where: { email },
//       data: { password: hashedPassword },
//     });
//   }
// }
//-----------------------------------------------------------------------------
// src/reset-password/rp.service.ts

// src/reset-password/rp.service.ts

// src/reset-password/rp.service.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { addMinutes, isAfter } from 'date-fns';
import crypto from 'crypto';
import { EmailService } from '../email/email.service';

const prisma = new PrismaClient();
export class ResetPasswordService {
  async requestPasswordReset(email: string): Promise<void> {

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Email address is not registered.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = addMinutes(new Date(), 10);

    await prisma.resetToken.deleteMany({
      where: { email },
    });

    await prisma.resetToken.create({
      data: {
        email,
        token,
        expiration,
      },
    });

    await EmailService.sendResetPasswordLink(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenRecord = await prisma.resetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord || isAfter(new Date(), tokenRecord.expiration)) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: tokenRecord.email },
      data: { password: hashedPassword },
    });

    await prisma.resetToken.delete({
      where: { token },
    });
  }
}