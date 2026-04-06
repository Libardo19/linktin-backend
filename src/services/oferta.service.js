const OfertaModel  = require("../models/oferta.model");
const EmpresaModel = require("../models/empresa.model");

// ─── Guards reutilizables (SRP) ───────────────────────────────────────

const soloEmpresa = (usuarioToken) => {
    if (usuarioToken.tipo !== "empresa" && usuarioToken.tipo !== "admin")
        throw { status: 403, message: "Solo las empresas pueden realizar esta acción" };
};

const verificarOferta = async (id_ofertas) => {
    const oferta = await OfertaModel.findById(id_ofertas);
    if (!oferta) throw { status: 404, message: "Oferta no encontrada" };
    return oferta;
};

const verificarPropietario = async (id_ofertas, usuarioToken) => {
    const oferta = await verificarOferta(id_ofertas);
    if (usuarioToken.tipo !== "admin" && oferta.perfil_empresa?.id_usuarios !== usuarioToken.id)
        throw { status: 403, message: "No tienes permiso para modificar esta oferta" };
    return oferta;
};

// ─── Servicios ────────────────────────────────────────────────────────

// GET /api/ofertas?estado=activa&modalidad=remoto&search=node&page=1&limit=10
const getAll = async (query) => OfertaModel.findAll(query);

// GET /api/ofertas/:id
const getById = async (id) => verificarOferta(parseInt(id));

// GET /api/ofertas/mis-ofertas — empresa ve sus propias ofertas
const getMisOfertas = async (usuarioToken) => {
    soloEmpresa(usuarioToken);
    const empresa = await EmpresaModel.findByUsuario(usuarioToken.id);
    if (!empresa) throw { status: 404, message: "Perfil de empresa no encontrado" };
    return OfertaModel.findByEmpresa(empresa.id_empresas);
};

// POST /api/ofertas
const create = async (usuarioToken, body) => {
    soloEmpresa(usuarioToken);
    const empresa = await EmpresaModel.findByUsuario(usuarioToken.id);
    if (!empresa) throw { status: 404, message: "Debes tener un perfil de empresa antes de publicar ofertas" };
    return OfertaModel.create({ id_empresas: empresa.id_empresas, ...body });
};

// PUT /api/ofertas/:id
const update = async (usuarioToken, id, body) => {
    await verificarPropietario(parseInt(id), usuarioToken);
    const { habilidades: _, ...datosActualizables } = body;
    return OfertaModel.update(parseInt(id), datosActualizables);
};

// DELETE /api/ofertas/:id
const remove = async (usuarioToken, id) => {
    await verificarPropietario(parseInt(id), usuarioToken);
    await OfertaModel.remove(parseInt(id));
    return { message: "Oferta eliminada correctamente" };
};

// PATCH /api/ofertas/:id/estado
const cambiarEstado = async (usuarioToken, id, estado) => {
    await verificarPropietario(parseInt(id), usuarioToken);
    return OfertaModel.cambiarEstado(parseInt(id), estado);
};

module.exports = { getAll, getById, getMisOfertas, create, update, remove, cambiarEstado };