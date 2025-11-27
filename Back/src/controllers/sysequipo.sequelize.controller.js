const db = require('../models/sequelize');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Obtener todos los equipos de sistemas
const getAllSysEquipos = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            activo,
            id_servicio_fk,
            id_tipo_equipo_fk,
            id_hospital_fk,
            search,
            sortBy = 'createdAt',
            order = 'DESC'
        } = req.query;

        // Construir filtros
        const where = {};

        if (activo !== undefined) {
            where.activo = activo === 'true' || activo === '1';
        }

        if (id_servicio_fk) {
            where.id_servicio_fk = id_servicio_fk;
        }

        if (id_tipo_equipo_fk) {
            where.id_tipo_equipo_fk = id_tipo_equipo_fk;
        }

        if (id_hospital_fk) {
            where.id_hospital_fk = id_hospital_fk;
        }

        // Búsqueda general
        if (search) {
            where[Op.or] = [
                { nombre_equipo: { [Op.like]: `%${search}%` } },
                { marca: { [Op.like]: `%${search}%` } },
                { modelo: { [Op.like]: `%${search}%` } },
                { serie: { [Op.like]: `%${search}%` } },
                { placa_inventario: { [Op.like]: `%${search}%` } },
                { codigo: { [Op.like]: `%${search}%` } }
            ];
        }

        // Calcular offset
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Consulta con paginación y relaciones
        const { count, rows: equipos } = await db.SysEquipo.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            order: [[sortBy, order]],
            include: [
                {
                    model: db.Hospital,
                    as: 'hospital',
                    attributes: ['id_hospital', 'nombre_hospital', 'ciudad']
                },
                {
                    model: db.Servicio,
                    as: 'servicio',
                    attributes: ['id', 'nombres', 'ubicacion']
                },
                {
                    model: db.TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombres', 'actividad']
                },
                {
                    model: db.Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombres', 'apellidos', 'email']
                }
            ],
            distinct: true
        });

        res.json({
            success: true,
            data: equipos,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
                perPage: parseInt(limit),
                from: offset + 1,
                to: offset + equipos.length
            }
        });
    } catch (error) {
        next(error);
    }
};

// Obtener equipo por ID
const getSysEquipoById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const equipo = await db.SysEquipo.findByPk(id, {
            include: [
                {
                    model: db.Hospital,
                    as: 'hospital',
                    attributes: ['id_hospital', 'nombre_hospital', 'ciudad']
                },
                {
                    model: db.Servicio,
                    as: 'servicio',
                    attributes: ['id', 'nombres', 'ubicacion']
                },
                {
                    model: db.TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombres', 'actividad']
                },
                {
                    model: db.Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombres', 'apellidos', 'email']
                }
            ]
        });

        if (!equipo) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        res.json({
            success: true,
            data: equipo
        });
    } catch (error) {
        next(error);
    }
};

// Buscar equipos
const searchSysEquipos = async (req, res, next) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Parámetro de búsqueda requerido'
            });
        }

        const equipos = await db.SysEquipo.findAll({
            where: {
                [Op.or]: [
                    { nombre_equipo: { [Op.like]: `%${q}%` } },
                    { marca: { [Op.like]: `%${q}%` } },
                    { modelo: { [Op.like]: `%${q}%` } },
                    { serie: { [Op.like]: `%${q}%` } },
                    { placa_inventario: { [Op.like]: `%${q}%` } },
                    { codigo: { [Op.like]: `%${q}%` } }
                ]
            },
            limit: parseInt(limit),
            include: [
                {
                    model: db.Hospital,
                    as: 'hospital',
                    attributes: ['id_hospital', 'nombre_hospital']
                },
                {
                    model: db.Servicio,
                    as: 'servicio',
                    attributes: ['id', 'nombres']
                },
                {
                    model: db.TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombres']
                }
            ]
        });

        res.json({
            success: true,
            data: equipos,
            count: equipos.length
        });
    } catch (error) {
        next(error);
    }
};

// Crear nuevo equipo
const createSysEquipo = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const equipo = await db.SysEquipo.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Equipo de sistemas creado exitosamente',
            data: equipo
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar equipo completamente
const updateSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const [affectedRows] = await db.SysEquipo.update(req.body, {
            where: { id_sys_equipo: id }
        });

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        const equipo = await db.SysEquipo.findByPk(id);

        res.json({
            success: true,
            message: 'Equipo de sistemas actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        next(error);
    }
};

// Actualización parcial
const patchSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [affectedRows] = await db.SysEquipo.update(req.body, {
            where: { id_sys_equipo: id }
        });

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        const equipo = await db.SysEquipo.findByPk(id);

        res.json({
            success: true,
            message: 'Equipo de sistemas actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        next(error);
    }
};

// Desactivar equipo (soft delete)
const deleteSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [affectedRows] = await db.SysEquipo.update(
            { activo: false },
            { where: { id_sys_equipo: id } }
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Equipo de sistemas desactivado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

// Reactivar equipo
const reactivarSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [affectedRows] = await db.SysEquipo.update(
            { activo: true },
            { where: { id_sys_equipo: id } }
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        const equipo = await db.SysEquipo.findByPk(id);

        res.json({
            success: true,
            message: 'Equipo de sistemas reactivado exitosamente',
            data: equipo
        });
    } catch (error) {
        next(error);
    }
};

// Dar de baja equipo
const darDeBajaSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { motivo_baja } = req.body;

        const [affectedRows] = await db.SysEquipo.update(
            {
                activo: false,
                estado: 'baja',
                motivo_baja,
                fecha_baja: new Date()
            },
            { where: { id_sys_equipo: id } }
        );

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        const equipo = await db.SysEquipo.findByPk(id);

        res.json({
            success: true,
            message: 'Equipo dado de baja exitosamente',
            data: equipo
        });
    } catch (error) {
        next(error);
    }
};

// Obtener estadísticas
const getEstadisticasSysEquipos = async (req, res, next) => {
    try {
        const [
            totalEquipos,
            equiposActivos,
            equiposInactivos,
            equiposPorTipo,
            equiposPorServicio
        ] = await Promise.all([
            db.SysEquipo.count(),
            db.SysEquipo.count({ where: { activo: true } }),
            db.SysEquipo.count({ where: { activo: false } }),
            db.SysEquipo.findAll({
                attributes: [
                    'id_tipo_equipo_fk',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id_sys_equipo')), 'total']
                ],
                include: [{
                    model: db.TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['nombres']
                }],
                group: ['id_tipo_equipo_fk']
            }),
            db.SysEquipo.findAll({
                attributes: [
                    'id_servicio_fk',
                    [db.sequelize.fn('COUNT', db.sequelize.col('id_sys_equipo')), 'total']
                ],
                include: [{
                    model: db.Servicio,
                    as: 'servicio',
                    attributes: ['nombres']
                }],
                group: ['id_servicio_fk']
            })
        ]);

        res.json({
            success: true,
            data: {
                total: totalEquipos,
                activos: equiposActivos,
                inactivos: equiposInactivos,
                porTipo: equiposPorTipo,
                porServicio: equiposPorServicio
            }
        });
    } catch (error) {
        next(error);
    }
};

// Obtener equipos por servicio
const getSysEquiposPorServicio = async (req, res, next) => {
    try {
        const { servicioId } = req.params;

        const equipos = await db.SysEquipo.findAll({
            where: { id_servicio_fk: servicioId },
            include: [
                {
                    model: db.Hospital,
                    as: 'hospital',
                    attributes: ['id_hospital', 'nombre_hospital']
                },
                {
                    model: db.TipoEquipo,
                    as: 'tipoEquipo',
                    attributes: ['id', 'nombres']
                }
            ]
        });

        res.json({
            success: true,
            data: equipos,
            count: equipos.length
        });
    } catch (error) {
        next(error);
    }
};

// Obtener equipos por tipo
const getSysEquiposPorTipo = async (req, res, next) => {
    try {
        const { tipoId } = req.params;

        const equipos = await db.SysEquipo.findAll({
            where: { id_tipo_equipo_fk: tipoId },
            include: [
                {
                    model: db.Hospital,
                    as: 'hospital',
                    attributes: ['id_hospital', 'nombre_hospital']
                },
                {
                    model: db.Servicio,
                    as: 'servicio',
                    attributes: ['id', 'nombres']
                }
            ]
        });

        res.json({
            success: true,
            data: equipos,
            count: equipos.length
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllSysEquipos,
    getSysEquipoById,
    searchSysEquipos,
    createSysEquipo,
    updateSysEquipo,
    patchSysEquipo,
    deleteSysEquipo,
    reactivarSysEquipo,
    darDeBajaSysEquipo,
    getEstadisticasSysEquipos,
    getSysEquiposPorServicio,
    getSysEquiposPorTipo
};
