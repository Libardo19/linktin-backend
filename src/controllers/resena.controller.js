const ResenaService = require ("../services/resena.service");

const create = async (req, res, next) => {
  try {
    const data = await ResenaService.create(req.usuario, req.body);
    res.status(201).json({success: true, data});
  } catch (error) {
    next(error);
  }
};

const getRecibidas = async (req, res, next) => {
  try {
    const data = await ResenaService.getRecibidas(req.params.id_usuario);
    res.status(200).json({success: true, data});
  } catch (error) {
    next(error);
  }
};

const getMisResenas = async (req, res, next) => {
  try {
    const data = await ResenaService.getMisResenas(req.usuario);
    res.status(200).json({success: true, data});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getRecibidas, 
  getMisResenas
};
