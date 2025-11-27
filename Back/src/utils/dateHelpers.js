/**
 * Parsear rango de fechas en formato "MM/DD/YYYY - MM/DD/YYYY"
 * @param {string} daterange
 * @returns {Object} { fechaInicio, fechaFin, mes1, dia1, ano1, mes2, dia2, ano2 }
 */
function parseDateRange(daterange) {
  const fechas = daterange.split('-').map(f => f.trim());
  const [mes1, dia1, ano1] = fechas[0].split('/').map(Number);
  const [mes2, dia2, ano2] = fechas[1].split('/').map(Number);

  const fechaInicio = `${ano1}-${String(mes1).padStart(2, '0')}-${String(dia1).padStart(2, '0')}`;
  const fechaFin = `${ano2}-${String(mes2).padStart(2, '0')}-${String(dia2).padStart(2, '0')}`;

  return {
    fechaInicio,
    fechaFin,
    mes1,
    dia1,
    ano1,
    mes2,
    dia2,
    ano2
  };
}

/**
 * Obtener primer día del mes actual
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
function getPrimerDiaMes() {
  const hoy = new Date();
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  return primerDia.toISOString().split('T')[0];
}

/**
 * Obtener fecha actual
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
function getFechaActual() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calcular color de avance basado en porcentaje
 * @param {number} porcentaje
 * @returns {number} Color (1-5)
 */
function calcularColorAvance(porcentaje) {
  if (porcentaje === 100) return 1; // Verde
  if (porcentaje >= 75) return 2;   // Amarillo-Verde
  if (porcentaje >= 50) return 3;   // Amarillo
  if (porcentaje >= 25) return 4;   // Naranja
  return 5;                          // Rojo
}

module.exports = {
  parseDateRange,
  getPrimerDiaMes,
  getFechaActual,
  calcularColorAvance
};
