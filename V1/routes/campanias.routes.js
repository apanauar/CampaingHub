import exxpress from "express";
import * as ctrl from "../controllers/campania.controller.js";
import { validateBody } from "../middlewares/validateBody.middleware.js";
import { crearCampaniaSchema, actualizarCampaniaSchema } from "../validators/campania.validators.js";

const router = exxpress.Router();

router.get("/resumen", ctrl.resumen);
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtener);
router.post("/", validateBody(crearCampaniaSchema), ctrl.crear);
router.patch("/:id", validateBody(actualizarCampaniaSchema), ctrl.actualizar);
router.delete("/:id", ctrl.eliminar);

export default router;