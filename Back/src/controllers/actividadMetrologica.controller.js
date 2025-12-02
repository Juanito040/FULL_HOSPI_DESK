const actividadMetrologicaService = require('../services/actividadMetrologica.service');
const { validationResult } = require('express-validator');

class ActividadMetrologicaController {

  /**
   * GET /api/actividad-metrologica
   * Obtener todas las actividades metrológicas
   */
  async getAll(req, res, next) {
    try {
      const actividades = await actividadMetrologicaService.findAll();
      res.json({
        success: true,
        data: actividades,
        count: actividades.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/actividad-metrologica/:id
   * Obtener actividad metrológica por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const actividad = await actividadMetrologicaService.findById(id);

      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'Actividad metrológica no encontrada'
        });
      }

      res.json({
        success: true,
        data: actividad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/actividad-metrologica
   * Crear nueva actividad metrológica
   */
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const actividad = await actividadMetrologicaService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Actividad metrológica creada exitosamente',
        data: actividad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/actividad-metrologica/:id
   * Actualizar actividad metrológica
   */
  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const actividad = await actividadMetrologicaService.update(id, req.body);

      res.json({
        success: true,
        message: 'Actividad metrológica actualizada exitosamente',
        data: actividad
      });
    } catch (error) {
      if (error.message === 'Actividad metrológica no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/actividad-metrologica/:id
   * Eliminar actividad metrológica
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await actividadMetrologicaService.delete(id);

      res.json({
        success: true,
        message: 'Actividad metrológica eliminada exitosamente'
      });
    } catch (error) {
      if (error.message === 'Actividad metrológica no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/actividad-metrologica/equipo/:equipoId
   * Obtener actividades por equipo
   */
  async getByEquipo(req, res, next) {
    try {
      const { equipoId } = req.params;
      const actividades = await actividadMetrologicaService.findByEquipo(equipoId);

      res.json({
        success: true,
        data: actividades,
        count: actividades.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/actividad-metrologica/periodo/:mes/:ano
   * Obtener actividades por periodo
   */
  async getByPeriodo(req, res, next) {
    try {
      const { mes, ano } = req.params;
      const actividades = await actividadMetrologicaService.findByPeriodo(
        parseInt(mes),
        parseInt(ano)
      );

      res.json({
        success: true,
        data: actividades,
        count: actividades.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/actividad-metrologica/pendientes
   * Obtener actividades pendientes
   */
  async getPendientes(req, res, next) {
    try {
      const actividades = await actividadMetrologicaService.findPendientes();

      res.json({
        success: true,
        data: actividades,
        count: actividades.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/actividad-metrologica/realizadas
   * Obtener actividades realizadas
   */
  async getRealizadas(req, res, next) {
    try {
      const actividades = await actividadMetrologicaService.findRealizadas();

      res.json({
        success: true,
        data: actividades,
        count: actividades.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/actividad-metrologica/:id/realizar
   * Marcar actividad como realizada
   */
  async marcarRealizada(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const actividad = await actividadMetrologicaService.marcarRealizada(id, req.body);

      res.json({
        success: true,
        message: 'Actividad marcada como realizada',
        data: actividad
      });
    } catch (error) {
      if (error.message === 'Actividad metrológica no encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }
}

module.exports = new ActividadMetrologicaController();
