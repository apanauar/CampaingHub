import express from 'express';
import { registerUserController } from '../controllers/auth.controllers.js';
import { validateBody } from '../middlewares/validateBody.middleware.js';
import { registerSchema } from '../validators/auth.validators.js';
import { loginUserController } from '../controllers/auth.controllers.js';
import { loginSchema } from '../validators/auth.validators.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerUserController);

authRouter.post('/login', validateBody(loginSchema), loginUserController);

export default authRouter;
