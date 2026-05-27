const { getCandidateProfile } = require("./candidate.service");
const { getOffers }           = require("./offer.service");
const { buildPrompt }         = require("../utils/buildPrompt");
const { askGemini }           = require("./gemini.service");

// ✅ Función que faltaba
const preFilter = (candidate, offers) => {
  return offers.filter(o => {
    const modalidadOk = !o.modalidad || !candidate.modalidad || o.modalidad === candidate.modalidad;
    const seniorityOk = !o.seniority || !candidate.seniority || o.seniority === candidate.seniority;
    return modalidadOk && seniorityOk;
  });
};

const generateRecommendations = async (idUsuario) => {
  const candidate = await getCandidateProfile(idUsuario);
  const offers    = await getOffers();

  const filtradas = preFilter(candidate, offers);
  const prompt    = buildPrompt(candidate, filtradas);

  const aiResponse = await askGemini(prompt);
  
  // 👇 Log temporal
  console.log("=== RESPUESTA MODELO ===");
  console.log(aiResponse);
  console.log("========================");

  const match = aiResponse.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error("Respuesta del modelo:", aiResponse);
    throw new Error("No se encontró JSON válido en la respuesta del modelo");
  }

  return JSON.parse(match[0]);
};

module.exports = { generateRecommendations };