const { Router } = require("express");
const ctrl = require("../controllers/sector.controller");
const auth = require("../middlewares/auth.middleware");
const { validateCreateSector,
        validateUpdateSector } = require("../middlewares/sector.validate");

const router = Router();

// Público — empresas y candidatos pueden ver el catálogo
router.get("/",    ctrl.getAll);
router.get("/:id", ctrl.getById);

// Protegido — solo admin gestiona el catálogo
router.post("/",      auth, validateCreateSector, ctrl.create);
router.put("/:id",    auth, validateUpdateSector,  ctrl.update);
router.delete("/:id", auth,                        ctrl.remove);

module.exports = router;