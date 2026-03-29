    const EmpresaService = require("../services/empresa.service");

    const getAll = async (req, res, next) => {
    try {
        const data = await EmpresaService.getAll();
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const getById = async (req, res, next) => {
    try {
        const data = await EmpresaService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const getMiPerfil = async (req, res, next) => {
    try {
        const data = await EmpresaService.getMiPerfil(req.usuario.id);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const create = async (req, res, next) => {
    try {
        const data = await EmpresaService.create(req.body, req.usuario);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const update = async (req, res, next) => {
    try {
        const data = await EmpresaService.update(req.params.id, req.body, req.usuario);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const remove = async (req, res, next) => {
    try {
        await EmpresaService.remove(req.params.id, req.usuario);
        res.status(200).json({ success: true, message: "Perfil de empresa eliminado" });
    } catch (err) { next(err); }
};

module.exports = { getAll, getById, getMiPerfil, create, update, remove };