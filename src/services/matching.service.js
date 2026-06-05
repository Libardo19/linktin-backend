const MatchingModel =     require("../models/matching.model");
const EmpresaModel =      require("../models/empresa.model");
const prisma =            require("../config/db.config");
const { calcularScore } = require("../utils/score.helper");
const { notificar } =     require("../utils/notificaciones.helper");

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

const darLike = async (usuarioToken, id_ofertas, scoreMatch) => {
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
  if (!candidato.habilidadEmpleados.length) {
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

  //4. Calcular score de compatibilidad, si en dado caso, no se envia ya un score_match
  const compatibilidad = scoreMatch ?? calcularScore(
    candidato.habilidadEmpleados,
    oferta.habilidades_ofertas,
  );

  //5. Crear el match - adjuntar cv_url del perfil del candidato
  const match = await MatchingModel.createMatch({
    id_usuarios: usuarioToken.id,
    id_ofertas:  parseInt(id_ofertas),
    compatibilidad,
    cv_url:      candidato.hoja_vida || null,
  });

  notificar.nuevoMatch({
    id_empresa: oferta.perfil_empresa.id_usuarios,
    candidato:  `${candidato.nombres} ${candidato.apellidos}`,
    oferta:     oferta.titulo,
    matchId:    match.id_match,
  }).catch(console.error);

  if (global.io) {
    global.io.to(`user:${oferta.perfil_empresa.id_usuarios}`).emit('nuevo_match', {
      matchId: match.id_match,
      candidato: `${candidato.nombres} ${candidato.apellidos}`,
      oferta: oferta.titulo,
    });

    global.io.to(`user:${oferta.perfil_empresa.id_usuarios}`).emit('nueva_notificacion', {
      tipo: 'nuevo_match',
      matchId: match.id_match,
    });
  }

  return match;
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

const responderEmpresa = async (usuarioToken, id_match, accion) => {
  soloEmpresa(usuarioToken);

  const match = await MatchingModel.findMatchById(parseInt(id_match));
  if (!match) throw { status: 404, message: "Match no encontrado." };
  if (match.estadoEmpresa !== "pendiente")
    throw { status: 400, message: `Ya has respondido a este match: ${match.estadoEmpresa}.` };

  const resultado = await MatchingModel.updateEstado(
    parseInt(id_match),
    "estadoEmpresa",
    accion,
    MatchingModel.MATCH_EMPRESA
  );

  const empresa = resultado.oferta?.perfil_empresa?.nombre || "La empresa";
  const oferta  = resultado.oferta?.titulo || "la oferta";

  if (accion === "aceptado") {
    notificar.matchAceptado({
      id_candidato: match.id_usuarios,
      empresa, oferta,
      matchId: parseInt(id_match),
    }).catch(console.error);

    if (global.io) {
      global.io.to(`user:${match.id_usuarios}`).emit('nueva_notificacion', {
        tipo: 'match_aceptado',
        matchId: parseInt(id_match),
        empresa,
        oferta,
      });
    }

    try {
      const empresaUserId = match.oferta?.perfil_empresa?.id_usuarios;
      if (empresaUserId) {
        let conversacion = await prisma.conversacion.findFirst({
          where: {
            AND: [
              { participantes: { some: { id_usuarios: match.id_usuarios } } },
              { participantes: { some: { id_usuarios: empresaUserId } } },
            ],
          },
        });

        if (!conversacion) {
          conversacion = await prisma.conversacion.create({
            data: {
              participantes: {
                connect: [
                  { id_usuarios: match.id_usuarios },
                  { id_usuarios: empresaUserId },
                ],
              },
            },
          });
        }

        if (global.io) {
          global.io.to(`user:${match.id_usuarios}`).emit('nueva_conversacion', {
            conversacionId: conversacion.id,
          });
          global.io.to(`user:${empresaUserId}`).emit('nueva_conversacion', {
            conversacionId: conversacion.id,
          });
        }
      }
    } catch (err) {
      console.error('Error al crear conversación automática:', err);
    }
  } else {
    notificar.matchRechazado({
      id_candidato: match.id_usuarios,
      empresa, oferta,
      matchId: parseInt(id_match),
    }).catch(console.error);

    if (global.io) {
      global.io.to(`user:${match.id_usuarios}`).emit('nueva_notificacion', {
        tipo: 'match_rechazado',
        matchId: parseInt(id_match),
        empresa,
        oferta,
      });
    }
  }

  return resultado;
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

  const resultado = await MatchingModel.updateEstado(
    parseInt(id_match),
    "estadoEmpresa",
    "rechazado",
    MatchingModel.MATCH_CANDIDATO
  );

  notificar.matchRetirado({
    id_empresa: match.oferta?.perfil_empresa?.id_usuarios,
    candidato:  usuarioToken.id,
    oferta:     match.oferta?.titulo || "la oferta",
    matchId:    parseInt(id_match),
  }).catch(console.error);
  
  return resultado;
};

const getCandidatosEmpresa = async (usuarioToken) => {
  soloEmpresa(usuarioToken);
  const empresa = await EmpresaModel.findByUsuarioId(usuarioToken.id);
  if (!empresa) throw { status: 404, message: "Empresa no encontrada." };
  return MatchingModel.findCandidatosByEmpresa(empresa.id_empresas);
};

module.exports = {
  darLike,
  getFeedCandidato,
  getFeedEmpresa,
  getMisMatches,
  getCandidatosEmpresa,
  responderEmpresa,
  retirarLike
};

