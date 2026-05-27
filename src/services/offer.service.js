const prisma = require("../config/db.config");

const getOffers = async () => {

  return await prisma.ofertas.findMany({

    where: {
      estado: "activa"
    },

    include: {

      perfil_empresa: true,

      habilidades_ofertas: {
        include: {
          habilidad: true
        }
      }

    }

  });

};

module.exports = {
  getOffers
};