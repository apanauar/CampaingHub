import express from "express";
import * as ctrl from "../controllers/campania.controller.js";
import { validateBody } from "../middlewares/validateBody.middleware.js";
import { crearCampaniaSchema, actualizarCampaniaSchema } from "../validators/campanias.validators.js";

const router = express.Router();

router.get("/resumen", ctrl.resumen);
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtener);
router.post("/", validateBody(crearCampaniaSchema), ctrl.crear);
router.patch("/:id", validateBody(actualizarCampaniaSchema), ctrl.actualizar);
router.delete("/:id", ctrl.eliminar);
router.post("/:id/piezas", ctrl.subirPieza);
router.post("/:id/brief", ctrl.generarBrief);
router.get("/:id/feriados", ctrl.feriados);
export default router;