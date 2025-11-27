/**
 * =====================================================
 * VALIDADORES: SysHojaVida
 * =====================================================
 * Validaciones para Hojas de Vida de Equipos IT
 */

const { body } = require('express-validator');

/**
 * Validador para crear/actualizar hoja de vida
 */
const sysHojaVidaValidator = [
  // Especificaciones técnicas
  body('ip')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La dirección IP no puede exceder 255 caracteres')
    .matches(/^(\d{1,3}\.){3}\d{1,3}$|^$/)
    .withMessage('Formato de IP inválido (ejemplo: 192.168.1.100)'),

  body('mac')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La dirección MAC no puede exceder 255 caracteres')
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^$/)
    .withMessage('Formato de MAC inválido (ejemplo: AA:BB:CC:DD:EE:FF)'),

  body('procesador')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El procesador no puede exceder 255 caracteres'),

  body('ram')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La RAM no puede exceder 255 caracteres'),

  body('disco_duro')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El disco duro no puede exceder 255 caracteres'),

  body('sistema_operativo')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El sistema operativo no puede exceder 255 caracteres'),

  body('office')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Office no puede exceder 255 caracteres'),

  body('tonner')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El toner no puede exceder 255 caracteres'),

  // Información de usuario y proveedor
  body('nombre_usuario')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El nombre de usuario no puede exceder 255 caracteres'),

  body('vendedor')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El vendedor no puede exceder 255 caracteres'),

  body('tipo_uso')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El tipo de uso no puede exceder 255 caracteres'),

  // Fechas
  body('fecha_compra')
    .optional()
    .isISO8601()
    .withMessage('La fecha de compra debe ser una fecha válida'),

  body('fecha_instalacion')
    .optional()
    .isISO8601()
    .withMessage('La fecha de instalación debe ser una fecha válida'),

  // Costo
  body('costo_compra')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El costo de compra debe ser un número entero positivo'),

  body('contrato')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El contrato no puede exceder 255 caracteres'),

  // Observaciones
  body('observaciones')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Las observaciones no pueden exceder 5000 caracteres'),

  body('foto')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La ruta de la foto no puede exceder 255 caracteres'),

  // Tipo de adquisición (booleanos)
  body('compraddirecta')
    .optional()
    .isBoolean()
    .withMessage('Compra directa debe ser verdadero o falso'),

  body('convenio')
    .optional()
    .isBoolean()
    .withMessage('Convenio debe ser verdadero o falso'),

  body('donado')
    .optional()
    .isBoolean()
    .withMessage('Donado debe ser verdadero o falso'),

  body('comodato')
    .optional()
    .isBoolean()
    .withMessage('Comodato debe ser verdadero o falso'),

  // Relación con equipo
  body('id_sysequipo_fk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del equipo debe ser un número entero positivo')
];

/**
 * Validador para actualización parcial
 * Solo valida los campos que se envíen
 */
const sysHojaVidaPatchValidator = [
  body('ip')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La dirección IP no puede exceder 255 caracteres'),

  body('mac')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La dirección MAC no puede exceder 255 caracteres'),

  body('procesador')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El procesador no puede exceder 255 caracteres'),

  body('ram')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La RAM no puede exceder 255 caracteres'),

  body('disco_duro')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El disco duro no puede exceder 255 caracteres'),

  body('sistema_operativo')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El sistema operativo no puede exceder 255 caracteres'),

  body('costo_compra')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El costo debe ser un número positivo'),

  body('compraddirecta')
    .optional()
    .isBoolean()
    .withMessage('Debe ser verdadero o falso'),

  body('convenio')
    .optional()
    .isBoolean()
    .withMessage('Debe ser verdadero o falso'),

  body('donado')
    .optional()
    .isBoolean()
    .withMessage('Debe ser verdadero o falso'),

  body('comodato')
    .optional()
    .isBoolean()
    .withMessage('Debe ser verdadero o falso')
];

module.exports = {
  sysHojaVidaValidator,
  sysHojaVidaPatchValidator
};
