const { Router } = require("express");
const ctrl  = require("../controllers/candidato.controller");
const auth  = require("../middlewares/auth.middleware");
    const {
    validateCreatePerfil,
    validateUpdatePerfil,
    validateExperiencia,
    validateEducacion,
    validateHabilidad,
    validateUpdateNivel,
    } = require("../middlewares/candidato.validate");

    const router = Router();

    router.use(auth);

    // Perfil
    router.get("/",    ctrl.getAll);
    router.get("/me",  ctrl.getMiPerfil);
    router.get("/:id", ctrl.getById);
    router.post("/",              validateCreatePerfil, ctrl.createPerfil);
    router.put("/:id",            validateUpdatePerfil, ctrl.updatePerfil);
    router.delete("/:id",                               ctrl.deletePerfil);

    // Experiencia
    router.post("/:id/experiencia",           validateExperiencia, ctrl.addExperiencia);
    router.put("/:id/experiencia/:expId",     validateExperiencia, ctrl.updateExperiencia);
    router.delete("/:id/experiencia/:expId",                       ctrl.deleteExperiencia);

    // Educación
    router.post("/:id/educacion",             validateEducacion,   ctrl.addEducacion);
    router.put("/:id/educacion/:eduId",       validateEducacion,   ctrl.updateEducacion);
    router.delete("/:id/educacion/:eduId",                         ctrl.deleteEducacion);

    // Habilidades
    router.post("/:id/habilidades",           validateHabilidad,   ctrl.addHabilidad);
    router.put("/:id/habilidades/:habId",     validateUpdateNivel, ctrl.updateHabilidad);
    router.delete("/:id/habilidades/:habId",                       ctrl.deleteHabilidad);

    module.exports = router;