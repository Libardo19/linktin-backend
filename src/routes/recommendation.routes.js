const express = require("express");

const router = express.Router();

const {
  getRecommendations
} = require("../controllers/recommendation.controller");

router.get("/:idUsuario", getRecommendations);

module.exports = router;