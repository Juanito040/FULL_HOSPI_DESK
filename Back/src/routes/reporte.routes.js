const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const {
  crearReporteValidator,
  actualizarReporteValidator,
  idValidator
} = require('../middlewares/validators/reporte.validator');

// Crear un nuevo reporte de mantenimiento
router.post('/', crearReporteValidator, reporteController.crearReporte);

// Obtener un reporte por ID
router.get('/:id', idValidator, reporteController.obtenerReporte);

// Actualizar un reporte
router.put('/:id', actualizarReporteValidator, reporteController.actualizarReporte);

// Eliminar un reporte
router.delete('/:id', idValidator, reporteController.eliminarReporte);

// Obtener todos los reportes de un equipo
router.get('/equipo/:idEquipo', reporteController.obtenerReportesPorEquipo);

module.exports = router;
