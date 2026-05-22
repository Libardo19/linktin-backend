const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: "Error de validación", errors });
    }
    next();
};

const createSchema = Joi.object({
    nombre:    Joi.string().max(100).required().messages({
        "any.required": "El nombre de la habilidad es obligatorio",
        "string.max":   "El nombre no puede superar 100 caracteres",
    }),
    categoria: Joi.string().max(100).optional().messages({
        "string.max": "La categoría no puede superar 100 caracteres",
    }),
});

const updateSchema = Joi.object({
    nombre:    Joi.string().max(100).optional(),
    categoria: Joi.string().max(100).optional().allow(""),
}).min(1).messages({
    "object.min": "Debes enviar al menos un campo para actualizar",
});

module.exports = {
    validateCreateHabilidad: validate(createSchema),
    validateUpdateHabilidad: validate(updateSchema),
};