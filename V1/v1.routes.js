import express from 'express';
import authRouter from './routes/auth.routes.js';
import {authenticateToken} from './middlewares/auth.middleware.js';
import tipoCampaniaRouter from './routes/tiposCampania.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import campaniasRouter from './routes/campanias.routes.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use(authenticateToken);
router.use('/usuarios', usuariosRouter);
router.use('/campanias', campaniasRouter);
router.use('/tipos-campania', tipoCampaniaRouter);
export default router;
