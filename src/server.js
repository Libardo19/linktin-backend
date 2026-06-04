const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { port } = require('./config/env.config');

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

global.io = io;

require('./services/chat.service')(io);

httpServer.listen(port, () => {
  console.log(`🚀 LinkTin API corriendo en http://localhost:${port}`);
  console.log(`📋 Entorno: ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.IO activo`);
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});
