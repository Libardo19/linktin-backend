const ctrl = require('../controllers/notificaciones.controller');
const { Router } = require("express");
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.use(auth); // todas las rutas requieren autenticación

router.get("/", ctrl.getMisNotificaciones);
router.patch("/:id/leer", ctrl.marcarLeida);
router.patch("/leer-todas", ctrl.marcarTodasLeidas);
router.delete("/limpiar", ctrl.limpiarLeidas);

module.exports = router;