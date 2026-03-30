const CandidatoService = require("../services/candidato.service");

    const getAll = async (req, res, next) => {
    try {
        const data = await CandidatoService.getAll();
        res.status(200).json({ success: true, total: data.length, data });
    } catch (err) { next(err); }
    };

    const getMiPerfil = async (req, res, next) => {
    try {
        const data = await CandidatoService.getMiPerfil(req.usuario);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const getById = async (req, res, next) => {
    try {
        const data = await CandidatoService.getById(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const createPerfil = async (req, res, next) => {
    try {
        const data = await CandidatoService.createPerfil(req.usuario, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const updatePerfil = async (req, res, next) => {
    try {
        const data = await CandidatoService.updatePerfil(req.params.id, req.usuario, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const deletePerfil = async (req, res, next) => {
    try {
        const data = await CandidatoService.deletePerfil(req.params.id, req.usuario);
        res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
    };

    // ── Experiencia ──────────────────────────────────────────────────────────────
    const addExperiencia = async (req, res, next) => {
    try {
        const data = await CandidatoService.addExperiencia(req.params.id, req.usuario, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const updateExperiencia = async (req, res, next) => {
    try {
        const data = await CandidatoService.updateExperiencia(req.params.id, req.params.expId, req.usuario, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const deleteExperiencia = async (req, res, next) => {
    try {
        const data = await CandidatoService.deleteExperiencia(req.params.id, req.params.expId, req.usuario);
        res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
    };

    // ── Educación ────────────────────────────────────────────────────────────────
    const addEducacion = async (req, res, next) => {
    try {
        const data = await CandidatoService.addEducacion(req.params.id, req.usuario, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const updateEducacion = async (req, res, next) => {
    try {
        const data = await CandidatoService.updateEducacion(req.params.id, req.params.eduId, req.usuario, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const deleteEducacion = async (req, res, next) => {
    try {
        const data = await CandidatoService.deleteEducacion(req.params.id, req.params.eduId, req.usuario);
        res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
    };

    // ── Habilidades ──────────────────────────────────────────────────────────────
    const addHabilidad = async (req, res, next) => {
    try {
        const data = await CandidatoService.addHabilidad(req.params.id, req.usuario, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const updateHabilidad = async (req, res, next) => {
    try {
        const data = await CandidatoService.updateHabilidad(req.params.id, req.params.habId, req.usuario, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
    };

    const deleteHabilidad = async (req, res, next) => {
    try {
        const data = await CandidatoService.deleteHabilidad(req.params.id, req.params.habId, req.usuario);
        res.status(200).json({ success: true, ...data });
    } catch (err) { next(err); }
    };

    module.exports = {
    getAll, getMiPerfil, getById, createPerfil, updatePerfil, deletePerfil,
    addExperiencia, updateExperiencia, deleteExperiencia,
    addEducacion, updateEducacion, deleteEducacion,
    addHabilidad, updateHabilidad, deleteHabilidad,
    };