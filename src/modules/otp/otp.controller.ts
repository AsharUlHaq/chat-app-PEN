
// import { Request, Response } from 'express';
// import { OTPService } from './otp.service';
// import { z } from 'zod';
// import { requestOtpSchema, verifyOtpSchema } from './otp.schema';

// const otpService = new OTPService();

// export class OTPController {
//   async requestOtp(req: Request, res: Response) {
//     try {
//       requestOtpSchema.parse(req.body);

//       const { email } = req.body;
//       await otpService.generateOtp(email);

//       return res.status(200).json({ message: 'OTP sent to your email.' });
//     } catch (error:any) {
//       return res.status(400).json({ error: error.errors || error.message });
//     }
//   }

//   async verifyOtp(req: Request, res: Response) {
//     try {
//       verifyOtpSchema.parse(req.body);

//       const { email, otp } = req.body;
//       const isOtpValid = await otpService.verifyOtp(email, otp);

//       if (isOtpValid) {
//         return res.status(200).json({ message: 'OTP verified successfully.' });
//       } else {
//         return res.status(400).json({ error: 'Invalid or expired OTP.' });
//       }
//     } catch (error:any) {
//       return res.status(400).json({ error: error.errors || error.message });
//     }
//   }
// }

// src/otp/otp.controller.ts

// import { Request, Response } from 'express';
// import { OTPService } from './otp.service';
// import { requestOtpSchema, verifyOtpSchema } from './otp.schema';

// const otpService = new OTPService();

// export class OTPController {
//   async requestOtp(req: Request, res: Response) {
//     try {
//       requestOtpSchema.parse(req.body);

//       const { email } = req.body;
//       await otpService.generateOtp(email);

//       return res.status(200).json({ message: 'OTP sent to your email.' });
//     } catch (error: any) {
//       return res.status(400).json({ error: error.errors || error.message });
//     }
//   }

//   async verifyOtp(req: Request, res: Response) {
//     try {
//       verifyOtpSchema.parse(req.body);

//       const { email, otp } = req.body;
//       const isOtpValid = await otpService.verifyOtp(email, otp);

//       if (isOtpValid) {
//         return res.status(200).json({ message: 'OTP verified successfully.' });
//       } else {
//         return res.status(400).json({ error: 'Invalid or expired OTP.' });
//       }
//     } catch (error: any) {
//       return res.status(400).json({ error: error.errors || error.message });
//     }
//   }
// }

// src/otp/otp.controller.ts

import { Request, Response } from 'express';
import { OTPService } from './otp.service';
import { requestOtpSchema, verifyOtpSchema } from './otp.schema';

const otpService = new OTPService();

export class OTPController {
  async requestOtp(req: Request, res: Response) {
    try {
      requestOtpSchema.parse(req.body);
      const { email } = req.body;
      await otpService.generateOtp(email);
      return res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.errors || error.message });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      verifyOtpSchema.parse(req.body);
      const { otp } = req.body;
      const user = await otpService.findUserByOtp(otp);
      if (user) {
        return res.status(200).json({ message: 'OTP verified successfully.', email: user.email });
      } else {
        return res.status(400).json({ error: 'Invalid or expired OTP.' });
      }
    } catch (error: any) {
      return res.status(400).json({ error: error.errors || error.message });
    }
  }
}
