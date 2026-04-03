const { Router } = require("express");
const ctrl = require("../controllers/habilidad.controller");
const auth = require("../middlewares/auth.middleware");
const { validateCreateHabilidad,
        validateUpdateHabilidad } = require("../middlewares/habilidad.validate");

const router = Router();

// Público — cualquiera puede ver el catálogo
router.get("/",    ctrl.getAll);
router.get("/:id", ctrl.getById);

// Protegido — solo admin puede modificar el catálogo
router.post("/",      auth, validateCreateHabilidad, ctrl.create);
router.put("/:id",    auth, validateUpdateHabilidad,  ctrl.update);
router.delete("/:id", auth,                          ctrl.remove);

module.exports = router;