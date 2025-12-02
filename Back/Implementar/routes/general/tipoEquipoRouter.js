const express = require('express');
const router = express.Router();
const TipoEquipo = require('../../models/generales/TipoEquipo');
const Equipo = require('../../models/Biomedica/Equipo');
const { where } = require('sequelize');

// Obtener todos los tipos de equipo
router.get('/tiposequipo', async (req, res) => {
    try {
        const tiposEquipos = await TipoEquipo.findAll();
        res.json(tiposEquipos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tipos de equipo', detalle: error.message });
    }
});

router.get('/cantidadequipostipo/:id', async (req, res) => {
    try {
        const cantidadEquipos = await Equipo.count({ where: { tipoEquipoIdFk: req.params.id, estadoBaja: false } });
        res.json(cantidadEquipos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proveedores', detalle: error.message });
    }
});

router.get('/tiposequipoBio', async (req, res) => {
    try {
        const tiposEquipos = await TipoEquipo.findAll({
            where: { tipoR: 1, activo: true },
            order: [['nombres', 'ASC']]
        });
        res.json(tiposEquipos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tipos de equipo', detalle: error.message });
    }
});

router.get('/alltiposequipoBio', async (req, res) => {
    try {
        const tiposEquipos = await TipoEquipo.findAll({
            where: { tipoR: 1 },
            order: [['nombres', 'ASC']]
        });
        res.json(tiposEquipos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los tipos de equipo', detalle: error.message });
    }
});

// Obtener un tipo de equipo por ID
router.get('/tiposequipo/:id', async (req, res) => {
    try {
        const tipoEquipo = await TipoEquipo.findByPk(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
        }
        res.json(tipoEquipo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tipo de equipo', detalle: error.message });
    }
});

router.put('/tiposequipo/activar/:id', async (req, res) => {
    try {
        const tipoEquipo = await TipoEquipo.findByPk(req.params.id);

        if (!tipoEquipo) {
            return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
        }
        await tipoEquipo.update({ activo: true })
        res.json({ res: 'Tipo Equipo Activo' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tipo de equipo', detalle: error.message });
    }
});

router.put('/tiposequipo/desactivar/:id', async (req, res) => {
    try {
        const tipoEquipo = await TipoEquipo.findByPk(req.params.id);
        const cantidadEquipos = await Equipo.count({ where: { tipoEquipoIdFk: req.params.id, estadoBaja: false } });

        if (!tipoEquipo) {
            return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
        }
        if (cantidadEquipos > 0) {
            return res.status(404).json({ error: 'El tipo de equipo tiene equipos activos relacionados' });
        }
        await tipoEquipo.update({ activo: false });
        res.json({ res: 'Tipo Equipo Inactivo' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el tipo de equipo', detalle: error.message });
    }
});

// Crear un nuevo tipo de equipo
router.post('/addtiposequipo', async (req, res) => {
    try {
        const tipoEquipo = await TipoEquipo.create(req.body);
        res.status(201).json(tipoEquipo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el tipo de equipo', detalle: error.message });
    }
});

// Actualizar un tipo de equipo
router.put('/tiposequipo/:id', async (req, res) => {
    try {
        const tipoEquipo = await TipoEquipo.findByPk(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
        }

        await tipoEquipo.update(req.body);
        res.json(tipoEquipo);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el tipo de equipo', detalle: error.message });
    }
});

// Eliminar un tipo de equipo
router.delete('/tiposequipo/:id', async (req, res) => {
    try {
        const tipoEquipo = await TipoEquipo.findByPk(req.params.id);
        if (!tipoEquipo) {
            return res.status(404).json({ error: 'Tipo de equipo no encontrado' });
        }

        await tipoEquipo.destroy();
        res.json({ mensaje: 'Tipo de equipo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el tipo de equipo', detalle: error.message });
    }
});

module.exports = router;
