const Joi = require("joi");

// ─── Schemas ──────────────────────────────────────────────────────────

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email":    "El email no tiene un formato válido",
      "any.required":    "El email es obligatorio",
      "string.empty":    "El email no puede estar vacío",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min":      "La contraseña debe tener al menos 6 caracteres",
      "any.required":    "La contraseña es obligatoria",
      "string.empty":    "La contraseña no puede estar vacía",
    }),
});

const registerSchema = Joi.object({
  id_usuarios: Joi.string()
    .alphanum()
    .max(10)
    .required()
    .messages({
      "string.alphanum": "El ID solo puede contener letras y números",
      "string.max":      "El ID no puede superar 10 caracteres",
      "any.required":    "El ID de usuario es obligatorio",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(50)
    .required()
    .messages({
      "string.email":    "El email no tiene un formato válido",
      "string.max":      "El email no puede superar 50 caracteres",
      "any.required":    "El email es obligatorio",
    }),

  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .required()
    .messages({
      "string.min":      "La contraseña debe tener al menos 8 caracteres",
      "string.max":      "La contraseña no puede superar 64 caracteres",
      "string.pattern.base": "La contraseña debe tener al menos una mayúscula, una minúscula y un número",
      "any.required":    "La contraseña es obligatoria",
    }),

  tipo: Joi.string()
    .valid("candidato", "empresa")  // admin solo se asigna manualmente en DB
    .required()
    .messages({
      "any.only":     "El tipo debe ser 'candidato' o 'empresa'",
      "any.required": "El tipo de usuario es obligatorio",
    }),
});

// ─── Factory — genera middleware de validación para cualquier schema ───

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // Recolecta todos los errores de una vez (abortEarly: false)
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors:  mensajes,
    });
  }

  next();
};

// ─── Exports ──────────────────────────────────────────────────────────

module.exports = {
  validateLogin:    validate(loginSchema),
  validateRegister: validate(registerSchema),
};