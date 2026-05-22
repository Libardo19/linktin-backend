const prisma = require("../config/db.config");

/**
 * Busca un usuario por email.
 * Usado en login para verificar que exista.
 */
const findByEmail = async (email) => {
  return prisma.usuario.findUnique({
    where: { email },
  });
};

/**
 * Busca un usuario por su id.
 * Usado para renovar token o verificar sesión activa.
 */
const findById = async (id_usuarios) => {
  return prisma.usuario.findUnique({
    where: { id_usuarios },
    select: {
      id_usuarios:    true,
      email:          true,
      tipo:           true,
      activo:         true,
      fecha_creacion: true,
    },
  });
};

/**
 * Crea un nuevo usuario.
 * La password ya llega hasheada desde el service.
 */
const createUsuario = async ({ id_usuarios, email, password, tipo }) => {
  return prisma.usuario.create({
    data: { id_usuarios, email, password, tipo },
    select: {
      id_usuarios:    true,
      email:          true,
      tipo:           true,
      fecha_creacion: true,
    },
  });
};

module.exports = { findByEmail, findById, createUsuario };