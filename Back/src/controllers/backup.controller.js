const backupService = require('../services/backup.service');

class BackupController {
  /**
   * GET /api/backup
   * Obtener todos los backups
   */
  async getAll(req, res, next) {
    try {
      const backups = await backupService.getAll();
      res.json({
        success: true,
        data: backups,
        count: backups.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/backups/:id
   * Obtener un backup por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const backup = await backupService.getById(id);

      res.json({
        success: true,
        data: backup
      });
    } catch (error) {
      if (error.message === 'Backup no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/backup
   * Crear un nuevo backup
   */
  async create(req, res, next) {
    try {
      const backup = await backupService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Backup creado exitosamente',
        data: backup
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/backups/:id
   * Actualizar un backup
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const backup = await backupService.update(id, req.body);

      res.json({
        success: true,
        message: 'Backup actualizado exitosamente',
        data: backup
      });
    } catch (error) {
      if (error.message === 'Backup no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/backups/:id
   * Eliminar un backup
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await backupService.delete(id);

      res.json({
        success: true,
        message: 'Backup eliminado exitosamente'
      });
    } catch (error) {
      if (error.message === 'Backup no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/backup/usuario/:usuarioId
   * Obtener backups por usuario
   */
  async getByUsuario(req, res, next) {
    try {
      const { usuarioId } = req.params;
      const backups = await backupService.getByUsuario(usuarioId);

      res.json({
        success: true,
        data: backups,
        count: backups.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/backup/rango
   * Obtener backups por rango de fechas
   * Query params: inicio=YYYY-MM-DD, fin=YYYY-MM-DD, limit=100, offset=0
   */
  async getByRango(req, res, next) {
    try {
      const { inicio, fin, limit = 100, offset = 0 } = req.query;

      if (!inicio || !fin) {
        return res.status(400).json({
          success: false,
          message: 'Debe suministrar fechas "inicio" y "fin" en formato YYYY-MM-DD'
        });
      }

      const backups = await backupService.getByRango(inicio, fin, limit, offset);

      res.json({
        success: true,
        data: backups,
        count: backups.length
      });
    } catch (error) {
      if (error.message.includes('Formato de fecha inválido')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/backup/pendientes
   * Obtener lista de backups pendientes
   */
  async getPendingBackups(req, res, next) {
    try {
      const pendientes = await backupService.getPendingBackups();

      if (pendientes.length === 0) {
        return res.json({
          success: true,
          message: 'No hay backups pendientes',
          data: []
        });
      }

      res.json({
        success: true,
        data: pendientes,
        count: pendientes.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/backup/pendientes/:id
   * Obtener detalle de backups pendientes por ID
   */
  async getPendingBackupsDetail(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await backupService.getPendingBackupsDetail(id);

      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BackupController();
