const { parse } = require('dotenv');
const NotificacionModel = require('../models/notificacion.model');

// mis notificaciones
const getMisNotificaciones = async (usuarioToken, query) => {
  const page = query.page ? parseInt(query.page) : 1;
  const limit = query.limit ? parseInt(query.limit) : 20;
  const soloNoLeidas = query.soloNoLeidas === 'true';

  const [data, noLeidas] = await Promise.all([
    NotificacionModel.findByUsuario(usuarioToken.id, { page, limit, soloNoLeidas }),
    NotificacionModel.countNoLeidas(usuarioToken.id)
  ]);

  return { noLeidas, total: data.length, page, limit, data };
}  

// marcar como leida
const marcarLeida = async (usuarioToken, id_notificacion) => {
  const result = await NotificacionModel.marcarLeida(parseInt(id_notificacion), usuarioToken.id);
  if (result.count === 0)
    throw {status : 404, message: 'Notificación no encontrada o no pertenece al usuario'}
  return { message: 'Notificación marcada como leída' };
}

// marcar todas como leidas
const marcarTodasLeidas = async (usuarioToken) => {
  const result = await NotificacionModel.marcarTodasLeidas(usuarioToken.id);
  return { message: `${result.count} notificaciones marcadas como leídas` };
}

// eliminar notificacion
const limpiarLeidas = async (usuarioToken) => {
  const result = await NotificacionModel.eliminarLeidas(usuarioToken.id);
  return { message: `${result.count} notificaciones leídas eliminadas` };
}

module.exports = {
  getMisNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  limpiarLeidas,
}