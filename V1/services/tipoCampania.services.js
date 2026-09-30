import { isValidObjectId } from "mongoose";
import TipoCampaniaModel from "../models/tipoCampania.model.js";
import campaniaModel from "../models/campania.model.js";

const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};
export const listarTipos = async () => {
    const tipos = await TipoCampaniaModel.find();
    return tipos;
};

export const obtenerTipo = async (id) => {
    if (!isValidObjectId(id)) {
        throw crearError("El id del tipo de campaña no es válido", 400);
    }
    const tipo = await TipoCampaniaModel.findById(id);
    if (!tipo) {
        throw crearError("Tipo de campaña no encontrado", 404);
    }
    return tipo;
};

export const crearTipo = async (datos) => {
    const existentes = await TipoCampaniaModel.find({ nombre: datos.nombre });
    if (existentes.length > 0) {
        throw crearError("Ya existe un tipo de campaña con ese nombre", 409);
    }
    const nuevoTipo = new TipoCampaniaModel(datos);
    await nuevoTipo.save();
    return nuevoTipo;
};

export const actualizarTipo = async (id, datos) => {
    await obtenerTipo(id);
    const tipoActualizado = await TipoCampaniaModel.findByIdAndUpdate(id, datos, { returnDocument: "after" });
    return tipoActualizado;
};

export const eliminarTipo = async (id) => {
    await obtenerTipo(id);
    const campaniasAsociadas = await campaniaModel.countDocuments({ tipo: id });
    if (campaniasAsociadas > 0) {
        throw crearError(`No se puede eliminar: hay ${campaniasAsociadas} campaña(s) con este tipo`, 409);
    }
    const tipoEliminado = await TipoCampaniaModel.findByIdAndDelete(id);
    return tipoEliminado;
};
