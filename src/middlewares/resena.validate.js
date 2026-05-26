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
  id_match: Joi.number().integer().required().messages({
    "any.required": "El id del match es obligatorio",
    "number.base":  "El id del match debe ser un número",
  }),
  raiting: Joi.number()
    .min(1).max(5)
    .precision(1)
    .required()
    .messages({
      "any.required": "La calificación es obligatoria",
      "number.min":   "La calificación mínima es 1",
      "number.max":   "La calificación máxima es 5",
    }),
  comentario: Joi.string().max(1000).optional().allow("", null).messages({
    "string.max": "El comentario no puede superar 1000 caracteres",
  }),
});

module.exports = { ValidateCreateResena: validate(createSchema) };