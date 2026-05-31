const { Router } = require("express");
const ctrl = require("../controllers/storage.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = Router();

router.use(auth);

router.post("/:tipo", upload.single("archivo"), ctrl.uploadFile);
router.delete("/:tipo", ctrl.deleteFile);
router.get("/cv/:userId", ctrl.downloadCv);

module.exports = router;
