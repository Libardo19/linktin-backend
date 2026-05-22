const AdminService = require("../services/admin.service");

const getStats = async (req, res, next) => {
  try {
    const data = await AdminService.getStats(req.usuario);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getUsuarios = async (req, res, next) => {
  try {
    const data = await AdminService.getUsuarios(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const getCandidatos = async (req, res, next) => {
  try {
    const data = await AdminService.getCandidatos(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const getEmpresas = async (req, res, next) => {
  try {
    const data = await AdminService.getEmpresas(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const getOfertas = async (req, res, next) => {
  try {
    const data = await AdminService.getOfertas(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const getMatches = async (req, res, next) => {
  try {
    const data = await AdminService.getMatches(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const getMetricas = async (req, res, next) => {
  try {
    const data = await AdminService.getMetricas(req.usuario);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const suspenderUsuario = async (req, res, next) => {
  try {
    const data = await AdminService.suspenderUsuario(req.usuario, req.params.id);
    res.status(200).json({ success: true, ...data });
  } catch (err) { next(err); }
};

const activarUsuario = async (req, res, next) => {
  try {
    const data = await AdminService.activarUsuario(req.usuario, req.params.id);
    res.status(200).json({ success: true, ...data });
  } catch (err) { next(err); }
};

const cambiarEstadoOferta = async (req, res, next) => {
  try {
    const data = await AdminService.cambiarEstadoOferta(req.usuario, req.params.id, req.body.estado);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = {
  getStats, getUsuarios, getCandidatos, getEmpresas,
  getOfertas, getMatches, getMetricas,
  suspenderUsuario, activarUsuario, cambiarEstadoOferta,
};
