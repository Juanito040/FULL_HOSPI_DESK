/**
 * Constantes para el módulo de sistemas
 * Mapeos de valores INT a strings para facilitar la lectura y uso
 */

// ========================================
// TIPO DE MANTENIMIENTO
// ========================================
const TIPO_MANTENIMIENTO = {
  CORRECTIVO: 1,
  PREVENTIVO: 2,
  PREDICTIVO: 3,
  OTRO: 4
};

const TIPO_MANTENIMIENTO_LABELS = {
  1: 'Correctivo',
  2: 'Preventivo',
  3: 'Predictivo',
  4: 'Otro'
};

// ========================================
// TIPO DE FALLA
// ========================================
const TIPO_FALLA = {
  DESGASTE: 1,
  OPERACION_INDEBIDA: 2,
  CAUSA_EXTERNA: 3,
  ACCESORIOS: 4,
  DESCONOCIDO: 5,
  SIN_FALLA: 6,
  OTROS: 7,
  NO_REGISTRA: 8
};

const TIPO_FALLA_LABELS = {
  1: 'Desgaste',
  2: 'Operación Indebida',
  3: 'Causa Externa',
  4: 'Accesorios',
  5: 'Desconocido',
  6: 'Sin Falla',
  7: 'Otros',
  8: 'No Registra'
};

// ========================================
// FUNCIONES DE CONVERSIÓN
// ========================================

/**
 * Convierte un string de tipo de mantenimiento a su valor INT
 * @param {string} label - El label del tipo de mantenimiento
 * @returns {number|null} - El valor INT correspondiente o null
 */
const getTipoMantenimientoValue = (label) => {
  const upperLabel = label?.toUpperCase().replace(/\s+/g, '_');
  return TIPO_MANTENIMIENTO[upperLabel] || null;
};

/**
 * Convierte un valor INT a su label de tipo de mantenimiento
 * @param {number} value - El valor INT
 * @returns {string|null} - El label correspondiente o null
 */
const getTipoMantenimientoLabel = (value) => {
  return TIPO_MANTENIMIENTO_LABELS[value] || null;
};

/**
 * Convierte un string de tipo de falla a su valor INT
 * @param {string} label - El label del tipo de falla
 * @returns {number|null} - El valor INT correspondiente o null
 */
const getTipoFallaValue = (label) => {
  // Mapeo especial para casos con espacios y caracteres especiales
  const mapping = {
    'DESGASTE': TIPO_FALLA.DESGASTE,
    'OPERACION_INDEBIDA': TIPO_FALLA.OPERACION_INDEBIDA,
    'OPERACIÓN_INDEBIDA': TIPO_FALLA.OPERACION_INDEBIDA,
    'CAUSA_EXTERNA': TIPO_FALLA.CAUSA_EXTERNA,
    'ACCESORIOS': TIPO_FALLA.ACCESORIOS,
    'DESCONOCIDO': TIPO_FALLA.DESCONOCIDO,
    'SIN_FALLA': TIPO_FALLA.SIN_FALLA,
    'OTROS': TIPO_FALLA.OTROS,
    'NO_REGISTRA': TIPO_FALLA.NO_REGISTRA
  };

  const upperLabel = label?.toUpperCase().replace(/\s+/g, '_');
  return mapping[upperLabel] || null;
};

/**
 * Convierte un valor INT a su label de tipo de falla
 * @param {number} value - El valor INT
 * @returns {string|null} - El label correspondiente o null
 */
const getTipoFallaLabel = (value) => {
  return TIPO_FALLA_LABELS[value] || null;
};

/**
 * Valida si un valor es un tipo de mantenimiento válido
 * @param {number} value - El valor a validar
 * @returns {boolean} - true si es válido
 */
const isValidTipoMantenimiento = (value) => {
  return Object.values(TIPO_MANTENIMIENTO).includes(value);
};

/**
 * Valida si un valor es un tipo de falla válido
 * @param {number} value - El valor a validar
 * @returns {boolean} - true si es válido
 */
const isValidTipoFalla = (value) => {
  return Object.values(TIPO_FALLA).includes(value);
};

/**
 * Obtiene todos los tipos de mantenimiento disponibles
 * @returns {Array} - Array de objetos {value, label}
 */
const getAllTiposMantenimiento = () => {
  return Object.entries(TIPO_MANTENIMIENTO_LABELS).map(([value, label]) => ({
    value: parseInt(value),
    label
  }));
};

/**
 * Obtiene todos los tipos de falla disponibles
 * @returns {Array} - Array de objetos {value, label}
 */
const getAllTiposFalla = () => {
  return Object.entries(TIPO_FALLA_LABELS).map(([value, label]) => ({
    value: parseInt(value),
    label
  }));
};

module.exports = {
  // Constantes
  TIPO_MANTENIMIENTO,
  TIPO_MANTENIMIENTO_LABELS,
  TIPO_FALLA,
  TIPO_FALLA_LABELS,

  // Funciones de conversión
  getTipoMantenimientoValue,
  getTipoMantenimientoLabel,
  getTipoFallaValue,
  getTipoFallaLabel,

  // Funciones de validación
  isValidTipoMantenimiento,
  isValidTipoFalla,

  // Funciones de listado
  getAllTiposMantenimiento,
  getAllTiposFalla
};
