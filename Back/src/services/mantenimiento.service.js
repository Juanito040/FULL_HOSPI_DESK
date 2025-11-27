const db = require('../models/sequelize');
const { Op } = require('sequelize');
const { TIPO_MANTENIMIENTO, TIPO_FALLA } = require('../utils/constants');
const { calcularColorAvance } = require('../utils/dateHelpers');

const MantenimientoPreventivo = db.MantenimientoPreventivo;
const Reporte = db.Reporte;
const Equipo = db.Equipo;
const TipoEquipo = db.TipoEquipo;
const Usuario = db.Usuario;

class MantenimientoService {

  /**
   * Obtener mantenimientos preventivos por técnico, mes y año
   */
  async findByTecnico(idUsuario, mes, ano) {
    return await MantenimientoPreventivo.findAll({
      where: {
        mes: mes,
        ano: ano,
        id_usuario_fk: idUsuario
      },
      include: [
        { model: TipoEquipo, as: 'tipoEquipo' },
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuario' },
        { model: Reporte, as: 'reporte' }
      ]
    });
  }

  /**
   * Obtener mantenimientos preventivos por mes y año (todos)
   */
  async findByFecha(mes, ano) {
    return await MantenimientoPreventivo.findAll({
      where: { mes: mes, ano: ano },
      include: [
        { model: TipoEquipo, as: 'tipoEquipo' },
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuario' },
        { model: Reporte, as: 'reporte' }
      ]
    });
  }

  /**
   * Obtener indicadores de mantenimientos correctivos
   */
  async getMantenimientosCorrectivos(fechaInicio, fechaFin) {
    return await Reporte.findAll({
      where: {
        fechaRealizado: { [Op.between]: [fechaInicio, fechaFin] },
        tipoMantenimiento: TIPO_MANTENIMIENTO.CORRECTIVO
      },
      include: [{ model: Equipo, as: 'equipo' }]
    });
  }

  /**
   * Contar mantenimientos por tipo
   */
  async contarPorTipo(tipo, fechaInicio, fechaFin) {
    return await Reporte.count({
      where: {
        fechaRealizado: { [Op.between]: [fechaInicio, fechaFin] },
        tipoMantenimiento: tipo
      }
    });
  }

  /**
   * Contar mantenimientos por tipo de falla
   */
  async contarPorTipoFalla(tipoFalla, fechaInicio, fechaFin) {
    return await Reporte.count({
      where: {
        fechaRealizado: { [Op.between]: [fechaInicio, fechaFin] },
        tipoFalla: tipoFalla
      }
    });
  }

  /**
   * Obtener todos los técnicos y auxiliares biomédicos
   */
  async getTecnicosAuxiliares() {
    try {
      const results = await db.sequelize.query(
        'SELECT id, nombres, apellidos, email FROM usuario',
        { type: db.Sequelize.QueryTypes.SELECT }
      );
      return results;
    } catch (error) {
      console.error('Error getTecnicosAuxiliares:', error.message);
      return [];
    }
  }

  /**
   * Calcular estadísticas de mantenimientos preventivos
   */
  async calcularEstadisticas(mantenimientos, diaInicio, diaFin) {
    let hechos = 0;
    let sinRealizar = 0;
    let tiempoTotal = 0;
    let tiempoRealizado = 0;
    let tiempoFaltante = 0;
    const mttosHechos = [];
    const mttosSinRealizar = [];
    const mttosFiltrados = [];

    for (const mtto of mantenimientos) {
      const dias = mtto.dias ? mtto.dias.split('-') : [];

      for (let dia = diaInicio; dia <= diaFin; dia++) {
        if (parseInt(dias[0]) === dia) {
          const tiempoMinutos = mtto.tipoEquipo?.tiempo_minutos || 0;
          tiempoTotal += tiempoMinutos;
          mttosFiltrados.push(mtto);

          if (mtto.reporte?.rutaPdf) {
            hechos++;
            tiempoRealizado += tiempoMinutos;
            mttosHechos.push(mtto);
          } else {
            sinRealizar++;
            tiempoFaltante += tiempoMinutos;
            mttosSinRealizar.push(mtto);
          }
        }
      }
    }

    const porcentaje = mttosFiltrados.length > 0
      ? (hechos / mttosFiltrados.length) * 100
      : 0;

    const advanceColor = calcularColorAvance(porcentaje);

    return {
      hechos,
      sinRealizar,
      tiempoTotal,
      tiempoRealizado,
      tiempoFaltante,
      mttosHechos,
      mttosSinRealizar,
      mttosFiltrados,
      porcentaje,
      advanceColor
    };
  }

  /**
   * Obtener indicadores de reportes
   */
  async getIndicadores(fechaInicio, fechaFin) {
    return {
      correctivos: await this.contarPorTipo(TIPO_MANTENIMIENTO.CORRECTIVO, fechaInicio, fechaFin),
      preventivos: await this.contarPorTipo(TIPO_MANTENIMIENTO.PREVENTIVO, fechaInicio, fechaFin),
      predictivos: await this.contarPorTipo(TIPO_MANTENIMIENTO.PREDICTIVO, fechaInicio, fechaFin),
      otros: await this.contarPorTipo(TIPO_MANTENIMIENTO.OTRO, fechaInicio, fechaFin),

      // Tipos de falla
      desgaste: await this.contarPorTipoFalla(TIPO_FALLA.DESGASTE, fechaInicio, fechaFin),
      operacionIndebida: await this.contarPorTipoFalla(TIPO_FALLA.OPERACION_INDEBIDA, fechaInicio, fechaFin),
      causaExterna: await this.contarPorTipoFalla(TIPO_FALLA.CAUSA_EXTERNA, fechaInicio, fechaFin),
      accesorios: await this.contarPorTipoFalla(TIPO_FALLA.ACCESORIOS, fechaInicio, fechaFin),
      desconocido: await this.contarPorTipoFalla(TIPO_FALLA.DESCONOCIDO, fechaInicio, fechaFin),
      sinFallas: await this.contarPorTipoFalla(TIPO_FALLA.SIN_FALLAS, fechaInicio, fechaFin),
      otrosFallas: await this.contarPorTipoFalla(TIPO_FALLA.OTROS, fechaInicio, fechaFin)
    };
  }
}

module.exports = new MantenimientoService();
