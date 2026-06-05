const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env.config');
const prisma = require('../config/db.config');

module.exports = (io) => {

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No autorizado'));
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuario conectado al chat: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);

    socket.on('unirse_conversacion', async (conversacionId) => {
      socket.join(conversacionId);

      const mensajes = await prisma.mensajes.findMany({
        where: { conversacionId },
        orderBy: { fecha_envio: 'asc' },
        include: {
          usuario: { select: { id_usuarios: true, email: true } },
        },
      });

      socket.emit('historial_mensajes', mensajes);
    });

    socket.on('enviar_mensaje', async ({ conversacionId, contenido }) => {
      if (!contenido?.trim()) return;

      const mensaje = await prisma.mensajes.create({
        data: {
          contenido,
          conversacionId,
          id_usuario: socket.userId,
        },
        include: {
          usuario: { select: { id_usuarios: true, email: true } },
        },
      });

      io.to(conversacionId).emit('nuevo_mensaje', mensaje);

      // Notificar al otro participante sobre el nuevo mensaje
      try {
        const conversacion = await prisma.conversacion.findUnique({
          where: { id: conversacionId },
          include: { participantes: { select: { id_usuarios: true } } },
        });

        if (conversacion) {
          const otroUsuario = conversacion.participantes.find(p => p.id_usuarios !== socket.userId);
          if (otroUsuario) {
            // Obtener nombre del remitente
            const remitente = await prisma.perfilCandidato.findUnique({
              where: { id_usuarios: socket.userId },
              select: { nombres: true, apellidos: true },
            });
            const nombreRemitente = remitente
              ? `${remitente.nombres} ${remitente.apellidos}`
              : socket.userId;

            await prisma.notificaciones.create({
              data: {
                id_usuario: otroUsuario.id_usuarios,
                tipo: 'mensaje_recibido',
                payload: { conversacionId, de: socket.userId, nombre: nombreRemitente },
              },
            });

            io.to(`user:${otroUsuario.id_usuarios}`).emit('nueva_notificacion', {
              tipo: 'mensaje_recibido',
              conversacionId,
              nombre: nombreRemitente,
            });
          }
        }
      } catch (err) {
        console.error('Error al notificar mensaje:', err);
      }
    });

    socket.on('escribiendo', ({ conversacionId }) => {
      socket.to(conversacionId).emit('usuario_escribiendo', {
        userId: socket.userId,
      });
    });

    socket.on('dejo_de_escribir', ({ conversacionId }) => {
      socket.to(conversacionId).emit('usuario_dejo_escribir', {
        userId: socket.userId,
      });
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado del chat: ${socket.userId}`);
    });
  });
};
