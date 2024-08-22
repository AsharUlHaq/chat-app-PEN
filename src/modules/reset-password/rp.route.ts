// // src/reset-password/reset-password.route.ts

// import { Router } from 'express';
// import { ResetPasswordController } from './rp.controller';

// const resetPasswordRoutes = Router();
// const controller = new ResetPasswordController();

// resetPasswordRoutes.post('/reset', controller.resetPassword.bind(controller));

// export {resetPasswordRoutes}

// src/auth/auth.route.ts

// import { Router } from 'express';
// import { ResetPasswordController } from './rp.controller';

// const resetPasswordRoutes = Router();
// const controller = new ResetPasswordController();

// resetPasswordRoutes.post('/reset', controller.resetPassword.bind(controller));

// export { resetPasswordRoutes };
//----------------------
import { Router } from 'express';
import { ResetPasswordController } from './rp.controller';

const resetPasswordRoutes = Router();
const controller = new ResetPasswordController();

resetPasswordRoutes.post('/reset', controller.resetPassword.bind(controller));

export { resetPasswordRoutes };
