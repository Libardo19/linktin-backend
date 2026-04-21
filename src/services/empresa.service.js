const EmpresaModel = require("../models/empresa.model");
const SectorService = require("./sector.service");

// ─── Guard ────────────────────────────────────────────────────────────
const verificarPropietario = (empresa, usuarioToken) => {
    if (usuarioToken.tipo !== "admin" && empresa.id_usuarios !== usuarioToken.id)
    throw { status: 403, message: "No tienes permiso para realizar esta acción" };
};

// ─── Helper: resuelve sector si viene en el body ───────────────────────
const resolverSector = async (sectorBody) => {
    if (!sectorBody) return {};
    const sector = await SectorService.findOrCreate(sectorBody);
    return { id_sector: sector.id_sector };
};

// ─── Servicios ────────────────────────────────────────────────────────

const getAll = async () => EmpresaModel.findAll();

const getById = async (id_empresas) => {
    const empresa = await EmpresaModel.findById(id_empresas);
    if (!empresa) throw { status: 404, message: "Empresa no encontrada" };
    return empresa;
};

const getMiPerfil = async (id_usuarios) => {
    const empresa = await EmpresaModel.findByUsuarioId(id_usuarios);
    if (!empresa) throw { status: 404, message: "Aún no tienes un perfil de empresa" };
    return empresa;
};

const create = async (body, usuarioToken) => {
    if (usuarioToken.tipo !== "empresa")
        throw { status: 403, message: "Solo las empresas pueden crear un perfil de empresa" };

    const existe = await EmpresaModel.findByUsuarioId(usuarioToken.id);
    if (existe) throw { status: 409, message: "Ya tienes un perfil de empresa registrado" };

    const { sector, ...resto } = body;
    const sectorData = await resolverSector(sector);

    return EmpresaModel.createEmpresa({
        id_usuarios: usuarioToken.id,
        ...resto,
        ...sectorData,
    });
};

const update = async (id_empresas, body, usuarioToken) => {
    const empresa = await EmpresaModel.findById(id_empresas);
    if (!empresa) throw { status: 404, message: "Empresa no encontrada" };
    verificarPropietario(empresa, usuarioToken);

    const { sector, ...resto } = body;
    const sectorData = await resolverSector(sector);

    return EmpresaModel.updateEmpresa(id_empresas, { ...resto, ...sectorData });
};

const remove = async (id_empresas, usuarioToken) => {
    const empresa = await EmpresaModel.findById(id_empresas);
    if (!empresa) throw { status: 404, message: "Empresa no encontrada" };
    verificarPropietario(empresa, usuarioToken);
    await EmpresaModel.deleteEmpresa(id_empresas);
};

module.exports = { getAll, getById, getMiPerfil, create, update, remove };