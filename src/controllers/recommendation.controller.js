const {
  generateRecommendations
} = require("../services/recommendation.service");

const getRecommendations = async (req, res) => {

  try {

    const { idUsuario } = req.params;

    const recommendations =
      await generateRecommendations(idUsuario);

    return res.status(200).json(recommendations);

  } catch (error) {

  console.error("ERROR COMPLETO:");
  console.error(error);

  return res.status(500).json({
    message: error.message,
    stack: error.stack
  });
  }

};

module.exports = {
  getRecommendations
};