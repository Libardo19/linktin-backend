    const CandidatoModel = require("../models/candidato.model");
    const HabilidadModel = require("../models/habilidad.model");

        const verificarPropietario = async (id_candidato, usuarioToken) => {
            const candidato = await CandidatoModel.findById(id_candidato);
                if (!candidato) throw { status: 404, message: "Perfil de candidato no encontrado" };

                if (usuarioToken.tipo !== "admin" && usuarioToken.id !== id_candidato)
                    throw { status: 403, message: "No tienes permiso para modificar este perfil" };
                return candidato;
                };

            const verificarExistencia = async (id_candidato) => {
                        
                    const candidato = await CandidatoModel.findById(id_candidato);
                    if (!candidato) throw { status: 404, message: "Perfil de candidato no encontrado" };
                    return candidato;
        };

        // ── Perfil ───────────────────────────────────────────────────────────────────
        const getAll = async () => CandidatoModel.findAll();

        const getById = async (id_candidato) => verificarExistencia(id_candidato);

        const getMiPerfil = async (usuarioToken) => {
        const candidato = await CandidatoModel.findByUsuarioId(usuarioToken.id);
            if (!candidato) throw { status: 404, message: "Aún no tienes un perfil de candidato creado" };
            return candidato;
            };

        const createPerfil = async (usuarioToken, body) => {
            if (usuarioToken.tipo !== "candidato")
                throw { status: 403, message: "Solo los candidatos pueden crear este perfil" };
            const existe = await CandidatoModel.findByUsuarioId(usuarioToken.id);
            if (existe) throw { status: 409, message: "Ya tienes un perfil de candidato creado" };
            return CandidatoModel.create({ id_candidato: usuarioToken.id, id_usuarios: usuarioToken.id, ...body });
            };

        const updatePerfil = async (id_candidato, usuarioToken, body) => {
            await verificarPropietario(id_candidato, usuarioToken);
        const { id_candidato: _, id_usuarios: __, ...datosActualizables } = body;
            return CandidatoModel.update(id_candidato, datosActualizables);
            };

        const deletePerfil = async (id_candidato, usuarioToken) => {
            await verificarPropietario(id_candidato, usuarioToken);
            await CandidatoModel.remove(id_candidato);
            return { message: "Perfil eliminado correctamente" };
            };

        // ── Experiencia ──────────────────────────────────────────────────────────────
        const addExperiencia = async (id_candidato, usuarioToken, body) => {
            await verificarPropietario(id_candidato, usuarioToken);
            return CandidatoModel.addExperiencia({ id_candidato, ...body });
            };

        const updateExperiencia = async (id_candidato, id_experiencia, usuarioToken, body) => {
            await verificarPropietario(id_candidato, usuarioToken);
            return CandidatoModel.updateExperiencia(parseInt(id_experiencia), body);
            };

        const deleteExperiencia = async (id_candidato, id_experiencia, usuarioToken) => {
            await verificarPropietario(id_candidato, usuarioToken);
            await CandidatoModel.removeExperiencia(parseInt(id_experiencia));
            return { message: "Experiencia eliminada correctamente" };
            };

        // ── Educación ────────────────────────────────────────────────────────────────
        const addEducacion = async (id_candidato, usuarioToken, body) => {
            await verificarPropietario(id_candidato, usuarioToken);
            return CandidatoModel.addEducacion({ id_candidato, ...body });
            };

        const updateEducacion = async (id_candidato, id_educacion, usuarioToken, body) => {
            await verificarPropietario(id_candidato, usuarioToken);
            return CandidatoModel.updateEducacion(parseInt(id_educacion), body);
            };

        const deleteEducacion = async (id_candidato, id_educacion, usuarioToken) => {
            await verificarPropietario(id_candidato, usuarioToken);
            await CandidatoModel.removeEducacion(parseInt(id_educacion));
            return { message: "Educación eliminada correctamente" };
            };

        // ── Habilidades ──────────────────────────────────────────────────────────────
        const addHabilidad = async (id_candidato, usuarioToken, body) => {
            await verificarPropietario(id_candidato, usuarioToken);

            const { nombre, categoria, nivel } = body;

            // Buscar en el catálogo, crear si no existe
            let habilidad = await HabilidadModel.findByNombre(nombre);
            if (!habilidad) {
                habilidad = await HabilidadModel.create({ nombre, categoria });
            }

            return CandidatoModel.addHabilidad({
                id_candidato,
                id_habilidades: habilidad.id_habilidades,
                nivel,
            });
};

        const updateHabilidad = async (id_candidato, id_habiEmpleados, usuarioToken, { nivel }) => {
            await verificarPropietario(id_candidato, usuarioToken);
            return CandidatoModel.updateHabilidad(parseInt(id_habiEmpleados), nivel);
            };

        const deleteHabilidad = async (id_candidato, id_habiEmpleados, usuarioToken) => {
            await verificarPropietario(id_candidato, usuarioToken);
            await CandidatoModel.removeHabilidad(parseInt(id_habiEmpleados));
            return { message: "Habilidad eliminada correctamente" };
            };

        module.exports = {
            getAll, getById, getMiPerfil, createPerfil, updatePerfil, deletePerfil,
            addExperiencia, updateExperiencia, deleteExperiencia,
            addEducacion, updateEducacion, deleteEducacion,
            addHabilidad, updateHabilidad, deleteHabilidad,
        };