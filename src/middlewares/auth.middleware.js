const jwt = require("jsonwebtoken");
const { jwt: jwtConfig } = require("../config/env.config");

/**
 * Verifica el JWT en el header Authorization.
 * Si es válido, adjunta el payload en req.usuario.
 * Uso: router.get('/ruta-privada', authMiddleware, controller)
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // 1. Verificar que el header exista y tenga formato "Bearer token"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verificar firma y expiración
    const payload = jwt.verify(token, jwtConfig.secret);

    // 3. Adjuntar payload al request para usarlo en controllers
    req.usuario = payload;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token expirado"
        : "Token inválido";

    return res.status(401).json({ success: false, message });
  }
};

module.exports = authMiddleware;