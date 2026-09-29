import {isValidObjectId} from 'mongoose';
import TipoCampaniaModel from '../models/tipoCampania.model.js';
import campaniaModel from '../models/campania.model.js';

const crearError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
}

export const listarTipos = async () => TipoCampaniaModel.find().sort({ nombre: 1 });

export const obtenerTipo = async (id) => {
    if (!isValidObjectId(id)) {
        throw crearError('ID de tipo de campaña inválido', 400);
    }
    const tipo = await TipoCampaniaModel.findById(id);
    if (!tipo) {
        throw crearError('Tipo de campaña no encontrado', 404);
    }
    return tipo;
}

export const crearTipo = async (datos) => {
    const tipoExistente = await TipoCampaniaModel.findOne({ nombre: datos.nombre });
    if (tipoExistente) {
        throw crearError('Ya existe un tipo de campaña con ese nombre', 409);
    }
    return TipoCampaniaModel.create(datos);
};

export const actualizarTipo = async (id, datos) => {
    await obtenerTipo(id);
    return TipoCampaniaModel.findByIdAndUpdate(id, datos, { returnDocument: 'after',  });
};

export const eliminarTipo = async (id) => {
    await obtenerTipo(id);
    const campaniasAsociadas = await campaniaModel.countDocuments({ tipoCampania: id });
    if (campaniasAsociadas > 0) {
        throw crearError('No se puede eliminar el tipo de campaña porque hay campañas asociadas', 400);
    }
    return TipoCampaniaModel.findByIdAndDelete(id);
};
    