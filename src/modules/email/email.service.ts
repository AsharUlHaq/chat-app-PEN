// // src/email/email.service.ts

// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export class EmailService {
//   static sendResetPasswordLink(email: string, token: string) {
//     throw new Error('Method not implemented.');
//   }
//   static async sendOtp(email: string, otp: string): Promise<void> {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP Code for Password Reset',
//       text: `Your OTP code is ${otp}. valid for 10 minutes.`,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('OTP sent successfully');
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       throw new Error('Failed to send OTP');
//     }
//   }
// }

// src/email/email.service.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export class EmailService {
  static async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code for Password Reset',
      text: `Your OTP code is ${otp}. Valid for 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  static async sendResetPasswordLink(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}. This link is valid for 10 minutes.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Password reset link sent successfully');
    } catch (error) {
      console.error('Error sending reset password link:', error);
      throw new Error('Failed to send password reset link');
    }
  }
}
