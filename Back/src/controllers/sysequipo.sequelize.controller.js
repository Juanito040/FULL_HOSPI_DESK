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
            order = 'DESC',
            includeAll = false  // Nuevo parámetro para incluir todos los equipos
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

        // Excluir equipos en bodega y dados de baja SOLO si includeAll es false
        if (includeAll !== 'true' && includeAll !== true) {
            where[Op.and] = [
                { [Op.or]: [{ ubicacion: { [Op.ne]: 'Bodega' } }, { ubicacion: null }] },
                { [Op.or]: [{ estado_baja: { [Op.ne]: 1 } }, { estado_baja: null }, { estado_baja: 0 }] }
            ];
        }

        console.log('🔍 Filtros aplicados en getAllSysEquipos:', JSON.stringify(where, null, 2));

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
            console.error('❌ Errores de validación:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errors: errors.array()
            });
        }

        // Extraer datos del equipo y hoja de vida del body
        const { hojaVida, ...equipoData } = req.body;

        // Convertir campos booleanos a números enteros
        if (equipoData.activo !== undefined) {
            equipoData.activo = equipoData.activo ? 1 : 0;
        }
        if (equipoData.estado_baja !== undefined) {
            equipoData.estado_baja = equipoData.estado_baja ? 1 : 0;
        }
        if (equipoData.administrable !== undefined) {
            equipoData.administrable = equipoData.administrable ? 1 : 0;
        }
        if (equipoData.preventivo_s !== undefined) {
            equipoData.preventivo_s = equipoData.preventivo_s ? 1 : 0;
        }

        console.log('📝 Datos a actualizar:', equipoData);

        // Verificar que el equipo existe antes de actualizar
        const equipoExistente = await db.SysEquipo.findByPk(id);
        if (!equipoExistente) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Equipo de sistemas no encontrado'
            });
        }

        // Actualizar el equipo
        const [affectedRows] = await db.SysEquipo.update(equipoData, {
            where: { id_sysequipo: id },
            transaction
        });

        console.log('✅ Filas afectadas:', affectedRows);

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
                console.log('✅ Hoja de vida actualizada');
            } else {
                // Crear nueva hoja de vida
                await db.SysHojaVida.create({
                    ...hojaVida,
                    id_sysequipo_fk: id
                }, { transaction });
                console.log('✅ Hoja de vida creada');
            }
        }

        // Confirmar la transacción
        await transaction.commit();
        console.log('✅ Transacción confirmada');

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
        console.error('❌ Error al actualizar equipo:', error.message);
        console.error('Stack:', error.stack);

        // Enviar error al cliente con más detalle
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar el equipo de sistemas',
            error: error.message,
            details: error.errors ? error.errors.map(e => e.message) : []
        });
    }
};

// Actualización parcial
const patchSysEquipo = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { id } = req.params;

        console.log('🔄 PATCH request recibido para equipo ID:', id);
        console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

        // Extraer datos del equipo y hoja de vida del body
        const { hojaVida, ...equipoData } = req.body;

        // Convertir campos booleanos a números enteros
        if (equipoData.activo !== undefined) {
            equipoData.activo = equipoData.activo ? 1 : 0;
        }
        if (equipoData.estado_baja !== undefined) {
            equipoData.estado_baja = equipoData.estado_baja ? 1 : 0;
        }
        if (equipoData.administrable !== undefined) {
            equipoData.administrable = equipoData.administrable ? 1 : 0;
        }
        if (equipoData.preventivo_s !== undefined) {
            equipoData.preventivo_s = equipoData.preventivo_s ? 1 : 0;
        }

        console.log('📝 Datos del equipo a actualizar (después de conversión):', JSON.stringify(equipoData, null, 2));

        // Actualizar el equipo si hay datos
        if (Object.keys(equipoData).length > 0) {
            const [affectedRows] = await db.SysEquipo.update(equipoData, {
                where: { id_sysequipo: id },
                transaction
            });

            console.log('✅ Filas afectadas en la actualización:', affectedRows);

            if (affectedRows === 0) {
                await transaction.rollback();
                console.log('❌ No se encontró el equipo con ID:', id);
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
        console.log('✅ Transacción COMMIT exitoso');

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

        console.log('📊 Equipo después de la actualización - activo:', equipo?.activo);

        res.json({
            success: true,
            message: 'Equipo de sistemas actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error en PATCH, haciendo ROLLBACK:', error.message);
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
                ubicacion_anterior: equipo.ubicacion,  // ✅ Guardar ubicación actual antes de cambiar
                ubicacion: 'Bodega',
                ubicacion_especifica: motivo || 'Enviado a bodega',
                estado_baja: 0  // ✅ Asegurar que NO esté marcado como dado de baja
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
        const { justificacion_baja, accesorios_reutilizables, id_usuario, password } = req.body;

        // Validar que el usuario sea administrador
        if (req.user && req.user.rol && req.user.rol.nombre !== 'Administrador') {
            await transaction.rollback();
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para dar de baja equipos permanentemente. Solo los administradores pueden realizar esta acción.'
            });
        }

        // Validar contraseña de administrador
        if (password && password !== 'admin') {
            await transaction.rollback();
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

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
            {
                activo: true,
                estado_baja: 0  // ✅ Limpiar estado de baja al reactivar
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
                estado_baja: 1,  // ✅ Marcar explícitamente como dado de baja para filtrado correcto
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
        console.log('📦 Buscando equipos en bodega...');

        const equipos = await db.SysEquipo.findAll({
            where: {
                ubicacion: 'Bodega',
                [db.Sequelize.Op.and]: [
                    {
                        [db.Sequelize.Op.or]: [
                            { estado_baja: { [db.Sequelize.Op.ne]: 1 } },
                            { estado_baja: null },
                            { estado_baja: 0 }
                        ]
                    }
                ]
                // Solo equipos en bodega que NO estén dados de baja
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

        console.log(`✅ Encontrados ${equipos.length} equipos en bodega`);

        res.json({
            success: true,
            data: equipos,
            count: equipos.length
        });
    } catch (error) {
        console.error('❌ Error al buscar equipos en bodega:', error.message);
        next(error);
    }
};

// Obtener equipos dados de baja
const getEquiposDadosDeBaja = async (req, res, next) => {
    try {
        console.log('🚫 Buscando equipos dados de baja...');

        const equipos = await db.SysEquipo.findAll({
            where: {
                estado_baja: 1
            },
            distinct: true,  // Evitar duplicados por múltiples registros en sysbaja
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

        console.log(`✅ Encontrados ${equipos.length} equipos dados de baja`);

        // Log detallado de equipos para debugging
        equipos.forEach(e => {
            console.log(`  - ID: ${e.id_sysequipo} | ${e.nombre_equipo} | Serie: ${e.serie} | Ubicación: ${e.ubicacion}`);
        });

        res.json({
            success: true,
            data: equipos,
            count: equipos.length
        });
    } catch (error) {
        console.error('❌ Error al buscar equipos dados de baja:', error.message);
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
