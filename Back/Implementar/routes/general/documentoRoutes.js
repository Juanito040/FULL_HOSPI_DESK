const express = require('express');
const router = express.Router();
const Documento = require('../../models/Biomedica/Documento');
const Equipo = require('../../models/Biomedica/Equipo');
const TipoDocumento = require('../../models/generales/TipoDocumento');

// Obtener todos los documentos
router.get('/documentos', async (req, res) => {
    try {
        const documentos = await Documento.findAll({
            include: [
                { model: Equipo, as: 'equipo' },
                { model: TipoDocumento, as: 'tipoDocumento' }
            ]
        });
        res.json(documentos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los documentos', detalle: error.message });
    }
});

// Obtener un documento por ID
router.get('/documentos/:id', async (req, res) => {
    try {
        const documento = await Documento.findByPk(req.params.id, {
            include: [
                { model: Equipo, as: 'equipo' },
                { model: TipoDocumento, as: 'tipoDocumento' }
            ]
        });

        if (!documento) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }
        res.json(documento);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el documento', detalle: error.message });
    }
});

// Crear un nuevo documento
router.post('/adddocumento', async (req, res) => {
    try {
        const nuevoDocumento = await Documento.create(req.body);
        res.status(201).json(nuevoDocumento);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el documento', detalle: error.message });
    }
});

// Actualizar un documento por ID
router.put('/documentos/:id', async (req, res) => {
    try {
        const documento = await Documento.findByPk(req.params.id);
        if (!documento) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        await documento.update(req.body);
        res.json(documento);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el documento', detalle: error.message });
    }
});

// Eliminar un documento por ID
router.delete('/documentos/:id', async (req, res) => {
    try {
        const documento = await Documento.findByPk(req.params.id);
        if (!documento) {
            return res.status(404).json({ error: 'Documento no encontrado' });
        }

        await documento.destroy();
        res.json({ mensaje: 'Documento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el documento', detalle: error.message });
    }
});

module.exports = router;
