const ReporteService = require("../services/reporte.service");

const create = async (req, res, next) => {
  try {
    const data = await ReporteService.create(req.usuario, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await ReporteService.getDashboard(req.usuario);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await ReporteService.getAll(req.usuario, req.query);
    res.status(200).json({ success: true, ...data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await ReporteService.getById(req.usuario, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const gestionarReporte = async (req, res, next) => {
  try {
    const data = await ReporteService.gestionarReporte(req.usuario, req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { 
  create, 
  getDashboard, 
  getAll, 
  getById, 
  gestionarReporte 
};