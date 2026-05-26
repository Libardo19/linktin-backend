const ReporteModel = require("../models/reporte.model");

const soloAdmin = (usuarioToken) => {
  if (usuarioToken.tipo !== "admin")
    throw { status: 403, message: "Solo el administrador puede realizar esta acción" };
};

const validarEntidad = (tipo_entidad, body) => {
  if (tipo_entidad === "usuario" && !body.id_usuario_reportado)
    throw { status: 400, message: "Debes indicar el usuario a reportar (id_usuario_reportado)" };
  if (tipo_entidad === "oferta" && !body.id_oferta_reportada)
    throw { status: 400, message: "Debes indicar la oferta a reportar (id_oferta_reportada)" };
  if (tipo_entidad === "resena" && !body.id_resena_reportada)
    throw { status: 400, message: "Debes indicar la reseña a reportar (id_resena_reportada)" };
};

const getIdEntidad = (tipo_entidad, body) => {
  if (tipo_entidad === "usuario") return body.id_usuario_reportado;
  if (tipo_entidad === "oferta")  return body.id_oferta_reportada;
  if (tipo_entidad === "resena")  return body.id_resena_reportada;
};

const create = async (usuarioToken, body) => {
  const { tipo_entidad, motivo, comentario } = body;

  validarEntidad(tipo_entidad, body);

  if (tipo_entidad === "usuario" && body.id_usuario_reportado === usuarioToken.id)
    throw { status: 400, message: "No puedes reportarte a ti mismo" };

  const duplicado = await ReporteModel.findDuplicado(
    usuarioToken.id,
    tipo_entidad,
    getIdEntidad(tipo_entidad, body)
  );
  if (duplicado)
    throw { status: 409, message: "Ya enviaste un reporte sobre este contenido" };

  return ReporteModel.create({
    id_reportante:        usuarioToken.id,
    tipo_entidad,
    motivo,
    comentario,
    id_usuario_reportado: tipo_entidad === "usuario" ? body.id_usuario_reportado : undefined,
    id_oferta_reportada:  tipo_entidad === "oferta"  ? body.id_oferta_reportada  : undefined,
    id_resena_reportada:  tipo_entidad === "resena"  ? body.id_resena_reportada  : undefined,
  });
};

const getDashboard = async (usuarioToken) => {
  soloAdmin(usuarioToken);
  const resumen = await ReporteModel.contarPorEstado();
  const conteo = { pendiente: 0, en_revision: 0, resuelto: 0, descartado: 0 };
  resumen.forEach(({ estado, _count }) => { conteo[estado] = _count.estado; });
  return conteo;
};

const getAll = async (usuarioToken, query) => {
  soloAdmin(usuarioToken);
  return ReporteModel.findAll({
    page:         query.page        ? parseInt(query.page)  : 1,
    limit:        query.limit       ? parseInt(query.limit) : 20,
    estado:       query.estado       || undefined,
    tipo_entidad: query.tipo_entidad || undefined,
    motivo:       query.motivo       || undefined,
  });
};

const getById = async (usuarioToken, id_reporte) => {
  soloAdmin(usuarioToken);
  const reporte = await ReporteModel.findById(parseInt(id_reporte));
  if (!reporte) throw { status: 404, message: "Reporte no encontrado" };
  return reporte;
};

const gestionarReporte = async (usuarioToken, id_reporte, body) => {
  soloAdmin(usuarioToken);
  const reporte = await ReporteModel.findById(parseInt(id_reporte));
  if (!reporte) throw { status: 404, message: "Reporte no encontrado" };
  if (reporte.estado === "resuelto" || reporte.estado === "descartado")
    throw { status: 409, message: `Este reporte ya fue ${reporte.estado} y no puede modificarse` };
  return ReporteModel.updateEstado(parseInt(id_reporte), body);
};

module.exports = { 
  create, 
  getDashboard, 
  getAll, 
  getById, 
  gestionarReporte 
};