// // src/reset-password/reset-password.route.ts

// import { Router } from 'express';
// import { ResetPasswordController } from './rp.controller';

// const resetPasswordRoutes = Router();
// const controller = new ResetPasswordController();

// resetPasswordRoutes.post('/reset', controller.resetPassword.bind(controller));

// export {resetPasswordRoutes}
//-------------------------------------------------------------

// src/auth/auth.route.ts

// import { Router } from 'express';
// import { ResetPasswordController } from './rp.controller';

// const resetPasswordRoutes = Router();
// const controller = new ResetPasswordController();

// resetPasswordRoutes.post('/reset', controller.resetPassword.bind(controller));

// export { resetPasswordRoutes };
//--------------------------------------------------------------
// src/reset-password/rp.route.ts

// src/reset-password/rp.route.ts

import { Router } from 'express';
import { ResetPasswordController } from './rp.controller';


const router = Router();


const controller = new ResetPasswordController();


router.post('/request', controller.requestPasswordReset.bind(controller));


router.post('/reset', controller.resetPassword.bind(controller));

export { router as resetPasswordRoutes };
