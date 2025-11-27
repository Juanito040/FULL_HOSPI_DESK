const db = require('../models/sequelize');
const { Op } = require('sequelize');

const SysMantenimiento = db.SysMantenimiento;
const SysEquipo = db.SysEquipo;
const SysHojaVida = db.SysHojaVida;
const Usuario = db.Usuario;
const TipoEquipo = db.TipoEquipo;
const Servicio = db.Servicio;

class SysMantenimientoService {

  /**
   * Crear un nuevo mantenimiento
   */
  async create(data) {
    return await SysMantenimiento.create(data);
  }

  /**
   * Obtener todos los mantenimientos con filtros opcionales
   */
  async findAll(filters = {}) {
    const where = {};

    if (filters.id_sysequipo_fk) {
      where.id_sysequipo_fk = filters.id_sysequipo_fk;
    }

    if (filters.tipo_mantenimiento) {
      where.tipo_mantenimiento = filters.tipo_mantenimiento;
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      where.fecha = {
        [Op.between]: [filters.fecha_inicio, filters.fecha_fin]
      };
    }

    return await SysMantenimiento.findAll({
      where,
      include: [
        {
          model: SysEquipo,
          as: 'equipo',
          include: [
            { model: TipoEquipo, as: 'tipoEquipo' },
            { model: Servicio, as: 'servicio' },
            { model: SysHojaVida, as: 'hojaVida' }
          ]
        },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['fecha', 'DESC'], ['createdAt', 'DESC']]
    });
  }

  /**
   * Obtener un mantenimiento por ID
   */
  async findById(id) {
    return await SysMantenimiento.findByPk(id, {
      include: [
        {
          model: SysEquipo,
          as: 'equipo',
          include: [
            { model: TipoEquipo, as: 'tipoEquipo' },
            { model: Servicio, as: 'servicio' },
            { model: SysHojaVida, as: 'hojaVida' }
          ]
        },
        { model: Usuario, as: 'usuario' }
      ]
    });
  }

  /**
   * Obtener mantenimientos por equipo
   */
  async findByEquipo(idEquipo) {
    return await SysMantenimiento.findAll({
      where: { id_sysequipo_fk: idEquipo },
      include: [
        { model: SysEquipo, as: 'equipo' },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['fecha', 'DESC']]
    });
  }

  /**
   * Obtener mantenimientos por rango de fechas
   */
  async findByDateRange(fechaInicio, fechaFin) {
    return await SysMantenimiento.findAll({
      where: {
        fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      },
      include: [
        {
          model: SysEquipo,
          as: 'equipo',
          include: [
            { model: TipoEquipo, as: 'tipoEquipo' },
            { model: Servicio, as: 'servicio' }
          ]
        },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['fecha', 'DESC']]
    });
  }

  /**
   * Obtener mantenimientos por técnico
   */
  async findByTecnico(idUsuario, fechaInicio = null, fechaFin = null) {
    const where = { id_sysusuario_fk: idUsuario };

    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }

    return await SysMantenimiento.findAll({
      where,
      include: [
        {
          model: SysEquipo,
          as: 'equipo',
          include: [
            { model: TipoEquipo, as: 'tipoEquipo' },
            { model: Servicio, as: 'servicio' }
          ]
        },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['fecha', 'DESC']]
    });
  }

  /**
   * Actualizar un mantenimiento
   */
  async update(id, data) {
    const mantenimiento = await SysMantenimiento.findByPk(id);

    if (!mantenimiento) {
      throw new Error('Mantenimiento no encontrado');
    }

    return await mantenimiento.update(data);
  }

  /**
   * Eliminar un mantenimiento
   */
  async delete(id) {
    const mantenimiento = await SysMantenimiento.findByPk(id);

    if (!mantenimiento) {
      throw new Error('Mantenimiento no encontrado');
    }

    return await mantenimiento.destroy();
  }

  /**
   * Obtener estadísticas de mantenimientos por tipo
   */
  async getEstadisticasPorTipo(fechaInicio, fechaFin) {
    const where = {};

    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }

    const correctivos = await SysMantenimiento.count({
      where: { ...where, tipo_mantenimiento: 'Correctivo' }
    });

    const preventivos = await SysMantenimiento.count({
      where: { ...where, tipo_mantenimiento: 'Preventivo' }
    });

    const predictivos = await SysMantenimiento.count({
      where: { ...where, tipo_mantenimiento: 'Predictivo' }
    });

    const otros = await SysMantenimiento.count({
      where: { ...where, tipo_mantenimiento: 'Otro' }
    });

    const total = correctivos + preventivos + predictivos + otros;

    return {
      correctivos,
      preventivos,
      predictivos,
      otros,
      total
    };
  }

  /**
   * Obtener estadísticas de mantenimientos por tipo de falla
   */
  async getEstadisticasPorFalla(fechaInicio, fechaFin) {
    const where = {};

    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }

    const desgaste = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Desgaste' }
    });

    const operacionIndebida = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Operación Indebida' }
    });

    const causaExterna = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Causa Externa' }
    });

    const accesorios = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Accesorios' }
    });

    const desconocido = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Desconocido' }
    });

    const sinFalla = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Sin Falla' }
    });

    const otrosFallas = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'Otros' }
    });

    const noRegistra = await SysMantenimiento.count({
      where: { ...where, tipo_falla: 'No Registra' }
    });

    return {
      desgaste,
      operacionIndebida,
      causaExterna,
      accesorios,
      desconocido,
      sinFalla,
      otros: otrosFallas,
      noRegistra
    };
  }

  /**
   * Obtener tiempo total fuera de servicio
   */
  async getTiempoFueraServicio(fechaInicio, fechaFin) {
    const where = {};

    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }

    const result = await SysMantenimiento.findAll({
      where,
      attributes: [
        [db.sequelize.fn('SUM', db.sequelize.col('tiempo_fuera_servicio')), 'total']
      ]
    });

    return result[0]?.dataValues?.total || 0;
  }

  /**
   * Obtener equipos con más mantenimientos
   */
  async getEquiposConMasMantenimientos(limite = 10, fechaInicio = null, fechaFin = null) {
    const where = {};

    if (fechaInicio && fechaFin) {
      where.fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }

    const result = await SysMantenimiento.findAll({
      where,
      attributes: [
        'id_sysequipo_fk',
        [db.sequelize.fn('COUNT', db.sequelize.col('id_sysmtto')), 'total']
      ],
      include: [
        {
          model: SysEquipo,
          as: 'equipo',
          attributes: ['id_sysequipo', 'nombre_equipo', 'marca', 'modelo', 'placa_inventario']
        }
      ],
      group: ['id_sysequipo_fk'],
      order: [[db.sequelize.literal('total'), 'DESC']],
      limit: limite
    });

    return result;
  }

  /**
   * Obtener dashboard con todas las estadísticas
   */
  async getDashboard(fechaInicio, fechaFin) {
    const [
      estadisticasTipo,
      estadisticasFalla,
      tiempoFueraServicio,
      equiposConMasMantenimientos,
      mantenimientosRecientes
    ] = await Promise.all([
      this.getEstadisticasPorTipo(fechaInicio, fechaFin),
      this.getEstadisticasPorFalla(fechaInicio, fechaFin),
      this.getTiempoFueraServicio(fechaInicio, fechaFin),
      this.getEquiposConMasMantenimientos(10, fechaInicio, fechaFin),
      this.findByDateRange(fechaInicio, fechaFin)
    ]);

    return {
      estadisticasTipo,
      estadisticasFalla,
      tiempoFueraServicio,
      equiposConMasMantenimientos,
      mantenimientosRecientes: mantenimientosRecientes.slice(0, 20)
    };
  }
}

module.exports = new SysMantenimientoService();
