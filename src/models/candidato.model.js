        const prisma = require("../config/db.config");

        const PERFIL_BASICO = {
        id_candidato:   true,
        nombres:        true,
        apellidos:      true,
        biografia:      true,
        foto_url:       true,
        ubicacion:      true,
        reputacion:     true,
        portafolio_url: true,
        github_url:     true,
        };

        const PERFIL_COMPLETO = {
        ...PERFIL_BASICO,
        fecha_nacimiento: true,
        genero:           true,
        hoja_vida:        true,
        experiencia_candidatos: {
            select: {
            id_experiencia: true,
            empresa:        true,
            cargo:          true,
            anio_inicio:    true,
            anio_fin:       true,
            },
            orderBy: { anio_inicio: "desc" },
        },
        educacion_candidatos: {
            select: {
            id_educacion: true,
            institucion:  true,
            titulo:       true,
            anio_inicio:  true,
            anio_fin:     true,
            },
            orderBy: { anio_inicio: "desc" },
        },
        habilidadEmpleados: {
            select: {
            id_habiEmpleados: true,
            nivel:            true,
            habilidad: {
                select: {
                id_habilidades: true,
                nombre:         true,
                categoria:      true,
                },
            },
            },
        },
        };

        const findAll = async () =>
            prisma.perfilCandidato.findMany({ select: PERFIL_BASICO, orderBy: { nombres: "asc" } });

        const findById = async (id_candidato) =>
            prisma.perfilCandidato.findUnique({ where: { id_candidato }, select: PERFIL_COMPLETO });

        const findByUsuarioId = async (id_usuarios) =>
            prisma.perfilCandidato.findUnique({ where: { id_usuarios }, select: PERFIL_COMPLETO });

        const create = async ({ id_candidato, id_usuarios, nombres, apellidos, ...rest }) =>
            prisma.perfilCandidato.create({
            data: { id_candidato, id_usuarios, nombres, apellidos, ...rest },
            select: PERFIL_COMPLETO,
        });

        const update = async (id_candidato, data) =>
            prisma.perfilCandidato.update({ where: { id_candidato }, data, select: PERFIL_COMPLETO });

        const remove = async (id_candidato) =>
            prisma.perfilCandidato.delete({ where: { id_candidato } });

        // ── Experiencia ──────────────────────────────────────────────────────────────
        const addExperiencia = async ({ id_candidato, empresa, cargo, anio_inicio, anio_fin }) =>
            prisma.experienciaCandidato.create({ data: { id_candidato, empresa, cargo, anio_inicio, anio_fin } });

        const updateExperiencia = async (id_experiencia, data) =>
            prisma.experienciaCandidato.update({ where: { id_experiencia }, data });

        const removeExperiencia = async (id_experiencia) =>
            prisma.experienciaCandidato.delete({ where: { id_experiencia } });

        // ── Educación ────────────────────────────────────────────────────────────────
        const addEducacion = async ({ id_candidato, institucion, titulo, anio_inicio, anio_fin }) =>
            prisma.educacionCandidato.create({ data: { id_candidato, institucion, titulo, anio_inicio, anio_fin } });

        const updateEducacion = async (id_educacion, data) =>
            prisma.educacionCandidato.update({ where: { id_educacion }, data });

        const removeEducacion = async (id_educacion) =>
            prisma.educacionCandidato.delete({ where: { id_educacion } });

        // ── Habilidades ──────────────────────────────────────────────────────────────
        const addHabilidad = async ({ id_candidato, id_habilidades, nivel }) =>
            prisma.habilidadEmpleado.create({
                data: { id_candidato, id_habilidades, nivel },
                include: { habilidad: true },
        });

        const updateHabilidad = async (id_habiEmpleados, nivel) =>
            prisma.habilidadEmpleado.update({
                where: { id_habiEmpleados },
                data: { nivel },
                include: { habilidad: true },
        });

        const removeHabilidad = async (id_habiEmpleados) =>
            prisma.habilidadEmpleado.delete({ where: { id_habiEmpleados } });

        module.exports = {
        findAll, findById, findByUsuarioId, create, update, remove,
        addExperiencia, updateExperiencia, removeExperiencia,
        addEducacion, updateEducacion, removeEducacion,
        addHabilidad, updateHabilidad, removeHabilidad,
        };

