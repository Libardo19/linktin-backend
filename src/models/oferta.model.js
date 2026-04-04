const prisma = require("../config/db.config");

// ─── Selectores reutilizables (SRP + DRY) ─────────────────────────────
const OFERTA_BASICA = {
    id_ofertas:       true,
    titulo:           true,
    modalidad:        true,
    ubicacion:        true,
    pago:             true,
    estado:           true,
    fecha_publicacion: true,
    fecha_cierre:     true,
    perfil_empresa: {
        select: { nombre: true, logo_url: true, sector: true, ubicacion: true },
    },
};

const OFERTA_COMPLETA = {
    ...OFERTA_BASICA,
    descripcion: true,
    direccion:   true,
    habilidades_ofertas: {
        select: {
        id_habiOfertas:  true,
        nivelRequerido:  true,
        obligatoria:     true,
        habilidad: { select: { id_habilidades: true, nombre: true, categoria: true } },
        },
    },
};

// ─── Helpers de filtro (OCP — agregar filtros sin modificar findAll) ───
const buildWhere = ({ estado, modalidad, sector, search }) => {
    const where = {};
    if (estado)   where.estado    = estado;
    if (modalidad) where.modalidad = modalidad;
    if (sector)   where.perfil_empresa = { sector };
    if (search)   where.OR = [
        { titulo:      { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
    ];
    return where;
};

// ─── Queries ──────────────────────────────────────────────────────────

// Listado con filtros + paginación
const findAll = async ({ page = 1, limit = 10, ...filtros }) => {
    const where  = buildWhere(filtros);
    const skip   = (page - 1) * limit;
    const [total, data] = await Promise.all([
        prisma.ofertas.count({ where }),
        prisma.ofertas.findMany({
        where,
        select:  OFERTA_BASICA,
        orderBy: { fecha_publicacion: "desc" },
        skip,
        take: limit,
        }),
    ]);
    return { total, page, limit, totalPages: Math.ceil(total / limit), data };
};

const findById = async (id_ofertas) =>
    prisma.ofertas.findUnique({ where: { id_ofertas }, select: OFERTA_COMPLETA });

const findByEmpresa = async (id_empresas) =>
    prisma.ofertas.findMany({
        where:   { id_empresas },
        select:  OFERTA_BASICA,
        orderBy: { fecha_publicacion: "desc" },
    });

const create = async ({ id_empresas, titulo, descripcion, direccion, modalidad, pago, fecha_cierre, habilidades }) =>
    prisma.ofertas.create({
        data: {
        id_empresas, titulo, descripcion, direccion, modalidad, pago, fecha_cierre,
        estado: "activa",
        // Crea las habilidades requeridas en la misma transacción
        habilidades_ofertas: {
            create: habilidades.map(({ id_habilidades, nivelRequerido, obligatoria }) => ({
            id_habilidades, nivelRequerido, obligatoria: obligatoria ?? false,
            })),
        },
        },
        select: OFERTA_COMPLETA,
    });

const update = async (id_ofertas, data) =>
    prisma.ofertas.update({ where: { id_ofertas }, data, select: OFERTA_COMPLETA });

const remove = async (id_ofertas) =>
    prisma.ofertas.delete({ where: { id_ofertas } });

const cambiarEstado = async (id_ofertas, estado) =>
    prisma.ofertas.update({ where: { id_ofertas }, data: { estado }, select: OFERTA_BASICA });

module.exports = { findAll, findById, findByEmpresa, create, update, remove, cambiarEstado };