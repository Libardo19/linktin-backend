const { Router } = require("express");
const ctrl = require("../controllers/oferta.controller");
const auth = require("../middlewares/auth.middleware");
const {
    validateCreateOferta,
    validateUpdateOferta,
    validateEstado,
} = require("../middlewares/oferta.validate");

const router = Router();

// Público — candidatos pueden ver ofertas sin autenticarse
router.get("/",    ctrl.getAll);

// Protegidas — rutas específicas ANTES de rutas con parámetros
router.get("/mis-ofertas",         auth, ctrl.getMisOfertas);
router.get("/:id", ctrl.getById);
router.post("/",                    auth, validateCreateOferta, ctrl.create);
router.put("/:id",                 auth, validateUpdateOferta,  ctrl.update);
router.delete("/:id",              auth, ctrl.remove);
router.patch("/:id/estado",        auth, validateEstado,        ctrl.cambiarEstado);

module.exports = router;