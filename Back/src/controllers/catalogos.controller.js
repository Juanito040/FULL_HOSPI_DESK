const db = require('../models/sequelize');
const { Hospital, Servicio, TipoEquipo } = db;

/**
 * Obtener todos los hospitales activos
 */
exports.getHospitales = async (req, res) => {
    try {
        const hospitales = await Hospital.findAll({
            where: { estado: 1 },
            attributes: ['id_hospital', 'nombre_hospital'],
            order: [['nombre_hospital', 'ASC']]
        });

        const formattedHospitales = hospitales.map(h => ({
            id: h.id_hospital,
            nombre: h.nombre_hospital
        }));

        res.status(200).json({
            success: true,
            data: formattedHospitales
        });
    } catch (error) {
        console.error('Error al obtener hospitales:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de hospitales',
            error: error.message
        });
    }
};

/**
 * Obtener todos los servicios activos
 */
exports.getServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll({
            where: { activo: 1 },
            attributes: ['id', 'nombres'],
            order: [['nombres', 'ASC']]
        });

        const formattedServicios = servicios.map(s => ({
            id: s.id,
            nombre: s.nombres
        }));

        res.status(200).json({
            success: true,
            data: formattedServicios
        });
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de servicios',
            error: error.message
        });
    }
};

/**
 * Obtener todos los tipos de equipo activos
 */
exports.getTiposEquipo = async (req, res) => {
    try {
        const tiposEquipo = await TipoEquipo.findAll({
            where: { activo: 1 },
            attributes: ['id', 'nombres'],
            order: [['nombres', 'ASC']]
        });

        const formattedTiposEquipo = tiposEquipo.map(t => ({
            id: t.id,
            nombre: t.nombres
        }));

        res.status(200).json({
            success: true,
            data: formattedTiposEquipo
        });
    } catch (error) {
        console.error('Error al obtener tipos de equipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de tipos de equipo',
            error: error.message
        });
    }
};

/**
 * Obtener todos los catálogos en una sola llamada
 */
exports.getAllCatalogos = async (req, res) => {
    try {
        const [hospitales, servicios, tiposEquipo] = await Promise.all([
            Hospital.findAll({
                where: { estado: 1 },
                attributes: ['id_hospital', 'nombre_hospital'],
                order: [['nombre_hospital', 'ASC']]
            }),
            Servicio.findAll({
                where: { activo: 1 },
                attributes: ['id', 'nombres'],
                order: [['nombres', 'ASC']]
            }),
            TipoEquipo.findAll({
                where: { activo: 1 },
                attributes: ['id', 'nombres'],
                order: [['nombres', 'ASC']]
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                hospitales: hospitales.map(h => ({ id: h.id_hospital, nombre: h.nombre_hospital })),
                servicios: servicios.map(s => ({ id: s.id, nombre: s.nombres })),
                tiposEquipo: tiposEquipo.map(t => ({ id: t.id, nombre: t.nombres }))
            }
        });
    } catch (error) {
        console.error('Error al obtener catálogos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los catálogos',
            error: error.message
        });
    }
};
