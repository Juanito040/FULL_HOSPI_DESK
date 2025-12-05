const sysmantenimientoService = require('../services/sysmantenimiento.service');
const { validationResult } = require('express-validator');
const {
  getAllTiposMantenimiento,
  getAllTiposFalla
} = require('../utils/sysConstants');

class SysMantenimientoController {

  /**
   * GET /api/sysmantenimiento/dashboard
   * Obtener dashboard con estadísticas
   */
  async getDashboard(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      // Si no se proporcionan fechas, usar el mes actual
      let fechaInicio = fecha_inicio;
      let fechaFin = fecha_fin;

      if (!fechaInicio || !fechaFin) {
        const hoy = new Date();
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
          .toISOString().split('T')[0];
        fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
          .toISOString().split('T')[0];
      }

      const dashboard = await sysmantenimientoService.getDashboard(fechaInicio, fechaFin);

      res.json({
        success: true,
        data: {
          ...dashboard,
          fechaInicio,
          fechaFin
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento
   * Obtener todos los mantenimientos con filtros
   */
  async getAll(req, res, next) {
    try {
      const filters = {
        id_sysequipo_fk: req.query.id_equipo,
        tipo_mantenimiento: req.query.tipo_mantenimiento,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin
      };

      const mantenimientos = await sysmantenimientoService.findAll(filters);

      res.json({
        success: true,
        count: mantenimientos.length,
        data: mantenimientos
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/:id
   * Obtener un mantenimiento por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const mantenimiento = await sysmantenimientoService.findById(id);

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado'
        });
      }

      res.json({
        success: true,
        data: mantenimiento
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/equipo/:idEquipo
   * Obtener mantenimientos de un equipo
   */
  async getByEquipo(req, res, next) {
    try {
      const { idEquipo } = req.params;
      const mantenimientos = await sysmantenimientoService.findByEquipo(idEquipo);

      res.json({
        success: true,
        count: mantenimientos.length,
        data: mantenimientos
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/tecnico/:idUsuario
   * Obtener mantenimientos realizados por un técnico
   */
  async getByTecnico(req, res, next) {
    try {
      const { idUsuario } = req.params;
      const { fecha_inicio, fecha_fin } = req.query;

      const mantenimientos = await sysmantenimientoService.findByTecnico(
        idUsuario,
        fecha_inicio,
        fecha_fin
      );

      res.json({
        success: true,
        count: mantenimientos.length,
        data: mantenimientos
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/sysmantenimiento
   * Crear un nuevo mantenimiento
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

      const mantenimiento = await sysmantenimientoService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Mantenimiento creado exitosamente',
        data: mantenimiento
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/sysmantenimiento/:id
   * Actualizar un mantenimiento
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
      const mantenimiento = await sysmantenimientoService.update(id, req.body);

      res.json({
        success: true,
        message: 'Mantenimiento actualizado exitosamente',
        data: mantenimiento
      });

    } catch (error) {
      if (error.message === 'Mantenimiento no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/sysmantenimiento/:id
   * Eliminar un mantenimiento
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await sysmantenimientoService.delete(id);

      res.json({
        success: true,
        message: 'Mantenimiento eliminado exitosamente'
      });

    } catch (error) {
      if (error.message === 'Mantenimiento no encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/estadisticas/tipo
   * Obtener estadísticas por tipo de mantenimiento
   */
  async getEstadisticasTipo(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const estadisticas = await sysmantenimientoService.getEstadisticasPorTipo(
        fecha_inicio,
        fecha_fin
      );

      res.json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/estadisticas/falla
   * Obtener estadísticas por tipo de falla
   */
  async getEstadisticasFalla(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const estadisticas = await sysmantenimientoService.getEstadisticasPorFalla(
        fecha_inicio,
        fecha_fin
      );

      res.json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/catalogos/tipos-mantenimiento
   * Obtener catálogo de tipos de mantenimiento
   */
  async getCatalogoTiposMantenimiento(req, res, next) {
    try {
      const tipos = getAllTiposMantenimiento();

      res.json({
        success: true,
        data: tipos
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sysmantenimiento/catalogos/tipos-falla
   * Obtener catálogo de tipos de falla
   */
  async getCatalogoTiposFalla(req, res, next) {
    try {
      const tipos = getAllTiposFalla();

      res.json({
        success: true,
        data: tipos
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SysMantenimientoController();
