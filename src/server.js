const app    = require("./app");
const { port } = require("./config/env.config");

app.listen(port, () => {
  console.log(`🚀 LinkTin API corriendo en http://localhost:${port}`);
  console.log(`📋 Entorno: ${process.env.NODE_ENV}`);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});