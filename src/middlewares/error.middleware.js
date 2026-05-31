/**
 * Middleware global de errores.
 * Captura cualquier error lanzado con next(err) en los controllers.
 * Debe registrarse ÚLTIMO en app.js, después de todas las rutas.
 */
const errorMiddleware = (err, req, res, next) => {

  // Errores controlados: thrown desde services con { status, message }
  if (err.status && err.message) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Error de Prisma: registro único duplicado (ej: email ya existe)
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "Ya existe un registro con ese valor único",
    });
  }

  // Error de Prisma: registro no encontrado
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Registro no encontrado",
    });
  }

  // Error de validación (Joi)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: err.details[0].message,
    });
  }

  // Error de multer (tamaño excedido, archivo no permitido)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "El archivo excede el tamaño máximo permitido (5MB)",
    });
  }
  if (err.message === "Formato de archivo no permitido") {
    return res.status(400).json({
      success: false,
      message: "Formato de archivo no permitido. Usa JPEG, PNG, WebP o PDF",
    });
  }

  // Error inesperado — no exponer detalles en producción
  console.error("[ERROR]", err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production"
      ? "Error interno del servidor"
      : err.message,
  });
};

module.exports = errorMiddleware;