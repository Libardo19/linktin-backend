const { Router } = require("express");
const AuthController   = require("../controllers/auth.controller");
const authMiddleware   = require("../middlewares/auth.middleware");
const { validateLogin,
        validateRegister } = require("../middlewares/validate.middleware");

const router = Router();

// Rutas públicas
router.post("/login",    validateLogin,    AuthController.login);
router.post("/register", validateRegister, AuthController.register);

// Ruta protegida — verifica que el token sea válido
router.get("/me", authMiddleware, AuthController.me);

module.exports = router;