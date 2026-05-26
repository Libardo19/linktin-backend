const { Router } = require("express");
const ctrl = require("../controllers/resena.controller");
const auth = require("../middlewares/auth.middleware");
const { validateCreateResena } = require("../middlewares/resena.validate");

const router = Router();

// Crear reseña 
router.post("/", auth, validateCreateResena, ctrl.create);
router.get("/mis-resenas", auth, ctrl.getMisResenas);
router.get("/usuario/:id_usuario", ctrl.getRecibidas);

module.exports = router;