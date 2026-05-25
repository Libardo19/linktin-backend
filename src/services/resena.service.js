const create = async (usuarioToken, { id_match, raiting, comentario }) => {
  const idMatch = parseInt(id_match);

  // Verificar que el match exista y sea efectivo
  const match = await ResenaModel.findMatchEfectivo(idMatch);
  if (!match)
    throw { status: 404, message: "Match no encontrado" };
  if (match.estadoUsuario !== "aceptado" || match.estadoEmpresa !== "aceptado")
    throw { status: 403, message: "Solo puedes dejar reseñas en matches efectivos" };

  // Determinar quién es el autor y quién es el receptor
  const esCandidato = match.id_usuarios === usuarioToken.id;
  const esEmpresa   = match.oferta?.perfil_empresa?.id_usuarios === usuarioToken.id;

  if (!esCandidato && !esEmpresa)
    throw { status: 403, message: "No perteneces a este match" };

  const id_enviado  = usuarioToken.id;
  const id_recibido = esCandidato
    ? match.oferta.perfil_empresa.id_usuarios  
    : match.id_usuarios;                

  // Verificar que no haya reseñado antes en este match
  const existe = await ResenaModel.findByAutorYMatch(id_enviado, idMatch);
  if (existe)
    throw { status: 409, message: "Ya dejaste una reseña para este match" };

  // Crear la reseña
  const resena = await ResenaModel.create({ id_enviado, id_recibido, id_match: idMatch, raiting, comentario });

  // Notificar al receptor  
  const nombreAutor = esCandidato
    ? `${resena.autor.perfil_candidato?.nombres} ${resena.autor.perfil_candidato?.apellidos}`
    : resena.autor.perfil_empresa?.nombre;

  notificar.resenaRecibida({
    id_receptor: id_recibido,
    de:          nombreAutor,
    raiting,
    matchId:     idMatch,
  }).catch(console.error);

  return resena;
};