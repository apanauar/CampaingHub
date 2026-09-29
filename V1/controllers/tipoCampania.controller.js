import * as service from '../services/tipoCampania.services.js';

export const listar = async (req, res) => res.json({ tipos: await service.listarTipos() });
export const obtener = async (req, res) => res.json({ tipo: await service.obtenerTipo(req.params.id) });
export const crear = async (req, res) => res.status(201).json({ tipo: await service.crearTipo(req.validatedBody) });
export const actualizar = async (req, res) => res.json({ tipo: await service.actualizarTipo(req.params.id, req.validatedBody) });
export const eliminar = async (req, res) => { await service.eliminarTipo(req.params.id); res.status(204).send(); };