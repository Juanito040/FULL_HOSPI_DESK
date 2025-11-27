const { body, param } = require('express-validator');

const filtrarMantenimientosValidator = [
  body('daterange')
    .notEmpty()
    .withMessage('El rango de fechas es requerido')
    .matches(/^\d{1,2}\/\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{1,2}\/\d{4}$/)
    .withMessage('Formato de rango de fechas inválido (MM/DD/YYYY - MM/DD/YYYY)'),

  body('usuarioprogramado')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido')
];

const getPreventivoValidator = [
  param('mes')
    .isInt({ min: 1, max: 12 })
    .withMessage('Mes debe estar entre 1 y 12'),

  param('ano')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Año inválido')
];

module.exports = {
  filtrarMantenimientosValidator,
  getPreventivoValidator
};
