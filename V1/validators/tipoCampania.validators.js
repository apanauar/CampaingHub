import joi from 'joi';

export const crearTipoSchema = joi.object({
    nombre: joi.string().min(2).max(50).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    descripcion: joi.string().optional()
});

export const actualizarTipoSchema = joi.object({
    nombre: joi.string().min(2).max(50).optional(),
    descripcion: joi.string().max(200).allow("").optional()
}).min(1).messages({ 'object.min': 'Debe enviar al menos un campo para actualizar' });