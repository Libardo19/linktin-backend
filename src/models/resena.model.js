const prisma = require("../config/db.config");

const RESENA_SELECT = {
  id_resena:   true,
  raiting:     true,
  comentario:  true,
  fecha_envio: true,
  autor: {
    select: {
      id_usuarios: true,
      perfil_candidato: { select: { nombres: true, apellidos: true, foto_url: true} },
      perfil_empresa: { select: { nombre: true, logo_url: true} },
    },
  },
  receptor: {
    select: {
      id_usuarios: true,
      perfil_candidato: { select: { nombres: true, apellidos: true, foto_url: true} },
      perfil_empresa: { select: { nombre: true, logo_url: true} },
    },
  },
  match: { select: { id_match: true, compatibilidad: true } },
};

// Verficar si ya existe una reseña entre el autor en ese match
const findByAutorYMatch = async (id_usuarios, id_match) => 
  prisma.resenas.findUnique({
    where: {id_enviado_id_match: {id_enviado, id_match}},
  });

// Verificar que el match exista y que el usuario sea parte de él
const findMatchEfectivo = async (id_match) =>
  prisma.matches.findUnique({
    where: { id_match },
    select: {
      id_match:      true,
      id_usuarios:   true,
      estadoUsuario: true,
      estadoEmpresa: true,
      oferta: {
        select: {
          titulo: true,
          perfil_empresa: {
            select: {
              id_usuarios: true,
              nombre:      true,
            },
          },
        },
      },
    },
  });

// Crear reseña
const create = async ({ id_enviado, id_recibido, id_match, raiting, comentario }) =>
  prisma.resenas.create({
    data: {
      id_enviado,
      id_recibido,
      id_match,
      raiting,
      comentario,
    },
    select: RESENA_SELECT,
  });
  
// Reseñas recibidas por un usuario con promedio
const findRecibidasByUsuario = async (id_recibido) => {
  const [resenas, promedio] = await Promise.all([
    prisma.resenas.findMany({
      where:   { id_recibido },
      select:  RESENA_SELECT,
      orderBy: { fecha_envio: "desc" },
    }),
    prisma.resenas.aggregate({
      where:   { id_recibido },
      _avg:    { raiting: true },
      _count:  { raiting: true },
    }),
  ]);
  return {
    promedio:      promedio._avg.raiting
      ? parseFloat(promedio._avg.raiting.toFixed(1))
      : null,
    total:         promedio._count.raiting,
    resenas,
  };
};

// Reseñas enviadas por un usuario
const findEnviadasByUsuario = async (id_enviado) =>
  prisma.resenas.findMany({
    where:   { id_enviado },
    select:  RESENA_SELECT,
    orderBy: { fecha_envio: "desc" },
  });

module.exports = {
  findByAutorYMatch, findMatchEfectivo, create,
  findRecibidasByUsuario, findEnviadasByUsuario,
};
