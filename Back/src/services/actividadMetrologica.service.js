const db = require('../models/sequelize');
const { Op } = require('sequelize');

const ActividadMetrologica = db.ActividadMetrologica;
const Equipo = db.Equipo;
const Usuario = db.Usuario;

class ActividadMetrologicaService {

  /**
   * Obtener todas las actividades metrológicas
   */
  async findAll() {
    return await ActividadMetrologica.findAll({
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuarioAprobo' }
      ],
      order: [['añoProgramado', 'DESC'], ['mesProgramado', 'DESC']]
    });
  }

  /**
   * Obtener actividad metrológica por ID
   */
  async findById(id) {
    return await ActividadMetrologica.findByPk(id, {
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuarioAprobo' }
      ]
    });
  }

  /**
   * Crear nueva actividad metrológica
   */
  async create(data) {
    return await ActividadMetrologica.create(data);
  }

  /**
   * Actualizar actividad metrológica
   */
  async update(id, data) {
    const actividad = await ActividadMetrologica.findByPk(id);
    if (!actividad) {
      throw new Error('Actividad metrológica no encontrada');
    }
    return await actividad.update(data);
  }

  /**
   * Eliminar actividad metrológica
   */
  async delete(id) {
    const actividad = await ActividadMetrologica.findByPk(id);
    if (!actividad) {
      throw new Error('Actividad metrológica no encontrada');
    }
    return await actividad.destroy();
  }

  /**
   * Obtener actividades por equipo
   */
  async findByEquipo(equipoId) {
    return await ActividadMetrologica.findAll({
      where: { equipoIdFk: equipoId },
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuarioAprobo' }
      ],
      order: [['añoProgramado', 'DESC'], ['mesProgramado', 'DESC']]
    });
  }

  /**
   * Obtener actividades por periodo
   */
  async findByPeriodo(mes, ano) {
    return await ActividadMetrologica.findAll({
      where: {
        mesProgramado: mes,
        añoProgramado: ano
      },
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuarioAprobo' }
      ]
    });
  }

  /**
   * Obtener actividades pendientes
   */
  async findPendientes() {
    return await ActividadMetrologica.findAll({
      where: { realizado: false },
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuarioAprobo' }
      ],
      order: [['añoProgramado', 'ASC'], ['mesProgramado', 'ASC']]
    });
  }

  /**
   * Obtener actividades realizadas
   */
  async findRealizadas() {
    return await ActividadMetrologica.findAll({
      where: { realizado: true },
      include: [
        { model: Equipo, as: 'equipo' },
        { model: Usuario, as: 'usuarioAprobo' }
      ],
      order: [['fechaRealizado', 'DESC']]
    });
  }

  /**
   * Marcar actividad como realizada
   */
  async marcarRealizada(id, data) {
    const actividad = await ActividadMetrologica.findByPk(id);
    if (!actividad) {
      throw new Error('Actividad metrológica no encontrada');
    }
    return await actividad.update({
      realizado: true,
      fechaRealizado: data.fechaRealizado || new Date(),
      empresa: data.empresa,
      errorMaximoIdentificado: data.errorMaximoIdentificado,
      observaciones: data.observaciones,
      resultado: data.resultado,
      rutaReporte: data.rutaReporte,
      usuarioIdFk: data.usuarioIdFk
    });
  }
}

module.exports = new ActividadMetrologicaService();
