const {Router} = require('express');
const ctrl = require('../controllers/matching.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

// Candidato
router.post("/like/:ofertaId", ctrl.darLike);
router.patch("/:id/retirar", ctrl.retirarLike);
router.get("/mis-postulaciones", ctrl.feedCandidato);
router.get("/mis_matches", ctrl.misMatches);

// Empresa
router.get("/oferta/:ofertaId/candidatos", ctrl.feedEmpresa);
router.patch("/:id/aceptar", ctrl.aceptar);
router.patch("/:id/rechazar", ctrl.rechazar);

module.exports = router;