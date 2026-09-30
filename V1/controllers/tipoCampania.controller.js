import * as service from "../services/tipoCampania.services.js";

export const listar = async (req, res) => {
    const tipos = await service.listarTipos();
    res.status(200).json({ tipos });
}
export const obtener = async (req, res) => {
    const { id } = req.params;
    const tipo = await service.obtenerTipo(id);
    res.status(200).json({ tipo });
};

export const crear = async (req, res) => {
    const tipo = await service.crearTipo(req.validatedBody);
    res.status(201).json({ tipo });
};

export const actualizar = async (req, res) => {
    const { id } = req.params;
    const tipo = await service.actualizarTipo(id, req.validatedBody);
    res.status(200).json({ tipo });
};

export const eliminar = async (req, res) => {
    const { id } = req.params;
    const tipo = await service.eliminarTipo(id);
    res.status(200).json({ mensaje: "Tipo de campaña eliminado", tipo });
};