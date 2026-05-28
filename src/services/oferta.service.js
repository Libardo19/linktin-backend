const OfertaModel  = require("../models/oferta.model");
const EmpresaModel = require("../models/empresa.model");
const { notificar } = require("../utils/notificaciones.helper");

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
    const empresa = await EmpresaModel.findByUsuarioId(usuarioToken.id);
    if (!empresa) throw { status: 404, message: "Perfil de empresa no encontrado" };
    return OfertaModel.findByEmpresa(empresa.id_empresas);
};

// POST /api/ofertas
const create = async (usuarioToken, body) => {
    soloEmpresa(usuarioToken);

    const empresa = await EmpresaModel.findByUsuarioId(usuarioToken.id);

    if (!empresa) throw { status: 404, message: "Debes tener un perfil de empresa antes de publicar ofertas" };

    // Normalizar campos
    const modalidadMap = { presencial: "presencial", remoto: "remoto", hibrido: "hibrido", remote: "remoto", "on-site": "presencial", onsite: "presencial", hybrid: "hibrido" };
    const modalidad = modalidadMap[body.modalidad?.toLowerCase().replace(/\s+/g, "").replace(/-/g, "")] || body.modalidad;
    const direccion = body.direccion || body.ubicacion || "";

    // Extraer el primer número del pago si es un rango
    let pago = null;
    if (body.pago) {
        const match = String(body.pago).match(/\d+(\.\d+)?/);
        pago = match ? match[0] : null;
    }

    const oferta = await OfertaModel.create({
        id_empresas: empresa.id_empresas,
        titulo: body.titulo,
        descripcion: body.descripcion,
        direccion,
        modalidad,
        pago,
        fecha_cierre: body.fecha_cierre,
        habilidades: body.habilidades || [],
    });

    OfertaModel.findIdsCandidatos().then((ids) =>
        notificar.nuevaOferta(ids, {
            empresa: empresa.nombre,
            oferta: oferta.titulo,
            ofertaId: oferta.id_ofertas,
        })
    ).catch(console.error);    

    return oferta;
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
    const oferta    = await verificarPropietario(parseInt(id), usuarioToken);
    const resultado = await OfertaModel.cambiarEstado(parseInt(id), estado);

    if (estado === "cerrada" || estado === "pausada") {
    OfertaModel.findIdsCandidatosPendientes(parseInt(id))
        .then((ids) => {
        if (ids.length)
            return notificar.ofertaCerrada(ids, {
            empresa:  oferta.perfil_empresa?.nombre || "La empresa",
            oferta:   oferta.titulo,
            ofertaId: parseInt(id),
            });
        }).catch(console.error);
    }

    return resultado;
};
module.exports = { getAll, getById, getMisOfertas, create, update, remove, cambiarEstado };