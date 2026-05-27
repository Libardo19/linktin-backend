const { openrouterApiKey } = require("../config/env.config");

const askGemini = async (prompt) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openrouterApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free", // ✅ router automático entre todos los modelos gratis
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    console.error("Respuesta inesperada:", JSON.stringify(data, null, 2));
    throw new Error("Respuesta inválida del modelo");
  }

  return data.choices[0].message.content;
};

module.exports = { askGemini };