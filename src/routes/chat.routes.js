const express = require('express');
const router = express.Router();
const prisma = require('../config/db.config');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/conversacion', authMiddleware, async (req, res) => {
  try {
    const { otroUsuarioId } = req.body;
    const miId = req.usuario.id;

    let conversacion = await prisma.conversacion.findFirst({
      where: {
        AND: [
          { participantes: { some: { id_usuarios: miId } } },
          { participantes: { some: { id_usuarios: otroUsuarioId } } },
        ],
      },
      include: {
        participantes: {
          select: {
            id_usuarios: true,
            email: true,
            perfil_candidato: { select: { nombres: true, apellidos: true } },
            perfil_empresa: { select: { nombre: true } },
          },
        },
        mensajes: {
          orderBy: { fecha_envio: 'desc' },
          take: 1,
        },
      },
    });

    if (!conversacion) {
      conversacion = await prisma.conversacion.create({
        data: {
          participantes: {
            connect: [{ id_usuarios: miId }, { id_usuarios: otroUsuarioId }],
          },
        },
        include: {
          participantes: {
            select: {
              id_usuarios: true,
              email: true,
              perfil_candidato: { select: { nombres: true, apellidos: true } },
              perfil_empresa: { select: { nombre: true } },
            },
          },
        },
      });
    }

    res.json({ success: true, data: conversacion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/conversaciones', authMiddleware, async (req, res) => {
  try {
    const conversaciones = await prisma.conversacion.findMany({
      where: {
        participantes: { some: { id_usuarios: req.usuario.id } },
      },
      include: {
        participantes: {
          select: {
            id_usuarios: true,
            email: true,
            perfil_candidato: { select: { nombres: true, apellidos: true } },
            perfil_empresa: { select: { nombre: true } },
          },
        },
        mensajes: {
          orderBy: { fecha_envio: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, data: conversaciones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
