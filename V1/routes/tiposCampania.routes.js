import express from "express";
import * as ctrl from "../controllers/tipoCampania.controller.js";
import { validateBody } from "../middlewares/validateBody.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { crearTipoSchema, actualizarTipoSchema } from "../validators/tipoCampania.validators.js";

const router = express.Router();

router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtener);

router.post("/", authorizeRoles(["admin"]), validateBody(crearTipoSchema), ctrl.crear);
router.patch("/:id", authorizeRoles(["admin"]), validateBody(actualizarTipoSchema), ctrl.actualizar);
router.delete("/:id", authorizeRoles(["admin"]), ctrl.eliminar);

export default router;