const express = require('express');
const backupController = require('../controllers/backup.controller');

const router = express.Router();

/**
 * RUTAS DE BACKUPS
 * Todas las rutas de gestión de backups (reportes de respaldo)
 * NOTA: Las rutas específicas DEBEN ir antes que las genéricas con parámetros
 */

// GET - Rutas específicas ANTES que las genéricas
router.get('/backup/pendientes', backupController.getPendingBackups);
router.get('/backup/rango', backupController.getByRango);

// GET - Rutas con parámetros específicos
router.get('/backup/pendientes/:id', backupController.getPendingBackupsDetail);
router.get('/backup/usuario/:usuarioId', backupController.getByUsuario);

// GET - Rutas genéricas DESPUÉS
router.get('/backups/:id', backupController.getById);
router.get('/backups', backupController.getAll);

// POST - Crear un nuevo backup
router.post('/backup', backupController.create);

// PUT - Actualizar un backup
router.put('/backup/:id', backupController.update);

// DELETE - Eliminar un backup
router.delete('/backup/:id', backupController.delete);

module.exports = router;
