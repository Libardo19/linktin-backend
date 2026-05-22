const prisma = require("../config/db.config");

// ─── Dashboard Stats ───────────────────────────────────────────────────
const getStats = async () => {
  const [totalCandidatos, totalEmpresas, matchesExitosos, ofertasActivas] = await Promise.all([
    prisma.usuario.count({ where: { tipo: "candidato" } }),
    prisma.usuario.count({ where: { tipo: "empresa" } }),
    prisma.matches.count({
      where: { estadoUsuario: "aceptado", estadoEmpresa: "aceptado" },
    }),
    prisma.ofertas.count({ where: { estado: "activa" } }),
  ]);

  const actividadReciente = await prisma.usuario.findMany({
    select: { id_usuarios: true, email: true, tipo: true, fecha_creacion: true },
    orderBy: { fecha_creacion: "desc" },
    take: 5,
  });

  return { totalCandidatos, totalEmpresas, matchesExitosos, ofertasActivas, actividadReciente };
};

// ─── Usuarios ──────────────────────────────────────────────────────────
const getAllUsuarios = async () =>
  prisma.usuario.findMany({
    select: {
      id_usuarios: true,
      email: true,
      tipo: true,
      activo: true,
      fecha_creacion: true,
      perfil_candidato: {
        select: { nombres: true, apellidos: true, ubicacion: true },
      },
      perfil_empresa: {
        select: { nombre: true, ubicacion: true },
      },
    },
    orderBy: { fecha_creacion: "desc" },
  });

const suspenderUsuario = async (id_usuarios) =>
  prisma.usuario.update({
    where: { id_usuarios },
    data: { activo: false },
  });

const activarUsuario = async (id_usuarios) =>
  prisma.usuario.update({
    where: { id_usuarios },
    data: { activo: true },
  });

// ─── Candidatos ────────────────────────────────────────────────────────
const getAllCandidatos = async () =>
  prisma.perfilCandidato.findMany({
    select: {
      id_candidato: true,
      nombres: true,
      apellidos: true,
      ubicacion: true,
      foto_url: true,
      reputacion: true,
      usuario: {
        select: { email: true, activo: true, fecha_creacion: true },
      },
      habilidadEmpleados: {
        select: {
          nivel: true,
          habilidad: { select: { id_habilidades: true, nombre: true, categoria: true } },
        },
      },
    },
    orderBy: { nombres: "asc" },
  });

// ─── Empresas ──────────────────────────────────────────────────────────
const getAllEmpresas = async () =>
  prisma.perfilEmpresa.findMany({
    select: {
      id_empresas: true,
      nombre: true,
      descripcion: true,
      logo_url: true,
      ubicacion: true,
      website: true,
      sector: { select: { nombre: true } },
      usuario: {
        select: { email: true, activo: true, fecha_creacion: true },
      },
    },
    orderBy: { nombre: "asc" },
  });

// ─── Ofertas ───────────────────────────────────────────────────────────
const getAllOfertas = async () =>
  prisma.ofertas.findMany({
    select: {
      id_ofertas: true,
      titulo: true,
      modalidad: true,
      pago: true,
      estado: true,
      fecha_publicacion: true,
      direccion: true,
      perfil_empresa: {
        select: { nombre: true, logo_url: true },
      },
    },
    orderBy: { fecha_publicacion: "desc" },
  });

const cambiarEstadoOferta = async (id_ofertas, estado) =>
  prisma.ofertas.update({
    where: { id_ofertas: parseInt(id_ofertas) },
    data: { estado },
    select: {
      id_ofertas: true,
      titulo: true,
      estado: true,
    },
  });

// ─── Matches ───────────────────────────────────────────────────────────
const getAllMatches = async () =>
  prisma.matches.findMany({
    select: {
      id_match: true,
      compatibilidad: true,
      estadoUsuario: true,
      estadoEmpresa: true,
      fechaMatch: true,
      usuario: {
        select: {
          id_usuarios: true,
          perfil_candidato: { select: { nombres: true, apellidos: true } },
        },
      },
      oferta: {
        select: {
          id_ofertas: true,
          titulo: true,
          perfil_empresa: { select: { nombre: true } },
        },
      },
    },
    orderBy: { fechaMatch: "desc" },
  });

// ─── Métricas ──────────────────────────────────────────────────────────
const getMetricas = async () => {
  const [totalCandidatos, totalEmpresas, totalMatches, totalOfertas] = await Promise.all([
    prisma.usuario.count({ where: { tipo: "candidato" } }),
    prisma.usuario.count({ where: { tipo: "empresa" } }),
    prisma.matches.count(),
    prisma.ofertas.count(),
  ]);

  const candidatosActivos = await prisma.usuario.count({
    where: { tipo: "candidato", activo: true },
  });
  const empresasActivas = await prisma.usuario.count({
    where: { tipo: "empresa", activo: true },
  });

  const matchesAceptados = await prisma.matches.count({
    where: { estadoUsuario: "aceptado", estadoEmpresa: "aceptado" },
  });

  const ofertasActivas = await prisma.ofertas.count({ where: { estado: "activa" } });

  const topSkills = await prisma.habilidades.findMany({
    select: {
      nombre: true,
      categoria: true,
      _count: { select: { habilidades_empleado: true, habilidades_ofertas: true } },
    },
    orderBy: [
      { habilidades_empleado: { _count: "desc" } },
    ],
    take: 5,
  });

  const topSkillsFormatted = topSkills.map((s) => ({
    nombre: s.nombre,
    categoria: s.categoria,
    totalUsos: s._count.habilidades_empleado + s._count.habilidades_ofertas,
  }));

  const totalUsosMax = topSkillsFormatted.length > 0
    ? Math.max(...topSkillsFormatted.map((s) => s.totalUsos))
    : 1;

  const totalHabilidades = await prisma.habilidades.count();

  return {
    totalCandidatos,
    totalEmpresas,
    totalMatches,
    totalOfertas,
    candidatosActivos,
    empresasActivas,
    matchesAceptados,
    ofertasActivas,
    tasaMatch: totalMatches > 0 ? Math.round((matchesAceptados / totalMatches) * 100) : 0,
    porcentajeOfertasActivas: totalOfertas > 0 ? Math.round((ofertasActivas / totalOfertas) * 100) : 0,
    totalHabilidades,
    topSkills: topSkillsFormatted.map((s) => ({
      ...s,
      porcentaje: Math.round((s.totalUsos / totalUsosMax) * 100),
    })),
  };
};

module.exports = {
  getStats,
  getAllUsuarios,
  getAllCandidatos,
  getAllEmpresas,
  getAllOfertas,
  getAllMatches,
  getMetricas,
  suspenderUsuario,
  activarUsuario,
  cambiarEstadoOferta,
};
