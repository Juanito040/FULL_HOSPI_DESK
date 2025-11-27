const { body, param } = require('express-validator');

const crearReporteValidator = [
  body('idEquipo')
    .notEmpty()
    .withMessage('ID del equipo es requerido')
    .isInt({ min: 1 })
    .withMessage('ID del equipo debe ser un número válido'),

  body('fecha')
    .notEmpty()
    .withMessage('Fecha es requerida')
    .isDate()
    .withMessage('Fecha inválida'),

  body('horaLlamado')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Hora de llamado inválida (formato HH:MM)'),

  body('horaInicio')
    .notEmpty()
    .withMessage('Hora de inicio es requerida')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Hora de inicio inválida (formato HH:MM)'),

  body('horaTerminacion')
    .notEmpty()
    .withMessage('Hora de terminación es requerida')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Hora de terminación inválida (formato HH:MM)'),

  body('tipoMantenimiento')
    .notEmpty()
    .withMessage('Tipo de mantenimiento es requerido')
    .isInt({ min: 1, max: 4 })
    .withMessage('Tipo de mantenimiento inválido (1=Correctivo, 2=Preventivo, 3=Predictivo, 4=Otro)'),

  body('trabajoRealizado')
    .optional()
    .isString()
    .trim(),

  body('observaciones')
    .optional()
    .isString()
    .trim()
];

const actualizarReporteValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID del reporte inválido'),

  body('fecha')
    .optional()
    .isDate()
    .withMessage('Fecha inválida'),

  body('horaInicio')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Hora de inicio inválida (formato HH:MM)'),

  body('horaTerminacion')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Hora de terminación inválida (formato HH:MM)'),

  body('tipoMantenimiento')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Tipo de mantenimiento inválido')
];

const idValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido')
];

module.exports = {
  crearReporteValidator,
  actualizarReporteValidator,
  idValidator
};
