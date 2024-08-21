// // // src/reset-password/reset-password.controller.ts

// // import { Request, Response } from 'express';
// // import { ResetPasswordService } from './rp.service';
// // import { z } from 'zod';

// // const resetPasswordService = new ResetPasswordService();

// // const resetPasswordSchema = z.object({
// //   email: z.string().email(),
// //   otp: z.string().length(6), // Assuming OTP is a fixed length string
// //   newPassword: z.string().min(6),
// // });

// // export class ResetPasswordController {
// //   async resetPassword(req: Request, res: Response) {
// //     try {
// //       resetPasswordSchema.parse(req.body);

// //       const { email, otp, newPassword } = req.body;
// //       await resetPasswordService.resetPassword(email, otp, newPassword);

// //       return res.status(200).json({ message: 'Password reset successfully.' });
// //     } catch (error:any) {
// //       return res.status(400).json({ error: error.message });
// //     }
// //   }
// // }

import { Request, Response } from 'express';
import { ResetPasswordService } from './rp.service';
import { resetPasswordSchema } from './rp.schema';

const resetPasswordService = new ResetPasswordService();

export class ResetPasswordController {
  async resetPassword(req: Request, res: Response) {
    try {
      resetPasswordSchema.parse(req.body);
      const { email, newPassword } = req.body;
      await resetPasswordService.resetPassword(email, newPassword);
      return res.status(200).json({status:200, message: 'Password reset successfully.',data:null,success:true });
    } catch (error: any) {
      return res.status(400).json({status:200, message: error.errors || error.message, data:null, success:true });
    }
  }
}
