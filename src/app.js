const express                = require("express");
const cors                   = require("cors");
const authRoutes             = require("./routes/auth.routes");
const candidatoRoutes        = require("./routes/candidato.routes");
const habilidadRoutes        = require("./routes/habilidad.routes");
const ofertaRoutes           = require("./routes/oferta.routes");
const empresaRoutes          = require("./routes/empresa.routes");
const sectorRoutes           = require("./routes/sector.routes");
const matchingRoutes         = require("./routes/matching.routes");
const notificacionesRoutes   = require("./routes/notificaciones.routes");
const adminRoutes            = require("./routes/admin.routes");
const resenaRoutes           = require("./routes/resena.routes");
const reporteRoutes          = require("./routes/reporte.routes");
const errorMiddleware        = require("./middlewares/error.middleware");
const recommendationRoutes = require("./routes/recommendation.routes");
const storageRoutes = require("./routes/storage.routes");

const app = express();

// CORS configurado antes de todo
app.use(cors({
  origin: ['http://localhost:3000', 'http://172.20.10.2:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json());

app.use("/api/auth",           authRoutes);
app.use("/api/candidatos",     candidatoRoutes);
app.use("/api/habilidades",    habilidadRoutes);
app.use("/api/ofertas",        ofertaRoutes);
app.use("/api/empresas",       empresaRoutes);
app.use("/api/sectores",       sectorRoutes);
app.use("/api/matches",        matchingRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/resenas",        resenaRoutes)
app.use("/api/admin",          adminRoutes);
app.use("/api/reportes",       reporteRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/storage", storageRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Ruta no encontrada" })
);

app.use(errorMiddleware);

module.exports = app;