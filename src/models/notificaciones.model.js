const prisma = require('../config/db.config');

// Trae las notificaciones de un usuario paginadas, solo las no leídas
const findByUsuario = async (id_usuario, { page = 1, limit = 20, soloNoLeidas = false } = {}) => prisma.notificaciones.findMany({
  where: {
    id_usuario,
    ...(soloNoLeidas && { leido: false }),
  },
  orderBy: [{ leido : 'asc' }, { fecha_creacion: 'desc' }],
  skip: (page - 1) * limit,
  take: limit,
});

//Cuenta las no leidas - para el badge del frontend
const countNoLeidas = async (id_usuario) => prisma.notificaciones.count({
  where: {
    id_usuario,
    leido: false,
  },
});

// Marca una notificacion especifica como leida
const marcarLeida = async (id_notificacion, id_usuario) => prisma.notificaciones.updateMany({
  where: {id_usuario, leido: false},
  data: { leido: true },
});

//marcar todas las notificaciones de un usuario como leidas
const marcarTodasLeidas = async (id_usuario) => prisma.notificaciones.updateMany({
  where: { id_usuario, leido: false },
  data: { leido: true }
});

//Elimina notificaciones leidas (limpieza opcionas)
const eliminarLeidas = async (id_usuario) => prisma.notificaciones.deleteMany({
  where: { id_usuario, leido: true },
});

module.exports = {
  findByUsuario,
  countNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
  eliminarLeidas,
};