// import { PrismaClient } from '@prisma/client';
// import { v4 as uuidv4 } from 'uuid'; // This is not needed anymore, can be removed
// import { addMinutes, isAfter } from 'date-fns';
// import { EmailService } from '../email/email.service';

// const prisma = new PrismaClient();

// export class OTPService {
//   async generateOtp(email: string): Promise<void> {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit numeric OTP
//     const expiration = addMinutes(new Date(), 10); // OTP expires in 10 minutes

//     // Find the user by email
//     const user = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Save OTP to the database
//     await prisma.oTP.create({
//       data: {
//         otp,
//         expiration,
//         user: {
//           connect: {
//             id: user.id, // Use user ID instead of email
//           },
//         },
//       },
//     });

//     // Send OTP via email
//     await EmailService.sendOtp(email, otp);
//   }

//   async verifyOtp(email:string ,otp: string): Promise<boolean> {
//     const otpRecord = await prisma.oTP.findFirst({
//       where: {
//         otp: otp,
//       },
//     });

//     if (!otpRecord) return false;

//     if (isAfter(new Date(), otpRecord.expiration)) {
//       // OTP expired
//       await prisma.oTP.delete({
//         where: {
//           id: otpRecord.id,
//         },
//       });
//       return false;
//     }

//     // OTP is valid
//     await prisma.oTP.delete({
//       where: {
//         id: otpRecord.id,
//       },
//     });
//     return true;
//   }
// }

// src/otp/otp.service.ts

import { PrismaClient } from '@prisma/client';
import { addMinutes, isAfter } from 'date-fns';
import { EmailService } from '../email/email.service';

const prisma = new PrismaClient();

export class OTPService {
  async generateOtp(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const expiration = addMinutes(new Date(), 10); 

    await prisma.oTP.create({
      data: {
        otp,
        expiration,
        user: {
          connect: {
            email: email,
          },
        },
      },
    });

    await EmailService.sendOtp(email, otp);
  }

  async findUserByOtp(otp: string) {
    const otpRecord = await prisma.oTP.findFirst({
      where: { otp },
      include: { user: true }, 
    });

    if (!otpRecord) return null;

    if (isAfter(new Date(), otpRecord.expiration)) {
     
      await prisma.oTP.delete({ where: { id: otpRecord.id } });
      return null;
    }

    return otpRecord.user; 
  }
}
