const prisma = require('../config/db.config');

const crear = (id_usuario, tipo, payload) => prisma.notificaciones.create({
  data: { id_usuario, tipo, payload }
});

const notificar = {

  //cuando candidato da like, notificar a empresa
  nuevoMatch: ({id_empresa, candidato, oferta, matchId}) => 
    crear(id_empresa, 'nuevo_match', {
      candidato, 
      oferta,
      matchId,
    }),

  //Empresa acepto, notificar a candidato
  matchAceptado: ({id_candidato, empresa, oferta, matchId}) => 
    crear(id_candidato, 'match_aceptado', {
      empresa, 
      oferta,
      matchId,
    }),

  //Empresa rechazo, notificar a candidato
  matchRechazado: ({id_candidato, empresa, oferta, matchId}) => 
    crear(id_candidato, 'match_rechazado', {
      empresa, 
      oferta,
      matchId,
    }),

  //Cuando empresa crea una oferta, notificar a candidatos
  nuevaOferta: (ids_candidatos, { empresa, oferta, ofertaId }) =>
    prisma.notificaciones.createMany({
      data: ids_candidatos.map((id_usuario) => ({
        id_usuario,
        tipo: 'nueva_oferta',
        payload: { empresa, oferta, ofertaId },
      })),
      skipDuplicates: true,
    }),

  //Oferta cerrada, notificar a candidatos que dieron like pero no fueron aceptados
  ofertaCerrada: (ids_candidatos, { empresa, oferta, ofertaId}) =>
    prisma.notificaciones.createMany({
      data: ids_candidatos.map((id_usuario) => ({
        id_usuario,
        tipo: 'oferta_cerrada',
        payload: { empresa, oferta, ofertaId },
      })),
      skipDuplicates: true,
    }),

  // Reseña recibida, notifica al receptor
  resenaRecibida: ({ id_receptor, de, raiting, matchId }) =>
    crear(id_receptor, "resena_recibida", {
      de,
      raiting,
      matchId,
    }),

  // Mensaje recibido, se llamará desde chat.socket.js
  mensajeRecibido: ({ id_receptor, de, matchId }) =>
    crear(id_receptor, "mensaje_recibido", {
      de,
      matchId,
    }),
}

module.exports = { notificar };