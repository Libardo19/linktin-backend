const prisma = require("../config/db.config");

const findAll = async (categoria) =>
    prisma.habilidades.findMany({
        where: categoria ? { categoria } : {},
        orderBy: [{ categoria: "asc" }, { nombre: "asc" }],
    });

const findById = async (id_habilidades) =>
    prisma.habilidades.findUnique({ where: { id_habilidades } });

const findByNombre = async (nombre) =>
    prisma.habilidades.findUnique({ where: { nombre } });

const create = async ({ nombre, categoria }) =>
    prisma.habilidades.create({ data: { nombre, categoria } });

const update = async (id_habilidades, data) =>
    prisma.habilidades.update({ where: { id_habilidades }, data });

const remove = async (id_habilidades) =>
    prisma.habilidades.delete({ where: { id_habilidades } });

module.exports = { findAll, findById, findByNombre, create, update, remove };