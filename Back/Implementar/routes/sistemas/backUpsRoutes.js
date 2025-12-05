const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { getPendingBackupsById } = require('../../utilities/sisBackUpChecker');
const Backup = require('../../models/sistemas/backUps');
const Usuario = require('../../models/generales/Usuario');
const sequelize = require('../../config/configDb');
const { notifyUserPendingBackup } = require('../../utilities/notify');


router.get('/backups', async (req, res) => {
    try {
        const backups = await Backup.findAll({
            include: [{ model: Usuario, as: 'autorRealizado' }],
            order: [['fecha_backup', 'DESC']]
        });

        res.json(backups);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los backups',
            detalle: error.message
        });
    }
});


router.get('/backups/:id', async (req, res) => {
    try {
        const backup = await Backup.findByPk(req.params.id, {
            include: ['autorRealizado']
        });

        if (!backup)
            return res.status(404).json({ error: 'Backup no encontrado' });

        res.json(backup);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el backup',
            detalle: error.message
        });
    }
});


router.post('backup', async (req, res) => {
    try {
        const nuevoBackup = await Backup.create(req.body);
        res.status(201).json(nuevoBackup);
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear el backup',
            detalle: error.message
        });
    }
});


router.delete('/rembackup/:id', async (req, res) => {
    try {
        const backup = await Backup.findByPk(req.params.id);

        if (!backup)
            return res.status(404).json({ error: 'Backup no encontrado' });

        await backup.destroy();
        res.json({ mensaje: 'Backup eliminado correctamente' });
    } catch (error) {
        res.status(500).json({
            error: 'Error al eliminar el backup',
            detalle: error.message
        });
    }
});


router.get('/backup/usuario/:id', async (req, res) => {
    try {
        const backups = await Backup.findAll({
            where: { id_autor_realizado_fk: req.params.id },
            include: ['autorRealizado'],
            order: [['fecha_backup', 'DESC']]
        });

        res.json(backups);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener backups por usuario',
            detalle: error.message
        });
    }
});


router.get('/backup/rango', async (req, res) => {
    try {
        const { inicio, fin, limit = 100, offset = 0 } = req.query;

        if (!inicio || !fin) {
            return res.status(400).json({
                error: 'Debe suministrar fechas "inicio" y "fin" en formato YYYY-MM-DD'
            });
        }

        const validar = (f) => /^\d{4}-\d{2}-\d{2}$/.test(f);
        if (!validar(inicio) || !validar(fin)) {
            return res.status(400).json({
                error: 'Formato de fecha inválido. Use YYYY-MM-DD'
            });
        }

        const backups = await Backup.findAll({
            where: {
                fecha_backup: {
                    [Op.gte]: inicio,
                    [Op.lte]: fin
                }
            },
            include: [{ model: Usuario, as: 'autorRealizado' }],
            order: [['fecha_backup', 'DESC'], ['createdAt', 'DESC']],
            limit: Number(limit),
            offset: Number(offset)
        });

        res.json(backups);

    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener backups por rango',
            detalle: error.message
        });
    }
});


router.get('/backup/pendientes', async (req, res) => {
    try {
        const ultimos = await Backup.findAll({
            attributes: [
                'nombre_recurso',
                'periodicidad',
                'destino',
                [sequelize.fn('MAX', sequelize.col('id_reporte_backup')), 'ultimo_id']
            ],
            group: ['nombre_recurso', 'periodicidad', 'destino']
        });

        const listaPendientes = [];

        for (const rec of ultimos) {
            const ultimoId = rec.dataValues.ultimo_id;

            const ultimoBackup = await Backup.findByPk(ultimoId);

            const pendientes = await getPendingBackupsById(ultimoId);

            if (pendientes.faltantes.length > 0) {

                listaPendientes.push({
                    id_reporte_backup: ultimoId,
                    nombre_recurso: rec.nombre_recurso,
                    periodicidad: rec.periodicidad,
                    destino: rec.destino
                });

               
                await notifyUserPendingBackup(
                    ultimoBackup.id_autor_realizado_fk,
                    rec.nombre_recurso,
                    rec.periodicidad
                );
            }
        }

        if (listaPendientes.length === 0) {
            return res.json({ mensaje: "No hay backups pendientes" });
        }

        res.json(listaPendientes);

    } catch (error) {
        res.status(500).json({
            error: "Error obteniendo lista de pendientes",
            detalle: error.message
        });
    }
});

router.get('/backup/pendientes/:id', async (req, res) => {
    try {
        const resultado = await getPendingBackupsById(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({
            error: "Error analizando backups",
            detalle: error.message
        });
    }
});

module.exports = router;