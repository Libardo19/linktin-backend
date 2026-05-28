const  NotificacionesService = require('../services/notificaciones.service');

const getMisNotificaciones = async (req, res, next) => {
  try {
    const data = await NotificacionesService.getMisNotificaciones(req.usuario, req.query);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

const marcarLeida = async (req, res, next) => {
  try {
    const data = await NotificacionesService.marcarLeida(req.usuario, req.params.id);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

const marcarTodasLeidas = async (req, res, next) => {
  try {
    const data = await NotificacionesService.marcarTodasLeidas(req.usuario);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

const limpiarLeidas = async (req, res, next) => {
  try {
    const data = await NotificacionesService.limpiarLeidas(req.usuario);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMisNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  limpiarLeidas,
}
