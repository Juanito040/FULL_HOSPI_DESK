const express = require('express');
const router = express.Router();
const HojaVida = require('../../models/Biomedica/HojaVida');
const Equipo = require('../../models/Biomedica/Equipo');
const DatosTecnicos = require('../../models/Biomedica/DatosTecnicos');
const Servicio = require('../../models/generales/Servicio');
const Sede = require('../../models/generales/Sede');

// Obtener todas las hojas de vida
router.get('/hojasvida', async (req, res) => {
    try {
        const hojasVida = await HojaVida.findAll({
            include: { model: Equipo, as: 'equipo' }
        });
        res.json(hojasVida);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las hojas de vida', detalle: error.message });
    }
});

// Obtener una hoja de vida por ID
router.get('/hojasvida/:id', async (req, res) => {
    try {
        const hojaVida = await HojaVida.findByPk(req.params.id, {
            include: { model: Equipo, as: 'equipo' }
        });
        if (!hojaVida) {
            return res.status(404).json({ error: 'Hoja de vida no encontrada' });
        }
        res.json(hojaVida);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la hoja de vida', detalle: error.message });
    }
});

// Crear una nueva hoja de vida
router.post('/addhojasvida', async (req, res) => {
    try {
        const nuevaHojaVida = await HojaVida.create(req.body);
        res.status(201).json(nuevaHojaVida);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la hoja de vida', detalle: error.message });
    }
});

// Actualizar una hoja de vida
router.put('/hojasvida/:id', async (req, res) => {
    try {
        const hojaVida = await HojaVida.findByPk(req.params.id);
        if (!hojaVida) {
            return res.status(404).json({ error: 'Hoja de vida no encontrada' });
        }

        await hojaVida.update(req.body);
        res.json(hojaVida);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la hoja de vida', detalle: error.message });
    }
});

// Eliminar una hoja de vida
router.delete('/hojasvida/:id', async (req, res) => {
    try {
        const hojaVida = await HojaVida.findByPk(req.params.id);
        if (!hojaVida) {
            return res.status(404).json({ error: 'Hoja de vida no encontrada' });
        }

        await hojaVida.destroy();
        res.json({ mensaje: 'Hoja de vida eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la hoja de vida', detalle: error.message });
    }
});

router.get('/hojavidaequipo/:id', async (req, res) => {
    const equipoId = parseInt(req.params.id, 10);

    if (isNaN(equipoId)) {
        return res.status(400).json({ error: 'ID de equipo inválido' });
    }

    try {
        const hojaVida = await HojaVida.findOne({
            where: { equipoIdFk: equipoId },
            include: [
                {
                    model: Equipo,
                    as: 'equipo',
                    include: [
                        {
                            model: Servicio,
                            as: 'servicios'
                        },
                        {
                            model: Sede,
                            as: 'sedes'                            
                        }
                    ]
                },
                {
                    model: DatosTecnicos,
                    as: 'datosTecnicos'
                }
            ]
        });

        if (!hojaVida) {
            return res.status(404).json({ error: 'Hoja de vida no encontrada para este equipo' });
        }

        res.json(hojaVida);
    } catch (error) {
        console.error('Error al obtener hoja de vida por ID de equipo:', error);
        res.status(500).json({ error: 'Error del servidor', detalle: error.message });
    }
});



module.exports = router;
