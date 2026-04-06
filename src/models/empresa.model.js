const prisma = require("../config/db.config");

    const PERFIL_COMPLETO = {
    id_empresas: true,
    id_usuarios: true,
    nombre:      true,
    descripcion: true,
    logo_url:    true,
    sector:      true,
    ubicacion:   true,
    website:     true,
    usuario: {
        select: {
        email:          true,
        tipo:           true,
        fecha_creacion: true,
        activo:         true,
        },
    },
    };

    const findAll = async () => {
        return prisma.perfilEmpresa.findMany({ select: PERFIL_COMPLETO });
        };

    const findById = async (id_empresas) => {
        return prisma.perfilEmpresa.findUnique({
            where: { id_empresas: Number(id_empresas) },
            select: PERFIL_COMPLETO,
        });
    };

    const findByUsuario = async (id_usuarios) => {
        return prisma.perfilEmpresa.findUnique({
            where: { id_usuarios },
            select: PERFIL_COMPLETO,
        });
    };

    const createEmpresa = async (data) => {
        return prisma.perfilEmpresa.create({
            data,
            select: PERFIL_COMPLETO,
        });
    };

    const updateEmpresa = async (id_empresas, data) => {
        return prisma.perfilEmpresa.update({
            where: { id_empresas: Number(id_empresas) },
            data,
            select: PERFIL_COMPLETO,
        });
    };

    const deleteEmpresa = async (id_empresas) => {
        return prisma.perfilEmpresa.delete({
            where: { id_empresas: Number(id_empresas) },
        });
    };

    module.exports = { findAll, findById, findByUsuario, createEmpresa, updateEmpresa, deleteEmpresa };