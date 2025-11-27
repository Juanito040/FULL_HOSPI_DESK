const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimiento.controller');
const {
  filtrarMantenimientosValidator,
  getPreventivoValidator
} = require('../middlewares/validators/mantenimiento.validator');

// Dashboard de mantenimientos del mes actual
router.get('/', mantenimientoController.getDashboard);

// Filtrar mantenimientos por fechas y técnico
router.post('/filtrar', filtrarMantenimientosValidator, mantenimientoController.filtrarMantenimientos);

// Obtener mantenimientos preventivos por mes y año
router.get('/preventivos/:mes/:ano', getPreventivoValidator, mantenimientoController.getPreventivos);

// Obtener lista de técnicos disponibles
router.get('/tecnicos', mantenimientoController.getTecnicos);

module.exports = router;
