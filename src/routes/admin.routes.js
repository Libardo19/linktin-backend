const { Router } = require("express");
const ctrl = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware");

const router = Router();

router.use(auth);

router.get("/stats",       ctrl.getStats);
router.get("/usuarios",    ctrl.getUsuarios);
router.get("/candidatos",  ctrl.getCandidatos);
router.get("/empresas",    ctrl.getEmpresas);
router.get("/ofertas",     ctrl.getOfertas);
router.get("/matches",     ctrl.getMatches);
router.get("/metricas",    ctrl.getMetricas);

router.patch("/usuarios/:id/suspender", ctrl.suspenderUsuario);
router.patch("/usuarios/:id/activar",   ctrl.activarUsuario);
router.patch("/ofertas/:id/estado",     ctrl.cambiarEstadoOferta);

module.exports = router;
