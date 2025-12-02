const { body, param } = require('express-validator');

const createActividadValidator = [
  body('tipoActividad')
    .notEmpty()
    .withMessage('El tipo de actividad es requerido')
    .isIn(['Calibración', 'Calificación', 'Validación', 'Confirmación Metrológica'])
    .withMessage('Tipo de actividad inválido'),

  body('mesProgramado')
    .notEmpty()
    .withMessage('El mes programado es requerido')
    .isInt({ min: 1, max: 12 })
    .withMessage('El mes debe estar entre 1 y 12'),

  body('añoProgramado')
    .notEmpty()
    .withMessage('El año programado es requerido')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Año inválido'),

  body('equipoIdFk')
    .notEmpty()
    .withMessage('El equipo es requerido')
    .isInt({ min: 1 })
    .withMessage('ID de equipo inválido'),

  body('realizado')
    .optional()
    .isBoolean()
    .withMessage('El campo realizado debe ser booleano'),

  body('fechaRealizado')
    .optional()
    .isISO8601()
    .withMessage('Fecha inválida'),

  body('empresa')
    .optional()
    .isString()
    .withMessage('La empresa debe ser un texto'),

  body('errorMaximoIdentificado')
    .optional()
    .isFloat()
    .withMessage('El error máximo debe ser un número'),

  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto'),

  body('resultado')
    .optional()
    .isIn(['Cumple', 'No Cumple', 'No Aplica'])
    .withMessage('Resultado inválido'),

  body('rutaReporte')
    .optional()
    .isString()
    .withMessage('La ruta del reporte debe ser texto'),

  body('usuarioIdFk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido')
];

const updateActividadValidator = [
  body('tipoActividad')
    .optional()
    .isIn(['Calibración', 'Calificación', 'Validación', 'Confirmación Metrológica'])
    .withMessage('Tipo de actividad inválido'),

  body('mesProgramado')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('El mes debe estar entre 1 y 12'),

  body('añoProgramado')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Año inválido'),

  body('equipoIdFk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de equipo inválido'),

  body('realizado')
    .optional()
    .isBoolean()
    .withMessage('El campo realizado debe ser booleano'),

  body('fechaRealizado')
    .optional()
    .isISO8601()
    .withMessage('Fecha inválida'),

  body('empresa')
    .optional()
    .isString()
    .withMessage('La empresa debe ser un texto'),

  body('errorMaximoIdentificado')
    .optional()
    .isFloat()
    .withMessage('El error máximo debe ser un número'),

  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto'),

  body('resultado')
    .optional()
    .isIn(['Cumple', 'No Cumple', 'No Aplica'])
    .withMessage('Resultado inválido'),

  body('rutaReporte')
    .optional()
    .isString()
    .withMessage('La ruta del reporte debe ser texto'),

  body('usuarioIdFk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido')
];

const marcarRealizadaValidator = [
  body('fechaRealizado')
    .optional()
    .isISO8601()
    .withMessage('Fecha inválida'),

  body('empresa')
    .optional()
    .isString()
    .withMessage('La empresa debe ser un texto'),

  body('errorMaximoIdentificado')
    .optional()
    .isFloat()
    .withMessage('El error máximo debe ser un número'),

  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto'),

  body('resultado')
    .notEmpty()
    .withMessage('El resultado es requerido')
    .isIn(['Cumple', 'No Cumple', 'No Aplica'])
    .withMessage('Resultado inválido'),

  body('rutaReporte')
    .optional()
    .isString()
    .withMessage('La ruta del reporte debe ser texto'),

  body('usuarioIdFk')
    .notEmpty()
    .withMessage('El usuario es requerido')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido')
];

const getPeriodoValidator = [
  param('mes')
    .isInt({ min: 1, max: 12 })
    .withMessage('El mes debe estar entre 1 y 12'),

  param('ano')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Año inválido')
];

module.exports = {
  createActividadValidator,
  updateActividadValidator,
  marcarRealizadaValidator,
  getPeriodoValidator
};
