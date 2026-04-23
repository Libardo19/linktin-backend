const MatchingService = require("../services/matching.service");

const darLike = async (req, res, next) => {
  try {
    const data = await MatchingService.darLike(req.usuario, req.params.ofertaId);
    res.status(201).json({ success: true, data });
  } catch (err) { 
    next(err); 
  }
};

const retirarLike = async (req, res, next) => {
  try {
    const data = await MatchingService.retirarLike(req.usuario, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const feedCandidato = async (req, res, next) => {
  try {
    const data = await MatchingService.getFeedCandidato(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const feedEmpresa = async (req, res, next) => {
  try {
    const data = await MatchingService.getFeedEmpresa(req.usuario, req.params.ofertaId);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const misMatches = async (req, res, next) => {
  try {
    const data = await MatchingService.getMisMatches(req.usuario);
    res.status(200).json({ success: true, total: data.length, data });
  } catch (err) { next(err); }
};

const aceptar = async (req, res, next) => {
  try {
    const data = await MatchingService.responderEmpresa(req.usuario, req.params.id, "aceptado");
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const rechazar = async (req, res, next) => {
  try {
    const data = await MatchingService.responderEmpresa(req.usuario, req.params.id, "rechazado");
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { darLike, retirarLike, feedCandidato, feedEmpresa, misMatches, aceptar, rechazar };