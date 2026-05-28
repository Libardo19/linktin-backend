const prisma = require("../config/db.config");

const REPORTE_SELECT = {
  id_reporte:     true,
  tipo_entidad:   true,
  motivo:         true,
  comentario:     true,
  estado:         true,
  nota_admin:     true,
  fecha_creacion: true,
  reportante: {
    select: {
      id_usuarios:      true,
      email:            true,
      tipo:             true,
      perfil_candidato: { select: { nombres: true, apellidos: true } },
      perfil_empresa:   { select: { nombre: true } },
    },
  },
  usuario_reportado: {
    select: {
      id_usuarios:      true,
      email:            true,
      tipo:             true,
      perfil_candidato: { select: { nombres: true, apellidos: true } },
      perfil_empresa:   { select: { nombre: true } },
    },
  },
  oferta_reportada: {
    select: {
      id_ofertas:     true,
      titulo:         true,
      estado:         true,
      perfil_empresa: { select: { nombre: true } },
    },
  },
  resena_reportada: {
    select: {
      id_resena:  true,
      raiting:    true,
      comentario: true,
      autor: {
        select: {
          id_usuarios:      true,
          perfil_candidato: { select: { nombres: true, apellidos: true } },
          perfil_empresa:   { select: { nombre: true } },
        },
      },
    },
  },
};

const findDuplicado = async (id_reportante, tipo_entidad, id_entidad) => {
  const where = { id_reportante };
  if (tipo_entidad === "usuario") where.id_usuario_reportado = id_entidad;
  if (tipo_entidad === "oferta")  where.id_oferta_reportada  = parseInt(id_entidad);
  if (tipo_entidad === "resena")  where.id_resena_reportada  = parseInt(id_entidad);
  return prisma.reportes.findFirst({ where });
};

const create = async ({ id_reportante, tipo_entidad, motivo, comentario, id_usuario_reportado, id_oferta_reportada, id_resena_reportada }) =>
  prisma.reportes.create({
    data: {
      id_reportante,
      tipo_entidad,
      motivo,
      comentario,
      id_usuario_reportado: id_usuario_reportado || null,
      id_oferta_reportada:  id_oferta_reportada  ? parseInt(id_oferta_reportada)  : null,
      id_resena_reportada:  id_resena_reportada   ? parseInt(id_resena_reportada)   : null,
    },
    select: REPORTE_SELECT,
  });

const findAll = async ({ page = 1, limit = 20, estado, tipo_entidad, motivo }) => {
  const where = {};
  if (estado)       where.estado       = estado;
  if (tipo_entidad) where.tipo_entidad = tipo_entidad;
  if (motivo)       where.motivo       = motivo;

  const [total, data] = await Promise.all([
    prisma.reportes.count({ where }),
    prisma.reportes.findMany({
      where,
      select:  REPORTE_SELECT,
      orderBy: [{ estado: "asc" }, { fecha_creacion: "desc" }],
      skip:    (page - 1) * limit,
      take:    limit,
    }),
  ]);

  return { total, page, limit, totalPages: Math.ceil(total / limit), data };
};

const findById = async (id_reporte) =>
  prisma.reportes.findUnique({ where: { id_reporte }, select: REPORTE_SELECT });

const updateEstado = async (id_reporte, { estado, nota_admin }) =>
  prisma.reportes.update({
    where:  { id_reporte },
    data:   { estado, ...(nota_admin !== undefined && { nota_admin }) },
    select: REPORTE_SELECT,
  });

const contarPorEstado = async () =>
  prisma.reportes.groupBy({
    by:     ["estado"],
    _count: { estado: true },
  });

module.exports = { findDuplicado, create, findAll, findById, updateEstado, contarPorEstado };