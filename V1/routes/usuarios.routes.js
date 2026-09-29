import { cambiarPlanController } from "../controllers/usuario.controller.js";
import express from "express";

const router = express.Router();
router.patch('/me/plan', cambiarPlanController);

export default router;