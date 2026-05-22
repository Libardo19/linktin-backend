const { Router } = require("express");
const EmpresaController  = require("../controllers/empresa.controller");
const authMiddleware     = require("../middlewares/auth.middleware");
const { validateCreateEmpresa,
        validateUpdateEmpresa } = require("../middlewares/empresa.validate");

const router = Router();

// Todas las rutas requieren JWT
router.use(authMiddleware);

router.get("/",       EmpresaController.getAll);
router.get("/me",     EmpresaController.getMiPerfil);
router.get("/:id",    EmpresaController.getById);
router.post("/",      validateCreateEmpresa, EmpresaController.create);
router.put("/:id",    validateUpdateEmpresa, EmpresaController.update);
router.delete("/:id", EmpresaController.remove);

module.exports = router;