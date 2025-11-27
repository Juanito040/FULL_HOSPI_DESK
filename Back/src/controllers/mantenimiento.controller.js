const mantenimientoService = require('../services/mantenimiento.service');
const { validationResult } = require('express-validator');
const { getPrimerDiaMes, getFechaActual, parseDateRange } = require('../utils/dateHelpers');

class MantenimientoController {

  /**
   * GET /api/mantenimiento
   * Obtener dashboard de mantenimientos del mes actual
   */
  async getDashboard(req, res, next) {
    try {
      const hoy = new Date();
      const fechaInicio = getPrimerDiaMes();
      const fechaFin = getFechaActual();

      // Obtener mantenimientos preventivos del mes actual
      const mantenimientos = await mantenimientoService.findByFecha(
        hoy.getMonth() + 1,
        hoy.getFullYear()
      );

      // Calcular estadísticas
      const estadisticas = await mantenimientoService.calcularEstadisticas(
        mantenimientos,
        1,
        31
      );

      // Obtener indicadores
      const indicadores = await mantenimientoService.getIndicadores(
        fechaInicio,
        fechaFin
      );

      // Obtener técnicos
      const tecnicos = await mantenimientoService.getTecnicosAuxiliares();

      res.json({
        success: true,
        data: {
          ...estadisticas,
          indicadores,
          mantenimientos: estadisticas.mttosFiltrados,
          tecnicos,
          fechaInicio,
          fechaFin,
          totalmtto: estadisticas.mttosFiltrados.length
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/mantenimiento/filtrar
   * Filtrar mantenimientos por rango de fechas y técnico
   */
  async filtrarMantenimientos(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { daterange, usuarioprogramado } = req.body;

      // Parsear rango de fechas (formato: MM/DD/YYYY - MM/DD/YYYY)
      const { fechaInicio, fechaFin, mes1, dia1, ano1, mes2, dia2, ano2 } = parseDateRange(daterange);

      // Obtener mantenimientos
      let mantenimientos1 = [];
      let mantenimientos2 = [];

      if (usuarioprogramado && usuarioprogramado !== 1) {
        mantenimientos1 = await mantenimientoService.findByTecnico(usuarioprogramado, mes1, ano1);
        if (mes1 !== mes2) {
          mantenimientos2 = await mantenimientoService.findByTecnico(usuarioprogramado, mes2, ano2);
        }
      } else {
        mantenimientos1 = await mantenimientoService.findByFecha(mes1, ano1);
        if (mes1 !== mes2) {
          mantenimientos2 = await mantenimientoService.findByFecha(mes2, ano2);
        }
      }

      const todosMantenimientos = [...mantenimientos1, ...mantenimientos2];

      // Calcular estadísticas
      const estadisticas = await mantenimientoService.calcularEstadisticas(
        todosMantenimientos,
        dia1,
        mes1 === mes2 ? dia2 : 31
      );

      // Obtener indicadores
      const indicadores = await mantenimientoService.getIndicadores(
        fechaInicio,
        fechaFin
      );

      // Obtener técnicos
      const tecnicos = await mantenimientoService.getTecnicosAuxiliares();

      res.json({
        success: true,
        data: {
          ...estadisticas,
          indicadores,
          mantenimientos: estadisticas.mttosFiltrados,
          tecnicos,
          fechaInicio,
          fechaFin,
          totalmtto: estadisticas.mttosFiltrados.length
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mantenimiento/preventivos/:mes/:ano
   * Obtener mantenimientos preventivos por mes y año
   */
  async getPreventivos(req, res, next) {
    try {
      const { mes, ano } = req.params;
      const mantenimientos = await mantenimientoService.findByFecha(
        parseInt(mes),
        parseInt(ano)
      );

      res.json({
        success: true,
        data: mantenimientos,
        count: mantenimientos.length
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mantenimiento/tecnicos
   * Obtener lista de técnicos
   */
  async getTecnicos(req, res, next) {
    try {
      const tecnicos = await mantenimientoService.getTecnicosAuxiliares();
      res.json({
        success: true,
        data: tecnicos
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MantenimientoController();
