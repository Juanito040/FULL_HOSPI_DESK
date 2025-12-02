const express = require('express');
const actividadMetrologicaController = require('../controllers/actividadMetrologica.controller');
const {
  createActividadValidator,
  updateActividadValidator,
  marcarRealizadaValidator,
  getPeriodoValidator
} = require('../middlewares/validators/actividadMetrologica.validator');

const router = express.Router();

/**
 * RUTAS DE ACTIVIDADES METROLÓGICAS
 * Gestión de calibraciones, calificaciones, validaciones y confirmaciones metrológicas
 */

// GET - Rutas específicas ANTES que las genéricas
router.get('/actividad-metrologica/pendientes', actividadMetrologicaController.getPendientes);
router.get('/actividad-metrologica/realizadas', actividadMetrologicaController.getRealizadas);
router.get('/actividad-metrologica/periodo/:mes/:ano', getPeriodoValidator, actividadMetrologicaController.getByPeriodo);
router.get('/actividad-metrologica/equipo/:equipoId', actividadMetrologicaController.getByEquipo);

// GET - Rutas genéricas
router.get('/actividad-metrologica/:id', actividadMetrologicaController.getById);
router.get('/actividad-metrologica', actividadMetrologicaController.getAll);

// POST - Crear actividad metrológica
router.post('/actividad-metrologica', createActividadValidator, actividadMetrologicaController.create);

// PUT - Actualizar actividad metrológica
router.put('/actividad-metrologica/:id/realizar', marcarRealizadaValidator, actividadMetrologicaController.marcarRealizada);
router.put('/actividad-metrologica/:id', updateActividadValidator, actividadMetrologicaController.update);

// DELETE - Eliminar actividad metrológica
router.delete('/actividad-metrologica/:id', actividadMetrologicaController.delete);

module.exports = router;
