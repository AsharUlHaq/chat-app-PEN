import { Router } from 'express';
import { OTPController } from './otp.controller';

const otpRoutes = Router();
const controller = new OTPController();

otpRoutes.post('/request', controller.requestOtp.bind(controller));
otpRoutes.post('/verify', controller.verifyOtp.bind(controller));

export { otpRoutes };
