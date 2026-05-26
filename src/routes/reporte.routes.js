const { Router } = require("express");
const ctrl = require("../controllers/reporte.controller");
const auth = require("../middlewares/auth.middleware");
const { validateCreateReporte, validateGestionReporte } = require("../middlewares/reporte.validate");

const router = Router();
router.use(auth);

router.post("/",               validateCreateReporte,  ctrl.create);
router.get("/dashboard",                               ctrl.getDashboard);
router.get("/",                                        ctrl.getAll);
router.get("/:id",                                     ctrl.getById);
router.patch("/:id/gestionar", validateGestionReporte, ctrl.gestionarReporte);

module.exports = router;