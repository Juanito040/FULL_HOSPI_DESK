/**
 * Constantes para el módulo de sistemas
 * Mapeos de valores INT a strings para facilitar la lectura y uso
 */

// ========================================
// INTERFACES
// ========================================

export interface CatalogoItem {
  id?: number;
  value?: number;
  nombre?: string;
  label?: string;
}

// ========================================
// TIPO DE MANTENIMIENTO
// ========================================

export const TIPO_MANTENIMIENTO = {
  CORRECTIVO: 1,
  PREVENTIVO: 2,
  PREDICTIVO: 3,
  OTRO: 4
} as const;

export const TIPO_MANTENIMIENTO_LABELS: { [key: number]: string } = {
  1: 'Correctivo',
  2: 'Preventivo',
  3: 'Predictivo',
  4: 'Otro'
};

// ========================================
// TIPO DE FALLA
// ========================================

export const TIPO_FALLA = {
  DESGASTE: 1,
  OPERACION_INDEBIDA: 2,
  CAUSA_EXTERNA: 3,
  ACCESORIOS: 4,
  DESCONOCIDO: 5,
  SIN_FALLA: 6,
  OTROS: 7,
  NO_REGISTRA: 8
} as const;

export const TIPO_FALLA_LABELS: { [key: number]: string } = {
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
// FUNCIONES HELPER
// ========================================

/**
 * Obtiene el label de un tipo de mantenimiento
 * @param value - Valor numérico del tipo de mantenimiento
 * @returns El label correspondiente o 'Desconocido'
 */
export function getTipoMantenimientoLabel(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'No especificado';
  return TIPO_MANTENIMIENTO_LABELS[value] || 'Desconocido';
}

/**
 * Obtiene el label de un tipo de falla
 * @param value - Valor numérico del tipo de falla
 * @returns El label correspondiente o 'Desconocido'
 */
export function getTipoFallaLabel(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'No especificado';
  return TIPO_FALLA_LABELS[value] || 'Desconocido';
}

/**
 * Obtiene todos los tipos de mantenimiento como array de CatalogoItem
 * @returns Array de objetos {value, label}
 */
export function getAllTiposMantenimiento(): CatalogoItem[] {
  return Object.entries(TIPO_MANTENIMIENTO_LABELS).map(([value, label]) => ({
    value: parseInt(value),
    label
  }));
}

/**
 * Obtiene todos los tipos de falla como array de CatalogoItem
 * @returns Array de objetos {value, label}
 */
export function getAllTiposFalla(): CatalogoItem[] {
  return Object.entries(TIPO_FALLA_LABELS).map(([value, label]) => ({
    value: parseInt(value),
    label
  }));
}

/**
 * Valida si un valor es un tipo de mantenimiento válido
 * @param value - Valor a validar
 * @returns true si es válido
 */
export function isValidTipoMantenimiento(value: any): boolean {
  return Object.values(TIPO_MANTENIMIENTO).includes(value);
}

/**
 * Valida si un valor es un tipo de falla válido
 * @param value - Valor a validar
 * @returns true si es válido
 */
export function isValidTipoFalla(value: any): boolean {
  return Object.values(TIPO_FALLA).includes(value);
}

/**
 * Obtiene la clase CSS para el badge de tipo de mantenimiento
 * @param value - Valor del tipo de mantenimiento
 * @returns Nombre de la clase CSS
 */
export function getTipoMantenimientoClass(value: number | null | undefined): string {
  switch (value) {
    case TIPO_MANTENIMIENTO.CORRECTIVO:
      return 'badge-danger';
    case TIPO_MANTENIMIENTO.PREVENTIVO:
      return 'badge-success';
    case TIPO_MANTENIMIENTO.PREDICTIVO:
      return 'badge-info';
    case TIPO_MANTENIMIENTO.OTRO:
      return 'badge-warning';
    default:
      return 'badge-secondary';
  }
}

/**
 * Obtiene la clase CSS para el badge de tipo de falla
 * @param value - Valor del tipo de falla
 * @returns Nombre de la clase CSS
 */
export function getTipoFallaClass(value: number | null | undefined): string {
  switch (value) {
    case TIPO_FALLA.DESGASTE:
      return 'badge-warning';
    case TIPO_FALLA.OPERACION_INDEBIDA:
      return 'badge-danger';
    case TIPO_FALLA.CAUSA_EXTERNA:
      return 'badge-info';
    case TIPO_FALLA.SIN_FALLA:
      return 'badge-success';
    default:
      return 'badge-secondary';
  }
}

// ========================================
// CONSTANTES DE BACKUPS
// ========================================

export const TIPOS_RECURSO_BACKUP = [
  'Servidor virtual',
  'Servidor fisico',
  'Base de datos',
  'Computador',
  'Correo',
  'Switch',
  'TRD',
  'Otro'
] as const;

export const MEDIOS_BACKUP = [
  'Cinta',
  'Disco',
  'Servidor'
] as const;

export const PERIODICIDADES_BACKUP = [
  'Diario',
  'Semanal',
  'Mensual'
] as const;

export const CASOS_MS = [
  'Si',
  'No'
] as const;

/**
 * Obtiene todos los tipos de recurso como array
 * @returns Array de tipos de recurso
 */
export function getAllTiposRecurso(): string[] {
  return [...TIPOS_RECURSO_BACKUP];
}

/**
 * Obtiene todos los medios de backup como array
 * @returns Array de medios
 */
export function getAllMediosBackup(): string[] {
  return [...MEDIOS_BACKUP];
}

/**
 * Obtiene todas las periodicidades como array
 * @returns Array de periodicidades
 */
export function getAllPeriodicidades(): string[] {
  return [...PERIODICIDADES_BACKUP];
}

/**
 * Obtiene las opciones de caso MS
 * @returns Array de opciones Si/No
 */
export function getCasosMS(): string[] {
  return [...CASOS_MS];
}
