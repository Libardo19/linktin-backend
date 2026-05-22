const prisma = require("../config/db.config");

const findAll = async () =>
    prisma.sectores.findMany({ orderBy: { nombre: "asc" } });

const findById = async (id_sector) =>
    prisma.sectores.findUnique({ where: { id_sector } });

const findByNombre = async (nombre) =>
    prisma.sectores.findUnique({ where: { nombre } });

const create = async ({ nombre, descripcion }) =>
    prisma.sectores.create({ data: { nombre, descripcion } });

const update = async (id_sector, data) =>
    prisma.sectores.update({ where: { id_sector }, data });

const remove = async (id_sector) =>
    prisma.sectores.delete({ where: { id_sector } });

module.exports = { findAll, findById, findByNombre, create, update, remove };