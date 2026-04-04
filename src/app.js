const express        = require("express");
const cors           = require("cors");
const authRoutes     = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const habilidadRoutes = require("./routes/habilidad.routes");
const ofertaRoutes    = require("./routes/oferta.routes");
const candidatoRoutes = require("./routes/candidato.routes"); 
const empresaRoutes = require("./routes/empresa.routes");
const app = express();

// ─── Middlewares globales ──────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Rutas ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/habilidades", habilidadRoutes);
app.use("/api/candidatos", candidatoRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/ofertas", ofertaRoutes);
// ─── Ruta de salud ────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ─── Manejo de rutas no encontradas ───────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Ruta no encontrada" })
);

// ─── Error middleware — SIEMPRE al final ──────────────
app.use(errorMiddleware);

module.exports = app;