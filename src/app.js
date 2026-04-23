const express         = require("express");
const cors            = require("cors");
const authRoutes      = require("./routes/auth.routes");
const candidatoRoutes = require("./routes/candidato.routes");
const habilidadRoutes = require("./routes/habilidad.routes");
const ofertaRoutes    = require("./routes/oferta.routes");
const empresaRoutes   = require("./routes/empresa.routes");
const sectorRoutes    = require("./routes/sector.routes");
const matchingRoutes   = require("./routes/matching.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",        authRoutes);
app.use("/api/candidatos",  candidatoRoutes);
app.use("/api/habilidades", habilidadRoutes);
app.use("/api/ofertas",     ofertaRoutes);
app.use("/api/empresas",    empresaRoutes);
app.use("/api/sectores",    sectorRoutes);
app.use("/api/matches",     matchingRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Ruta no encontrada" })
);

app.use(errorMiddleware);

module.exports = app;