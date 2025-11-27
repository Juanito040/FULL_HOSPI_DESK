const db = require('../models/sequelize');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Obtener todas las hojas de vida
const getAllSysHojasVida = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      id_sysequipo_fk,
      search,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    // Construir condiciones WHERE
    const where = {};

    // Filtrar por equipo
    if (id_sysequipo_fk) {
      where.id_sysequipo_fk = id_sysequipo_fk;
    }

    // Búsqueda general
    if (search) {
      where[Op.or] = [
        { ip: { [Op.like]: `%${search}%` } },
        { mac: { [Op.like]: `%${search}%` } },
        { procesador: { [Op.like]: `%${search}%` } },
        { sistema_operativo: { [Op.like]: `%${search}%` } },
        { nombre_usuario: { [Op.like]: `%${search}%` } },
        { vendedor: { [Op.like]: `%${search}%` } }
      ];
    }

    // Calcular offset para paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Consultar hojas de vida con paginación
    const { count, rows: hojasVida } = await db.SysHojaVida.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [[sortBy, order]],
      include: [
        {
          model: db.SysEquipo,
          as: 'equipo',
          attributes: [
            'id_sysequipo',
            'nombre_equipo',
            'marca',
            'modelo',
            'serie',
            'placa_inventario',
            'ubicacion'
          ],
          include: [
            {
              model: db.Servicio,
              as: 'servicio',
              attributes: ['id', 'nombres', 'ubicacion']
            },
            {
              model: db.TipoEquipo,
              as: 'tipoEquipo',
              attributes: ['id', 'nombres']
            }
          ]
        }
      ],
      distinct: true
    });

    // Respuesta con paginación
    res.json({
      success: true,
      data: hojasVida,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        perPage: parseInt(limit),
        from: offset + 1,
        to: offset + hojasVida.length
      }
    });

  } catch (error) {
    console.error('Error al obtener hojas de vida:', error);
    next(error);
  }
};

// Obtener hoja de vida por ID
const getSysHojaVidaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const hojaVida = await db.SysHojaVida.findByPk(id, {
      include: [
        {
          model: db.SysEquipo,
          as: 'equipo',
          attributes: [
            'id_sysequipo',
            'nombre_equipo',
            'marca',
            'modelo',
            'serie',
            'placa_inventario',
            'ubicacion'
          ],
          include: [
            {
              model: db.Servicio,
              as: 'servicio',
              attributes: ['id', 'nombres', 'ubicacion']
            },
            {
              model: db.TipoEquipo,
              as: 'tipoEquipo',
              attributes: ['id', 'nombres']
            }
          ]
        }
      ]
    });

    if (!hojaVida) {
      return res.status(404).json({
        success: false,
        message: 'Hoja de vida no encontrada'
      });
    }

    res.json({
      success: true,
      data: hojaVida
    });
  } catch (error) {
    console.error('Error al obtener hoja de vida:', error);
    next(error);
  }
};

// Obtener hoja de vida por ID de equipo
const getSysHojaVidaByEquipoId = async (req, res, next) => {
  try {
    const { equipoId } = req.params;

    const hojaVida = await db.SysHojaVida.findOne({
      where: { id_sysequipo_fk: equipoId },
      include: [
        {
          model: db.SysEquipo,
          as: 'equipo',
          attributes: [
            'id_sysequipo',
            'nombre_equipo',
            'marca',
            'modelo',
            'serie',
            'placa_inventario',
            'ubicacion'
          ],
          include: [
            {
              model: db.Servicio,
              as: 'servicio',
              attributes: ['id', 'nombres', 'ubicacion']
            },
            {
              model: db.TipoEquipo,
              as: 'tipoEquipo',
              attributes: ['id', 'nombres']
            }
          ]
        }
      ]
    });

    if (!hojaVida) {
      return res.status(404).json({
        success: false,
        message: 'Hoja de vida no encontrada para este equipo'
      });
    }

    res.json({
      success: true,
      data: hojaVida
    });
  } catch (error) {
    console.error('Error al obtener hoja de vida por equipo:', error);
    next(error);
  }
};

// Crear nueva hoja de vida
const createSysHojaVida = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const hojaVida = await db.SysHojaVida.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hoja de vida creada exitosamente',
      data: hojaVida
    });
  } catch (error) {
    console.error('Error al crear hoja de vida:', error);
    next(error);
  }
};

// Actualizar hoja de vida completamente
const updateSysHojaVida = async (req, res, next) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const [affectedRows] = await db.SysHojaVida.update(req.body, {
      where: { id_syshoja_vida: id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hoja de vida no encontrada'
      });
    }

    const hojaVida = await db.SysHojaVida.findByPk(id);

    res.json({
      success: true,
      message: 'Hoja de vida actualizada exitosamente',
      data: hojaVida
    });
  } catch (error) {
    console.error('Error al actualizar hoja de vida:', error);
    next(error);
  }
};

// Actualización parcial de hoja de vida
const patchSysHojaVida = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [affectedRows] = await db.SysHojaVida.update(req.body, {
      where: { id_syshoja_vida: id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hoja de vida no encontrada'
      });
    }

    const hojaVida = await db.SysHojaVida.findByPk(id);

    res.json({
      success: true,
      message: 'Hoja de vida actualizada exitosamente',
      data: hojaVida
    });
  } catch (error) {
    console.error('Error al actualizar hoja de vida:', error);
    next(error);
  }
};

// Eliminar hoja de vida
const deleteSysHojaVida = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affectedRows = await db.SysHojaVida.destroy({
      where: { id_syshoja_vida: id }
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hoja de vida no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Hoja de vida eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar hoja de vida:', error);
    next(error);
  }
};

// Buscar hojas de vida
const searchSysHojasVida = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parámetro de búsqueda requerido'
      });
    }

    const hojasVida = await db.SysHojaVida.findAll({
      where: {
        [Op.or]: [
          { ip: { [Op.like]: `%${q}%` } },
          { mac: { [Op.like]: `%${q}%` } },
          { procesador: { [Op.like]: `%${q}%` } },
          { sistema_operativo: { [Op.like]: `%${q}%` } },
          { nombre_usuario: { [Op.like]: `%${q}%` } },
          { vendedor: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: parseInt(limit),
      include: [
        {
          model: db.SysEquipo,
          as: 'equipo',
          attributes: ['id_sysequipo', 'nombre_equipo', 'marca', 'modelo']
        }
      ]
    });

    res.json({
      success: true,
      data: hojasVida,
      count: hojasVida.length
    });
  } catch (error) {
    console.error('Error al buscar hojas de vida:', error);
    next(error);
  }
};

// Obtener estadísticas de hojas de vida
const getEstadisticasSysHojasVida = async (req, res, next) => {
  try {
    const [
      totalHojasVida,
      hojasPorSistemaOperativo,
      hojasPorTipoEquipo
    ] = await Promise.all([
      db.SysHojaVida.count(),
      db.SysHojaVida.findAll({
        attributes: [
          'sistema_operativo',
          [db.sequelize.fn('COUNT', db.sequelize.col('id_syshoja_vida')), 'total']
        ],
        group: ['sistema_operativo']
      }),
      db.SysHojaVida.findAll({
        attributes: [
          [db.sequelize.fn('COUNT', db.sequelize.col('SysHojaVida.id_syshoja_vida')), 'total']
        ],
        include: [{
          model: db.SysEquipo,
          as: 'equipo',
          attributes: [],
          include: [{
            model: db.TipoEquipo,
            as: 'tipoEquipo',
            attributes: ['id', 'nombres']
          }]
        }],
        group: ['equipo.tipoEquipo.id']
      })
    ]);

    res.json({
      success: true,
      data: {
        total: totalHojasVida,
        porSistemaOperativo: hojasPorSistemaOperativo,
        porTipoEquipo: hojasPorTipoEquipo
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    next(error);
  }
};

module.exports = {
  getAllSysHojasVida,
  getSysHojaVidaById,
  getSysHojaVidaByEquipoId,
  createSysHojaVida,
  updateSysHojaVida,
  patchSysHojaVida,
  deleteSysHojaVida,
  searchSysHojasVida,
  getEstadisticasSysHojasVida
};
