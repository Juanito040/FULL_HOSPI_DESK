const { Op } = require('sequelize');
const db = require('../models/sequelize');
const { getPendingBackupsById } = require('../utils/backupChecker.util');
const { notifyUserPendingBackup } = require('../utils/notify');

class BackupService {
  /**
   * Obtener todos los backups
   */
  async getAll() {
    try {
      return await db.Backup.findAll({
        include: [{ model: db.Usuario, as: 'autorRealizado' }],
        order: [['fecha_backup', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Error al obtener backups: ${error.message}`);
    }
  }

  /**
   * Obtener un backup por ID
   */
  async getById(id) {
    try {
      const backup = await db.Backup.findByPk(id, {
        include: [{ model: db.Usuario, as: 'autorRealizado' }]
      });

      if (!backup) {
        throw new Error('Backup no encontrado');
      }

      return backup;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear un nuevo backup
   */
  async create(data) {
    try {
      const backup = await db.Backup.create(data);
      return await this.getById(backup.id_reporte_backup);
    } catch (error) {
      throw new Error(`Error al crear backup: ${error.message}`);
    }
  }

  /**
   * Actualizar un backup
   */
  async update(id, data) {
    try {
      const backup = await this.getById(id);
      await backup.update(data);
      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar un backup
   */
  async delete(id) {
    try {
      const backup = await this.getById(id);
      await backup.destroy();
      return { message: 'Backup eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener backups por usuario
   */
  async getByUsuario(usuarioId) {
    try {
      return await db.Backup.findAll({
        where: { id_autor_realizado_fk: usuarioId },
        include: [{ model: db.Usuario, as: 'autorRealizado' }],
        order: [['fecha_backup', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Error al obtener backups por usuario: ${error.message}`);
    }
  }

  /**
   * Obtener backups por rango de fechas
   */
  async getByRango(inicio, fin, limit = 100, offset = 0) {
    try {
      // Validar formato de fechas
      const validarFecha = (f) => /^\d{4}-\d{2}-\d{2}$/.test(f);
      if (!validarFecha(inicio) || !validarFecha(fin)) {
        throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
      }

      return await db.Backup.findAll({
        where: {
          fecha_backup: {
            [Op.gte]: inicio,
            [Op.lte]: fin
          }
        },
        include: [{ model: db.Usuario, as: 'autorRealizado' }],
        order: [['fecha_backup', 'DESC'], ['createdAt', 'DESC']],
        limit: Number(limit),
        offset: Number(offset)
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener backups pendientes
   */
  async getPendingBackups() {
    try {
      const { sequelize } = db;

      const ultimos = await db.Backup.findAll({
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
        const ultimoBackup = await this.getById(ultimoId);

        const pendientes = await getPendingBackupsById(ultimoId);

        if (pendientes.faltantes && pendientes.faltantes.length > 0) {
          listaPendientes.push({
            id_reporte_backup: ultimoId,
            nombre_recurso: rec.nombre_recurso,
            periodicidad: rec.periodicidad,
            destino: rec.destino,
            faltantes: pendientes.faltantes,
            ultimo_backup: pendientes.ultimo_backup
          });

          // Enviar notificación al usuario responsable
          await notifyUserPendingBackup(
            ultimoBackup.id_autor_realizado_fk,
            rec.nombre_recurso,
            rec.periodicidad
          );
        }
      }

      return listaPendientes;
    } catch (error) {
      throw new Error(`Error al obtener backups pendientes: ${error.message}`);
    }
  }

  /**
   * Obtener detalle de backups pendientes por ID
   */
  async getPendingBackupsDetail(id) {
    try {
      return await getPendingBackupsById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BackupService();
