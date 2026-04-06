const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: "Error de validación", errors });
    }
    next();
};

const habilidadOfertaSchema = Joi.object({
    id_habilidades: Joi.number().integer().required(),
    nivelRequerido: Joi.string().valid("basico", "intermedio", "avanzado").required(),
    obligatoria:    Joi.boolean().default(false),
});

const createSchema = Joi.object({
    titulo:       Joi.string().max(200).required().messages({
        "any.required": "El título es obligatorio",
    }),
    descripcion:  Joi.string().required().messages({
        "any.required": "La descripción es obligatoria",
    }),
    direccion:    Joi.string().max(150).optional().allow(""),
    modalidad:    Joi.string().valid("presencial", "remoto", "hibrido").required().messages({
        "any.only":     "La modalidad debe ser: presencial, remoto o hibrido",
        "any.required": "La modalidad es obligatoria",
    }),
    pago:         Joi.number().positive().optional(),
    fecha_cierre: Joi.date().iso().greater("now").optional().messages({
        "date.greater": "La fecha de cierre debe ser futura",
    }),
    habilidades:  Joi.array().items(habilidadOfertaSchema).min(1).required().messages({
        "any.required": "Debes especificar al menos una habilidad requerida",
        "array.min":    "Debes especificar al menos una habilidad requerida",
    }),
});

const updateSchema = Joi.object({
    titulo:       Joi.string().max(200).optional(),
    descripcion:  Joi.string().optional(),
    direccion:    Joi.string().max(150).optional().allow(""),
    modalidad:    Joi.string().valid("presencial", "remoto", "hibrido").optional(),
    pago:         Joi.number().positive().optional(),
    fecha_cierre: Joi.date().iso().greater("now").optional(),
}).min(1).messages({ "object.min": "Debes enviar al menos un campo para actualizar" });

const estadoSchema = Joi.object({
    estado: Joi.string().valid("activa", "cerrada", "pausada").required().messages({
        "any.only":     "El estado debe ser: activa, cerrada o pausada",
        "any.required": "El estado es obligatorio",
    }),
});

module.exports = {
    validateCreateOferta: validate(createSchema),
    validateUpdateOferta: validate(updateSchema),
    validateEstado:       validate(estadoSchema),
};