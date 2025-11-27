const reporteService = require('../services/reporte.service');
const { validationResult } = require('express-validator');

class ReporteController {

  /**
   * POST /api/reportes
   * Crear un nuevo reporte
   */
  async crearReporte(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { idEquipo, ...datosReporte } = req.body;
      const reporte = await reporteService.crearReporte(datosReporte, idEquipo);

      res.status(201).json({
        success: true,
        message: 'Reporte creado correctamente',
        data: reporte
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reportes/:id
   * Obtener un reporte por ID
   */
  async obtenerReporte(req, res, next) {
    try {
      const { id } = req.params;
      const { reporte, mantenimientoMSV } = await reporteService.obtenerReporteCompleto(id);

      res.json({
        success: true,
        data: {
          reporte,
          mantenimientoMSV
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/reportes/:id
   * Actualizar un reporte
   */
  async actualizarReporte(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const reporte = await reporteService.actualizarReporte(id, req.body);

      res.json({
        success: true,
        message: 'Reporte actualizado correctamente',
        data: reporte
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/reportes/:id
   * Eliminar un reporte
   */
  async eliminarReporte(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await reporteService.eliminarReporte(id);

      res.json({
        success: true,
        message: resultado.mensaje
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reportes/equipo/:idEquipo
   * Obtener reportes por equipo
   */
  async obtenerReportesPorEquipo(req, res, next) {
    try {
      const { idEquipo } = req.params;
      const reportes = await reporteService.obtenerReportesPorEquipo(idEquipo);

      res.json({
        success: true,
        data: reportes,
        count: reportes.length
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReporteController();
