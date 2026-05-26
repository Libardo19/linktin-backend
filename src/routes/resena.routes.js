const { Router } = require("express");
const ctrl = require("../controllers/resena.controller");
const auth = require("../middlewares/auth.middleware");
const { ValidateCreateResena } = require("../middlewares/resena.validate");

const router = Router();

router.post("/", auth, ValidateCreateResena, ctrl.create);
router.get("/mis-resenas", auth, ctrl.getMisResenas);
router.get("/usuario/:id_usuario", ctrl.getRecibidas);

module.exports = router;