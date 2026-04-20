const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ success: false, message: "Error de validación", errors });
    }
    next();
};

// Sub-schema del sector (opcional al crear empresa)
const sectorSchema = Joi.object({
    nombre:      Joi.string().max(100).required().messages({
        "any.required": "El nombre del sector es obligatorio si lo incluyes",
    }),
    descripcion: Joi.string().optional().allow("", null),
});

const createEmpresaSchema = Joi.object({
    nombre:      Joi.string().max(100).required().messages({
        "any.required": "El nombre es obligatorio",
        "string.max":   "El nombre no puede superar 100 caracteres",
    }),
    descripcion: Joi.string().optional().allow("", null),
    logo_url:    Joi.string().uri().max(255).optional().allow("", null),
    ubicacion:   Joi.string().max(100).optional().allow("", null),
    website:     Joi.string().uri().max(255).optional().allow("", null),
    sector:      sectorSchema.optional(),
});

const updateEmpresaSchema = Joi.object({
    nombre:      Joi.string().max(100).optional(),
    descripcion: Joi.string().optional().allow("", null),
    logo_url:    Joi.string().uri().max(255).optional().allow("", null),
    ubicacion:   Joi.string().max(100).optional().allow("", null),
    website:     Joi.string().uri().max(255).optional().allow("", null),
    sector:      sectorSchema.optional(),
}).min(1).messages({ "object.min": "Debes enviar al menos un campo para actualizar" });

module.exports = {
    validateCreateEmpresa: validate(createEmpresaSchema),
    validateUpdateEmpresa: validate(updateEmpresaSchema),
};