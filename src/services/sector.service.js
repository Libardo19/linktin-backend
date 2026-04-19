const SectorModel = require("../models/sector.model");

const soloAdmin = (usuarioToken) => {
    if (usuarioToken.tipo !== "admin")
      throw { status: 403, message: "Solo el administrador puede realizar esta acción" };
};

const verificarExistencia = async (id_sector) => {
    const sector = await SectorModel.findById(id_sector);
    if (!sector) throw { status: 404, message: "Sector no encontrado" };
    return sector;
};

// GET /api/sectores — público
const getAll = async () => SectorModel.findAll();

// GET /api/sectores/:id — público
const getById = async (id) => verificarExistencia(parseInt(id));

// POST /api/sectores — solo admin
const create = async (usuarioToken, { nombre, descripcion }) => {
    soloAdmin(usuarioToken);
    const existe = await SectorModel.findByNombre(nombre);
    if (existe) throw { status: 409, message: `El sector '${nombre}' ya existe` };
    return SectorModel.create({ nombre, descripcion });
};

// PUT /api/sectores/:id — solo admin
const update = async (usuarioToken, id, body) => {
    soloAdmin(usuarioToken);
    await verificarExistencia(parseInt(id));
    if (body.nombre) {
      const existe = await SectorModel.findByNombre(body.nombre);
      if (existe && existe.id_sector !== parseInt(id))
        throw { status: 409, message: `Ya existe otro sector con el nombre '${body.nombre}'` };
    }
    return SectorModel.update(parseInt(id), body);
};

// DELETE /api/sectores/:id — solo admin
const remove = async (usuarioToken, id) => {
    soloAdmin(usuarioToken);
    await verificarExistencia(parseInt(id));
    await SectorModel.remove(parseInt(id));
    return { message: "Sector eliminado correctamente" };
};

/**
 * Busca un sector por nombre y lo crea si no existe.
 * Usado por empresa.service al crear/actualizar perfil.
 * SRP: lógica de búsqueda-o-creación centralizada aquí.
 */
const findOrCreate = async ({ nombre, descripcion }) => {
    let sector = await SectorModel.findByNombre(nombre);
    if (!sector) sector = await SectorModel.create({ nombre, descripcion });
    return sector;
};

module.exports = { getAll, getById, create, update, remove, findOrCreate };