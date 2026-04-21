const prisma = require("../config/db.config");

const PERFIL_COMPLETO = {
    id_empresas: true,
    id_usuarios: true,
    nombre:      true,
    descripcion: true,
    logo_url:    true,
    ubicacion:   true,
    website:     true,    
    sector: {
        select: { id_sector: true, nombre: true, descripcion: true },
    },
    usuario: {
        select: { email: true, tipo: true, fecha_creacion: true, activo: true },
    },
};

const findAll = async () =>
    prisma.perfilEmpresa.findMany({ select: PERFIL_COMPLETO, orderBy: { nombre: "asc" } });

const findById = async (id_empresas) =>
    prisma.perfilEmpresa.findUnique({
        where: { id_empresas: parseInt(id_empresas) },
        select: PERFIL_COMPLETO,
    });

const findByUsuarioId = async (id_usuarios) =>
    prisma.perfilEmpresa.findUnique({ where: { id_usuarios }, select: PERFIL_COMPLETO });

const createEmpresa = async (data) =>
    prisma.perfilEmpresa.create({ data, select: PERFIL_COMPLETO });

const updateEmpresa = async (id_empresas, data) =>
    prisma.perfilEmpresa.update({
        where: { id_empresas: parseInt(id_empresas) },
        data,
        select: PERFIL_COMPLETO,
    });

const deleteEmpresa = async (id_empresas) =>
    prisma.perfilEmpresa.delete({ where: { id_empresas: parseInt(id_empresas) } });

module.exports = { findAll, findById, findByUsuarioId, createEmpresa, updateEmpresa, deleteEmpresa };