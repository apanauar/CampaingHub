import express from 'express';
import authRouter from './routes/auth.routes.js';
import {authenticateToken} from './middlewares/auth.middleware.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use(authenticateToken);
export default router;