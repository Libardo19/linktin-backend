const SectorService = require("../services/sector.service");

const getAll = async (req, res, next) => {
    try {
      const data = await SectorService.getAll();
      res.status(200).json({ success: true, total: data.length, data });
    } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
    try {
      const data = await SectorService.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const create = async (req, res, next) => {
    try {
      const data = await SectorService.create(req.usuario, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
};

const update = async (req, res, next) => {
    try {
      const data = await SectorService.update(req.usuario, req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
    try {
      const data = await SectorService.remove(req.usuario, req.params.id);
      res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };