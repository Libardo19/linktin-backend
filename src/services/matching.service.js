const MatchingModel =     require("../models/matching.model");
const EmpresaModel =      require("../models/empresa.model");
const { calcularScore } = require("../utils/score.helper");
const { usuario } = require("../config/db.config");

// Guards

const soloEmpresa = (usuarioToken) => {
  if (usuarioToken.tipo !== "empresa" && usuarioToken.tipo !== "admin") {
    throw {
      status: 403,
      message: "Acceso denegado: Solo empresas pueden realizar esta acción.",
    };
  }
};

const soloCandidato = (usuarioToken) => {
  if (usuarioToken.tipo !== "candidato" && usuarioToken.tipo !== "admin") {
    throw {
      status: 403,
      message: "Acceso denegado: Solo candidatos pueden realizar esta acción.",
    };
  }
};

// Like a una oferta (candidato se postula)

/**
 * POST /api/matches/like/:ofertaId
 * El candidato le da like a una oferta específica.
 * 1. Verifica que el candidato tenga perfil y habilidades
 * 2. Verifica que la oferta exista y esté activa
 * 3. Calcula el score de compatibilidad
 * 4. Crea el match con cv_url del perfil del candidato
 * OCP: si en el futuro se cambia el algoritmo, solo se toca score.helper.js
 */

const darLike = async (usuarioToken, id_ofertas) => {
  soloCandidato(usuarioToken);

  //1. Verificar perfil y habilidades del candidato
  const candidato = await MatchingModel.findCandidatoConHabilidades(
    usuarioToken.id,
  );
  if (!candidato) {
    throw {
      status: 400,
      message: "Perfil incompleto: Crea tu perfil de candidato.",
    };
  }
  if (!candidato.habilidades_candidatos.length) {
    throw {
      status: 400,
      message: "Perfil incompleto: Agrega al menos una habilidad.",
    };
  }

  //2. Verificar que la oferta exista y esté activa
  const oferta = await MatchingModel.findOfertaConHabilidades(
    parseInt(id_ofertas),
  );
  if (!oferta) throw { status: 404, message: "Oferta no encontrada." };
  if (oferta.estado !== "activa")
    throw {
      status: 400,
      message: "No puedes postular a una oferta que no está activa.",
    };

  //3. verificar que no exista un match previo
  const existe = await MatchingModel.findMatchExistente(
    usuarioToken.id,
    parseInt(id_ofertas),
  );
  if (existe) {
    throw { status: 400, message: "Ya has postulado a esta oferta." };
  }

  //4. Calcular score de compatibilidad
  const compatibilidad = calcularScore(
    candidato.habilidadEmpleado,
    oferta.habilidades_ofertas,
  );

  //5. Crear el match - adjuntar cv_url del perfil del candidato
  return MatchingModel.createMatch({
    id_usuarios: usuarioToken.id,
    id_ofertas: parseInt(id_ofertas),
    compatibilidad,
    cv_url: candidato.hoja_vida || null,
  });
};

//Feeds

//Candidato: ve sus postulaciones
const getFeedCandidato = async (usuarioToken) => {
  soloCandidato(usuarioToken);
  return MatchingModel.findFeedCandidato(usuarioToken.id);
};

//Empresa: ve candidatos postulados a su oferta
const getFeedEmpresa = async (usuarioToken, id_ofertas) => {
  soloEmpresa(usuarioToken);

  //verificar que la oferta exista y le pertenezca a la empresa
  const empresa = await EmpresaModel.findByUsuarioId(usuarioToken.id);
  if (!empresa) {
    throw { status: 404, message: "Empresa no encontrada." };
  }

  const oferta = await MatchingModel.findOfertaConHabilidades(
    parseInt(id_ofertas),
  );
  if (!oferta) throw { status: 404, message: "Oferta no encontrada." };
  if (
    oferta.id_empresas !== empresa.id_empresas &&
    usuarioToken.tipo !== "admin"
  ) {
    throw {
      status: 403,
      message: "Acceso denegado: Esta oferta no te pertenece.",
    };
  }

  return MatchingModel.findFeedEmpresa(parseInt(id_ofertas));
};

// Matches efectivos de cualquier usuario
const getMisMatches = async (usuarioToken) => 
  MatchingModel.findMatchesEfectivos(usuarioToken.id);

// Respuesta de la empresa 

/**
 * La empresa acepta o rechaza un candidato postulado.
 * Al aceptar devuelve el selector MATCH_EMPRESA (con cv_url).
 * Al rechazar devuelve el selector MATCH_EMPRESA también.
 */

const responerEmpresa = async (usuarioToken, id_match, accion) => {
  soloEmpresa(usuarioToken);

  const match = await MatchingModel.findMatchById(parseInt(id_match));
  if (!match) throw { status: 404, message: "Match no encontrado." };
  if (match.estadoEmpresa !== "pendiente")
    throw { status: 400, message: `Ya has respondido a este match: ${match.estadoEmpresa}.` };

  return MatchingModel.updateEstado(
    parseInt(id_match),
    "estadoEmpresa",
    accion,
    MatchingModel.MATCH_EMPRESA
  );
};

/**
 * El candidato retira su postulación (quita el like).
 * Solo si la empresa aún no ha respondido.
 */

const retirarLike = async (usuarioToken, id_match) => {
  soloCandidato(usuarioToken);

  const match = await MatchingModel.findMatchById(parseInt(id_match));
  if (!match) throw { status: 404, message: "Match no encontrado." };
  if (match.id_usuarios !== usuarioToken.id) {
    throw { status: 403, message: "Acceso denegado: Este match no te pertenece." };
  }
  if (match.estadoEmpresa === "aceptado")
    throw { status: 409, message: "No puedes retirara una postulaciones ya aceptada por la empresa" };

  return MatchingModel.updateEstado(
    parseInt(id_match),
    "estadoEmpresa",
    "rechazado",
    MatchingModel.MATCH_CANIDATO
  );
};

module.exports = {
  darLike,
  getFeedCandidato,
  getFeedEmpresa,
  getMisMatches,
  responerEmpresa,
  retirarLike
};

