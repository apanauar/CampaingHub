import * as service from "../services/campanias.services.js";

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