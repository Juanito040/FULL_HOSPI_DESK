const db = require('../models/sequelize');
const { Op } = require('sequelize');

const Reporte = db.Reporte;
const SysEquipo = db.SysEquipo;
const MantenimientoPreventivo = db.MantenimientoPreventivo;
const ProtocoloPreventivo = db.ProtocoloPreventivo;
const MantenimientoMSV = db.MantenimientoMSV;

class ReporteService {

  /**
   * Crear un nuevo reporte
   */
  async crearReporte(datosReporte, idEquipo) {
    const equipo = await SysEquipo.findByPk(idEquipo);

    if (!equipo) {
      throw new Error('Equipo de sistemas no encontrado');
    }

    // Calcular total de horas
    const horaInicio = new Date(`1970-01-01T${datosReporte.horaInicio}`);
    const horaFin = new Date(`1970-01-01T${datosReporte.horaTerminacion}`);
    const diffMs = horaFin - horaInicio;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalHoras = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:00`;

    // Obtener último ID de reporte para generar número
    const ultimoReporte = await Reporte.findOne({
      order: [['id', 'DESC']]
    });

    const numeroReporte = ultimoReporte
      ? (ultimoReporte.id + 20001).toString()
      : '20001';

    const reporte = await Reporte.create({
      ...datosReporte,
      horaTotal: totalHoras,
      numeroReporte: numeroReporte,
      equipoIdFk: idEquipo
    });

    return reporte;
  }

  /**
   * Obtener reporte por ID con todas las relaciones
   */
  async obtenerReporteCompleto(idReporte) {
    const reporte = await Reporte.findByPk(idReporte, {
      include: [
        {
          model: SysEquipo,
          as: 'sysequipo',
          include: [{ model: db.TipoEquipo, as: 'tipoEquipo' }]
        }
      ]
    });

    if (!reporte) {
      throw new Error('Reporte no encontrado');
    }

    // Buscar datos MSV si aplica
    let mantenimientoMSV = null;
    if (reporte.equipo?.tipoEquipo?.id === 9 && reporte.tipoMantenimiento === 3) {
      mantenimientoMSV = await MantenimientoMSV.findOne({
        where: {
          id_equipo_fk: reporte.equipo.id
        }
      });
    }

    return {
      reporte,
      mantenimientoMSV
    };
  }

  /**
   * Actualizar reporte
   */
  async actualizarReporte(idReporte, datosActualizados) {
    const reporte = await Reporte.findByPk(idReporte);

    if (!reporte) {
      throw new Error('Reporte no encontrado');
    }

    // Recalcular total de horas si se actualizan las horas
    if (datosActualizados.horaInicio || datosActualizados.horaTerminacion) {
      const horaInicio = new Date(`1970-01-01T${datosActualizados.horaInicio || reporte.horaInicio}`);
      const horaFin = new Date(`1970-01-01T${datosActualizados.horaTerminacion || reporte.horaTerminacion}`);
      const diffMs = horaFin - horaInicio;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      datosActualizados.horaTotal = `${String(diffHours).padStart(2, '0')}:${String(diffMinutes).padStart(2, '0')}:00`;
    }

    await reporte.update(datosActualizados);
    return reporte;
  }

  /**
   * Obtener reportes por equipo
   */
  async obtenerReportesPorEquipo(idEquipo) {
    return await Reporte.findAll({
      where: { equipoIdFk: idEquipo },
      order: [['fecha', 'DESC']]
    });
  }

  /**
   * Eliminar reporte
   */
  async eliminarReporte(idReporte) {
    const reporte = await Reporte.findByPk(idReporte);

    if (!reporte) {
      throw new Error('Reporte no encontrado');
    }

    await reporte.destroy();
    return { mensaje: 'Reporte eliminado correctamente' };
  }
}

module.exports = new ReporteService();
