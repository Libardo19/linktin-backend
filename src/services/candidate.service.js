const prisma = require("../config/db.config");

const getCandidateProfile = async (idUsuario) => {

  const candidato = await prisma.perfilCandidato.findFirst({

    where: {
      id_usuarios: idUsuario
    },

    include: {

      habilidadEmpleados: {
        include: {
          habilidad: true
        }
      },

      experiencia_candidatos: true,

      educacion_candidatos: true

    }

  });

  return candidato;

};

module.exports = {
  getCandidateProfile
};