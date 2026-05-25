const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: "Error de validación", errors });
  }
  next();
};

const MOTIVOS = [
  "abuso", "acoso", "spam", "contenido_inapropiado",
  "lenguaje_ofensivo", "oferta_falsa", "informacion_incorrecta",
  "suplantacion", "otro",
];

const ESTADOS = ["pendiente", "en_revision", "resuelto", "descartado"];

const createSchema = Joi.object({
  tipo_entidad: Joi.string()
    .valid("usuario", "oferta", "resena")
    .required()
    .messages({
      "any.only":     "El tipo debe ser: usuario, oferta o resena",
      "any.required": "El tipo de entidad es obligatorio",
    }),
  motivo: Joi.string()
    .valid(...MOTIVOS)
    .required()
    .messages({
      "any.only":     `El motivo debe ser uno de: ${MOTIVOS.join(", ")}`,
      "any.required": "El motivo es obligatorio",
    }),
  comentario: Joi.string().max(1000).optional().allow("", null).messages({
    "string.max": "El comentario no puede superar 1000 caracteres",
  }),
  id_usuario_reportado: Joi.string().max(10).optional(),
  id_oferta_reportada:  Joi.number().integer().optional(),
  id_resena_reportada:  Joi.number().integer().optional(),
});

const gestionarSchema = Joi.object({
  estado: Joi.string()
    .valid(...ESTADOS)
    .required()
    .messages({
      "any.only":     `El estado debe ser: ${ESTADOS.join(", ")}`,
      "any.required": "El estado es obligatorio",
    }),
  nota_admin: Joi.string().max(2000).optional().allow("", null).messages({
    "string.max": "La nota no puede superar 2000 caracteres",
  }),
});

module.exports = {
  validateCreateReporte:  validate(createSchema),
  validateGestionReporte: validate(gestionarSchema),
};