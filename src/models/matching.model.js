const prisma = require('../config/db.config');

// Selector candidato - sin cv_url
const MATCH_CANDIDATO = {
  id_match:       true,
  compatibilidad: true,
  estadoUsuario:  true,
  estadoEmpresa:  true,
  fechaMatch:     true,
  oferta: {
    select: {
      id_ofertas:   true,
      titulo:       true,
      modalidad:    true,
      estado:       true,
      fecha_cierre: true,
      perfil_empresa: {
        select: { 
          nombre:   true, 
          logo_url: true,
          sector: {
            select: {
              nombre: true
            },
          },  
        },   
      },
    },
  },
};

// Selector empresa - con cv_url
const MATCH_EMPRESA = {
  id_match:       true,
  compatibilidad: true,
  estadoUsuario:  true,
  estadoEmpresa:  true,
  fechaMatch:     true,
  cv_url:         true,
  usuario: {
    select: {
      id_usuario:   true,
      perfil_candidato: {
        select: {
          nombre:         true,
          apellido:       true,
          foto_url:       true,
          ubicacion:      true,
          reputacion:     true,
          biografia:      true,
          github_url:     true,
          portafolio_url: true,
          habilidadEmpleados: {
            select: {
              nivel: true,
              habilidad: {
                select: {
                  nombre:     true,
                  categoria:  true
                },
              },
            },
          },  
        },   
      },
    },
  },
}; 

// Queries comunes
const findCandidatoConHabilidades = async (id_usuario) => 
  prisma.perfil_candidato.findUnique({
  where: {
    id_usuario
  },
  include: {
    habilidadEmpleados: {
      include: {
        habilidad: {
          select: {
            nombre:         true,
            id_habilidades: true
          },
        },
      },
    },
  },
});

const findOfertaConHabilidades = async (id_ofertas) => 
  prisma.ofertas.findUnique({
  where: { id_ofertas},
  include: {
    habilidades_ofertas: {
      include: {
        habilidad: {
          select: {
            nombre: true
          },
        },
      },
    },
  },
});

const findMatchExistente = async (id_usuarios, id_ofertas) => 
  prisma.matches.findUnique({
  where: {
    id_usuarios_id_ofertas: {
      id_usuarios,
      id_ofertas
    },
  },
});

const createMatch = async (id_usuarios, id_ofertas, compatibilidad, cv_url) => 
  prisma.matches.create({
  data: {
    id_usuarios,
    id_ofertas,
    compatibilidad,
    cv_url: cv_url || null,
    estadoUsuario: "aceptado",
    estadoEmpresa: "pendiente"
  },
  select: MATCH_CANDIDATO,
});

//Feed candidato: sus postulaciones ordenadas por score
const findFeedCandidato = async (id_usuarios) => prisma.matches.findMany({
  where: {
    id_usuarios,
    estadoUsuario: { not: "rechazado"},
    oferta: { estado: "activa"},
  },
  select: MATCH_CANDIDATO,
  orderBy: {
    compatibilidad: 'desc'
  },
});

// Feed empresa: candidatos postulados a su oferta con score y CV
const findFeedEmpresa = async (id_ofertas) =>
  prisma.matches.findMany({
    where: {
      id_ofertas,
      estadoEmpresa: { not: "rechazado" },
    },
    select:  MATCH_EMPRESA,
    orderBy: { compatibilidad: "desc" },
  });

// Matches efectivos: ambos aceptaron
const findMatchesEfectivos = async (id_usuarios) =>
  prisma.matches.findMany({
    where:   { id_usuarios, estadoUsuario: "aceptado", estadoEmpresa: "aceptado" },
    select:  MATCH_CANDIDATO,
    orderBy: { fechaMatch: "desc" },
  });

const findMatchById = async (id_match) =>
  prisma.matches.findUnique({ where: { id_match } });

const updateEstado = async (id_match, campo, estado, selector) =>
  prisma.matches.update({
    where:  { id_match },
    data:   { [campo]: estado },
    select: selector,
  });

  module.exports = {
  findCandidatoConHabilidades,
  findOfertaConHabilidades,
  findMatchExistente,
  createMatch,
  findFeedCandidato,
  findFeedEmpresa,
  findMatchesEfectivos,
  findMatchById,
  updateEstado,
  MATCH_CANDIDATO,
  MATCH_EMPRESA,
  };