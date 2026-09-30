import Joi from "joi";

const CANALES = ["instagram", "tiktok", "meta_ads", "google_ads", "linkedin", "email"];
const ESTADOS = ["borrador", "activa", "pausada", "finalizada"];

export const crearCampaniaSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos {#limit} caracteres',
        'string.max': 'El nombre no puede tener más de {#limit} caracteres',
        'any.required': 'El nombre es obligatorio'
    }),
    cliente: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El cliente es obligatorio',
        'any.required': 'El cliente es obligatorio'
    }),
    tipo: Joi.string().required().messages({
        'string.empty': 'El tipo de campaña es obligatorio',
        'any.required': 'El tipo de campaña es obligatorio'
    }),
    objetivo: Joi.string().max(500).optional().messages({
        'string.max': 'El objetivo no puede tener más de {#limit} caracteres'
    }),
    canales: Joi.array().items(Joi.string().valid(...CANALES)).required().messages({
        'any.only': `Canal inválido. Opciones: ${CANALES.join(", ")}`,
        'any.required': 'Los canales son obligatorios'
    }),
    presupuesto: Joi.number().min(0).optional().messages({
        'number.base': 'El presupuesto debe ser un número',
        'number.min': 'El presupuesto no puede ser negativo'
    }),
    fechaInicio: Joi.string().required().messages({
        'string.empty': 'La fecha de inicio es obligatoria',
        'any.required': 'La fecha de inicio es obligatoria'
    }),
    fechaFin: Joi.string().required().messages({
        'string.empty': 'La fecha de fin es obligatoria',
        'any.required': 'La fecha de fin es obligatoria'
    })
});

export const actualizarCampaniaSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).optional(),
    cliente: Joi.string().min(2).max(100).optional(),
    tipo: Joi.string().optional(),
    objetivo: Joi.string().max(500).optional(),
    canales: Joi.array().items(Joi.string().valid(...CANALES)).optional(),
    presupuesto: Joi.number().min(0).optional(),
    fechaInicio: Joi.string().optional(),
    fechaFin: Joi.string().optional(),
    estado: Joi.string().valid(...ESTADOS).optional().messages({
        'any.only': `Estado inválido. Opciones: ${ESTADOS.join(", ")}`
    })
});