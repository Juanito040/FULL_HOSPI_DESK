const express = require('express');
const router = express.Router();
const sysmantenimientoController = require('../controllers/sysmantenimiento.controller');
const {
  createMantenimientoValidator,
  updateMantenimientoValidator,
  getByIdValidator,
  getByEquipoValidator,
  getByTecnicoValidator,
  dateRangeValidator
} = require('../middlewares/validators/sysmantenimiento.validator');

// Dashboard y estadísticas
router.get('/dashboard', sysmantenimientoController.getDashboard);
router.get('/estadisticas/tipo', dateRangeValidator, sysmantenimientoController.getEstadisticasTipo);
router.get('/estadisticas/falla', dateRangeValidator, sysmantenimientoController.getEstadisticasFalla);

// CRUD básico
router.get('/', sysmantenimientoController.getAll);
router.get('/:id', getByIdValidator, sysmantenimientoController.getById);
router.post('/', createMantenimientoValidator, sysmantenimientoController.create);
router.put('/:id', updateMantenimientoValidator, sysmantenimientoController.update);
router.delete('/:id', getByIdValidator, sysmantenimientoController.delete);

// Consultas específicas
router.get('/equipo/:idEquipo', getByEquipoValidator, sysmantenimientoController.getByEquipo);
router.get('/tecnico/:idUsuario', getByTecnicoValidator, sysmantenimientoController.getByTecnico);

module.exports = router;
