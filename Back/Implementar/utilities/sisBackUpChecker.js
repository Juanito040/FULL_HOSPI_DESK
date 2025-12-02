const dayjs = require('dayjs');
const Backup = require('../models/sistemas/backUps');

async function getPendingBackupsById(id) {

    const backups = await Backup.findAll({
        where: { id_reporte_backup: id },
        order: [['fecha_backup', 'ASC']]
    });

    if (backups.length === 0) {
        return {
            mensaje: "El recurso no tiene backups registrados",
            faltantes: []
        };
    }

    const ultimo = backups[backups.length - 1];

    const ultimaFecha = dayjs(ultimo.fecha_backup).startOf('day');
    const periodicidad = ultimo.periodicidad;
    const hoy = dayjs().startOf('day');

    let faltantes = [];
    let iterar;

    if (periodicidad === 'Diario') {
        iterar = ultimaFecha.add(1, 'day');
        while (iterar.isBefore(hoy)) {
            faltantes.push(iterar.format('YYYY-MM-DD'));
            iterar = iterar.add(1, 'day');
        }

    } else if (periodicidad === 'Semanal') {
        iterar = ultimaFecha.add(1, 'week');
        while (iterar.isBefore(hoy)) {
            faltantes.push(iterar.format('YYYY-MM-DD'));
            iterar = iterar.add(1, 'week');
        }

    } else if (periodicidad === 'Mensual') {
        iterar = ultimaFecha.add(1, 'month');
        while (iterar.isBefore(hoy)) {
            faltantes.push(iterar.format('YYYY-MM-DD'));
            iterar = iterar.add(1, 'month');
        }
    }

    if (faltantes.length === 0) {
        return {
            mensaje: "No hay backups pendientes",
            faltantes: []
        };
    }

    return {
        recurso: ultimo.nombre_recurso,
        periodicidad,
        ultimo_backup: ultimaFecha.format('YYYY-MM-DD'),
        faltantes
    };
}

module.exports = { getPendingBackupsById };
