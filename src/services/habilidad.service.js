const HabilidadModel = require("../models/habilidad.model");

const soloAdmin = (usuarioToken) => {
    if (usuarioToken.tipo !== "admin")
    throw { status: 403, message: "Solo el administrador puede realizar esta acción" };
};

const verificarExistencia = async (id_habilidades) => {
    const habilidad = await HabilidadModel.findById(id_habilidades);
    if (!habilidad) throw { status: 404, message: "Habilidad no encontrada" };
    return habilidad;
};

// GET /api/habilidades?categoria=backend
const getAll = async (categoria) => HabilidadModel.findAll(categoria);

// GET /api/habilidades/:id
const getById = async (id) => verificarExistencia(parseInt(id));

// POST /api/habilidades — solo admin
const create = async (usuarioToken, { nombre, categoria }) => {
    soloAdmin(usuarioToken);
    const existe = await HabilidadModel.findByNombre(nombre);
    if (existe) throw { status: 409, message: `La habilidad '${nombre}' ya existe en el catálogo` };
    return HabilidadModel.create({ nombre, categoria });
};

// PUT /api/habilidades/:id — solo admin
const update = async (usuarioToken, id, body) => {
    soloAdmin(usuarioToken);
    await verificarExistencia(parseInt(id));
    if (body.nombre) {
        const existe = await HabilidadModel.findByNombre(body.nombre);
        if (existe && existe.id_habilidades !== parseInt(id))
        throw { status: 409, message: `Ya existe otra habilidad con el nombre '${body.nombre}'` };
    }
    return HabilidadModel.update(parseInt(id), body);
};

// DELETE /api/habilidades/:id — solo admin
const remove = async (usuarioToken, id) => {
    soloAdmin(usuarioToken);
    await verificarExistencia(parseInt(id));
    await HabilidadModel.remove(parseInt(id));
    return { message: "Habilidad eliminada correctamente" };
};

module.exports = { getAll, getById, create, update, remove };