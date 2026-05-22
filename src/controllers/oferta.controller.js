const OfertaService = require("../services/oferta.service");

// SRP: el controller solo extrae datos del request y delega al service

const getAll = async (req, res, next) => {
    try {
        const { page, limit, estado, modalidad, sector, search } = req.query;
        const result = await OfertaService.getAll({
        page:  page  ? parseInt(page)  : 1,
        limit: limit ? parseInt(limit) : 10,
        estado, modalidad, sector, search,
        });
        res.status(200).json({ success: true, ...result });
    } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
    try {
        const data = await OfertaService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const getMisOfertas = async (req, res, next) => {
    try {
        const data = await OfertaService.getMisOfertas(req.usuario);
        res.status(200).json({ success: true, total: data.length, data });
    } catch (err) { next(err); }
};

const create = async (req, res, next) => {
    try {
        const data = await OfertaService.create(req.usuario, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

const update = async (req, res, next) => {
    try {
        const data = await OfertaService.update(req.usuario, req.params.id, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
        const data = await OfertaService.remove(req.usuario, req.params.id);
        res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
};

const cambiarEstado = async (req, res, next) => {
    try {
        const data = await OfertaService.cambiarEstado(req.usuario, req.params.id, req.body.estado);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

module.exports = { getAll, getById, getMisOfertas, create, update, remove, cambiarEstado };