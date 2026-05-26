
const NIVEL_VALOR = { basico: 1, intermedio: 2, avanzado: 3 };

/**
 * Calcula el puntaje de una habilidad individual.
 * @param {string} nivelCandidato - nivel que tiene el candidato
 * @param {string} nivelRequerido - nivel que pide la oferta
 * @returns {number} 0.0 | 0.5 | 1.0
 */
const puntajeHabilidad = (nivelCandidato, nivelRequerido) => {
  if (!nivelCandidato) return 0;
  const diff = NIVEL_VALOR[nivelCandidato] - NIVEL_VALOR[nivelRequerido];
  if (diff >= 0)  return 1.0;  
  if (diff === -1) return 0.5;  
  return 0;                       
};

/**
 * Calcula el score de compatibilidad entre un candidato y una oferta.
 * @param {Array} habilidadesCandidato - [{ nombre, nivel }]
 * @param {Array} habilidadesOferta    - [{ nombre, nivelRequerido, obligatoria }]
 * @returns {number} score entre 0 y 100 (dos decimales)
 */
const calcularScore = (habilidadesCandidato, habilidadesOferta) => {
  if (!habilidadesOferta.length) return 0;

  const mapaCandidate = new Map(
    habilidadesCandidato.map(({ habilidad, nivel }) => [habilidad.nombre, nivel])
  );

  let puntajeTotal = 0;
  let pesoTotal    = 0;

  for (const req of habilidadesOferta) {
    const peso           = req.obligatoria ? 2 : 1;
    const nivelCandidato = mapaCandidate.get(req.habilidad.nombre);
    const puntaje        = puntajeHabilidad(nivelCandidato, req.nivelRequerido);

    puntajeTotal += puntaje * peso;
    pesoTotal    += peso;
  }

  const score = (puntajeTotal / pesoTotal) * 100;
  return parseFloat(score.toFixed(2));
};

module.exports = { calcularScore };