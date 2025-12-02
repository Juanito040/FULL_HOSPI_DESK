const express = require('express');
const router = express.Router();

const CumplimientoProtocoloPreventivo = require('../../models/Biomedica/CumplimientoProtocoloPreventivo');
const ProtocoloPreventivo = require('../../models/Biomedica/ProtocoloPreventivo');
const Reporte = require('../../models/Biomedica/Reporte');

// Obtener todos los cumplimientos
router.get('/cumplimientos', async (req, res) => {
    try {
        const cumplimientos = await CumplimientoProtocoloPreventivo.findAll({
            include: [
                { model: ProtocoloPreventivo, as: 'protocolo' },
                { model: Reporte, as: 'reporte' }
            ],
            order: [['id', 'ASC']]
        });
        res.json(cumplimientos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los cumplimientos', detalle: error.message });
    }
});

// Obtener cumplimientos por ID de reporte
router.get('/cumplimientos/reporte/:id', async (req, res) => {
    try {
        const cumplimientos = await CumplimientoProtocoloPreventivo.findAll({
            where: { reporteIdFk: req.params.id },
            include: [{ model: ProtocoloPreventivo, as: 'protocolo' }]
        });
        res.json(cumplimientos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los cumplimientos del reporte', detalle: error.message });
    }
});

// Obtener un cumplimiento por ID
router.get('/cumplimiento/:id', async (req, res) => {
    try {
        const cumplimiento = await CumplimientoProtocoloPreventivo.findByPk(req.params.id, {
            include: [
                { model: ProtocoloPreventivo, as: 'protocolo' },
                { model: Reporte, as: 'reporte' }
            ]
        });

        if (!cumplimiento) {
            return res.status(404).json({ error: 'Cumplimiento no encontrado' });
        }

        res.json(cumplimiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el cumplimiento', detalle: error.message });
    }
});

// Crear nuevo cumplimiento
router.post('/addcumplimiento', async (req, res) => {
    try {
        const cumplimiento = await CumplimientoProtocoloPreventivo.create(req.body);
        res.status(201).json(cumplimiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el cumplimiento', detalle: error.message });
    }
});

// Actualizar cumplimiento
router.put('/actcumplimiento/:id', async (req, res) => {
    try {
        const cumplimiento = await CumplimientoProtocoloPreventivo.findByPk(req.params.id);
        if (!cumplimiento) {
            return res.status(404).json({ error: 'Cumplimiento no encontrado' });
        }

        await cumplimiento.update(req.body);
        res.json(cumplimiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el cumplimiento', detalle: error.message });
    }
});

// Eliminar cumplimiento
router.delete('/remcumplimiento/:id', async (req, res) => {
    try {
        const cumplimiento = await CumplimientoProtocoloPreventivo.findByPk(req.params.id);
        if (!cumplimiento) {
            return res.status(404).json({ error: 'Cumplimiento no encontrado' });
        }

        await cumplimiento.destroy();
        res.json({ mensaje: 'Cumplimiento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cumplimiento', detalle: error.message });
    }
});

module.exports = router;
