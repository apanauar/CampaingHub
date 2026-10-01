import * as service from "../services/campanias.services.js";
import { upload } from "../middlewares/multer.middleware.js";
import { runMulterSingle } from "../utils/multer.util.js";
export const listar = async (req, res) => {
    const resultado = await service.listarCampanias(req.user, req.query);
    res.status(200).json(resultado);
};

export const obtener = async (req, res) => {
    const { id } = req.params;
    const campania = await service.obtenerCampania(req.user, id);
    res.status(200).json({ campania });
};

export const crear = async (req, res) => {
    const campania = await service.crearCampania(req.user, req.validatedBody);
    res.status(201).json({ campania });
};

export const actualizar = async (req, res) => {
    const { id } = req.params;
    const campania = await service.actualizarCampania(req.user, id, req.validatedBody);
    res.status(200).json({ campania });
};

export const eliminar = async (req, res) => {
    const { id } = req.params;
    const campania = await service.eliminarCampania(req.user, id);
    res.status(200).json({ mensaje: "Campaña eliminada", campania });
};

export const resumen = async (req, res) => {
    const resultado = await service.resumenPlan(req.user);
    res.status(200).json(resultado);
};

export const subirPieza = async (req, res) => {
    await runMulterSingle(upload, "imagen", req, res);  

    if (!req.file) {
        return res.status(400).json({ error: "No se envió ninguna imagen (campo 'imagen')" });
    }
    if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "El archivo debe ser una imagen" });
    }

    const { id } = req.params;
    const campania = await service.agregarPieza(req.user, id, req.file);
    res.status(201).json({ campania });
};

export const generarBrief = async (req, res) => {
    const { id } = req.params;
    const resultado = await service.generarBrief(req.user, id);
    res.status(200).json(resultado);
};

export const feriados = async (req, res) => {
    const { id } = req.params;
    const resultado = await service.obtenerFeriados(req.user, id);
    res.status(200).json(resultado);
};
