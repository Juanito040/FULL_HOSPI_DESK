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

        // Excluir equipos en bodega y dados de baja de la lista principal
        where[Op.and] = [
            { [Op.or]: [{ ubicacion: { [Op.ne]: 'Bodega' } }, { ubicacion: null }] },
            { [Op.or]: [{ estado_baja: { [Op.ne]: 1 } }, { estado_baja: null }] }
        ];

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
                },
                {
                    model: db.SysHojaVida,
                    as: 'hojaVida'
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
    const transaction = await db.sequelize.transaction();

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Extraer datos del equipo y hoja de vida del body
        const { hojaVida, ...equipoData } = req.body;

        // Crear el equipo dentro de una transacción
        const equipo = await db.SysEquipo.create(equipoData, { transaction });

        // Si se proporcionan datos de hoja de vida, crearla automáticamente
        let hojaVidaCreada = null;
        if (hojaVida && Object.keys(hojaVida).length > 0) {
            hojaVidaCreada = await db.SysHojaVida.create({
                ...hojaVida,
                id_sysequipo_fk: equipo.id_sysequipo
            }, { transaction });
        }

        // Confirmar la transacción
        await transaction.commit();

        // Obtener el equipo completo con la hoja de vida incluida
        const equipoCompleto = await db.SysEquipo.findByPk(equipo.id_sysequipo, {
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
                },
                {
                    model: db.SysHojaVida,
                    as: 'hojaVida'
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: hojaVidaCreada
                ? 'Equipo de sistemas y hoja de vida creados exitosamente'
                : 'Equipo de sistemas creado exitosamente',
            data: equipoCompleto
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        next(error);
    }
};

// Actualizar equipo completamente
const updateSysEquipo = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { id } = req.params;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Extraer datos del equipo y hoja de vida del body
        const { hojaVida, ...equipoData } = req.body;

        // Actualizar el equipo
        const [affectedRows] = await db.SysEquipo.update(equipoData, {
            where: { id_sysequipo: id },
            transaction
        });

        if (affectedRows === 0) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        // Si se proporcionan datos de hoja de vida, actualizarla o crearla
        if (hojaVida && Object.keys(hojaVida).length > 0) {
            const hojaVidaExistente = await db.SysHojaVida.findOne({
                where: { id_sysequipo_fk: id }
            });

            if (hojaVidaExistente) {
                // Actualizar hoja de vida existente
                await db.SysHojaVida.update(hojaVida, {
                    where: { id_sysequipo_fk: id },
                    transaction
                });
            } else {
                // Crear nueva hoja de vida
                await db.SysHojaVida.create({
                    ...hojaVida,
                    id_sysequipo_fk: id
                }, { transaction });
            }
        }

        // Confirmar la transacción
        await transaction.commit();

        // Obtener el equipo actualizado con todas las relaciones
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
                },
                {
                    model: db.SysHojaVida,
                    as: 'hojaVida'
                }
            ]
        });

        res.json({
            success: true,
            message: 'Equipo de sistemas actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Actualización parcial
const patchSysEquipo = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { id } = req.params;

        // Extraer datos del equipo y hoja de vida del body
        const { hojaVida, ...equipoData } = req.body;

        // Actualizar el equipo si hay datos
        if (Object.keys(equipoData).length > 0) {
            const [affectedRows] = await db.SysEquipo.update(equipoData, {
                where: { id_sysequipo: id },
                transaction
            });

            if (affectedRows === 0) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'Equipo de sistemas no encontrado'
                });
            }
        }

        // Si se proporcionan datos de hoja de vida, actualizarla o crearla
        if (hojaVida && Object.keys(hojaVida).length > 0) {
            const hojaVidaExistente = await db.SysHojaVida.findOne({
                where: { id_sysequipo_fk: id }
            });

            if (hojaVidaExistente) {
                // Actualizar hoja de vida existente
                await db.SysHojaVida.update(hojaVida, {
                    where: { id_sysequipo_fk: id },
                    transaction
                });
            } else {
                // Crear nueva hoja de vida
                await db.SysHojaVida.create({
                    ...hojaVida,
                    id_sysequipo_fk: id
                }, { transaction });
            }
        }

        // Confirmar la transacción
        await transaction.commit();

        // Obtener el equipo actualizado con todas las relaciones
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
                },
                {
                    model: db.SysHojaVida,
                    as: 'hojaVida'
                }
            ]
        });

        res.json({
            success: true,
            message: 'Equipo de sistemas actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Enviar equipo a bodega (soft delete)
const deleteSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;

        const equipo = await db.SysEquipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        await db.SysEquipo.update(
            {
                activo: 0,
                ubicacion: 'Bodega',
                ubicacion_especifica: motivo || 'Enviado a bodega'
            },
            { where: { id_sysequipo: id } }
        );

        const equipoActualizado = await db.SysEquipo.findByPk(id);

        res.json({
            success: true,
            message: 'Equipo enviado a bodega exitosamente',
            data: equipoActualizado
        });
    } catch (error) {
        next(error);
    }
};

// Dar de baja permanente (hard delete modificado)
const hardDeleteSysEquipo = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { id } = req.params;
        const { justificacion_baja, accesorios_reutilizables, id_usuario } = req.body;

        const equipo = await db.SysEquipo.findByPk(id);

        if (!equipo) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        const nombreEquipo = equipo.nombre_equipo;

        // Marcar como dado de baja
        await db.SysEquipo.update(
            {
                activo: 0,
                estado_baja: 1
            },
            {
                where: { id_sysequipo: id },
                transaction
            }
        );

        // Crear registro de baja
        await db.SysBaja.create({
            fecha_baja: new Date(),
            justificacion_baja: justificacion_baja || 'No especificada',
            accesorios_reutilizables: accesorios_reutilizables || '',
            id_sysequipo_fk: id,
            id_sysusuario_fk: id_usuario || null
        }, { transaction });

        await transaction.commit();

        const equipoActualizado = await db.SysEquipo.findByPk(id, {
            include: [
                {
                    model: db.SysBaja,
                    as: 'baja',
                    include: [
                        {
                            model: db.Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                }
            ]
        });

        res.json({
            success: true,
            message: `Equipo "${nombreEquipo}" dado de baja permanentemente`,
            data: equipoActualizado
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Reactivar equipo
const reactivarSysEquipo = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [affectedRows] = await db.SysEquipo.update(
            { activo: true },
            { where: { id_sysequipo: id } }
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
            { where: { id_sysequipo: id } }
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
                    [db.sequelize.fn('COUNT', db.sequelize.col('id_sysequipo')), 'total']
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
                    [db.sequelize.fn('COUNT', db.sequelize.col('id_sysequipo')), 'total']
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

// Obtener equipos en bodega
const getEquiposEnBodega = async (req, res, next) => {
    try {
        const equipos = await db.SysEquipo.findAll({
            where: {
                activo: 0,
                ubicacion: 'Bodega',
                estado_baja: 0
            },
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
                },
                {
                    model: db.Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombres', 'apellidos']
                }
            ],
            order: [['updatedAt', 'DESC']]
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

// Obtener equipos dados de baja
const getEquiposDadosDeBaja = async (req, res, next) => {
    try {
        const equipos = await db.SysEquipo.findAll({
            where: {
                estado_baja: 1
            },
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
                },
                {
                    model: db.Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombres', 'apellidos']
                },
                {
                    model: db.SysBaja,
                    as: 'baja',
                    include: [
                        {
                            model: db.Usuario,
                            as: 'usuario',
                            attributes: ['id', 'nombres', 'apellidos']
                        }
                    ]
                }
            ],
            order: [['updatedAt', 'DESC']]
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
    hardDeleteSysEquipo,
    reactivarSysEquipo,
    darDeBajaSysEquipo,
    getEstadisticasSysEquipos,
    getSysEquiposPorServicio,
    getSysEquiposPorTipo,
    getEquiposEnBodega,
    getEquiposDadosDeBaja
};
