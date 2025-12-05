const { body, param, query } = require('express-validator');
const { isValidTipoMantenimiento, isValidTipoFalla } = require('../../utils/sysConstants');

const createMantenimientoValidator = [
  body('id_sysequipo_fk')
    .notEmpty()
    .withMessage('El ID del equipo es requerido')
    .isInt({ min: 1 })
    .withMessage('ID de equipo inválido'),

  body('fecha')
    .optional()
    .isDate()
    .withMessage('Formato de fecha inválido (YYYY-MM-DD)'),

  body('tipo_mantenimiento')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Tipo de mantenimiento inválido (debe ser 1-4)')
    .custom((value) => {
      if (value && !isValidTipoMantenimiento(value)) {
        throw new Error('Tipo de mantenimiento no válido');
      }
      return true;
    }),

  body('tipo_falla')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Tipo de falla inválido (debe ser 1-8)')
    .custom((value) => {
      if (value && !isValidTipoFalla(value)) {
        throw new Error('Tipo de falla no válido');
      }
      return true;
    }),

  body('hora_llamado')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Formato de hora inválido (HH:MM:SS)'),

  body('hora_inicio')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Formato de hora inválido (HH:MM:SS)'),

  body('hora_terminacion')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Formato de hora inválido (HH:MM:SS)'),

  body('tiempo_fuera_servicio')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tiempo fuera de servicio debe ser un número positivo'),

  body('id_sysusuario_fk')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido')
];

const updateMantenimientoValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de mantenimiento inválido'),

  body('fecha')
    .optional()
    .isDate()
    .withMessage('Formato de fecha inválido (YYYY-MM-DD)'),

  body('tipo_mantenimiento')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Tipo de mantenimiento inválido (debe ser 1-4)')
    .custom((value) => {
      if (value && !isValidTipoMantenimiento(value)) {
        throw new Error('Tipo de mantenimiento no válido');
      }
      return true;
    }),

  body('tipo_falla')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Tipo de falla inválido (debe ser 1-8)')
    .custom((value) => {
      if (value && !isValidTipoFalla(value)) {
        throw new Error('Tipo de falla no válido');
      }
      return true;
    }),

  body('hora_llamado')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Formato de hora inválido (HH:MM:SS)'),

  body('hora_inicio')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Formato de hora inválido (HH:MM:SS)'),

  body('hora_terminacion')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
    .withMessage('Formato de hora inválido (HH:MM:SS)'),

  body('tiempo_fuera_servicio')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tiempo fuera de servicio debe ser un número positivo')
];

const getByIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de mantenimiento inválido')
];

const getByEquipoValidator = [
  param('idEquipo')
    .isInt({ min: 1 })
    .withMessage('ID de equipo inválido')
];

const getByTecnicoValidator = [
  param('idUsuario')
    .isInt({ min: 1 })
    .withMessage('ID de usuario inválido'),

  query('fecha_inicio')
    .optional()
    .isDate()
    .withMessage('Formato de fecha inicio inválido (YYYY-MM-DD)'),

  query('fecha_fin')
    .optional()
    .isDate()
    .withMessage('Formato de fecha fin inválido (YYYY-MM-DD)')
];

const dateRangeValidator = [
  query('fecha_inicio')
    .optional()
    .isDate()
    .withMessage('Formato de fecha inicio inválido (YYYY-MM-DD)'),

  query('fecha_fin')
    .optional()
    .isDate()
    .withMessage('Formato de fecha fin inválido (YYYY-MM-DD)')
];

module.exports = {
  createMantenimientoValidator,
  updateMantenimientoValidator,
  getByIdValidator,
  getByEquipoValidator,
  getByTecnicoValidator,
  dateRangeValidator
};
