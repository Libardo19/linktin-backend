const { PrismaClient } = require("@prisma/client");

// Instancia única — evita abrir múltiples conexiones en desarrollo
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development"
    ? ["query", "warn", "error"]
    : ["error"],
});

module.exports = prisma; 
