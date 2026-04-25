const  NotificacionesService = require('../services/notificaciones.service');

const getMisNotificaciones = async (req, res, next) => {
  try {
    const data = await NotificacionesService.getMisNotificaciones(req.usuarioToken, req.query);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

const marcarLeida = async (req, res, next) => {
  try {
    const data = await NotificacionesService.marcarLeida(req.usuarioToken, req.params.id);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

const marcarTodasLeidas = async (req, res, next) => {
  try {
    const data = await NotificacionesService.marcarTodasLeidas(req.usuarioToken);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}

const limpiarLeidas = async (req, res, next) => {
  try {
    const data = await NotificacionesService.limpiarLeidas(req.usuarioToken);
    res.status(200).json({success: true, ...data});
  } catch (error) {
    next(error);
  }
}
