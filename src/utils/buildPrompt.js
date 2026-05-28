const buildPrompt = (candidate, offers) => {

  return `
Eres un sistema inteligente ATS especializado en ofertas del sector TI.

Tu tarea es analizar un candidato y una lista de ofertas laborales para determinar cuáles ofertas son las más compatibles.

Debes evaluar:

1. Habilidades técnicas
2. Nivel de habilidades
3. Experiencia laboral
4. Educación
5. Tecnologías similares
6. Seniority
7. Modalidad
8. Compatibilidad general

IMPORTANTE:
- Las habilidades obligatorias tienen más peso.
- La experiencia laboral tiene peso alto.
- Considera tecnologías similares parcialmente compatibles.
- Ordena de mayor compatibilidad a menor.
- Debes retornar MÍNIMO 5 recomendaciones.
- Tu respuesta debe ser ÚNICAMENTE el objeto JSON, sin texto adicional, sin explicaciones, sin bloques de código markdown, sin comillas al inicio o al final. Solo JSON puro y válido.
- Si incluyes cualquier texto fuera del JSON, la respuesta será inválida.

CANDIDATO:
${JSON.stringify(candidate)}

OFERTAS:
${JSON.stringify(offers)}

Responde ÚNICAMENTE con este JSON con mínimo 5 elementos en el array, nada más:
{"recomendaciones":[{"id_oferta":1,"score_match":95,"nivel_compatibilidad":"Alta","razones":["razon1","razon2"],"faltantes":["faltante1"]}]}
`;

};

module.exports = {
  buildPrompt
};