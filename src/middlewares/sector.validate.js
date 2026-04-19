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
    nombre:      Joi.string().max(100).required().messages({
      "any.required": "El nombre del sector es obligatorio",
      "string.max":   "El nombre no puede superar 100 caracteres",
    }),
    descripcion: Joi.string().optional().allow("", null),
});

const updateSchema = Joi.object({
    nombre:      Joi.string().max(100).optional(),
    descripcion: Joi.string().optional().allow("", null),
  }).min(1).messages({
    "object.min": "Debes enviar al menos un campo para actualizar",
});

module.exports = {
    validateCreateSector: validate(createSchema),
    validateUpdateSector: validate(updateSchema),
};