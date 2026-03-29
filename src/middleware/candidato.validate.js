const Joi = require("joi");

    const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((d) => d.message);
            return res.status(400).json({ success: false, message: "Error de validación", errors });
        }
        next();
        };

    const createPerfilSchema = Joi.object({
    nombres:          Joi.string().max(20).required(),
    apellidos:        Joi.string().max(20).required(),
    fecha_nacimiento: Joi.date().iso().optional(),
    genero:           Joi.string().max(15).optional(),
    biografia:        Joi.string().max(1000).optional(),
    foto_url:         Joi.string().uri().max(255).optional(),
    ubicacion:        Joi.string().max(100).optional(),
    portafolio_url:   Joi.string().uri().max(255).optional(),
    github_url:       Joi.string().uri().max(255).optional(),
    hoja_vida:        Joi.string().max(255).optional(),
    });

    const updatePerfilSchema = Joi.object({
    nombres:          Joi.string().max(20).optional(),
    apellidos:        Joi.string().max(20).optional(),
    fecha_nacimiento: Joi.date().iso().optional(),
    genero:           Joi.string().max(15).optional(),
    biografia:        Joi.string().max(1000).optional(),
    foto_url:         Joi.string().uri().max(255).optional().allow(""),
    ubicacion:        Joi.string().max(100).optional(),
    portafolio_url:   Joi.string().uri().max(255).optional().allow(""),
    github_url:       Joi.string().uri().max(255).optional().allow(""),
    hoja_vida:        Joi.string().max(255).optional().allow(""),
    }).min(1).messages({ "object.min": "Debes enviar al menos un campo para actualizar" });

    const experienciaSchema = Joi.object({
    empresa:     Joi.string().max(100).required(),
    cargo:       Joi.string().max(100).required(),
    anio_inicio: Joi.number().integer().min(1950).max(new Date().getFullYear()).required(),
    anio_fin:    Joi.number().integer().min(1950).max(new Date().getFullYear()).optional().allow(null),
    });

    const educacionSchema = Joi.object({
    institucion: Joi.string().max(150).required(),
    titulo:      Joi.string().max(150).required(),
    anio_inicio: Joi.number().integer().min(1950).max(new Date().getFullYear()).required(),
    anio_fin:    Joi.number().integer().min(1950).max(new Date().getFullYear()).optional().allow(null),
    });

    const habilidadSchema = Joi.object({
    id_habilidades: Joi.number().integer().required(),
    nivel:          Joi.string().valid("basico", "intermedio", "avanzado").required(),
    });

    const updateNivelSchema = Joi.object({
    nivel: Joi.string().valid("basico", "intermedio", "avanzado").required(),
    });

    module.exports = {
    validateCreatePerfil: validate(createPerfilSchema),
    validateUpdatePerfil: validate(updatePerfilSchema),
    validateExperiencia:  validate(experienciaSchema),
    validateEducacion:    validate(educacionSchema),
    validateHabilidad:    validate(habilidadSchema),
    validateUpdateNivel:  validate(updateNivelSchema),
    };