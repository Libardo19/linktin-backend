const AdminModel = require("../models/admin.model");

const verificarAdmin = (usuarioToken) => {
  if (!usuarioToken || usuarioToken.tipo !== "admin") {
    throw { status: 403, message: "Solo los administradores pueden acceder a esta ruta" };
  }
};

const getStats = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getStats();
};

const getUsuarios = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getAllUsuarios();
};

const getCandidatos = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getAllCandidatos();
};

const getEmpresas = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getAllEmpresas();
};

const getOfertas = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getAllOfertas();
};

const getMatches = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getAllMatches();
};

const getMetricas = async (usuarioToken) => {
  verificarAdmin(usuarioToken);
  return AdminModel.getMetricas();
};

const suspenderUsuario = async (usuarioToken, id_usuarios) => {
  verificarAdmin(usuarioToken);
  const usuario = await AdminModel.suspenderUsuario(id_usuarios);
  return { message: "Usuario suspendido correctamente" };
};

const activarUsuario = async (usuarioToken, id_usuarios) => {
  verificarAdmin(usuarioToken);
  const usuario = await AdminModel.activarUsuario(id_usuarios);
  return { message: "Usuario activado correctamente" };
};

const cambiarEstadoOferta = async (usuarioToken, id_ofertas, estado) => {
  verificarAdmin(usuarioToken);
  return AdminModel.cambiarEstadoOferta(id_ofertas, estado);
};

module.exports = {
  getStats,
  getUsuarios,
  getCandidatos,
  getEmpresas,
  getOfertas,
  getMatches,
  getMetricas,
  suspenderUsuario,
  activarUsuario,
  cambiarEstadoOferta,
};
